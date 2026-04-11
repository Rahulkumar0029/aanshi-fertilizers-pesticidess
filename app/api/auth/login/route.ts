import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getResend } from "@/lib/resend";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashValue(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const rawEmail = body.email;
    const password = body.password;

    const email =
      typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email: { $regex: `^${escapeRegex(email)}$`, $options: "i" },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const storedPassword =
      typeof user.password === "string" ? user.password : "";

    const looksHashed =
      storedPassword.startsWith("$2a$") ||
      storedPassword.startsWith("$2b$") ||
      storedPassword.startsWith("$2y$");

    if (!looksHashed) {
      return NextResponse.json(
        { error: "Account password is not configured correctly" },
        { status: 500 }
      );
    }

    const isMatch = await bcrypt.compare(password, storedPassword);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Normal user = direct login
    if (user.role === "user") {
      const response = NextResponse.json({
        message: "Login successful",
        user: {
          _id: String(user._id),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });

      response.cookies.set("userId", String(user._id), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    // Owner = OTP required
    const now = new Date();
    const lastSentAt = user.ownerOtpLastSentAt
      ? new Date(user.ownerOtpLastSentAt)
      : null;

    if (lastSentAt && now.getTime() - lastSentAt.getTime() < 60 * 1000) {
      return NextResponse.json(
        { error: "Please wait before requesting another OTP" },
        { status: 429 }
      );
    }

    const otp = generateOtp();
    const otpHash = hashValue(otp);
    const otpExpiresAt = new Date(now.getTime() + 5 * 60 * 1000);

    user.ownerOtpCodeHash = otpHash;
    user.ownerOtpExpiresAt = otpExpiresAt;
    user.ownerOtpAttempts = 0;
    user.ownerOtpLastSentAt = now;
    await user.save();

    const resend = getResend();
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!fromEmail) {
      throw new Error("Missing RESEND_FROM_EMAIL");
    }

    await resend.emails.send({
      from: fromEmail,
      to: [user.email],
      subject: "Your Aanshi owner login OTP",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6;">
          <h2>Owner Login Verification</h2>
          <p>Hello ${user.name},</p>
          <p>Your OTP for owner login is:</p>
          <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
          <p>This OTP expires in 5 minutes.</p>
          <p>If you did not try to log in, please reset your password immediately.</p>
        </div>
      `,
      text: `Your Aanshi owner login OTP is ${otp}. It expires in 5 minutes.`,
    });

    const response = NextResponse.json({
      message: "OTP sent to owner email",
      requiresOtp: true,
      email: user.email,
      role: user.role,
    });

    response.cookies.set("ownerPending2FA", String(user._id), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 10,
    });

    return response;
  } catch (error: any) {
    console.error("LOGIN FAILED:", error);
    return NextResponse.json(
      { error: "Login failed", details: error.message },
      { status: 500 }
    );
  }
}
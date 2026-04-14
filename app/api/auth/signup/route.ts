import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getResend } from "@/lib/resend";

function getBaseUrl() {
  const appUrl = process.env.APP_URL?.trim();

  if (!appUrl) {
    throw new Error("Missing APP_URL");
  }

  return appUrl.replace(/\/+$/, "");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeIndianPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }

  return digits;
}

function isValidIndianPhone(phone: string) {
  return /^[6-9]\d{9}$/.test(phone);
}

function hashValue(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json().catch(() => null);

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const rawPhone = typeof body?.phone === "string" ? body.phone.trim() : "";
    const password =
      typeof body?.password === "string" ? body.password.trim() : "";

    const phone = normalizeIndianPhone(rawPhone);

    if (!name || !email || !rawPhone || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        { error: "Please enter a valid name" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (!isValidIndianPhone(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit Indian mobile number" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existingEmailUser = await User.findOne({ email });

    if (existingEmailUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const existingPhoneUser = await User.findOne({ phone });

    if (existingPhoneUser) {
      return NextResponse.json(
        { error: "An account with this phone number already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const rawEmailToken = crypto.randomBytes(32).toString("hex");
    const hashedEmailToken = hashValue(rawEmailToken);
    const emailVerificationExpires = new Date(Date.now() + 1000 * 60 * 30);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "user",
      signupCompleted: false,
      emailVerified: false,
      emailVerificationToken: hashedEmailToken,
      emailVerificationExpires,
      phoneVerified: false,
    });

    const resend = getResend();
    const fromEmail = process.env.RESEND_FROM_EMAIL?.trim();

    if (!fromEmail) {
      throw new Error("Missing RESEND_FROM_EMAIL");
    }

    const baseUrl = getBaseUrl();
    const verifyUrl = `${baseUrl}/verify-email/${rawEmailToken}`;

    const emailResult = await resend.emails.send({
      from: fromEmail,
      to: [user.email],
      subject: "Verify your Aanshi account email",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222;">
          <h2 style="margin-bottom:12px;">Verify your email</h2>
          <p>Hello ${user.name || "User"},</p>
          <p>Welcome to Aanshi Farms. Please verify your email to activate your account.</p>
          <p style="margin:24px 0;">
            <a
              href="${verifyUrl}"
              style="display:inline-block;padding:12px 20px;background:#2f7d32;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;"
            >
              Verify Email
            </a>
          </p>
          <p>This link will expire in 30 minutes.</p>
          <p>If you did not create this account, you can safely ignore this email.</p>
          <hr style="margin:24px 0;border:none;border-top:1px solid #e5e5e5;" />
          <p style="font-size:13px;color:#666;">If the button does not work, copy and paste this link:</p>
          <p style="font-size:13px;word-break:break-all;color:#666;">${verifyUrl}</p>
        </div>
      `,
      text: `Hello ${
        user.name || "User"
      }, verify your Aanshi account using this link: ${verifyUrl}. This link expires in 30 minutes.`,
    });

    if ((emailResult as any)?.error) {
      throw new Error(JSON.stringify((emailResult as any).error, null, 2));
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created successfully. Please verify your email to continue.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("SIGNUP FAILED:", error);

    if (error?.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];

      if (duplicateField === "email") {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }

      if (duplicateField === "phone") {
        return NextResponse.json(
          { error: "An account with this phone number already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Signup failed", details: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
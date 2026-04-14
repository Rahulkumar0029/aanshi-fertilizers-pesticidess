import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getResend } from "@/lib/resend";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashValue(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function POST() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const pendingOwnerId = cookieStore.get("ownerPending2FA")?.value;

    if (!pendingOwnerId) {
      return NextResponse.json(
        { error: "OTP session expired. Please log in again." },
        { status: 401 }
      );
    }

    const user = await User.findById(pendingOwnerId);

    if (!user || user.role !== "owner") {
      return NextResponse.json(
        { error: "Owner session not found" },
        { status: 404 }
      );
    }

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
    const fromEmail = process.env.RESEND_FROM_EMAIL?.trim();

    if (!fromEmail) {
      throw new Error("Missing RESEND_FROM_EMAIL");
    }

    await resend.emails.send({
      from: fromEmail,
      to: [user.email],
      subject: "Your new Aanshi owner login OTP",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6;">
          <h2>Owner Login Verification</h2>
          <p>Hello ${user.name},</p>
          <p>Your new OTP is:</p>
          <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
          <p>This OTP expires in 5 minutes.</p>
        </div>
      `,
      text: `Your new Aanshi owner login OTP is ${otp}. It expires in 5 minutes.`,
    });

    return NextResponse.json({
      success: true,
      message: "A new OTP has been sent",
    });
  } catch (error: any) {
    console.error("RESEND OWNER OTP FAILED:", error);

    return NextResponse.json(
      {
        error: "Failed to resend OTP",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
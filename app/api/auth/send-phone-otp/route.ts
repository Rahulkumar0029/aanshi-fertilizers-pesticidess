import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getUser } from "@/lib/auth";
import { sendPhoneOtp } from "@/lib/msg91";

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

export async function POST() {
  try {
    await connectDB();

    const safeUser = await getUser();

    if (!safeUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findById(safeUser._id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    const lastSentAt = user.phoneOtpLastSentAt
      ? new Date(user.phoneOtpLastSentAt)
      : null;

    if (lastSentAt && now.getTime() - lastSentAt.getTime() < 60 * 1000) {
      return NextResponse.json(
        { success: false, error: "Please wait before requesting another OTP" },
        { status: 429 }
      );
    }

    const targetPhone = user.pendingPhone || user.phone;

    if (!targetPhone) {
      return NextResponse.json(
        { success: false, error: "No phone number available for verification" },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizeIndianPhone(targetPhone);

    if (!isValidIndianPhone(normalizedPhone)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number. Please update it first." },
        { status: 400 }
      );
    }

    await sendPhoneOtp(normalizedPhone);

    user.phoneOtpExpiresAt = new Date(now.getTime() + 5 * 60 * 1000);
    user.phoneOtpAttempts = 0;
    user.phoneOtpLastSentAt = now;
    await user.save();

    const maskedPhone = `******${normalizedPhone.slice(-4)}`;

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${maskedPhone}`,
      phoneVerified: !!user.phoneVerified,
      hasPendingPhone: !!user.pendingPhone,
    });
  } catch (error: any) {
    console.error("SEND PHONE OTP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send phone OTP",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
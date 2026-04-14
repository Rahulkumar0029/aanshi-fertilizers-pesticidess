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

export async function POST(req: Request) {
  try {
    await connectDB();

    const safeUser = await getUser();

    if (!safeUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    const rawPhone = typeof body?.phone === "string" ? body.phone.trim() : "";
    const normalizedPhone = normalizeIndianPhone(rawPhone);

    if (!rawPhone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 }
      );
    }

    if (!isValidIndianPhone(normalizedPhone)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid 10-digit Indian mobile number",
        },
        { status: 400 }
      );
    }

    const user = await User.findById(safeUser._id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (user.phone === normalizedPhone) {
      return NextResponse.json(
        {
          success: false,
          error: "This is already your current phone number",
        },
        { status: 400 }
      );
    }

    const existingPhoneUser = await User.findOne({
      phone: normalizedPhone,
      _id: { $ne: user._id },
    });

    if (existingPhoneUser) {
      return NextResponse.json(
        {
          success: false,
          error: "An account with this phone number already exists",
        },
        { status: 409 }
      );
    }

    const now = new Date();
    const lastSentAt = user.phoneOtpLastSentAt
      ? new Date(user.phoneOtpLastSentAt)
      : null;

    if (lastSentAt && now.getTime() - lastSentAt.getTime() < 60 * 1000) {
      return NextResponse.json(
        {
          success: false,
          error: "Please wait before requesting another OTP",
        },
        { status: 429 }
      );
    }

    user.pendingPhone = normalizedPhone;
    user.phoneOtpExpiresAt = new Date(now.getTime() + 5 * 60 * 1000);
    user.phoneOtpAttempts = 0;
    user.phoneOtpLastSentAt = now;

    await user.save();

    await sendPhoneOtp(normalizedPhone);

    const maskedPhone = `******${normalizedPhone.slice(-4)}`;

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${maskedPhone}`,
      pendingPhone: normalizedPhone,
      phoneVerified: false,
    });
  } catch (error: any) {
    console.error("UPDATE PHONE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update phone number",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
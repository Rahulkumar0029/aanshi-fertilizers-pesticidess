import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getUser } from "@/lib/auth";
import { verifyPhoneOtp } from "@/lib/msg91";

function normalizeIndianPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }

  return digits;
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
    const otp = typeof body?.otp === "string" ? body.otp.trim() : "";

    if (!otp || otp.length !== 6) {
      return NextResponse.json(
        { success: false, error: "Enter a valid 6-digit OTP" },
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

    const targetPhone = user.pendingPhone || user.phone;

    if (!targetPhone) {
      return NextResponse.json(
        { success: false, error: "No phone number available for verification" },
        { status: 400 }
      );
    }

    if (
      user.phoneOtpExpiresAt &&
      new Date(user.phoneOtpExpiresAt).getTime() < Date.now()
    ) {
      user.phoneOtpExpiresAt = null;
      user.phoneOtpAttempts = 0;
      await user.save();

      return NextResponse.json(
        { success: false, error: "OTP expired. Please request a new OTP." },
        { status: 400 }
      );
    }

    if ((user.phoneOtpAttempts || 0) >= 5) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many incorrect OTP attempts. Please request a new OTP.",
        },
        { status: 429 }
      );
    }

    const normalizedPhone = normalizeIndianPhone(targetPhone);

    try {
      await verifyPhoneOtp(normalizedPhone, otp);
    } catch (providerError: any) {
      user.phoneOtpAttempts = (user.phoneOtpAttempts || 0) + 1;
      await user.save();

      return NextResponse.json(
        {
          success: false,
          error: providerError?.message || "Invalid OTP",
        },
        { status: 400 }
      );
    }

    const wasPendingPhoneUpdate =
      !!user.pendingPhone && user.pendingPhone !== user.phone;

    if (wasPendingPhoneUpdate) {
      user.phone = user.pendingPhone;
      user.pendingPhone = null;
    }

    user.phoneVerified = true;
    user.phoneOtpExpiresAt = null;
    user.phoneOtpAttempts = 0;
    user.phoneOtpLastSentAt = null;

    await user.save();

    return NextResponse.json({
      success: true,
      message: wasPendingPhoneUpdate
        ? "Phone number updated and verified successfully."
        : "Phone number verified successfully.",
      phone: user.phone,
      phoneVerified: true,
    });
  } catch (error: any) {
    console.error("VERIFY PHONE OTP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to verify phone OTP",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
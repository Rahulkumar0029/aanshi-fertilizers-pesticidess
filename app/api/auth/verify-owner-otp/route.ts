import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

function hashValue(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function POST(req: Request) {
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

    const body = await req.json();
    const otp =
      typeof body.otp === "string" ? body.otp.trim() : "";

    if (!otp || otp.length !== 6) {
      return NextResponse.json(
        { error: "Enter a valid 6-digit OTP" },
        { status: 400 }
      );
    }

    const user = await User.findById(pendingOwnerId);

    if (!user || user.role !== "owner") {
      return NextResponse.json(
        { error: "Owner session not found" },
        { status: 404 }
      );
    }

    if (!user.ownerOtpCodeHash || !user.ownerOtpExpiresAt) {
      return NextResponse.json(
        { error: "No active OTP found. Please log in again." },
        { status: 400 }
      );
    }

    if (new Date(user.ownerOtpExpiresAt).getTime() < Date.now()) {
      user.ownerOtpCodeHash = null;
      user.ownerOtpExpiresAt = null;
      user.ownerOtpAttempts = 0;
      await user.save();

      return NextResponse.json(
        { error: "OTP expired. Please log in again." },
        { status: 400 }
      );
    }

    if ((user.ownerOtpAttempts || 0) >= 5) {
      return NextResponse.json(
        { error: "Too many incorrect OTP attempts. Please log in again." },
        { status: 429 }
      );
    }

    const incomingHash = hashValue(otp);

    if (incomingHash !== user.ownerOtpCodeHash) {
      user.ownerOtpAttempts = (user.ownerOtpAttempts || 0) + 1;
      await user.save();

      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 401 }
      );
    }

    user.ownerOtpCodeHash = null;
    user.ownerOtpExpiresAt = null;
    user.ownerOtpAttempts = 0;
    await user.save();

    const response = NextResponse.json({
      message: "Owner verification successful",
      user: {
        _id: String(user._id),
        name: user.name,
        email: user.email,
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

    response.cookies.set("ownerPending2FA", "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error: any) {
    console.error("VERIFY OWNER OTP FAILED:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP", details: error.message },
      { status: 500 }
    );
  }
}
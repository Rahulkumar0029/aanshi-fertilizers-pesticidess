import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

function hashValue(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json().catch(() => null);
    const rawToken =
      typeof body?.token === "string" ? body.token.trim() : "";

    if (!rawToken) {
      return NextResponse.json(
        { success: false, error: "Verification token is required." },
        { status: 400 }
      );
    }

    const hashedToken = hashValue(rawToken);

    const user = await User.findOne({
      emailChangeToken: hashedToken,
      emailChangeExpires: { $gt: new Date() },
    });

    if (!user || !user.pendingEmail) {
      return NextResponse.json(
        { success: false, error: "Verification link is invalid or expired." },
        { status: 400 }
      );
    }

    user.email = user.pendingEmail;
    user.pendingEmail = null;
    user.emailVerified = true;
    user.emailChangeToken = null;
    user.emailChangeExpires = null;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Your email has been updated and verified successfully.",
    });
  } catch (error: any) {
    console.error("VERIFY EMAIL CHANGE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to verify changed email.",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
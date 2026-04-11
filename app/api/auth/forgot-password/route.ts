import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getResend } from "@/lib/resend";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const rawEmail = body.email;
    const email =
      typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email: { $regex: `^${escapeRegex(email)}$`, $options: "i" },
    });

    // Never reveal whether account exists
    const genericResponse = NextResponse.json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });

    if (!user) {
      return genericResponse;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 min

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = expiresAt;
    await user.save();

    const appUrl = process.env.APP_URL;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!appUrl || !fromEmail) {
      throw new Error("Missing APP_URL or RESEND_FROM_EMAIL");
    }

    const resetUrl = `${appUrl}/reset-password/${rawToken}`;

    const resend = getResend();

    await resend.emails.send({
      from: fromEmail,
      to: [user.email],
      subject: "Reset your Aanshi account password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Reset your password</h2>
          <p>Hello ${user.name},</p>
          <p>We received a request to reset your password for your Aanshi account.</p>
          <p>
            <a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#2f7d32;color:#ffffff;text-decoration:none;border-radius:8px;">
              Reset Password
            </a>
          </p>
          <p>This link will expire in 30 minutes.</p>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
      `,
      text: `Hello ${user.name}, reset your password using this link: ${resetUrl}. This link expires in 30 minutes.`,
    });

    return genericResponse;
  } catch (error: any) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request", details: error.message },
      { status: 500 }
    );
  }
}
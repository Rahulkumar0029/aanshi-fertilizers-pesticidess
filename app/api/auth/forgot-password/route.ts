import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getResend } from "@/lib/resend";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getBaseUrl() {
  const appUrl = process.env.APP_URL?.trim();

  if (!appUrl) {
    throw new Error("Missing APP_URL");
  }

  return appUrl.replace(/\/+$/, "");
}

export async function POST(req: Request) {
  try {
    console.log("FORGOT PASSWORD API HIT");

    await connectDB();

    const body = await req.json().catch(() => null);
    const rawEmail = body?.email;

    const email =
      typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

    console.log("Incoming email:", email);

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const genericResponse = NextResponse.json({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });

    const user = await User.findOne({
      email: { $regex: `^${escapeRegex(email)}$`, $options: "i" },
    });

    console.log("User found:", !!user);

    if (!user) {
      return genericResponse;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = expiresAt;
    await user.save();

    const resend = getResend();
    const baseUrl = getBaseUrl();

    const fromEmail = process.env.RESEND_FROM_EMAIL?.trim();

    if (!fromEmail) {
      throw new Error("Missing RESEND_FROM_EMAIL");
    }

    const resetUrl = `${baseUrl}/reset-password/${rawToken}`;

    console.log("APP_URL:", baseUrl);
    console.log("FROM_EMAIL:", fromEmail);
    console.log("HAS_RESEND_KEY:", !!process.env.RESEND_API_KEY);
    console.log("RESET_URL:", resetUrl);
    console.log("User email value:", user.email);
    console.log("User name value:", user.name);

    console.log("About to send email...");
    console.log("Sending to:", user.email);
    console.log("Using from:", fromEmail);

    const emailResult = await resend.emails.send({
      from: fromEmail,
      to: [user.email],
      subject: "Reset your Aanshi account password",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222;">
          <h2 style="margin-bottom:12px;">Reset your password</h2>
          <p>Hello ${user.name || "User"},</p>
          <p>We received a request to reset your password for your Aanshi account.</p>
          <p style="margin:24px 0;">
            <a
              href="${resetUrl}"
              style="display:inline-block;padding:12px 20px;background:#2f7d32;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;"
            >
              Reset Password
            </a>
          </p>
          <p>This link will expire in 30 minutes.</p>
          <p>If you did not request this, you can safely ignore this email.</p>
          <hr style="margin:24px 0;border:none;border-top:1px solid #e5e5e5;" />
          <p style="font-size:13px;color:#666;">
            If the button does not work, copy and paste this link into your browser:
          </p>
          <p style="font-size:13px;word-break:break-all;color:#666;">
            ${resetUrl}
          </p>
        </div>
      `,
      text: `Hello ${
        user.name || "User"
      }, reset your password using this link: ${resetUrl}. This link expires in 30 minutes.`,
    });

    console.log("Full RESEND RESULT:", JSON.stringify(emailResult, null, 2));

    if ((emailResult as any)?.error) {
      throw new Error(
        JSON.stringify((emailResult as any).error, null, 2)
      );
    }

    return genericResponse;
  } catch (error: any) {
    console.error("FORGOT PASSWORD ERROR FULL:", error);
    console.error("FORGOT PASSWORD ERROR MESSAGE:", error?.message);
    console.error("FORGOT PASSWORD ERROR STACK:", error?.stack);

    return NextResponse.json(
      {
        error: "Failed to process password reset request",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
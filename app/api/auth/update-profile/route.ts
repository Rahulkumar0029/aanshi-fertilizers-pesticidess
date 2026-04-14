import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getUser } from "@/lib/auth";
import { getResend } from "@/lib/resend";

function getBaseUrl() {
  const appUrl = process.env.APP_URL?.trim();

  if (!appUrl) {
    throw new Error("Missing APP_URL");
  }

  return appUrl.replace(/\/+$/, "");
}

function hashValue(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
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

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const rawPhone = typeof body?.phone === "string" ? body.phone.trim() : "";
    const phone = normalizeIndianPhone(rawPhone);

    const address = body?.address || {};
    const addressLine1 =
      typeof address?.addressLine1 === "string"
        ? address.addressLine1.trim()
        : "";
    const addressLine2 =
      typeof address?.addressLine2 === "string"
        ? address.addressLine2.trim()
        : "";
    const villageOrCity =
      typeof address?.villageOrCity === "string"
        ? address.villageOrCity.trim()
        : "";
    const district =
      typeof address?.district === "string" ? address.district.trim() : "";
    const state =
      typeof address?.state === "string" ? address.state.trim() : "";
    const pincode =
      typeof address?.pincode === "string" ? address.pincode.trim() : "";

    if (!name || !email || !rawPhone) {
      return NextResponse.json(
        { success: false, error: "Name, email, and phone are required." },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid full name." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!isValidIndianPhone(phone)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid 10-digit Indian mobile number.",
        },
        { status: 400 }
      );
    }

    if (pincode && !/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 6-digit pincode." },
        { status: 400 }
      );
    }

    const user = await User.findById(safeUser._id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    const emailChanged = user.email !== email;
    const phoneChanged = user.phone !== phone;
    const nameChanged = user.name !== name;

    if (phoneChanged) {
      const existingPhoneUser = await User.findOne({
        phone,
        _id: { $ne: user._id },
      });

      if (existingPhoneUser) {
        return NextResponse.json(
          {
            success: false,
            error: "An account with this phone number already exists.",
          },
          { status: 409 }
        );
      }
    }

    if (emailChanged) {
      const existingEmailUser = await User.findOne({
        email,
        _id: { $ne: user._id },
      });

      if (existingEmailUser) {
        return NextResponse.json(
          {
            success: false,
            error: "An account with this email already exists.",
          },
          { status: 409 }
        );
      }
    }

    user.name = name;
    user.phone = phone;
    user.address = {
      addressLine1,
      addressLine2,
      villageOrCity,
      district,
      state,
      pincode,
    };

    let message = "Profile updated successfully.";

    if (emailChanged) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = hashValue(rawToken);
      const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

      user.pendingEmail = email;
      user.emailChangeToken = hashedToken;
      user.emailChangeExpires = expiresAt;

      const resend = getResend();
      const fromEmail = process.env.RESEND_FROM_EMAIL?.trim();

      if (!fromEmail) {
        throw new Error("Missing RESEND_FROM_EMAIL");
      }

      const baseUrl = getBaseUrl();
      const verifyUrl = `${baseUrl}/verify-email-change/${rawToken}`;

      const emailResult = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: "Verify your new Aanshi account email",
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222;">
            <h2 style="margin-bottom:12px;">Verify your new email</h2>
            <p>Hello ${user.name || "User"},</p>
            <p>We received a request to change your Aanshi account email.</p>
            <p style="margin:24px 0;">
              <a
                href="${verifyUrl}"
                style="display:inline-block;padding:12px 20px;background:#2f7d32;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;"
              >
                Verify New Email
              </a>
            </p>
            <p>This link will expire in 30 minutes.</p>
            <p>Your current email will remain active until this new email is verified.</p>
            <hr style="margin:24px 0;border:none;border-top:1px solid #e5e5e5;" />
            <p style="font-size:13px;color:#666;">
              If the button does not work, copy and paste this link into your browser:
            </p>
            <p style="font-size:13px;word-break:break-all;color:#666;">
              ${verifyUrl}
            </p>
          </div>
        `,
        text: `Hello ${
          user.name || "User"
        }, verify your new Aanshi email using this link: ${verifyUrl}. This link expires in 30 minutes.`,
      });

      if ((emailResult as any)?.error) {
        throw new Error(JSON.stringify((emailResult as any).error, null, 2));
      }

      message =
        "Profile updated. Verification link sent to your new email address.";
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message,
      emailVerificationRequired: emailChanged,
      pendingEmail: emailChanged ? email : null,
    });
  } catch (error: any) {
    console.error("UPDATE PROFILE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update profile.",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
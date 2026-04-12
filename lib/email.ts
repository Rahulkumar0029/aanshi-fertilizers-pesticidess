import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTPEmail(to: string, otp: string) {
  try {
    await resend.emails.send({
      from: "Aanshi <onboarding@resend.dev>",
      to,
      subject: "Your OTP Code",
      html: `
        <h2>Your OTP Code</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    throw new Error("Failed to send OTP");
  }
}
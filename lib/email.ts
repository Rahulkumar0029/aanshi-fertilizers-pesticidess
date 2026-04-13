import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTPEmail(to: string, otp: string) {
  try {
    const result = await resend.emails.send({
      from: "Aanshi Support <support@aanshifarms.in>",
      to,
      subject: "Your OTP Code",
      html: `
        <h2>Your OTP Code</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    console.log("EMAIL SENT:", result);
    return result;
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    throw new Error("Failed to send OTP");
  }
}
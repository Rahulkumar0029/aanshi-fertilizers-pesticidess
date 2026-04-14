const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;
const MSG91_COUNTRY_CODE = process.env.MSG91_COUNTRY_CODE || "91";

if (!MSG91_AUTH_KEY) {
  throw new Error("Missing MSG91_AUTH_KEY");
}

if (!MSG91_TEMPLATE_ID) {
  throw new Error("Missing MSG91_TEMPLATE_ID");
}

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `${MSG91_COUNTRY_CODE}${digits}`;
  }

  if (
    digits.length === MSG91_COUNTRY_CODE.length + 10 &&
    digits.startsWith(MSG91_COUNTRY_CODE)
  ) {
    return digits;
  }

  throw new Error("Invalid phone number format");
}

export async function sendPhoneOtp(phone: string) {
  const mobile = formatPhone(phone);

  const url = `https://control.msg91.com/api/v5/otp?authkey=${MSG91_AUTH_KEY}&mobile=${mobile}&template_id=${MSG91_TEMPLATE_ID}`;

  const res = await fetch(url, {
    method: "POST",
  });

  const rawText = await res.text();

  let data: any = null;
  try {
    data = JSON.parse(rawText);
  } catch {
    data = { rawText };
  }

  console.log("MSG91 SEND OTP STATUS:", res.status);
  console.log("MSG91 SEND OTP RESPONSE:", data);
  console.log("MSG91 SEND OTP MOBILE:", mobile);

  if (!res.ok || data?.type === "error") {
    throw new Error(
      data?.message ||
        data?.rawText ||
        "Failed to send OTP from MSG91"
    );
  }

  return data;
}

export async function verifyPhoneOtp(phone: string, otp: string) {
  const mobile = formatPhone(phone);

  const url = `https://control.msg91.com/api/v5/otp/verify?authkey=${MSG91_AUTH_KEY}&mobile=${mobile}&otp=${otp}`;

  const res = await fetch(url, {
    method: "POST",
  });

  const rawText = await res.text();

  let data: any = null;
  try {
    data = JSON.parse(rawText);
  } catch {
    data = { rawText };
  }

  console.log("MSG91 VERIFY OTP STATUS:", res.status);
  console.log("MSG91 VERIFY OTP RESPONSE:", data);
  console.log("MSG91 VERIFY OTP MOBILE:", mobile);

  if (!res.ok || data?.type === "error") {
    throw new Error(
      data?.message ||
        data?.rawText ||
        "OTP verification failed from MSG91"
    );
  }

  return data;
}
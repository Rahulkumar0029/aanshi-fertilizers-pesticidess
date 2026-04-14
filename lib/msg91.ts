const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;
const MSG91_COUNTRY_CODE = process.env.MSG91_COUNTRY_CODE || "91";

if (!MSG91_AUTH_KEY) {
  throw new Error("Missing MSG91_AUTH_KEY");
}

if (!MSG91_TEMPLATE_ID) {
  throw new Error("Missing MSG91_TEMPLATE_ID");
}

// Normalize Indian phone
function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `${MSG91_COUNTRY_CODE}${digits}`;
  }

  if (digits.startsWith(MSG91_COUNTRY_CODE)) {
    return digits;
  }

  throw new Error("Invalid phone number format");
}

// SEND OTP
export async function sendPhoneOtp(phone: string) {
  const mobile = formatPhone(phone);

  const url = `https://control.msg91.com/api/v5/otp?authkey=${MSG91_AUTH_KEY}&mobile=${mobile}&template_id=${MSG91_TEMPLATE_ID}`;

  const res = await fetch(url, {
    method: "POST",
  });

  const data = await res.json();

  if (!res.ok || data?.type === "error") {
    throw new Error(data?.message || "Failed to send OTP");
  }

  return data;
}

// VERIFY OTP
export async function verifyPhoneOtp(phone: string, otp: string) {
  const mobile = formatPhone(phone);

  const url = `https://control.msg91.com/api/v5/otp/verify?authkey=${MSG91_AUTH_KEY}&mobile=${mobile}&otp=${otp}`;

  const res = await fetch(url, {
    method: "POST",
  });

  const data = await res.json();

  if (!res.ok || data?.type === "error") {
    throw new Error(data?.message || "OTP verification failed");
  }

  return data;
}
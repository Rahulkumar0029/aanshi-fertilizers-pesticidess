import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  const expiredCookie = {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };

  response.cookies.set("userId", "", expiredCookie);
  response.cookies.set("ownerPending2FA", "", expiredCookie);

  return response;
}
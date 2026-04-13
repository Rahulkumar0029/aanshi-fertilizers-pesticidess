import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      const response = NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );

      response.cookies.set("userId", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(0),
      });

      return response;
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("AUTH ME ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch user", details: error.message },
      { status: 500 }
    );
  }
}
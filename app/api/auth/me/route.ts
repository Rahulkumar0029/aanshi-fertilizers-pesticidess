import { NextResponse } from "next/server";
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

      response.cookies.set("role", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(0),
      });

      return response;
    }

    return NextResponse.json({
      id: user.id || user._id?.toString?.() || "",
      _id: user._id?.toString?.() || user.id || "",
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "user",
      emailVerified: Boolean(user.emailVerified),
      phoneVerified: Boolean(user.phoneVerified),
      signupCompleted: Boolean(user.signupCompleted),
      pendingEmail: user.pendingEmail || null,
      address: {
        addressLine1: user.address?.addressLine1 || "",
        addressLine2: user.address?.addressLine2 || "",
        villageOrCity: user.address?.villageOrCity || "",
        district: user.address?.district || "",
        state: user.address?.state || "",
        pincode: user.address?.pincode || "",
      },
    });
  } catch (error: any) {
    console.error("AUTH ME ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch user",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
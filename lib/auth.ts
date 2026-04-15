import mongoose from "mongoose";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export type SafeUser = {
  id: string;
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  signupCompleted: boolean;
  pendingEmail?: string | null;
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    villageOrCity?: string;
    district?: string;
    state?: string;
    pincode?: string;
  };
};

export async function getUser(): Promise<SafeUser | null> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value?.trim();

    if (!userId) return null;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.warn("getUser: invalid userId cookie", userId);
      return null;
    }

    await connectDB();

    const user = await User.findById(userId).select("-password").lean();

    if (!user) return null;

    return {
      id: String(user._id),
      _id: String(user._id),
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "user",
      emailVerified: !!user.emailVerified,
      phoneVerified: !!user.phoneVerified,
      signupCompleted: !!user.signupCompleted,
      pendingEmail: user.pendingEmail || null,
      address: user.address || {
        addressLine1: "",
        addressLine2: "",
        villageOrCity: "",
        district: "",
        state: "",
        pincode: "",
      },
    };
  } catch (error: any) {
    console.error("getUser ERROR:", {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    return null;
  }
}

export async function requireOwner(): Promise<SafeUser> {
  const user = await getUser();

  if (!user || user.role !== "owner") {
    throw new Error("UNAUTHORIZED_OWNER");
  }

  return user;
}
"use server";

import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

type AuthUser = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
};

export async function getUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return null;

  await connectDB();

  const user = await User.findById(userId).select("-password").lean();

  if (!user) return null;

  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return !!cookieStore.get("userId")?.value;
}

export async function isOwner(): Promise<boolean> {
  const user = await getUser();
  return user?.role === "owner";
}
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
};

export async function getUser(): Promise<SafeUser | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return null;

  await connectDB();

  const user = await User.findById(userId).select("-password").lean();

  if (!user) return null;

  return {
    id: String(user._id),
    _id: String(user._id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

export async function requireOwner(): Promise<SafeUser> {
  const user = await getUser();

  if (!user || user.role !== "owner") {
    throw new Error("UNAUTHORIZED_OWNER");
  }

  return user;
}
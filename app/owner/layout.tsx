import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/login?redirect=/owner");
  }

  await connectDB();

  const user = await User.findById(userId).select("role");

  if (!user || user.role !== "owner") {
    redirect("/login?redirect=/owner");
  }

  return <div className="min-h-screen bg-background">{children}</div>;
}
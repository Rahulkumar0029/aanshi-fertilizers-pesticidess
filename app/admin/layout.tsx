import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/login?redirect=/admin");
  }

  await connectDB();

  const user = await User.findById(userId).select("role");

  if (!user || user.role !== "owner") {
    redirect("/login?redirect=/admin");
  }

  return <div className="min-h-screen bg-background">{children}</div>;
}
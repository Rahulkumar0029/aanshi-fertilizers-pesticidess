import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";

export default async function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    const user = await getUser();

    if (!user) {
        redirect("/login?redirect=/admin");
    }

    if (user.role !== "owner") {
        redirect("/");
    }

    return <>{children}</>;
}
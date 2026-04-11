"use client";

import Link from "next/link";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    MessageSquare,
    BarChart3,
    Image as ImageIcon,
    Settings,
    LogOut,
    ExternalLink,
    Leaf,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const sections = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Products", path: "/admin/products", icon: Package, color: "text-green-600", bg: "bg-green-50" },
    { name: "Orders", path: "/admin/orders", icon: ShoppingBag, color: "text-purple-600", bg: "bg-purple-50" },
    { name: "Inquiries", path: "/admin/inquiries", icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-50" },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart3, color: "text-rose-600", bg: "bg-rose-50" },
    { name: "Banners", path: "/admin/banners", icon: ImageIcon, color: "text-indigo-600", bg: "bg-indigo-50" },
    { name: "Settings", path: "/admin/settings", icon: Settings, color: "text-slate-600", bg: "bg-slate-50" },
];

type AuthUser = {
    _id?: string;
    id?: string;
    name: string;
    role: string;
};

export default function AdminHome() {
    const [adminName, setAdminName] = useState("Admin");
    const router = useRouter();

    // only load name, not protect route here
    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await fetch("/api/auth/me", {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) return;

                const user: AuthUser = await res.json();
                setAdminName(user.name || "Admin");
            } catch (error) {
                console.error("Failed to load admin user:", error);
            }
        };

        loadUser();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
            });

            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10">
            {/* TOP BAR */}
            <div className="max-w-7xl mx-auto flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                    <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                        <Leaf className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Aanshi Panel</h1>
                        <p className="text-xs text-gray-400 uppercase">Management Hub</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary"
                    >
                        <ExternalLink size={16} /> View Website
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="bg-white text-red-500 px-4 py-2 rounded-xl font-bold border border-red-100 hover:bg-red-50 flex items-center gap-2"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            {/* WELCOME */}
            <div className="max-w-7xl mx-auto mb-10">
                <h2 className="text-4xl font-bold text-gray-900">
                    Welcome back, {adminName} 👋
                </h2>
                <p className="text-gray-500 mt-2">
                    Manage your store products, orders, and inquiries from one place.
                </p>
            </div>

            {/* GRID */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sections.map((section) => (
                    <Link
                        key={section.name}
                        href={section.path}
                        className="group bg-white p-8 rounded-3xl shadow-sm border hover:shadow-xl flex flex-col items-center text-center"
                    >
                        <div className={`${section.bg} ${section.color} p-5 rounded-2xl mb-4`}>
                            <section.icon size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {section.name}
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                            Manage all {section.name.toLowerCase()}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
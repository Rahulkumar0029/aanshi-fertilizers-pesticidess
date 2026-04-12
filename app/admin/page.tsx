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
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const sections = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: Package,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: ShoppingBag,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    name: "Inquiries",
    path: "/admin/inquiries",
    icon: MessageSquare,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    name: "Analytics",
    path: "/admin/analytics",
    icon: BarChart3,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    name: "Banners",
    path: "/admin/banners",
    icon: ImageIcon,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
    color: "text-slate-600",
    bg: "bg-slate-50",
  },
];

type AuthUser = {
  _id?: string;
  id?: string;
  name: string;
  role: string;
};

type AdminStats = {
  products: number;
  orders: number;
  inquiries: number;
};

export default function AdminHome() {
  const [adminName, setAdminName] = useState("Admin");
  const [userRole, setUserRole] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    products: 0,
    orders: 0,
    inquiries: 0,
  });

  const router = useRouter();

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const authRes = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!authRes.ok) {
          router.replace("/login?redirect=/admin");
          return;
        }

        const user: AuthUser = await authRes.json();

        if (!user || (user.role !== "admin" && user.role !== "owner")) {
          router.replace("/");
          return;
        }

        setAdminName(user.name || "Admin");
        setUserRole(user.role);

        const [productsRes, ordersRes, inquiriesRes] = await Promise.all([
          fetch("/api/products", { credentials: "include", cache: "no-store" }),
          fetch("/api/orders", { credentials: "include", cache: "no-store" }),
          fetch("/api/inquiries", { credentials: "include", cache: "no-store" }),
        ]);

        const [productsData, ordersData, inquiriesData] = await Promise.all([
          productsRes.ok ? productsRes.json() : [],
          ordersRes.ok ? ordersRes.json() : [],
          inquiriesRes.ok ? inquiriesRes.json() : [],
        ]);

        setStats({
          products: Array.isArray(productsData) ? productsData.length : 0,
          orders: Array.isArray(ordersData) ? ordersData.length : 0,
          inquiries: Array.isArray(inquiriesData) ? inquiriesData.length : 0,
        });
      } catch (error) {
        console.error("Failed to load admin data:", error);
        router.replace("/login?redirect=/admin");
      } finally {
        setCheckingAuth(false);
      }
    };

    loadAdminData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <p className="text-sm text-gray-500">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary p-2 shadow-lg shadow-primary/20">
              <Leaf className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Aanshi Admin Panel</h1>
              <p className="text-xs uppercase text-gray-400">Management Hub</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50"
            >
              <ExternalLink size={16} />
              View Website
            </Link>

            {userRole === "owner" && (
              <Link
                href="/owner"
                className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10"
              >
                <ShieldCheck size={16} />
                Owner Panel
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-white px-4 py-2 font-bold text-red-500 hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm border">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {adminName} 👋
          </h2>
          <p className="mt-2 text-gray-500">
            Manage products, orders, inquiries, marketing content, and business settings from one place.
          </p>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Products</p>
            <h3 className="mt-2 text-3xl font-bold text-gray-900">{stats.products}</h3>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Orders</p>
            <h3 className="mt-2 text-3xl font-bold text-gray-900">{stats.orders}</h3>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Inquiries</p>
            <h3 className="mt-2 text-3xl font-bold text-gray-900">{stats.inquiries}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((section) => (
            <Link
              key={section.name}
              href={section.path}
              className="group rounded-3xl border bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`mx-auto mb-4 w-fit rounded-2xl p-5 ${section.bg} ${section.color}`}>
                <section.icon size={32} />
              </div>

              <h2 className="text-xl font-bold text-gray-800">{section.name}</h2>
              <p className="mt-1 text-sm text-gray-400">
                Manage all {section.name.toLowerCase()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
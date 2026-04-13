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
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const sections = [
  {
    name: "Dashboard",
    path: "/admin",
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

type Inquiry = {
  _id: string;
  productName?: string;
  userName?: string;
  productCategory?: string;
  status?: string;
  timestamp?: string;
  createdAt?: string;
};

export default function AdminHome() {
  const [adminName, setAdminName] = useState("Admin");
  const [userRole, setUserRole] = useState("owner");
  const [stats, setStats] = useState<AdminStats>({
    products: 0,
    orders: 0,
    inquiries: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const authRes = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (authRes.ok) {
          const user: AuthUser = await authRes.json();
          setAdminName(user?.name || "Admin");
          setUserRole(user?.role || "owner");
        }

        const [productsRes, ordersRes, inquiriesRes] = await Promise.all([
          fetch("/api/products", {
            credentials: "include",
            cache: "no-store",
          }),
          fetch("/api/orders", {
            credentials: "include",
            cache: "no-store",
          }),
          fetch("/api/inquiries", {
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        const [productsData, ordersData, inquiriesData] = await Promise.all([
          productsRes.ok ? productsRes.json() : [],
          ordersRes.ok ? ordersRes.json() : [],
          inquiriesRes.ok ? inquiriesRes.json() : [],
        ]);

        const safeProducts = Array.isArray(productsData) ? productsData : [];
        const safeOrders = Array.isArray(ordersData) ? ordersData : [];
        const safeInquiries = Array.isArray(inquiriesData) ? inquiriesData : [];

        setStats({
          products: safeProducts.length,
          orders: safeOrders.length,
          inquiries: safeInquiries.length,
        });

        setRecentInquiries(safeInquiries.slice(0, 5));
      } catch (error) {
        console.error("Failed to load admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

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

  const engagementRate = Math.round(
    (stats.inquiries / (stats.products || 1)) * 100
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading admin panel...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6 sm:py-8 lg:py-10">
      <div className="container-app">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between lg:mb-10">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary p-2 shadow-lg shadow-primary/20">
              <Leaf className="text-white" size={24} />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-black text-gray-900 sm:text-2xl">
                Aanshi Admin Panel
              </h1>
              <p className="text-[11px] uppercase tracking-wider text-gray-400 sm:text-xs">
                Management Hub
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50"
            >
              <ExternalLink size={16} />
              View Website
            </Link>

            {userRole === "owner" && (
              <Link
                href="/owner"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10"
              >
                <ShieldCheck size={16} />
                Owner Panel
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50"
              type="button"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        <div className="mb-8 rounded-3xl border bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Welcome back, {adminName} 👋
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
            Manage products, orders, inquiries, marketing content, and business
            settings from one place.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 lg:mb-10">
          <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm text-gray-500">Total Products</p>
            <h3 className="mt-2 text-3xl font-bold text-gray-900">
              {stats.products}
            </h3>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm text-gray-500">Total Orders</p>
            <h3 className="mt-2 text-3xl font-bold text-gray-900">
              {stats.orders}
            </h3>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm text-gray-500">Total Inquiries</p>
            <h3 className="mt-2 text-3xl font-bold text-gray-900">
              {stats.inquiries}
            </h3>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm text-gray-500">Activity</p>
            <div className="mt-2 flex items-center gap-2">
              <h3 className="text-3xl font-bold text-gray-900">
                {engagementRate}%
              </h3>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <p className="mt-1 text-xs font-semibold text-green-600">
              Engagement Rate
            </p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 lg:mb-10">
          {sections.map((section) => (
            <Link
              key={section.name}
              href={section.path}
              className="group rounded-3xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-8"
            >
              <div
                className={`mx-auto mb-4 w-fit rounded-2xl p-4 sm:p-5 ${section.bg} ${section.color}`}
              >
                <section.icon size={30} />
              </div>

              <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                {section.name}
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Manage all {section.name.toLowerCase()}
              </p>
            </Link>
          ))}
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-800">
              Recent Inquiries
            </h2>

            <Link
              href="/admin/inquiries"
              className="text-sm font-bold text-primary hover:underline"
            >
              View All
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="py-12 text-center">
              <MessageSquare className="mx-auto mb-4 text-gray-200" size={48} />
              <p className="text-gray-400 font-medium">
                No recent inquiries to show.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentInquiries.map((inq, index) => (
                <div
                  key={inq._id || index}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50/40 p-4 transition hover:bg-white hover:shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800">
                      {inq.productName || "Unknown Product"}
                    </p>
                    <p className="truncate text-sm italic text-gray-500">
                      by {inq.userName || "Customer"} •{" "}
                      {inq.productCategory || "Unknown Category"}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={`inline-block rounded-lg px-2 py-1 text-[10px] font-black uppercase ${
                        inq.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {inq.status || "pending"}
                    </span>

                    <p className="mt-2 text-[10px] text-gray-400">
                      {new Date(
                        inq.timestamp || inq.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

type Inquiry = {
  _id: string;
  productName: string;
  createdAt: string;
};

type Product = {
  _id: string;
  name: string;
  createdAt: string;
};

type Order = {
  _id: string;
  productName: string;
  price?: number;
  createdAt: string;
};

function Card({
  title,
  value,
  valueClassName,
}: {
  title: string;
  value: string | number;
  valueClassName: string;
}) {
  return (
    <div className="rounded-xl bg-white p-6 text-center shadow">
      <h2 className="text-gray-500">{title}</h2>
      <p className={`text-3xl font-bold ${valueClassName}`}>{value}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("7d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const authRes = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (!authRes.ok) {
          router.replace("/login?redirect=/admin/analytics");
          return;
        }

        const user = await authRes.json();

        if (user.role !== "owner" && user.role !== "admin") {
          router.replace("/");
          return;
        }

        const [p, i, o] = await Promise.all([
          fetch("/api/products", {
            credentials: "include",
            cache: "no-store",
          }).then((res) => res.json().catch(() => [])),
          fetch("/api/inquiries", {
            credentials: "include",
            cache: "no-store",
          }).then((res) => res.json().catch(() => [])),
          fetch("/api/orders", {
            credentials: "include",
            cache: "no-store",
          }).then((res) => res.json().catch(() => [])),
        ]);

        setProducts(Array.isArray(p) ? p : []);
        setInquiries(Array.isArray(i) ? i : []);
        setOrders(Array.isArray(o) ? o : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  const filtered = useMemo(() => {
    let startDate = new Date();

    if (filter === "24h") startDate.setDate(startDate.getDate() - 1);
    else if (filter === "7d") startDate.setDate(startDate.getDate() - 7);
    else if (filter === "30d") startDate.setDate(startDate.getDate() - 30);
    else if (filter === "1y") startDate.setFullYear(startDate.getFullYear() - 1);

    if (filter === "custom" && customStart && customEnd) {
      const start = new Date(customStart);
      const end = new Date(customEnd);
      end.setHours(23, 59, 59, 999);

      return {
        products: products.filter((p) => {
          const date = new Date(p.createdAt);
          return date >= start && date <= end;
        }),
        inquiries: inquiries.filter((i) => {
          const date = new Date(i.createdAt);
          return date >= start && date <= end;
        }),
        orders: orders.filter((o) => {
          const date = new Date(o.createdAt);
          return date >= start && date <= end;
        }),
      };
    }

    return {
      products: products.filter((p) => new Date(p.createdAt) >= startDate),
      inquiries: inquiries.filter((i) => new Date(i.createdAt) >= startDate),
      orders: orders.filter((o) => new Date(o.createdAt) >= startDate),
    };
  }, [filter, customStart, customEnd, products, inquiries, orders]);

  const totalRevenue = filtered.orders.reduce(
    (sum, o) => sum + (o.price || 0),
    0
  );

  const topProducts = useMemo(() => {
    const count: Record<string, number> = {};

    filtered.inquiries.forEach((i) => {
      const key = i.productName || "Unknown Product";
      count[key] = (count[key] || 0) + 1;
    });

    return Object.entries(count)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [filtered.inquiries]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Smart Analytics Dashboard</h1>

        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="flex items-center gap-2 rounded border bg-white px-4 py-2"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-3 rounded-xl bg-white p-4 shadow">
        {["24h", "7d", "30d", "1y"].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 font-semibold ${
              filter === f ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setFilter("custom")}
          className={`rounded-full px-4 py-2 ${
            filter === "custom" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
        >
          Custom
        </button>

        {filter === "custom" && (
          <div className="flex flex-wrap gap-2">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="rounded border p-2"
            />
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="rounded border p-2"
            />
          </div>
        )}
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <Card
          title="Products Added"
          value={filtered.products.length}
          valueClassName="text-blue-600"
        />
        <Card
          title="Inquiries"
          value={filtered.inquiries.length}
          valueClassName="text-green-600"
        />
        <Card
          title="Orders"
          value={filtered.orders.length}
          valueClassName="text-orange-600"
        />
        <Card
          title="Revenue"
          value={`₹ ${totalRevenue}`}
          valueClassName="text-purple-600"
        />
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">Top Products</h2>

        {topProducts.length === 0 ? (
          <p className="text-gray-400">No data</p>
        ) : (
          <ul className="space-y-2">
            {topProducts.map(([name, count]) => (
              <li
                key={name}
                className="flex justify-between border-b pb-2"
              >
                <span>{name}</span>
                <span className="font-bold text-blue-600">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
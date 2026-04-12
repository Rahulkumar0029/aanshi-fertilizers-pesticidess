"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  ShoppingBag,
  Trash2,
  ArrowLeft,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { buildAdminFollowupMessage, openWhatsApp } from "@/lib/whatsapp";

type Order = {
  _id: string;
  customerName?: string;
  phone?: string;
  productName: string;
  productCategory: string;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered";
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          router.replace("/login?redirect=/admin/orders");
          return;
        }

        const user = await res.json();

        if (user.role !== "owner" && user.role !== "admin") {
          router.replace("/");
          return;
        }

        await fetchOrders();
      } catch {
        router.replace("/login?redirect=/admin/orders");
      }
    };

    init();
  }, [router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json().catch(() => []);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Order["status"]) => {
    toast.loading("Updating status...", { id: "update" });
    setActionLoadingId(id);

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update order");
      }

      toast.success("Order updated!", { id: "update" });
      await fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Update failed", { id: "update" });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this order record?")) return;

    toast.loading("Deleting order...", { id: "delete" });
    setActionLoadingId(id);

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete order");
      }

      toast.success("Order deleted!", { id: "delete" });
      await fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed", { id: "delete" });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleWhatsApp = (order: Order) => {
    if (!order.phone) {
      toast.error("Customer phone number not available");
      return;
    }

    const message = buildAdminFollowupMessage({
      customerName: order.customerName,
      customerPhone: order.phone,
      productName: order.productName,
      category: order.productCategory,
      status: order.status,
    });

    openWhatsApp(message, order.phone);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6">
      <Toaster position="top-right" />

      <div className="container-app">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-primary/10 p-3">
              <ShoppingBag className="text-primary" size={28} />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                Order Management
              </h1>
              <p className="text-sm leading-6 text-gray-500 sm:text-base">
                Track and manage product orders.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="inline-flex items-center justify-center gap-2 rounded border bg-white px-4 py-2"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="table-scroll">
            <table className="min-w-[900px] w-full">
              <thead className="border-b border-gray-100 bg-gray-50 text-left">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">Customer</th>
                  <th className="p-4 font-semibold text-gray-600">Product</th>
                  <th className="p-4 font-semibold text-gray-600">Status</th>
                  <th className="p-4 font-semibold text-gray-600">Date</th>
                  <th className="p-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-bold">{order.customerName || "Guest"}</p>

                      {order.phone && (
                        <p className="text-sm text-gray-500">{order.phone}</p>
                      )}

                      <p className="text-xs text-gray-400">
                        ID: {order._id.slice(-6)}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="font-medium">{order.productName}</p>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                        {order.productCategory}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={order.status}
                        disabled={actionLoadingId === order._id}
                        onChange={(e) =>
                          updateStatus(
                            order._id,
                            e.target.value as Order["status"]
                          )
                        }
                        className="rounded-lg border px-3 py-1.5 font-bold"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>

                    <td className="p-4 text-sm text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleWhatsApp(order)}
                          disabled={!order.phone || actionLoadingId === order._id}
                          className="inline-flex items-center gap-2 rounded bg-green-500 px-3 py-2 text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <MessageSquare size={16} />
                          WhatsApp
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(order._id)}
                          disabled={actionLoadingId === order._id}
                          className="inline-flex items-center gap-2 rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600 disabled:opacity-70"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {orders.length === 0 && (
              <div className="py-20 text-center text-gray-400">
                No orders found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
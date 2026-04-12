"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, MessageSquare, Trash2 } from "lucide-react";
import { buildAdminFollowupMessage, openWhatsApp } from "@/lib/whatsapp";

type Inquiry = {
  _id: string;
  userName: string;
  phone?: string;
  productName: string;
  productCategory: string;
  status: string;
  timestamp?: string;
  createdAt?: string;
};

export default function InquiryPage() {
  const [data, setData] = useState<Inquiry[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
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
          router.replace("/login?redirect=/admin/inquiries");
          return;
        }

        const user = await res.json();

        if (user.role !== "owner" && user.role !== "admin") {
          router.replace("/");
          return;
        }

        await fetchData();
      } catch {
        router.replace("/login?redirect=/admin/inquiries");
      } finally {
        setPageLoading(false);
      }
    };

    init();
  }, [router]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/inquiries", {
        credentials: "include",
        cache: "no-store",
      });

      const result = await res.json().catch(() => []);
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
      setData([]);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    toast.loading("Updating...", { id: "update" });
    setActionLoadingId(id);

    try {
      const res = await fetch("/api/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, status }),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(result?.error || "Update failed");
      }

      toast.success("Status updated", { id: "update" });
      await fetchData();
    } catch (error: any) {
      toast.error(error?.message || "Update failed", { id: "update" });
    } finally {
      setActionLoadingId(null);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;

    toast.loading("Deleting...", { id: "delete" });
    setActionLoadingId(id);

    try {
      const res = await fetch("/api/inquiries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(result?.error || "Delete failed");
      }

      toast.success("Inquiry deleted", { id: "delete" });
      await fetchData();
    } catch (error: any) {
      toast.error(error?.message || "Delete failed", { id: "delete" });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleWhatsApp = (item: Inquiry) => {
    if (!item.phone) {
      toast.error("Customer phone number not available");
      return;
    }

    const message = buildAdminFollowupMessage({
      customerName: item.userName,
      customerPhone: item.phone,
      productName: item.productName,
      category: item.productCategory,
      status: item.status,
    });

    openWhatsApp(message, item.phone);
  };

  const getDisplayDate = (item: Inquiry) => {
    const raw = item.timestamp || item.createdAt;
    return raw ? new Date(raw).toLocaleString() : "N/A";
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Toaster position="top-right" />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inquiry Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage inquiries and follow up with customers professionally.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="flex items-center gap-2 rounded border bg-white px-4 py-2 hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-semibold">{item.userName}</td>
                <td className="p-3">{item.productName}</td>
                <td className="p-3">{item.productCategory}</td>

                <td className="p-3">
                  <select
                    value={item.status}
                    onChange={(e) => updateStatus(item._id, e.target.value)}
                    className="rounded border px-2 py-1"
                    disabled={actionLoadingId === item._id}
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="done">Done</option>
                  </select>
                </td>

                <td className="p-3">{getDisplayDate(item)}</td>

                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleWhatsApp(item)}
                      disabled={!item.phone || actionLoadingId === item._id}
                      className="inline-flex items-center gap-2 rounded bg-green-500 px-3 py-2 text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <MessageSquare size={16} />
                      WhatsApp
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteInquiry(item._id)}
                      disabled={actionLoadingId === item._id}
                      className="inline-flex items-center gap-2 rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600 disabled:opacity-70"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <p className="mt-10 text-center text-gray-500">No inquiries yet.</p>
      )}
    </div>
  );
}
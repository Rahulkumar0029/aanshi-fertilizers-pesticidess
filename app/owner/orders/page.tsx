"use client";

import { useEffect, useState } from "react";
import {
  Clock,
  User,
  Package,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Inquiry = {
  _id: string;
  userName?: string;
  productName?: string;
  productCategory?: string;
  timestamp?: string;
  createdAt?: string;
  status?: string;
};

export default function OwnerOrders() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadInquiries = async () => {
      try {
        const res = await fetch("/api/inquiries", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await res.json().catch(() => []);
        setInquiries(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch owner inquiries:", error);
        setInquiries([]);
      } finally {
        setLoading(false);
      }
    };

    loadInquiries();
  }, []);

  const filteredInquiries = inquiries.filter((iq) => {
    const query = searchQuery.toLowerCase();
    return (
      (iq.productName?.toLowerCase() || "").includes(query) ||
      (iq.userName?.toLowerCase() || "").includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#f8faf8] pb-12 pt-8 sm:pt-10 lg:pt-12">
      <div className="container-app">
        <header className="mb-8 sm:mb-10 lg:mb-12">
          <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
            Customer Inquiries
          </h1>
          <p className="text-sm leading-6 text-gray-500 sm:text-base">
            Manage and track all product interest requests from customers.
          </p>
        </header>

        <div className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by customer or product..."
                className="w-full rounded-xl border border-border py-2.5 pl-10 pr-4 outline-none transition-all focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <Filter size={18} />
              <span>Filter: All Inquiries</span>
            </div>
          </div>

          <div className="table-scroll">
            {loading ? (
              <div className="flex flex-col items-center gap-4 py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                <p className="italic text-gray-500">Fetching latest inquiries...</p>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="py-20 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/30 text-primary">
                  <AlertCircle size={32} />
                </div>
                <h3 className="mb-2 text-lg font-bold sm:text-xl">
                  No inquiries found
                </h3>
                <p className="text-sm text-gray-500 sm:text-base">
                  When customers show interest in products, they will appear here.
                </p>
              </div>
            ) : (
              <table className="min-w-[900px] w-full border-collapse text-left">
                <thead>
                  <tr className="bg-accent/30">
                    <th className="p-4 font-bold text-gray-700">Customer</th>
                    <th className="p-4 font-bold text-gray-700">Product</th>
                    <th className="p-4 font-bold text-gray-700">Date & Time</th>
                    <th className="p-4 font-bold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredInquiries.map((iq) => (
                      <motion.tr
                        key={iq._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-border transition-colors hover:bg-accent/10"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <User size={16} />
                            </div>
                            <span className="font-semibold">
                              {iq.userName || "Customer"}
                            </span>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="flex items-center gap-2 font-bold">
                              <Package size={14} className="text-gray-400" />
                              {iq.productName || "Unknown Product"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {iq.productCategory || "Uncategorized"}
                            </span>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock size={14} />
                            {iq.timestamp || iq.createdAt
                              ? new Date(iq.timestamp || iq.createdAt || "").toLocaleString()
                              : "N/A"}
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 rounded-full border border-yellow-200 bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                            {iq.status || "pending"}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Clock, User, Package, ExternalLink, Filter, Search, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OwnerOrders() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/inquiries")
      .then((res) => res.json())
      .then((data) => {
        setInquiries(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredInquiries = inquiries.filter((iq) =>
    (iq.productName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (iq.userName?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8faf8] pt-24 pb-12">
      <div className="container mx-auto px-4">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Customer Inquiries</h1>
          <p className="text-gray-500">Manage and track all product interest requests from WhatsApp.</p>
        </header>

        <div className="bg-white rounded-[2rem] shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by customer or product..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <Filter size={18} />
              <span>Filter: All Inquiries</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-gray-500 italic">Fetching latest inquiries...</p>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="py-20 text-center">
                <div className="bg-accent/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">No inquiries found</h3>
                <p className="text-gray-500">When customers show interest in products, they will appear here.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-accent/30">
                    <th className="p-4 font-bold text-gray-700">Customer</th>
                    <th className="p-4 font-bold text-gray-700">Product</th>
                    <th className="p-4 font-bold text-gray-700">Date & Time</th>
                    <th className="p-4 font-bold text-gray-700">Status</th>
                    <th className="p-4 font-bold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredInquiries.map((iq) => (
                      <motion.tr
                        key={iq._id} // ✅ Standardized to _id
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-border hover:bg-accent/10 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              <User size={16} />
                            </div>
                            <span className="font-semibold">{iq.userName}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold flex items-center gap-2">
                              <Package size={14} className="text-gray-400" /> {iq.productName}
                            </span>
                            <span className="text-xs text-gray-500">{iq.productCategory}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock size={14} />
                            {iq.timestamp ? new Date(iq.timestamp).toLocaleString() : "N/A"}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                            {iq.status || "Pending"}
                          </span>
                        </td>
                        <td className="p-4">
                          <button className="text-primary font-bold flex items-center gap-1 hover:underline">
                            Details <ExternalLink size={14} />
                          </button>
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

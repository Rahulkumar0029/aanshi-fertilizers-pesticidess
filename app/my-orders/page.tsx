"use client";

import { useEffect, useState } from "react";
import { Clock, Package, ExternalLink, ShoppingBag, ArrowRight, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function MyOrders() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inquiries")
      .then((res) => res.json())
      .then((data) => {
        setInquiries(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f8faf8] pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">My Activity</h1>
            <p className="text-gray-500">Track all your product interests and WhatsApp inquiries here.</p>
          </div>
          <Link href="/products" className="bg-primary text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition-all">
            <ShoppingBag size={20} /> Continue Shopping
          </Link>
        </header>

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-gray-500 italic">Loading your history...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-border text-center space-y-6">
            <div className="bg-accent/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-primary">
              <Clock size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">No Recent Activity</h3>
              <p className="text-gray-500 max-w-md mx-auto">You haven&apos;t inquired about any products yet. Browse our catalog and click &apos;Order via WhatsApp&apos; to get started.</p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-primary font-bold text-lg hover:underline group">
              Browse Products <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {inquiries.map((iq) => (
              <motion.div
                key={iq._id} // ✅ Standardized to _id
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-border flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                    <Package size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{iq.productName}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock size={14} /> Inquired on {new Date(iq.timestamp).toLocaleDateString()} at {new Date(iq.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="flex-1 text-center md:text-right px-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Status</span>
                    <span className="inline-flex items-center gap-1 text-primary font-bold bg-primary/10 px-3 py-1 rounded-full text-xs">
                      <MessageSquare size={12} /> Contacted Shop
                    </span>
                  </div>
                  <button className="bg-accent p-3 rounded-2xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                    <ExternalLink size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

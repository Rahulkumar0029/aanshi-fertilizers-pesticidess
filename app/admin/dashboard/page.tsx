"use client";

import { useEffect, useState } from "react";
import { Package, MessageCircle, TrendingUp, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalInquiries: 0,
    });

    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // ✅ FETCH DATA
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, inquiriesRes] = await Promise.all([
                    fetch("/api/products"),
                    fetch("/api/inquiries"),
                ]);

                const products = await productsRes.json();
                const inquiriesData = await inquiriesRes.json();

                setStats({
                    totalProducts: Array.isArray(products) ? products.length : 0,
                    totalInquiries: Array.isArray(inquiriesData) ? inquiriesData.length : 0,
                });

                setInquiries(Array.isArray(inquiriesData) ? inquiriesData.slice(0, 5) : []); 
            } catch (err) {
                console.error(err);
                toast.error("Failed to load dashboard data");
            }

            setLoading(false);
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("admin");
        window.location.href = "/admin/login";
    };

    if (loading) {
        return <div className="p-6 flex items-center justify-center min-h-screen">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Toaster position="top-right" />

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <div className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-2 cursor-pointer">
                        <Link href="/admin" className="flex items-center gap-1">
                            <ArrowLeft size={16} /> Back to Hub
                        </Link>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Admin Dashboard <span className="text-primary">🚀</span>
                    </h1>
                </div>

                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-2xl font-bold hover:bg-red-100 transition-all active:scale-95"
                >
                    <LogOut size={18} /> Logout
                </button>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

                {/* PRODUCTS */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
                    <div>
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Products</p>
                        <h2 className="text-4xl font-black text-gray-900">
                            {stats.totalProducts}
                        </h2>
                    </div>
                    <div className="bg-green-50 p-4 rounded-2xl">
                        <Package size={32} className="text-green-600" />
                    </div>
                </div>

                {/* INQUIRIES */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
                    <div>
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Inquiries</p>
                        <h2 className="text-4xl font-black text-gray-900">
                            {stats.totalInquiries}
                        </h2>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-2xl">
                        <MessageCircle size={32} className="text-blue-600" />
                    </div>
                </div>

                {/* GROWTH (REAL DATA COUNTER) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
                    <div>
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Activity</p>
                        <h2 className="text-4xl font-black text-gray-900">
                            {Math.round((stats.totalInquiries / (stats.totalProducts || 1)) * 100)}%
                        </h2>
                        <span className="text-xs text-green-500 font-bold flex items-center gap-1 mt-1">
                            <TrendingUp size={12} /> Engagement Rate
                        </span>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-2xl">
                        <TrendingUp size={32} className="text-purple-600" />
                    </div>
                </div>

            </div>

            {/* RECENT INQUIRIES */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        Recent Inquiries
                    </h2>
                    <Link href="/admin/inquiries" className="text-sm text-primary font-bold hover:underline">
                        View All Inquiries
                    </Link>
                </div>

                {inquiries.length === 0 ? (
                    <div className="py-12 text-center">
                        <MessageCircle className="mx-auto text-gray-200 mb-4" size={48} />
                        <p className="text-gray-400 font-medium">No recent inquiries to show.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {inquiries.map((inq, index) => (
                            <div
                                key={index}
                                className="p-5 border border-gray-100 rounded-2xl flex justify-between items-center bg-gray-50/30 hover:bg-white hover:shadow-sm transition-all"
                            >
                                <div>
                                    <p className="font-bold text-gray-800">
                                        {inq.productName}
                                    </p>
                                    <p className="text-sm text-gray-500 font-medium italic">
                                        by {inq.userName} • {inq.productCategory}
                                    </p>
                                </div>

                                <div className="flex flex-col items-end">
                                    <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-lg ${
                                        inq.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                        {inq.status}
                                    </span>
                                    <span className="text-[10px] text-gray-400 mt-2">
                                        {new Date(inq.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
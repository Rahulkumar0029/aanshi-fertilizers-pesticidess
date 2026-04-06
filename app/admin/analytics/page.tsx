"use client";

import { useEffect, useState } from "react";

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

export default function AnalyticsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const [filter, setFilter] = useState("7d");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    // ✅ FETCH DATA
    useEffect(() => {
        const fetchData = async () => {
            try {
                const p = await fetch("/api/products").then(res => res.json());
                const i = await fetch("/api/inquiries").then(res => res.json());
                const o = await fetch("/api/orders").then(res => res.json());

                setProducts(Array.isArray(p) ? p : []);
                setInquiries(Array.isArray(i) ? i : []);
                setOrders(Array.isArray(o) ? o : []);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    // ✅ FILTER LOGIC
    const getFilteredData = () => {
        let startDate = new Date();

        if (filter === "24h") startDate.setDate(startDate.getDate() - 1);
        else if (filter === "7d") startDate.setDate(startDate.getDate() - 7);
        else if (filter === "30d") startDate.setDate(startDate.getDate() - 30);
        else if (filter === "1y") startDate.setFullYear(startDate.getFullYear() - 1);

        if (filter === "custom" && customStart && customEnd) {
            const start = new Date(customStart);
            const end = new Date(customEnd);

            return {
                products: products.filter(p => new Date(p.createdAt) >= start && new Date(p.createdAt) <= end),
                inquiries: inquiries.filter(i => new Date(i.createdAt) >= start && new Date(i.createdAt) <= end),
                orders: orders.filter(o => new Date(o.createdAt) >= start && new Date(o.createdAt) <= end),
            };
        }

        return {
            products: products.filter(p => new Date(p.createdAt) >= startDate),
            inquiries: inquiries.filter(i => new Date(i.createdAt) >= startDate),
            orders: orders.filter(o => new Date(o.createdAt) >= startDate),
        };
    };

    const { products: fp, inquiries: fi, orders: fo } = getFilteredData();

    // ✅ REVENUE
    const totalRevenue = fo.reduce((sum, o) => sum + (o.price || 0), 0);

    // ✅ TOP PRODUCTS
    const getTopProducts = () => {
        const count: any = {};
        fi.forEach((i) => {
            count[i.productName] = (count[i.productName] || 0) + 1;
        });

        return Object.entries(count)
            .sort((a: any, b: any) => b[1] - a[1])
            .slice(0, 5);
    };

    if (loading) {
        return <div className="p-6">Loading analytics...</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">

            <h1 className="text-3xl font-bold mb-6">
                📊 Smart Analytics Dashboard
            </h1>

            {/* FILTER */}
            <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-3">
                {["24h", "7d", "30d", "1y"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full font-semibold ${
                            filter === f
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200"
                        }`}
                    >
                        {f}
                    </button>
                ))}

                <button
                    onClick={() => setFilter("custom")}
                    className={`px-4 py-2 rounded-full ${
                        filter === "custom"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200"
                    }`}
                >
                    Custom
                </button>

                {filter === "custom" && (
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className="border p-2 rounded"
                        />
                        <input
                            type="date"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className="border p-2 rounded"
                        />
                    </div>
                )}
            </div>

            {/* STATS */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">

                <Card title="Products Added" value={fp.length} color="blue" />
                <Card title="Inquiries" value={fi.length} color="green" />
                <Card title="Orders" value={fo.length} color="orange" />
                <Card title="Revenue" value={`₹ ${totalRevenue}`} color="purple" />

            </div>

            {/* TOP PRODUCTS */}
            <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-bold mb-4">
                    🔥 Top Products
                </h2>

                {getTopProducts().length === 0 ? (
                    <p className="text-gray-400">No data</p>
                ) : (
                    <ul className="space-y-2">
                        {getTopProducts().map(([name, count]: any) => (
                            <li
                                key={name}
                                className="flex justify-between border-b pb-2"
                            >
                                <span>{name}</span>
                                <span className="font-bold text-blue-600">
                                    {count}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

// ✅ CARD COMPONENT
function Card({ title, value, color }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow text-center">
            <h2 className="text-gray-500">{title}</h2>
            <p className={`text-3xl font-bold text-${color}-600`}>
                {value}
            </p>
        </div>
    );
}
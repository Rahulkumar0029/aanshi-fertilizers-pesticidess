"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ShoppingBag, Trash2 } from "lucide-react";

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

    // ✅ FETCH ORDERS
    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/orders");
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // ✅ UPDATE STATUS
    const updateStatus = async (id: string, status: Order["status"]) => {
        toast.loading("Updating status...");

        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (!res.ok) {
                throw new Error("Failed to update order");
            }

            toast.dismiss();
            toast.success("Order updated!");
            fetchOrders();
        } catch (error) {
            console.error(error);
            toast.dismiss();
            toast.error("Update failed");
        }
    };

    // ✅ DELETE ORDER
    const handleDelete = async (id: string) => {
        if (!confirm("Remove this order record?")) return;

        toast.loading("Deleting order...");

        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete order");
            }

            toast.dismiss();
            toast.success("Order deleted!");
            fetchOrders();
        } catch (error) {
            console.error(error);
            toast.dismiss();
            toast.error("Delete failed");
        }
    };

    if (loading) {
        return <div className="p-6">Loading orders...</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Toaster position="top-right" />

            <div className="flex items-center gap-3 mb-8">
                <div className="bg-primary/10 p-3 rounded-2xl">
                    <ShoppingBag className="text-primary" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Order Management
                    </h1>
                    <p className="text-gray-500">
                        Track and manage product orders.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100 text-left">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">
                                Customer
                            </th>
                            <th className="p-4 font-semibold text-gray-600">
                                Product
                            </th>
                            <th className="p-4 font-semibold text-gray-600">
                                Status
                            </th>
                            <th className="p-4 font-semibold text-gray-600">
                                Date
                            </th>
                            <th className="p-4 font-semibold text-gray-600">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                            <tr
                                key={order._id}
                                className="hover:bg-gray-50/50 transition-colors"
                            >
                                <td className="p-4">
                                    <p className="font-bold text-gray-800">
                                        {order.customerName || "Guest"}
                                    </p>

                                    {order.phone && (
                                        <p className="text-sm text-gray-500">
                                            {order.phone}
                                        </p>
                                    )}

                                    <p className="text-xs text-gray-400">
                                        ID: {order._id.slice(-6)}
                                    </p>
                                </td>

                                <td className="p-4">
                                    <p className="font-medium text-gray-700">
                                        {order.productName}
                                    </p>
                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">
                                        {order.productCategory}
                                    </span>
                                </td>

                                <td className="p-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) =>
                                            updateStatus(
                                                order._id,
                                                e.target.value as Order["status"]
                                            )
                                        }
                                        className={`text-sm font-bold px-3 py-1 rounded-lg border-none focus:ring-0 ${
                                            order.status === "Delivered"
                                                ? "bg-green-100 text-green-700"
                                                : order.status === "Shipped"
                                                ? "bg-blue-100 text-blue-700"
                                                : order.status === "Confirmed"
                                                ? "bg-purple-100 text-purple-700"
                                                : "bg-amber-100 text-amber-700"
                                        }`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </td>

                                <td className="p-4 text-sm text-gray-500 italic">
                                    {order.createdAt
                                        ? new Date(order.createdAt).toLocaleDateString()
                                        : "N/A"}
                                </td>

                                <td className="p-4">
                                    <button
                                        onClick={() => handleDelete(order._id)}
                                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
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
    );
}
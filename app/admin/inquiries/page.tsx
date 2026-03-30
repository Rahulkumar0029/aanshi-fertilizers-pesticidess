"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type Inquiry = {
    _id: string;
    userName: string;
    productName: string;
    productCategory: string;
    status: string;
    timestamp: string;
};

export default function InquiryPage() {
    const [data, setData] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(false);

    // ✅ FETCH DATA
    const fetchData = async () => {
        const res = await fetch("/api/inquiries");
        const result = await res.json();
        setData(Array.isArray(result) ? result : []);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ✅ UPDATE STATUS
    const updateStatus = async (id: string, status: string) => {
        toast.loading("Updating...");
        setLoading(true);

        await fetch("/api/inquiries", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
        });

        toast.dismiss();
        toast.success("Status Updated ✅");

        fetchData();
        setLoading(false);
    };

    // ✅ DELETE
    const deleteInquiry = async (id: string) => {
        if (!confirm("Are you sure you want to delete this inquiry?")) return;
        
        toast.loading("Deleting...");
        setLoading(true);

        await fetch("/api/inquiries", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });

        toast.dismiss();
        toast.success("Deleted ❌");

        fetchData();
        setLoading(false);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Toaster position="top-right" />

            <h1 className="text-3xl font-bold mb-6">
                Inquiry Dashboard
            </h1>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3">Customer</th>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((item) => (
                            <tr
                                key={item._id}
                                className="text-center border-t hover:bg-gray-50"
                            >
                                <td className="p-2 font-semibold">
                                    {item.userName}
                                </td>

                                <td>{item.productName}</td>

                                <td>{item.productCategory}</td>

                                {/* STATUS DROPDOWN */}
                                <td>
                                    <select
                                        value={item.status}
                                        onChange={(e) =>
                                            updateStatus(
                                                item._id,
                                                e.target.value
                                            )
                                        }
                                        className="border px-2 py-1 rounded"
                                    >
                                        <option value="pending">
                                            Pending
                                        </option>
                                        <option value="contacted">
                                            Contacted
                                        </option>
                                        <option value="done">
                                            Done
                                        </option>
                                    </select>
                                </td>

                                <td>
                                    {item.timestamp ? new Date(
                                        item.timestamp
                                    ).toLocaleString() : "N/A"}
                                </td>

                                {/* ACTIONS */}
                                <td>
                                    <button
                                        onClick={() =>
                                            deleteInquiry(item._id)
                                        }
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* EMPTY STATE */}
            {data.length === 0 && (
                <p className="text-center mt-10 text-gray-500">
                    No inquiries yet.
                </p>
            )}
        </div>
    );
}
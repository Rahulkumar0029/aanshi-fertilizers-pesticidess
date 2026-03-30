"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type Product = {
    _id?: string;
    name: string;
    category: string;
    price?: string;
    usage?: string;
    image?: string;
};

export default function AdminPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState<Product>({
        name: "",
        category: "",
        price: "",
        usage: "",
        image: "",
    });

    const [editingId, setEditingId] = useState<string | null>(null);

    // ✅ PROTECT ADMIN
    useEffect(() => {
        if (localStorage.getItem("admin") !== "true") {
            window.location.href = "/admin/login";
        }
    }, []);

    // ✅ FETCH PRODUCTS
    const fetchProducts = async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ✅ HANDLE INPUT
    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ IMAGE UPLOAD
    const handleImageUpload = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        toast.loading("Uploading image...");
        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/uploads", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        setForm((prev) => ({
            ...prev,
            image: data.secure_url,
        }));

        toast.dismiss();
        toast.success("Image uploaded ✅");
        setLoading(false);
    };

    // ✅ SUBMIT (ADD / UPDATE)
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        toast.loading(editingId ? "Updating..." : "Adding...");
        setLoading(true);

        if (editingId) {
            await fetch(`/api/products/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
        } else {
            await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
        }

        toast.dismiss();
        toast.success("Success ✅");

        setForm({
            name: "",
            category: "",
            price: "",
            usage: "",
            image: "",
        });

        setEditingId(null);
        fetchProducts();
        setLoading(false);
    };

    // ✅ DELETE
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        
        toast.loading("Deleting...");
        await fetch(`/api/products/${id}`, { method: "DELETE" });
        toast.dismiss();
        toast.success("Deleted ❌");

        fetchProducts();
    };

    // ✅ EDIT
    const handleEdit = (product: Product) => {
        setForm(product);
        setEditingId(product._id || null);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <Toaster position="top-right" />

            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* ✅ FORM */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow mb-10 grid gap-4"
            >
                <input
                    name="name"
                    placeholder="Product Name"
                    value={form.name}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <input
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <input
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="usage"
                    placeholder="Usage"
                    value={form.usage}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                {/* ✅ IMAGE UPLOAD */}
                <input
                    type="file"
                    onChange={handleImageUpload}
                    className="border p-2 rounded"
                />

                {form.image && (
                    <img
                        src={form.image}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded"
                    />
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white py-2 rounded font-bold"
                >
                    {loading
                        ? "Processing..."
                        : editingId
                            ? "Update Product"
                            : "Add Product"}
                </button>
            </form>

            {/* ✅ TABLE UI */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3">Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((p) => (
                            <tr
                                key={p._id}
                                className="text-center border-t"
                            >
                                <td className="p-2">
                                    <img
                                        src={
                                            p.image || "/placeholder.png"
                                        }
                                        alt={p.name}
                                        className="h-12 w-12 object-cover mx-auto"
                                    />
                                </td>

                                <td>{p.name}</td>
                                <td>{p.category}</td>
                                <td>₹ {p.price}</td>

                                <td className="flex gap-2 justify-center py-2">
                                    <button
                                        onClick={() => handleEdit(p)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(p._id!)
                                        }
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
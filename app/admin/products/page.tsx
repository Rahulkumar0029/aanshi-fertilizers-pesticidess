"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type Product = {
    _id?: string;
    name: string;
    category: string;
    mrp?: number;
    price?: number;
    usage?: string;
    image?: string;
};

export default function AdminPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState<Product>({
        name: "",
        category: "",
        mrp: 0,
        price: 0,
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
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ✅ HANDLE INPUT (NUMBER FIXED)
    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]:
                name === "price" || name === "mrp"
                    ? Number(value)
                    : value,
        });
    };

    // ✅ IMAGE UPLOAD
    const handleImageUpload = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        toast.loading("Uploading image...");
        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
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
        } catch {
            toast.dismiss();
            toast.error("Upload failed ❌");
        }

        setLoading(false);
    };

    // ✅ ADD / UPDATE
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!form.name || !form.category) {
            toast.error("Required fields missing");
            return;
        }

        toast.loading(editingId ? "Updating..." : "Adding...");
        setLoading(true);

        try {
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
                mrp: 0,
                price: 0,
                usage: "",
                image: "",
            });

            setEditingId(null);
            fetchProducts();
        } catch {
            toast.dismiss();
            toast.error("Something went wrong ❌");
        }

        setLoading(false);
    };

    // ✅ DELETE
    const handleDelete = async (id: string) => {
        if (!confirm("Delete this product?")) return;

        toast.loading("Deleting...");
        try {
            await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            toast.dismiss();
            toast.success("Deleted ❌");
            fetchProducts();
        } catch {
            toast.dismiss();
            toast.error("Delete failed ❌");
        }
    };

    // ✅ EDIT
    const handleEdit = (product: Product) => {
        setForm(product);
        setEditingId(product._id || null);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <Toaster position="top-right" />

            <h1 className="text-3xl font-bold mb-6">
                Product Management
            </h1>

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

                {/* ✅ MRP */}
                <input
                    name="mrp"
                    type="number"
                    placeholder="MRP (Original Price)"
                    value={form.mrp}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                {/* ✅ OFFER PRICE */}
                <input
                    name="price"
                    type="number"
                    placeholder="Offer Price"
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

                {/* ✅ IMAGE */}
                <input
                    type="file"
                    onChange={handleImageUpload}
                    className="border p-2 rounded"
                />

                {form.image && (
                    <img
                        src={form.image}
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

            {/* ✅ TABLE */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3">Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>MRP</th>
                            <th>Price</th>
                            <th>Discount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((p) => {
                            const discount =
                                p.mrp && p.price
                                    ? Math.floor(
                                        ((p.mrp - p.price) / p.mrp) * 100
                                    )
                                    : 0;

                            return (
                                <tr
                                    key={p._id}
                                    className="text-center border-t"
                                >
                                    <td className="p-2">
                                        <img
                                            src={
                                                p.image ||
                                                "/placeholder.png"
                                            }
                                            className="h-12 w-12 object-cover mx-auto"
                                        />
                                    </td>

                                    <td>{p.name}</td>
                                    <td>{p.category}</td>
                                    <td>₹ {p.mrp}</td>
                                    <td>₹ {p.price}</td>
                                    <td className="text-red-500 font-bold">
                                        {discount > 0
                                            ? `${discount}%`
                                            : "-"}
                                    </td>

                                    <td className="flex gap-2 justify-center py-2">
                                        <button
                                            onClick={() =>
                                                handleEdit(p)
                                            }
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
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
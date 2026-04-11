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
    description?: string;
    image?: string;
    size?: string;
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
        description: "",
        image: "",
        size: "",
    });

    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        if (localStorage.getItem("admin") !== "true") {
            window.location.href = "/admin/login";
        }
    }, []);

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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                name === "price" || name === "mrp"
                    ? Number(value)
                    : value,
        }));
    };

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.name || !form.category) {
            toast.error("Required fields missing");
            return;
        }

        toast.loading(editingId ? "Updating..." : "Adding...");
        setLoading(true);

        try {
            const payload = {
                ...form,
                size: form.size?.trim() || "",
                description: form.description?.trim() || "",
                usage: form.usage?.trim() || "",
            };

            if (editingId) {
                await fetch(`/api/products/${editingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            } else {
                await fetch("/api/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
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
                description: "",
                image: "",
                size: "",
            });

            setEditingId(null);
            fetchProducts();
        } catch {
            toast.dismiss();
            toast.error("Something went wrong ❌");
        }

        setLoading(false);
    };

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

    const handleEdit = (product: Product) => {
        setForm({
            name: product.name || "",
            category: product.category || "",
            mrp: product.mrp || 0,
            price: product.price || 0,
            usage: product.usage || "",
            description: product.description || "",
            image: product.image || "",
            size: product.size || "",
        });

        setEditingId(product._id || null);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <Toaster position="top-right" />

            <h1 className="mb-6 text-3xl font-bold">
                Product Management
            </h1>

            <form
                onSubmit={handleSubmit}
                className="mb-10 grid gap-4 rounded-xl bg-white p-6 shadow"
            >
                <input
                    name="name"
                    placeholder="Product Name"
                    value={form.name}
                    onChange={handleChange}
                    className="rounded border p-2"
                    required
                />

                <input
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handleChange}
                    className="rounded border p-2"
                    required
                />

                <input
                    name="size"
                    placeholder="Size (e.g. 1L, 2L, 5kg)"
                    value={form.size || ""}
                    onChange={handleChange}
                    className="rounded border p-2"
                />

                <input
                    name="mrp"
                    type="number"
                    placeholder="MRP (Original Price)"
                    value={form.mrp}
                    onChange={handleChange}
                    className="rounded border p-2"
                />

                <input
                    name="price"
                    type="number"
                    placeholder="Offer Price"
                    value={form.price}
                    onChange={handleChange}
                    className="rounded border p-2"
                />

                <input
                    name="usage"
                    placeholder="Usage"
                    value={form.usage}
                    onChange={handleChange}
                    className="rounded border p-2"
                />

                <textarea
                    name="description"
                    placeholder="Product Description"
                    value={form.description || ""}
                    onChange={handleChange}
                    rows={4}
                    className="rounded border p-2"
                />

                <input
                    type="file"
                    onChange={handleImageUpload}
                    className="rounded border p-2"
                />

                {form.image && (
                    <img
                        src={form.image}
                        alt={form.name || "Product image"}
                        className="h-20 w-20 rounded object-cover"
                    />
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded bg-green-600 py-2 font-bold text-white"
                >
                    {loading
                        ? "Processing..."
                        : editingId
                          ? "Update Product"
                          : "Add Product"}
                </button>
            </form>

            <div className="overflow-hidden rounded-xl bg-white shadow">
                <table className="w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3">Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Size</th>
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
                                    ? Math.floor(((p.mrp - p.price) / p.mrp) * 100)
                                    : 0;

                            return (
                                <tr
                                    key={p._id}
                                    className="border-t text-center"
                                >
                                    <td className="p-2">
                                        <img
                                            src={p.image || "/placeholder.png"}
                                            alt={p.name}
                                            className="mx-auto h-12 w-12 object-cover"
                                        />
                                    </td>

                                    <td>{p.name}</td>
                                    <td>{p.category}</td>
                                    <td>{p.size || "-"}</td>
                                    <td>₹ {p.mrp}</td>
                                    <td>₹ {p.price}</td>
                                    <td className="font-bold text-red-500">
                                        {discount > 0 ? `${discount}%` : "-"}
                                    </td>

                                    <td className="flex justify-center gap-2 py-2">
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="rounded bg-blue-500 px-3 py-1 text-white"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(p._id!)}
                                            className="rounded bg-red-500 px-3 py-1 text-white"
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
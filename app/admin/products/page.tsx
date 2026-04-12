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

  // ✅ REAL AUTH CHECK (NO localStorage)
  useEffect(() => {
    const checkOwnerAccess = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          window.location.href = "/login?redirect=/admin/products";
          return;
        }

        const user = await res.json();

        if (user.role !== "owner") {
          window.location.href = "/";
        }
      } catch {
        window.location.href = "/login?redirect=/admin/products";
      }
    };

    checkOwnerAccess();
  }, []);

  // ✅ FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ INPUT CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "mrp" ? Number(value) : value,
    }));
  };

  // ✅ IMAGE UPLOAD (FIXED)
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.loading("Uploading image...", { id: "upload" });
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data?.secure_url) {
        throw new Error(data?.error || "Upload failed");
      }

      setForm((prev) => ({
        ...prev,
        image: data.secure_url,
      }));

      toast.success("Image uploaded ✅", { id: "upload" });
    } catch (error: any) {
      toast.error(error?.message || "Upload failed ❌", {
        id: "upload",
      });
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  // ✅ ADD / UPDATE PRODUCT
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name || !form.category) {
      toast.error("Required fields missing");
      return;
    }

    toast.loading(editingId ? "Updating..." : "Adding...", {
      id: "save",
    });

    setLoading(true);

    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        category: form.category.trim(),
        size: form.size?.trim() || "",
        description: form.description?.trim() || "",
        usage: form.usage?.trim() || "",
      };

      const res = await fetch(
        editingId ? `/api/products/${editingId}` : "/api/products",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong");
      }

      toast.success("Success ✅", { id: "save" });

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
      await fetchProducts();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong ❌", {
        id: "save",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE PRODUCT
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    toast.loading("Deleting...", { id: "delete" });

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Delete failed");
      }

      toast.success("Deleted ✅", { id: "delete" });
      await fetchProducts();
    } catch (error: any) {
      toast.error(error?.message || "Delete failed ❌", {
        id: "delete",
      });
    }
  };

  // ✅ EDIT
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

      {/* FORM */}
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
          placeholder="Size (1L, 5kg...)"
          value={form.size || ""}
          onChange={handleChange}
          className="rounded border p-2"
        />

        <input
          name="mrp"
          type="number"
          placeholder="MRP"
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
          placeholder="Description"
          value={form.description || ""}
          onChange={handleChange}
          rows={4}
          className="rounded border p-2"
        />

        {/* ✅ PNG + JPG SUPPORT */}
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleImageUpload}
          className="rounded border p-2"
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
          className="rounded bg-green-600 py-2 text-white font-bold"
        >
          {loading
            ? "Processing..."
            : editingId
            ? "Update Product"
            : "Add Product"}
        </button>
      </form>

      {/* TABLE */}
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
                <tr key={p._id} className="border-t text-center">
                  <td className="p-2">
                    <img
                      src={p.image || "/placeholder.png"}
                      className="mx-auto h-12 w-12 object-cover"
                    />
                  </td>

                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.size || "-"}</td>
                  <td>₹ {p.mrp}</td>
                  <td>₹ {p.price}</td>

                  <td className="text-red-500 font-bold">
                    {discount > 0 ? `${discount}%` : "-"}
                  </td>

                  <td className="flex justify-center gap-2 py-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(p)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(p._id!)}
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
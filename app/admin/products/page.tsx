"use client";

import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Package,
  Search,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

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

type AuthUser = {
  _id?: string;
  id?: string;
  name: string;
  role: string;
};

const CATEGORIES = [
  "Fertilizers",
  "Pesticides",
  "Seeds",
  "Plant Growth",
  "Organic",
  "Fungicides",
];

const FALLBACK_IMAGE = "/placeholder.png";

function getSafeImageSrc(src?: string) {
  const value = src?.trim();
  return value ? value : FALLBACK_IMAGE;
}

const EMPTY_FORM: Product = {
  name: "",
  category: CATEGORIES[0],
  mrp: 0,
  price: 0,
  usage: "",
  description: "",
  image: FALLBACK_IMAGE,
  size: "",
};

export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState<Product>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          router.replace("/login?redirect=/admin/products");
          return;
        }

        const user: AuthUser = await res.json();

        if (user.role !== "owner" && user.role !== "admin") {
          router.replace("/");
          return;
        }

        await fetchProducts();
      } catch {
        router.replace("/login?redirect=/admin/products");
      } finally {
        setPageLoading(false);
      }
    };

    init();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json().catch(() => []);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "mrp" ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

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

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.secure_url) {
        throw new Error(data?.details || data?.error || "Upload failed");
      }

      setForm((prev) => ({
        ...prev,
        image: data.secure_url,
      }));

      toast.success("Image uploaded successfully", { id: "upload" });
    } catch (error: any) {
      toast.error(error?.message || "Upload failed", { id: "upload" });
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim() || !form.category.trim()) {
      toast.error("Product name and category are required");
      return;
    }

    toast.loading(editingId ? "Updating product..." : "Adding product...", {
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
        image: getSafeImageSrc(form.image),
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

      toast.success(
        editingId ? "Product updated successfully" : "Product added successfully",
        { id: "save" }
      );

      resetForm();
      await fetchProducts();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong", { id: "save" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    toast.loading("Deleting product...", { id: "delete" });

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Delete failed");
      }

      toast.success("Product deleted", { id: "delete" });

      if (editingId === id) {
        resetForm();
      }

      await fetchProducts();
    } catch (error: any) {
      toast.error(error?.message || "Delete failed", { id: "delete" });
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name || "",
      category: product.category || CATEGORIES[0],
      mrp: product.mrp || 0,
      price: product.price || 0,
      usage: product.usage || "",
      description: product.description || "",
      image: getSafeImageSrc(product.image),
      size: product.size || "",
    });

    setEditingId(product._id || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return products;

    return products.filter((p) => {
      const name = p.name?.toLowerCase() || "";
      const category = p.category?.toLowerCase() || "";
      const size = p.size?.toLowerCase() || "";
      return (
        name.includes(query) ||
        category.includes(query) ||
        size.includes(query)
      );
    });
  }, [products, searchQuery]);

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf8]">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading products panel...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf8] p-4 md:p-6">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
              <Package className="text-primary" />
              Product Management
            </h1>
            <p className="mt-2 text-gray-500">
              Add, edit, delete, and manage all business products from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft size={16} />
              Back to Admin
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-semibold text-white hover:opacity-90"
            >
              <Plus size={16} />
              New Product
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-[420px_1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <ShieldCheck size={18} className="text-primary" />
              {editingId ? "Edit Product" : "Add Product"}
            </div>

            <div className="space-y-4">
              <input
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border p-3 outline-none focus:border-primary"
                required
              />

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border p-3 outline-none focus:border-primary"
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <input
                name="size"
                placeholder="Size (1L, 5kg...)"
                value={form.size || ""}
                onChange={handleChange}
                className="w-full rounded-xl border p-3 outline-none focus:border-primary"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  name="mrp"
                  type="number"
                  placeholder="MRP"
                  value={form.mrp || 0}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3 outline-none focus:border-primary"
                />

                <input
                  name="price"
                  type="number"
                  placeholder="Offer Price"
                  value={form.price || 0}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3 outline-none focus:border-primary"
                />
              </div>

              <input
                name="usage"
                placeholder="Usage"
                value={form.usage || ""}
                onChange={handleChange}
                className="w-full rounded-xl border p-3 outline-none focus:border-primary"
              />

              <textarea
                name="description"
                placeholder="Description"
                value={form.description || ""}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-xl border p-3 outline-none focus:border-primary"
              />

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleImageUpload}
                className="w-full rounded-xl border p-3"
              />

              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-xl border">
                  <Image
                    src={getSafeImageSrc(form.image)}
                    alt="Preview"
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <input
                  name="image"
                  placeholder="Or paste image URL"
                  value={form.image || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3 outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-3">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full rounded-xl border py-3 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel Edit
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700 disabled:opacity-70"
                >
                  {loading
                    ? "Processing..."
                    : editingId
                    ? "Update Product"
                    : "Add Product"}
                </button>
              </div>
            </div>
          </form>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">
                All Products ({filteredProducts.length})
              </h2>

              <div className="relative w-full max-w-sm">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search by name, category, size..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border py-2 pl-9 pr-3 outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Size</th>
                    <th className="p-3 text-left">MRP</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Discount</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((p) => {
                    const discount =
                      p.mrp && p.price && p.mrp > 0
                        ? Math.floor(((p.mrp - p.price) / p.mrp) * 100)
                        : 0;

                    return (
                      <tr key={p._id} className="border-t align-middle">
                        <td className="p-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded-lg border">
                            <Image
                              src={getSafeImageSrc(p.image)}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                        </td>

                        <td className="p-3 font-medium text-gray-900">{p.name}</td>
                        <td className="p-3">{p.category}</td>
                        <td className="p-3">{p.size || "-"}</td>
                        <td className="p-3">₹ {p.mrp || 0}</td>
                        <td className="p-3">₹ {p.price || 0}</td>
                        <td className="p-3 font-bold text-red-500">
                          {discount > 0 ? `${discount}%` : "-"}
                        </td>

                        <td className="p-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(p)}
                              className="rounded-lg bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
                            >
                              <Pencil size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() => p._id && handleDelete(p._id)}
                              className="rounded-lg bg-red-500 px-3 py-2 text-white hover:bg-red-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="py-10 text-center text-gray-400">
                  No products found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
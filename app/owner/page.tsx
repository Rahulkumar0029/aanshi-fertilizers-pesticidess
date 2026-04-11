"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Loader2,
  Package,
  Search,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  category: string;
  size: string;
  price: string;
  usage: string;
  image: string;
  description?: string;
}

interface AuthUser {
  _id?: string;
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
}

const CATEGORIES = [
  "Fertilizers",
  "Pesticides",
  "Seeds",
  "Plant Growth",
  "Organic",
  "Fungicides",
];

export default function OwnerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [ownerName, setOwnerName] = useState("Owner");

  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    category: CATEGORIES[0],
    size: "",
    price: "Contact for Pricing",
    description: "",
    usage: "",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
  });

  // ✅ REAL OWNER AUTH CHECK
  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const authRes = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!authRes.ok) {
          router.push("/login?redirect=/owner");
          return;
        }

        const user: AuthUser = await authRes.json();

        if (user.role !== "owner") {
          router.push("/");
          return;
        }

        setOwnerName(user.name || "Owner");
        await fetchProducts();
      } catch (error) {
        console.error("Owner auth failed:", error);
        router.push("/login?redirect=/owner");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoad();
  }, [router]);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products", {
        credentials: "include",
      });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
    }
  }

  // ✅ REAL LOGOUT
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: CATEGORIES[0],
      size: "",
      price: "Contact for Pricing",
      description: "",
      usage: "",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
    });
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to add product");
      }

      toast.success("Product added successfully");
      setIsAdding(false);
      resetForm();
      await fetchProducts();
    } catch (error) {
      console.error("Failed to add product", error);
      toast.error("Failed to add product");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;

    setFormLoading(true);

    try {
      const res = await fetch(`/api/products/${editingProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update product");
      }

      toast.success("Product updated successfully");
      setEditingProduct(null);
      resetForm();
      await fetchProducts();
    } catch (error) {
      console.error("Failed to update product", error);
      toast.error("Failed to update product");
    } finally {
      setFormLoading(false);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.loading("Uploading image...", { id: "upload" });
    setImageLoading(true);

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: uploadData,
        credentials: "include",
      });

      const data = await res.json();

      if (data.secure_url) {
        setFormData((prev) => ({
          ...prev,
          image: data.secure_url,
        }));
        toast.success("Image uploaded ✅", { id: "upload" });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed ❌", { id: "upload" });
    } finally {
      setImageLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      toast.success("Product deleted");
      await fetchProducts();
    } catch (error) {
      console.error("Failed to delete product", error);
      toast.error("Failed to delete product");
    }
  };

  const startEditing = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      size: product.size,
      price: product.price,
      description: product.description || "",
      usage: product.usage,
      image: product.image,
    });
    setIsAdding(false);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8faf8] pb-20 pt-10">
      <Toaster position="top-right" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="flex items-center gap-3 text-4xl font-bold text-gray-900">
              <Package className="text-primary" /> Owner Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-500">
              Welcome back, {ownerName}. Manage your agricultural product catalog.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsAdding(true);
                setEditingProduct(null);
                resetForm();
              }}
              className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105"
            >
              <Plus size={20} /> Add New Product
            </button>

            <button
              onClick={handleLogout}
              className="rounded-2xl border border-gray-200 bg-white px-6 py-3 font-bold text-gray-600 transition-all hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-10 max-w-xl">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search your products..."
            className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
          />
        </div>

        {/* Product List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="font-medium italic text-gray-500">
              Loading your products...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={product._id}
                  className="group flex flex-col overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute left-4 top-4 rounded-full border border-primary/20 bg-white/90 px-3 py-1 text-xs font-bold text-primary backdrop-blur-sm">
                      {product.category}
                    </div>
                  </div>

                  <div className="flex flex-grow flex-col p-8">
                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                      {product.name}
                    </h3>

                    <div className="mb-6 space-y-2">
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Size:</span> {product.size || "-"}
                      </p>

                      <p className="line-clamp-2 text-sm text-gray-500">
                        <span className="font-semibold">Description:</span>{" "}
                        {product.description?.trim() || "-"}
                      </p>

                      <p className="line-clamp-2 text-sm text-gray-500">
                        <span className="font-semibold">Usage:</span>{" "}
                        {product.usage?.trim() || "-"}
                      </p>
                    </div>

                    <div className="mt-auto flex gap-3 border-t border-gray-50 pt-4">
                      <button
                        onClick={() => startEditing(product)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-3 font-bold text-primary transition-all hover:bg-primary hover:text-white"
                      >
                        <Pencil size={18} /> Edit
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="rounded-xl bg-red-50 p-3 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-xl italic text-gray-400">
              No products found. Start by adding one!
            </p>
          </div>
        )}
      </div>

      {/* Form Overlay */}
      <AnimatePresence>
        {(isAdding || editingProduct) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAdding(false);
                setEditingProduct(null);
                resetForm();
              }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isAdding ? "Add New Product" : "Edit Product"}
                </h2>

                <button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="rounded-full p-2 transition-colors hover:bg-gray-100"
                >
                  <X size={24} />
                </button>
              </div>

              <form
                onSubmit={isAdding ? handleAddProduct : handleUpdateProduct}
                className="space-y-6 p-8"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-semibold text-gray-700">
                      Product Name
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="e.g. Premium Urea"
                      value={formData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-semibold text-gray-700">
                      Category
                    </label>
                    <select
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      value={formData.category}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-semibold text-gray-700">
                      Available Sizes
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="e.g. 1kg, 5kg"
                      value={formData.size}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, size: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-semibold text-gray-700">
                      Price (Optional)
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="e.g. 500 or Contact"
                      value={formData.price}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="ml-1 text-sm font-semibold text-gray-700">
                      Product Image
                    </label>

                    <div className="flex items-center gap-4">
                      <label className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border border-primary border-dashed bg-white px-4 py-2 text-primary transition-all hover:bg-primary hover:text-white">
                        <span className="text-sm font-bold">
                          {imageLoading ? "Uploading..." : "Upload Image"}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={imageLoading}
                        />
                      </label>

                      {formData.image && (
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-gray-200">
                          <Image
                            src={formData.image}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <input
                      type="text"
                      className="mt-2 w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 text-xs outline-none transition-all focus:ring-1 focus:ring-primary/20"
                      placeholder="Or paste Image URL"
                      value={formData.image}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-sm font-semibold text-gray-700">
                    Short Description
                  </label>
                  <textarea
                    required
                    rows={2}
                    className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Brief overview of the product..."
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-sm font-semibold text-gray-700">
                    Usage Guidelines
                  </label>
                  <textarea
                    required
                    rows={2}
                    className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="How to apply this product..."
                    value={formData.usage}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData({ ...formData, usage: e.target.value })
                    }
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                    className="flex-1 rounded-2xl border border-gray-100 py-4 font-bold text-gray-600 transition-all hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-[2] rounded-2xl bg-primary py-4 text-lg font-bold text-white transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-70"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {formLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Save size={20} />
                      )}
                      {isAdding ? "Save Product" : "Update Product"}
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
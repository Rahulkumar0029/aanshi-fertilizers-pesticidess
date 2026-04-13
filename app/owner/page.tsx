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
  ShieldCheck,
  ExternalLink,
  Settings,
  MessageSquare,
  ShoppingBag,
  BarChart3,
  Image as ImageIcon,
  LogOut,
  ArrowRight,
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
  image?: string;
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

const FALLBACK_IMAGE = "/placeholder.png";

const quickLinks = [
  {
    title: "Open Admin Panel",
    description: "Go to the main admin control area.",
    href: "/admin",
    icon: ShieldCheck,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Orders",
    description: "Track WhatsApp and order leads.",
    href: "/admin/orders",
    icon: ShoppingBag,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    title: "Inquiries",
    description: "Check customer and wholesale inquiries.",
    href: "/admin/inquiries",
    icon: MessageSquare,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "Analytics",
    description: "Review performance and business activity.",
    href: "/admin/analytics",
    icon: BarChart3,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    title: "Banners",
    description: "Manage homepage marketing banners.",
    href: "/admin/banners",
    icon: ImageIcon,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    title: "Settings",
    description: "Update business details and dynamic content.",
    href: "/admin/settings",
    icon: Settings,
    color: "text-slate-600",
    bg: "bg-slate-50",
  },
];

function getSafeImageSrc(src?: string) {
  const value = src?.trim();
  return value ? value : FALLBACK_IMAGE;
}

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
    image: FALLBACK_IMAGE,
  });

  useEffect(() => {
    const loadOwnerData = async () => {
      try {
        const authRes = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (authRes.ok) {
          const user: AuthUser = await authRes.json();
          setOwnerName(user?.name || "Owner");
        }

        await fetchProducts();
      } catch (error) {
        console.error("Failed to load owner data:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadOwnerData();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json().catch(() => []);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
    }
  }

  const goTo = (href: string) => {
    router.push(href);
  };

  const openAddModal = () => {
    setIsAdding(true);
    setEditingProduct(null);
    resetForm();
  };

  const closeModal = () => {
    setIsAdding(false);
    setEditingProduct(null);
    resetForm();
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
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
      image: FALLBACK_IMAGE,
    });
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const payload = {
        ...formData,
        image: getSafeImageSrc(formData.image),
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to add product");
      }

      toast.success("Product added successfully");
      closeModal();
      await fetchProducts();
    } catch (error) {
      console.error("Failed to add product", error);
      toast.error(error instanceof Error ? error.message : "Failed to add product");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;

    setFormLoading(true);

    try {
      const payload = {
        ...formData,
        image: getSafeImageSrc(formData.image),
      };

      const res = await fetch(`/api/products/${editingProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update product");
      }

      toast.success("Product updated successfully");
      closeModal();
      await fetchProducts();
    } catch (error) {
      console.error("Failed to update product", error);
      toast.error(error instanceof Error ? error.message : "Failed to update product");
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

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.details || data?.error || "Upload failed");
      }

      if (!data?.secure_url) {
        throw new Error("Image URL missing after upload");
      }

      setFormData((prev) => ({
        ...prev,
        image: data.secure_url,
      }));

      toast.success("Image uploaded successfully", { id: "upload" });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Upload failed", {
        id: "upload",
      });
    } finally {
      setImageLoading(false);
      e.target.value = "";
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete product");
      }

      toast.success("Product deleted");
      await fetchProducts();
    } catch (error) {
      console.error("Failed to delete product", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete product");
    }
  };

  const startEditing = (product: Product) => {
    setEditingProduct(product);
    setIsAdding(false);
    setFormData({
      name: product.name,
      category: product.category,
      size: product.size,
      price: product.price,
      description: product.description || "",
      usage: product.usage,
      image: getSafeImageSrc(product.image),
    });
  };

  const filteredProducts = products.filter((p) => {
    const name = p.name?.toLowerCase() || "";
    const category = p.category?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();

    return name.includes(query) || category.includes(query);
  });

  return (
    <div className="min-h-screen bg-[#f8faf8] pb-14 pt-6 sm:pb-20 sm:pt-8">
      <Toaster position="top-right" />

      <div className="container-app">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              <Package className="text-primary" />
              Owner Dashboard
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-lg">
              Welcome back, {ownerName}. Manage products and access full business controls.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={() => goTo("/")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 font-bold text-gray-600 transition-all hover:bg-gray-50"
            >
              <ExternalLink size={18} />
              View Website
            </button>

            <button
              type="button"
              onClick={() => goTo("/admin")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
            >
              <ShieldCheck size={18} />
              Open Admin Panel
            </button>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
            >
              <Plus size={20} />
              Add New Product
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-3 font-bold text-gray-600 transition-all hover:bg-gray-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 lg:mb-10">
          {quickLinks.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => goTo(item.href)}
              className="group rounded-3xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl sm:p-6"
            >
              <div className={`mb-4 w-fit rounded-2xl p-4 ${item.bg} ${item.color}`}>
                <item.icon size={24} />
              </div>

              <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">{item.description}</p>

              <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">
                Open
                <ArrowRight size={16} />
              </div>
            </button>
          ))}
        </div>

        <div className="relative mb-8 max-w-xl lg:mb-10">
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

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="font-medium italic text-gray-500">
              Loading your products...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 xl:gap-8">
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
                  <div className="relative h-52 overflow-hidden sm:h-56">
                    <Image
                      src={getSafeImageSrc(product.image)}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute left-4 top-4 rounded-full border border-primary/20 bg-white/90 px-3 py-1 text-xs font-bold text-primary backdrop-blur-sm">
                      {product.category}
                    </div>
                  </div>

                  <div className="flex flex-grow flex-col p-5 sm:p-6 lg:p-8">
                    <h3 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">
                      {product.name}
                    </h3>

                    <div className="mb-3">
                      <span className="text-lg font-bold text-primary sm:text-xl">
                        {product.price || "Contact for Pricing"}
                      </span>
                    </div>

                    <div className="mb-6 space-y-2">
                      <p className="text-sm leading-6 text-gray-500">
                        <span className="font-semibold">Size:</span> {product.size || "-"}
                      </p>

                      <p className="line-clamp-2 text-sm leading-6 text-gray-500">
                        <span className="font-semibold">Description:</span>{" "}
                        {product.description?.trim() || "-"}
                      </p>

                      <p className="line-clamp-2 text-sm leading-6 text-gray-500">
                        <span className="font-semibold">Usage:</span>{" "}
                        {product.usage?.trim() || "-"}
                      </p>
                    </div>

                    <div className="mt-auto flex gap-3 border-t border-gray-50 pt-4">
                      <button
                        type="button"
                        onClick={() => startEditing(product)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-3 font-bold text-primary transition-all hover:bg-primary hover:text-white"
                      >
                        <Pencil size={18} />
                        Edit
                      </button>

                      <button
                        type="button"
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
            <p className="text-lg italic text-gray-400 sm:text-xl">
              No products found. Start by adding one.
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {(isAdding || editingProduct) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl sm:rounded-[2.5rem]"
            >
              <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6 lg:p-8">
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {isAdding ? "Add New Product" : "Edit Product"}
                </h2>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full p-2 transition-colors hover:bg-gray-100"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="max-h-[calc(90vh-88px)] overflow-y-auto">
                <form
                  onSubmit={isAdding ? handleAddProduct : handleUpdateProduct}
                  className="space-y-6 p-5 sm:p-6 lg:p-8"
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

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-primary border-dashed bg-white px-4 py-3 text-primary transition-all hover:bg-primary hover:text-white sm:flex-1">
                          <span className="text-sm font-bold">
                            {imageLoading ? "Uploading..." : "Upload Image"}
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={handleImageUpload}
                            disabled={imageLoading}
                          />
                        </label>

                        <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-gray-200">
                          <Image
                            src={getSafeImageSrc(formData.image)}
                            alt="Preview"
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      </div>

                      <input
                        type="text"
                        className="mt-2 w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 text-xs outline-none transition-all focus:ring-1 focus:ring-primary/20"
                        placeholder="Or paste Image URL"
                        value={formData.image}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({
                            ...formData,
                            image: e.target.value.trim() || FALLBACK_IMAGE,
                          })
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
                      rows={3}
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
                      rows={3}
                      className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="How to apply this product..."
                      value={formData.usage}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData({ ...formData, usage: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:gap-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 rounded-2xl border border-gray-100 py-4 font-bold text-gray-600 transition-all hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={formLoading || imageLoading}
                      className="flex-[2] rounded-2xl bg-primary py-4 text-base font-bold text-white transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-70 sm:text-lg"
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
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
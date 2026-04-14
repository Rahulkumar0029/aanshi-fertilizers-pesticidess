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

type Variant = {
  label: string;
  mrp: number;
  price: number;
  isDefault: boolean;
  stock?: "in_stock" | "low_stock" | "out_of_stock";
};

type Product = {
  _id?: string;
  name: string;
  brand?: string;
  category: string;
  usage?: string;
  description?: string;
  image?: string;
  variants?: Variant[];

  // backward compatibility for old products
  size?: string;
  mrp?: number;
  price?: number;
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

function createEmptyVariant(isDefault = false): Variant {
  return {
    label: "",
    mrp: 0,
    price: 0,
    isDefault,
    stock: "in_stock",
  };
}

const EMPTY_FORM: Product = {
  name: "",
  brand: "",
  category: CATEGORIES[0],
  usage: "",
  description: "",
  image: FALLBACK_IMAGE,
  variants: [createEmptyVariant(true)],
};

function getDisplayVariants(product: Product): Variant[] {
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    return product.variants;
  }

  if (
    product.size ||
    typeof product.price === "number" ||
    typeof product.mrp === "number"
  ) {
    return [
      {
        label: product.size || "Default",
        mrp: Number(product.mrp || 0),
        price: Number(product.price || 0),
        isDefault: true,
        stock: "in_stock",
      },
    ];
  }

  return [];
}

function getDefaultVariant(product: Product): Variant | null {
  const variants = getDisplayVariants(product);

  if (!variants.length) {
    return null;
  }

  return variants.find((variant) => variant.isDefault) || variants[0];
}

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
        const authRes = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (authRes.ok) {
          const user: AuthUser = await authRes.json();
          if (user?.role !== "owner" && user?.role !== "admin") {
            router.replace("/");
            return;
          }
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
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      ...EMPTY_FORM,
      variants: [createEmptyVariant(true)],
    });
    setEditingId(null);
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...(prev.variants || []), createEmptyVariant(false)],
    }));
  };

  const removeVariant = (index: number) => {
    setForm((prev) => {
      const updated = (prev.variants || []).filter((_, i) => i !== index);

      if (updated.length === 0) {
        return {
          ...prev,
          variants: [createEmptyVariant(true)],
        };
      }

      if (!updated.some((variant) => variant.isDefault)) {
        updated[0].isDefault = true;
      }

      return {
        ...prev,
        variants: updated,
      };
    });
  };

  const updateVariant = <K extends keyof Variant>(
    index: number,
    field: K,
    value: Variant[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      variants: (prev.variants || []).map((variant, i) =>
        i === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      ),
    }));
  };

  const setDefaultVariant = (index: number) => {
    setForm((prev) => ({
      ...prev,
      variants: (prev.variants || []).map((variant, i) => ({
        ...variant,
        isDefault: i === index,
      })),
    }));
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

    const cleanedVariants = (form.variants || [])
      .map((variant) => ({
        label: variant.label.trim(),
        mrp: Number(variant.mrp || 0),
        price: Number(variant.price || 0),
        isDefault: Boolean(variant.isDefault),
        stock: variant.stock || "in_stock",
      }))
      .filter((variant) => variant.label);

    if (cleanedVariants.length === 0) {
      toast.error("At least one valid size variant is required");
      return;
    }

    if (!cleanedVariants.some((variant) => variant.isDefault)) {
      cleanedVariants[0].isDefault = true;
    }

    const firstDefaultIndex = cleanedVariants.findIndex(
      (variant) => variant.isDefault
    );

    const normalizedVariants = cleanedVariants.map((variant, index) => ({
      ...variant,
      isDefault: index === firstDefaultIndex,
    }));

    toast.loading(editingId ? "Updating product..." : "Adding product...", {
      id: "save",
    });

    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        brand: form.brand?.trim() || "",
        category: form.category.trim(),
        description: form.description?.trim() || "",
        usage: form.usage?.trim() || "",
        image: getSafeImageSrc(form.image),
        variants: normalizedVariants,
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
    let safeVariants: Variant[] = [];

    if (Array.isArray(product.variants) && product.variants.length > 0) {
      safeVariants = product.variants.map((variant, index) => ({
        label: variant.label || "",
        mrp: Number(variant.mrp || 0),
        price: Number(variant.price || 0),
        isDefault:
          typeof variant.isDefault === "boolean"
            ? variant.isDefault
            : index === 0,
        stock: variant.stock || "in_stock",
      }));
    } else if (
      product.size ||
      typeof product.price === "number" ||
      typeof product.mrp === "number"
    ) {
      safeVariants = [
        {
          label: product.size || "Default",
          mrp: Number(product.mrp || 0),
          price: Number(product.price || 0),
          isDefault: true,
          stock: "in_stock",
        },
      ];
    } else {
      safeVariants = [createEmptyVariant(true)];
    }

    if (!safeVariants.some((variant) => variant.isDefault)) {
      safeVariants[0].isDefault = true;
    }

    setForm({
      name: product.name || "",
      brand: product.brand || "",
      category: product.category || CATEGORIES[0],
      usage: product.usage || "",
      description: product.description || "",
      image: getSafeImageSrc(product.image),
      variants: safeVariants,
    });

    setEditingId(product._id || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) => {
      const name = product.name?.toLowerCase() || "";
      const brand = product.brand?.toLowerCase() || "";
      const category = product.category?.toLowerCase() || "";
      const legacySize = product.size?.toLowerCase() || "";
      const variantLabels = getDisplayVariants(product)
        .map((variant) => variant.label?.toLowerCase() || "")
        .join(" ");

      return (
        name.includes(query) ||
        brand.includes(query) ||
        category.includes(query) ||
        legacySize.includes(query) ||
        variantLabels.includes(query)
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
    <div className="min-h-screen bg-[#f8faf8] py-4 sm:py-6">
      <Toaster position="top-right" />

      <div className="container-app">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900 sm:text-3xl">
              <Package className="text-primary" />
              Product Management
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              Add, edit, delete, and manage all business products from one place.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft size={16} />
              Back to Admin
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 font-semibold text-white hover:opacity-90"
            >
              <Plus size={16} />
              New Product
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[520px_minmax(0,1fr)]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6"
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

              <input
                name="brand"
                placeholder="Brand (Bayer, Syngenta, UPL...)"
                value={form.brand || ""}
                onChange={handleChange}
                className="w-full rounded-xl border p-3 outline-none focus:border-primary"
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

              <div className="rounded-2xl border border-gray-200 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Sizes & Pricing
                    </h3>
                    <p className="text-xs text-gray-500">
                      Add multiple sizes for one product and choose one default size.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addVariant}
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    <Plus size={14} />
                    Add Size
                  </button>
                </div>

                <div className="space-y-3">
                  {(form.variants || []).map((variant, index) => (
                    <div
                      key={`${index}-${variant.label}`}
                      className="rounded-xl border border-gray-200 p-3"
                    >
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <input
                          type="text"
                          placeholder="Size (100 ml, 500ml, 1L, 5kg, 25kg...)"
                          value={variant.label}
                          onChange={(e) =>
                            updateVariant(index, "label", e.target.value)
                          }
                          className="w-full rounded-xl border p-3 outline-none focus:border-primary"
                        />

                        <select
                          value={variant.stock || "in_stock"}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "stock",
                              e.target.value as Variant["stock"]
                            )
                          }
                          className="w-full rounded-xl border p-3 outline-none focus:border-primary"
                        >
                          <option value="in_stock">In Stock</option>
                          <option value="low_stock">Low Stock</option>
                          <option value="out_of_stock">Out of Stock</option>
                        </select>

                        <input
                          type="number"
                          min="0"
                          placeholder="MRP"
                          value={variant.mrp}
                          onChange={(e) =>
                            updateVariant(index, "mrp", Number(e.target.value))
                          }
                          className="w-full rounded-xl border p-3 outline-none focus:border-primary"
                        />

                        <input
                          type="number"
                          min="0"
                          placeholder="Offer Price"
                          value={variant.price}
                          onChange={(e) =>
                            updateVariant(index, "price", Number(e.target.value))
                          }
                          className="w-full rounded-xl border p-3 outline-none focus:border-primary"
                        />
                      </div>

                      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                          <input
                            type="radio"
                            name="defaultVariant"
                            checked={variant.isDefault}
                            onChange={() => setDefaultVariant(index)}
                          />
                          Set as default size
                        </label>

                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          disabled={(form.variants || []).length === 1}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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

              <div className="flex flex-col gap-3 sm:flex-row">
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

          <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                All Products ({filteredProducts.length})
              </h2>

              <div className="relative w-full lg:max-w-sm">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search by name, brand, category, size..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border py-2 pl-9 pr-3 outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="table-scroll">
              <table className="min-w-[1100px] text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Brand</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Sizes</th>
                    <th className="p-3 text-left">Default MRP</th>
                    <th className="p-3 text-left">Default Price</th>
                    <th className="p-3 text-left">Discount</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => {
                    const displayVariants = getDisplayVariants(product);
                    const defaultVariant = getDefaultVariant(product);

                    const discount =
                      defaultVariant &&
                      defaultVariant.mrp > 0 &&
                      defaultVariant.price >= 0 &&
                      defaultVariant.mrp > defaultVariant.price
                        ? Math.floor(
                            ((defaultVariant.mrp - defaultVariant.price) /
                              defaultVariant.mrp) *
                              100
                          )
                        : 0;

                    return (
                      <tr key={product._id} className="border-t align-middle">
                        <td className="p-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded-lg border">
                            <Image
                              src={getSafeImageSrc(product.image)}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                        </td>

                        <td className="p-3 font-medium text-gray-900">
                          {product.name}
                        </td>

                        <td className="p-3">{product.brand || "-"}</td>

                        <td className="p-3">{product.category}</td>

                        <td className="p-3">
                          <div className="flex flex-wrap gap-2">
                            {displayVariants.length > 0 ? (
                              displayVariants.map((variant, index) => (
                                <span
                                  key={`${variant.label}-${index}`}
                                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                    variant.isDefault
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {variant.label}
                                  {variant.isDefault ? " • Default" : ""}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </td>

                        <td className="p-3">
                          ₹ {defaultVariant?.mrp?.toLocaleString("en-IN") || 0}
                        </td>

                        <td className="p-3">
                          ₹ {defaultVariant?.price?.toLocaleString("en-IN") || 0}
                        </td>

                        <td className="p-3 font-bold text-red-500">
                          {discount > 0 ? `${discount}%` : "-"}
                        </td>

                        <td className="p-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(product)}
                              className="rounded-lg bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
                            >
                              <Pencil size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                product._id && handleDelete(product._id)
                              }
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
"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, PhoneForwarded } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { buildProductInquiryMessage, openWhatsApp } from "@/lib/whatsapp";

type Product = {
  _id: string;
  name: string;
  category: string;
  price?: number;
  mrp?: number;
  usage?: string;
  description?: string;
  image?: string;
  size?: string;
};

type AuthUser = {
  _id?: string;
  id?: string;
  name: string;
  email?: string;
  phone: string;
  role: string;
};

const CATEGORIES = [
  "All",
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

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products", {
          cache: "no-store",
        });
        const data = await res.json().catch(() => []);
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const categoryFromURL = searchParams.get("category");
    setSelectedCategory(categoryFromURL || "All");
  }, [searchParams]);

  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === "All" ||
      p.category?.toLowerCase().trim() ===
        selectedCategory.toLowerCase().trim();

    const matchSearch = p.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  const getDiscount = (mrp?: number, price?: number) => {
    if (!mrp || !price || mrp <= 0) return 0;
    return Math.floor(((mrp - price) / mrp) * 100);
  };

  const handleInquiry = async (product: Product) => {
    try {
      setActionLoadingId(product._id);

      const authRes = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!authRes.ok) {
        router.push(`/login?redirect=/products`);
        return;
      }

      const user: AuthUser = await authRes.json();
      const userId = user.id || user._id;

      if (!userId || !user.name || !user.phone) {
        alert("Your account details are incomplete. Please login again.");
        router.push("/login?redirect=/products");
        return;
      }

      const inquiryPayload = {
        userId,
        userName: user.name,
        phone: user.phone,
        productId: product._id,
        productName: product.name,
        productCategory: product.category,
        productSize: product.size || "",
        status: "pending",
        message: product.description || "",
      };

      const inquiryRes = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(inquiryPayload),
      });

      if (!inquiryRes.ok) {
        const inquiryError = await inquiryRes.json().catch(() => null);
        console.error("Inquiry save failed:", inquiryError);
      }

      const orderPayload = {
        userId,
        productId: product._id,
        productName: product.name,
        productCategory: product.category,
        productSize: product.size || "",
        customerName: user.name,
        phone: user.phone,
        status: "Pending",
        source: "WhatsApp",
        price: product.price || 0,
      };

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) {
        const orderError = await orderRes.json().catch(() => null);
        console.error("Order save failed:", orderError);
      }

      const message = buildProductInquiryMessage({
        customerName: user.name,
        customerPhone: user.phone,
        productName: product.name,
        category: product.category,
        size: product.size,
        price: product.price,
        mrp: product.mrp,
        description: product.description || product.usage,
      });

      openWhatsApp(message);
    } catch (error) {
      console.error("Failed to handle inquiry/order:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <section className="bg-primary px-4 py-14 text-white sm:py-16">
        <div className="container-app text-center">
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Our Product Catalog
          </h1>
          <p className="mx-auto max-w-2xl text-sm opacity-90 sm:text-lg">
            High-quality agricultural inputs for every farming need.
          </p>
        </div>
      </section>

      <section className="container-app -mt-6 sm:-mt-8">
        <div className="rounded-2xl bg-white p-4 shadow-xl sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-xl border border-border py-3 pl-12 pr-4 outline-none transition focus:border-primary"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
              />
            </div>

            <div className="flex w-full flex-wrap gap-2 sm:gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    router.push(`/products?category=${cat}`);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition sm:px-5 ${
                    selectedCategory === cat
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-app py-12 sm:py-16 lg:py-20">
        {loading ? (
          <p className="text-center text-sm text-gray-500 sm:text-base">
            Loading...
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
              {filteredProducts.map((product) => {
                const discount = getDiscount(product.mrp, product.price);

                return (
                  <div
                    key={product._id}
                    className="overflow-hidden rounded-2xl bg-white shadow transition hover:shadow-lg"
                  >
                    <div className="relative h-56 sm:h-60">
                      <Image
                        src={getSafeImageSrc(product.image)}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />

                      {discount > 0 && (
                        <span className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 p-5 sm:p-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold sm:text-xl">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>

                      {product.size && (
                        <div>
                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                            Size: {product.size}
                          </span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="text-xl font-extrabold text-green-600 sm:text-2xl">
                          ₹ {product.price || "Contact"}
                        </span>

                        {product.mrp && (
                          <span className="text-base text-gray-400 line-through sm:text-lg">
                            ₹ {product.mrp}
                          </span>
                        )}
                      </div>

                      <p className="line-clamp-2 text-sm leading-6 text-gray-600">
                        {product.usage ||
                          product.description ||
                          "Product details available on view page."}
                      </p>

                      <div className="mt-2 flex flex-col gap-2">
                        <Link
                          href={`/products/${product._id}`}
                          className="rounded-lg border border-border py-2.5 text-center text-sm font-medium transition hover:bg-gray-50 sm:text-base"
                        >
                          View Details
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleInquiry(product)}
                          disabled={actionLoadingId === product._id}
                          className="flex items-center justify-center gap-2 rounded-lg bg-green-500 py-3 text-sm font-bold text-white shadow-md transition hover:bg-green-600 disabled:opacity-70 sm:text-base"
                        >
                          <PhoneForwarded size={16} />
                          {actionLoadingId === product._id
                            ? "Opening WhatsApp..."
                            : "WhatsApp Inquiry"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <p className="mt-10 text-center text-sm text-gray-400 sm:text-base">
                No products found
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default function Products() {
  return (
    <Suspense fallback={<div className="container-app py-10 text-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
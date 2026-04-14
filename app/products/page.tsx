"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { Search } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { buildProductInquiryMessage, openWhatsApp } from "@/lib/whatsapp";
import ProductCard from "@/components/ProductCard";

type ProductVariant = {
  label: string;
  mrp?: number;
  price?: number;
  isDefault?: boolean;
  stock?: "in_stock" | "low_stock" | "out_of_stock";
};

type Product = {
  _id: string;
  name: string;
  brand?: string;
  category: string;
  usage?: string;
  description?: string;
  image?: string;
  variants?: ProductVariant[];

  // backward compatibility for old products
  size?: string;
  mrp?: number;
  price?: number;
};

type AuthUser = {
  _id?: string;
  id?: string;
  name: string;
  email?: string;
  phone: string;
  role: string;
};

type InquiryProduct = Product & {
  selectedVariant?: ProductVariant | null;
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

function getCompatibleVariant(product: InquiryProduct): ProductVariant | null {
  if (product.selectedVariant) return product.selectedVariant;

  if (Array.isArray(product.variants) && product.variants.length > 0) {
    return (
      product.variants.find((variant) => variant.isDefault) ||
      product.variants[0]
    );
  }

  if (
    product.size ||
    typeof product.price === "number" ||
    typeof product.mrp === "number"
  ) {
    return {
      label: product.size || "Default",
      price: product.price,
      mrp: product.mrp,
      isDefault: true,
      stock: "in_stock",
    };
  }

  return null;
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

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === "All" ||
      product.category?.toLowerCase().trim() ===
        selectedCategory.toLowerCase().trim();

    const query = searchQuery.toLowerCase().trim();

    const matchSearch =
      !query ||
      product.name?.toLowerCase().includes(query) ||
      product.brand?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.size?.toLowerCase().includes(query) ||
      product.variants?.some((variant) =>
        variant.label.toLowerCase().includes(query)
      );

    return Boolean(matchCategory && matchSearch);
  });

  const handleInquiry = async (product: InquiryProduct) => {
    try {
      setActionLoadingId(product._id);

      const selectedVariant = getCompatibleVariant(product);

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
        alert("Your account details are incomplete.");
        return;
      }

      const inquiryPayload = {
        userId,
        userName: user.name,
        phone: user.phone,
        productId: product._id,
        productName: product.name,
        productCategory: product.category,
        selectedSize: selectedVariant?.label || "",
        selectedPrice: selectedVariant?.price || 0,
        selectedMrp: selectedVariant?.mrp || 0,
        brand: product.brand || "",
        status: "pending",
      };

      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(inquiryPayload),
      });

      const orderPayload = {
        userId,
        productId: product._id,
        productName: product.name,
        productCategory: product.category,
        selectedSize: selectedVariant?.label || "",
        selectedPrice: selectedVariant?.price || 0,
        selectedMrp: selectedVariant?.mrp || 0,
        brand: product.brand || "",
        customerName: user.name,
        phone: user.phone,
        status: "Pending",
        source: "WhatsApp",
      };

      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderPayload),
      });

      const message = buildProductInquiryMessage({
        productName: product.name,
        category: product.category,
        brand: product.brand,
        size: selectedVariant?.label,
        price: selectedVariant?.price,
        mrp: selectedVariant?.mrp,
        description: product.description || product.usage,
      });

      openWhatsApp(message);
    } catch (error) {
      console.error("Inquiry error:", error);
      alert("Something went wrong.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <section className="bg-primary px-4 py-14 text-white">
        <div className="container-app text-center">
          <h1 className="text-4xl font-bold">Our Product Catalog</h1>
          <p className="mt-2 text-lg opacity-90">
            High-quality agricultural inputs for every farming need.
          </p>
        </div>
      </section>

      <section className="container-app -mt-6">
        <div className="rounded-2xl bg-white p-4 shadow-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, brand, size..."
                className="w-full rounded-xl border py-3 pl-12 pr-4 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    router.push(`/products?category=${cat}`);
                  }}
                  className={`rounded-full px-4 py-2 ${
                    selectedCategory === cat
                      ? "bg-primary text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-app py-12">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onInquiry={handleInquiry}
                  isLoading={actionLoadingId === product._id}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <p className="mt-10 text-center text-gray-400">
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
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
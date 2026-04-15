"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { buildProductInquiryMessage, openWhatsApp } from "@/lib/whatsapp";
import ProductCard from "@/components/ProductCard";
import ProductFiltersSidebar from "@/components/products/ProductFiltersSidebar";

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

  size?: string;
  mrp?: number;
  price?: number;
};

type UserAddress = {
  addressLine1?: string;
  addressLine2?: string;
  villageOrCity?: string;
  district?: string;
  state?: string;
  pincode?: string;
};

type AuthUser = {
  _id?: string;
  id?: string;
  name: string;
  email?: string;
  phone: string;
  role: string;
  address?: UserAddress;
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

function getListingPrice(product: Product) {
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    const prices = product.variants
      .map((variant) => variant.price)
      .filter((price): price is number => typeof price === "number");

    if (prices.length > 0) {
      return Math.min(...prices);
    }
  }

  return typeof product.price === "number" ? product.price : 0;
}

function formatAddress(address?: UserAddress) {
  if (!address) return "";

  return [
    address.addressLine1,
    address.addressLine2,
    address.villageOrCity,
    address.district,
    address.state,
    address.pincode,
  ]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(", ");
}

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [availability, setAvailability] = useState("");
  const [sort, setSort] = useState("");

  const [draftCategory, setDraftCategory] = useState("All");
  const [draftBrand, setDraftBrand] = useState("");
  const [draftSize, setDraftSize] = useState("");
  const [draftAvailability, setDraftAvailability] = useState("");
  const [draftSort, setDraftSort] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
    const categoryFromURL = searchParams.get("category") || "All";
    setSelectedCategory(categoryFromURL);
    setDraftCategory(categoryFromURL);
  }, [searchParams]);

  const brands = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.brand?.trim())
          .filter((value): value is string => Boolean(value))
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [products]);

  const sizes = useMemo(() => {
    return [
      ...new Set(
        products.flatMap((product) => {
          if (Array.isArray(product.variants) && product.variants.length > 0) {
            return product.variants
              .map((variant) => variant.label?.trim())
              .filter((value): value is string => Boolean(value));
          }

          return product.size?.trim() ? [product.size.trim()] : [];
        })
      ),
    ].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
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

        const matchBrand =
          !selectedBrand ||
          product.brand?.toLowerCase().trim() ===
            selectedBrand.toLowerCase().trim();

        const matchSize =
          !selectedSize ||
          product.size?.toLowerCase().trim() ===
            selectedSize.toLowerCase().trim() ||
          product.variants?.some(
            (variant) =>
              variant.label.toLowerCase().trim() ===
              selectedSize.toLowerCase().trim()
          );

        const matchAvailability =
          !availability ||
          product.variants?.some((variant) => variant.stock === availability) ||
          (!product.variants?.length && availability === "in_stock");

        return Boolean(
          matchCategory &&
            matchSearch &&
            matchBrand &&
            matchSize &&
            matchAvailability
        );
      })
      .sort((a, b) => {
        if (sort === "price_asc") {
          return getListingPrice(a) - getListingPrice(b);
        }

        if (sort === "price_desc") {
          return getListingPrice(b) - getListingPrice(a);
        }

        return 0;
      });
  }, [
    products,
    selectedCategory,
    searchQuery,
    selectedBrand,
    selectedSize,
    availability,
    sort,
  ]);

  const activeFilterCount = [
    selectedCategory !== "All",
    selectedBrand !== "",
    selectedSize !== "",
    availability !== "",
    sort !== "",
  ].filter(Boolean).length;

  const openFilters = () => {
    setDraftCategory(selectedCategory);
    setDraftBrand(selectedBrand);
    setDraftSize(selectedSize);
    setDraftAvailability(availability);
    setDraftSort(sort);
    setIsFilterOpen(true);
  };

  const closeFilters = () => {
    setIsFilterOpen(false);
  };

  const applyFilters = () => {
    setSelectedCategory(draftCategory);
    setSelectedBrand(draftBrand);
    setSelectedSize(draftSize);
    setAvailability(draftAvailability);
    setSort(draftSort);

    const params = new URLSearchParams(searchParams.toString());

    if (draftCategory && draftCategory !== "All") {
      params.set("category", draftCategory);
    } else {
      params.delete("category");
    }

    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : "/products");

    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setDraftCategory("All");
    setDraftBrand("");
    setDraftSize("");
    setDraftAvailability("");
    setDraftSort("");

    setSelectedCategory("All");
    setSelectedBrand("");
    setSelectedSize("");
    setAvailability("");
    setSort("");

    router.push("/products");
    setIsFilterOpen(false);
  };

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
      const formattedAddress = formatAddress(user.address);

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
        customerName: user.name,
        customerPhone: user.phone,
        customerAddress: formattedAddress,
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
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:max-w-[760px]">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, brand, size..."
                    className="w-full rounded-xl border py-3 pl-12 pr-4 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={openFilters}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 font-medium text-gray-800 transition hover:bg-gray-50 sm:min-w-[130px]"
                >
                  <SlidersHorizontal size={18} />
                  Filter
                  {activeFilterCount > 0 ? (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">
                      {activeFilterCount}
                    </span>
                  ) : null}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setDraftCategory(cat);
                    router.push(
                      cat === "All" ? "/products" : `/products?category=${cat}`
                    );
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
            <div className="mb-6 flex items-center justify-between gap-3">
              <p className="text-sm text-gray-600">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""} found
              </p>
            </div>

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

      <ProductFiltersSidebar
        isOpen={isFilterOpen}
        onClose={closeFilters}
        categories={CATEGORIES}
        brands={brands}
        sizes={sizes}
        selectedCategory={draftCategory}
        setSelectedCategory={setDraftCategory}
        selectedBrand={draftBrand}
        setSelectedBrand={setDraftBrand}
        selectedSize={draftSize}
        setSelectedSize={setDraftSize}
        availability={draftAvailability}
        setAvailability={setDraftAvailability}
        sort={draftSort}
        setSort={setDraftSort}
        clearFilters={clearFilters}
        applyFilters={applyFilters}
      />
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
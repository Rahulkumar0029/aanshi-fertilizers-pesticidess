"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { BUSINESS_DETAILS } from "@/lib/constants";
import { buildProductInquiryMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

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
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  address?: UserAddress;
};

function getDefaultVariant(product: Product): ProductVariant | null {
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

function getDisplayVariants(product: Product): ProductVariant[] {
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
        price: product.price,
        mrp: product.mrp,
        isDefault: true,
        stock: "in_stock",
      },
    ];
  }

  return [];
}

function getDiscount(mrp?: number, price?: number) {
  if (!mrp || !price || mrp <= 0 || mrp <= price) return 0;
  return Math.floor(((mrp - price) / mrp) * 100);
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

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setNotFoundState(false);

        const res = await fetch(`/api/products/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 404) {
            setNotFoundState(true);
          }
          setProduct(null);
          return;
        }

        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    let ignore = false;

    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          if (!ignore) {
            setUser(null);
            setAuthChecked(true);
          }
          return;
        }

        const data = await res.json();

        if (!ignore) {
          setUser(data ?? null);
          setAuthChecked(true);
        }
      } catch (error) {
        console.error("Failed to fetch auth user:", error);

        if (!ignore) {
          setUser(null);
          setAuthChecked(true);
        }
      }
    };

    fetchCurrentUser();

    return () => {
      ignore = true;
    };
  }, []);

  const displayVariants = useMemo(
    () => (product ? getDisplayVariants(product) : []),
    [product]
  );

  const initialVariant = useMemo(
    () => (product ? getDefaultVariant(product) : null),
    [product]
  );

  useEffect(() => {
    setSelectedVariant(initialVariant);
  }, [initialVariant]);

  if (notFoundState) {
    notFound();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf8] py-8 sm:py-10 lg:py-12">
        <div className="container-app">
          <div className="rounded-2xl bg-white p-10 text-center shadow-lg">
            Loading product...
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8faf8] py-8 sm:py-10 lg:py-12">
        <div className="container-app">
          <div className="rounded-2xl bg-white p-10 text-center shadow-lg">
            Product not found.
          </div>
        </div>
      </div>
    );
  }

  const discount = getDiscount(selectedVariant?.mrp, selectedVariant?.price);

  const handleProtectedWhatsApp = async () => {
    try {
      if (!authChecked) return;

      if (!user) {
        router.push(`/login?redirect=${encodeURIComponent(`/products/${product._id}`)}`);
        return;
      }

      if (!user.name || !user.phone) {
        alert("Your account details are incomplete.");
        return;
      }

      setActionLoading(true);

      const formattedAddress = formatAddress(user.address);

      const inquiryPayload = {
        userId: user.id || user._id,
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
        userId: user.id || user._id,
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

      const whatsappUrl = buildWhatsAppUrl(
        buildProductInquiryMessage({
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
        })
      );

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Product detail inquiry error:", error);
      alert("Something went wrong.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf8] py-8 sm:py-10 lg:py-12">
      <div className="container-app">
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <div className="p-5 sm:p-6 lg:p-8">
            <Link
              href="/products"
              className="mb-6 inline-block text-sm font-semibold text-primary hover:underline sm:text-base"
            >
              ← Back to Products
            </Link>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
              <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-xl bg-gray-50 sm:h-80 lg:min-h-[460px]">
                <Image
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-6"
                />

                {product.brand ? (
                  <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-green-800 shadow">
                    {product.brand}
                  </span>
                ) : null}

                {discount > 0 ? (
                  <span className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                    {discount}% OFF
                  </span>
                ) : null}
              </div>

              <div className="flex flex-col gap-5">
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                    {product.name}
                  </h1>

                  <p className="text-gray-500">Category: {product.category}</p>
                </div>

                {displayVariants.length > 0 ? (
                  <div>
                    <h3 className="mb-2 font-semibold">Available Sizes</h3>

                    <div className="flex flex-wrap gap-2">
                      {displayVariants.map((variant, index) => {
                        const isActive =
                          selectedVariant?.label === variant.label;

                        return (
                          <button
                            key={`${variant.label}-${index}`}
                            type="button"
                            onClick={() => setSelectedVariant(variant)}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                              isActive
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                          >
                            {variant.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-3xl font-bold text-primary">
                    {typeof selectedVariant?.price === "number"
                      ? `₹ ${selectedVariant.price.toLocaleString("en-IN")}`
                      : "Contact"}
                  </span>

                  {typeof selectedVariant?.mrp === "number" &&
                  selectedVariant.mrp > (selectedVariant.price ?? 0) ? (
                    <span className="text-lg text-gray-400 line-through">
                      ₹ {selectedVariant.mrp.toLocaleString("en-IN")}
                    </span>
                  ) : null}
                </div>

                {selectedVariant?.stock === "low_stock" ? (
                  <p className="text-sm font-semibold text-amber-600">
                    Limited stock available
                  </p>
                ) : null}

                {selectedVariant?.stock === "out_of_stock" ? (
                  <p className="text-sm font-semibold text-red-600">
                    Out of stock
                  </p>
                ) : null}

                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-gray-600">
                    {product.description || "High-quality agricultural product"}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Usage</h3>
                  <p className="text-gray-600">
                    {product.usage || "Use as per agricultural guidelines"}
                  </p>
                </div>

                <div className="rounded-xl bg-green-50 p-4 text-sm">
                  <p className="font-semibold text-primary">
                    Need help before ordering?
                  </p>
                  <p className="mt-2">WhatsApp us for best guidance.</p>
                  <p className="mt-2">WhatsApp: {BUSINESS_DETAILS.phone}</p>
                  <p className="break-all">Email: {BUSINESS_DETAILS.email}</p>
                </div>

                <button
                  type="button"
                  onClick={handleProtectedWhatsApp}
                  disabled={!authChecked || actionLoading || selectedVariant?.stock === "out_of_stock"}
                  className="rounded-xl bg-green-500 py-4 text-center font-bold text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {!authChecked
                    ? "Checking..."
                    : actionLoading
                    ? "Opening WhatsApp..."
                    : "Order / Inquire on WhatsApp"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PhoneForwarded } from "lucide-react";

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

type ProductCardProps = {
  product: Product;
  onInquiry: (
    product: Product & { selectedVariant?: ProductVariant | null }
  ) => void;
  isLoading?: boolean;
};

type AuthUser = {
  id?: string;
  name?: string;
  phone?: string;
  address?: string;
};

const FALLBACK_IMAGE = "/placeholder.png";

function getSafeImageSrc(src?: string) {
  const value = src?.trim();
  return value ? value : FALLBACK_IMAGE;
}

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

export default function ProductCard({
  product,
  onInquiry,
  isLoading = false,
}: ProductCardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const defaultVariant = useMemo(() => getDefaultVariant(product), [product]);
  const displayVariants = useMemo(() => getDisplayVariants(product), [product]);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    defaultVariant
  );
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setSelectedVariant(defaultVariant);
  }, [defaultVariant, product._id]);

  useEffect(() => {
    let ignore = false;

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
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
      } catch {
        if (!ignore) {
          setUser(null);
          setAuthChecked(true);
        }
      }
    };

    checkAuth();

    return () => {
      ignore = true;
    };
  }, []);

  const discount = getDiscount(selectedVariant?.mrp, selectedVariant?.price);

  const displayText =
    product.usage ||
    product.description ||
    "Product details available on view page.";

  const handleProtectedInquiry = () => {
    if (!authChecked) return;

    if (!user) {
      const redirect = encodeURIComponent(pathname || `/products/${product._id}`);
      router.push(`/login?redirect=${redirect}`);
      return;
    }

    onInquiry({
      ...product,
      selectedVariant,
    });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gray-50 sm:h-60">
        <Image
          src={getSafeImageSrc(product.image)}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-4 transition-transform duration-300 hover:scale-105"
        />

        {product.brand ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-green-800 shadow-md">
            {product.brand}
          </span>
        ) : null}

        {discount > 0 ? (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
            {discount}% OFF
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold sm:text-xl">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.category}</p>
        </div>

        {displayVariants.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Available Sizes
            </p>

            <div className="flex flex-wrap gap-2">
              {displayVariants.map((variant, index) => {
                const isActive = selectedVariant?.label === variant.label;

                return (
                  <button
                    key={`${variant.label}-${index}`}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      isActive
                        ? "border-green-600 bg-green-600 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-green-500 hover:text-green-700"
                    }`}
                  >
                    {variant.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-xl font-extrabold text-green-600 sm:text-2xl">
            {typeof selectedVariant?.price === "number"
              ? `₹ ${selectedVariant.price.toLocaleString("en-IN")}`
              : "Contact"}
          </span>

          {typeof selectedVariant?.mrp === "number" &&
          selectedVariant.mrp > (selectedVariant.price ?? 0) ? (
            <span className="text-base text-gray-400 line-through sm:text-lg">
              ₹ {selectedVariant.mrp.toLocaleString("en-IN")}
            </span>
          ) : null}
        </div>

        {selectedVariant?.stock === "low_stock" ? (
          <p className="text-xs font-semibold text-amber-600">Limited stock</p>
        ) : null}

        {selectedVariant?.stock === "out_of_stock" ? (
          <p className="text-xs font-semibold text-red-600">Out of stock</p>
        ) : null}

        <p className="line-clamp-2 text-sm leading-6 text-gray-600">
          {displayText}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-2">
          <Link
            href={`/products/${product._id}`}
            className="rounded-lg border border-border py-2.5 text-center text-sm font-medium transition hover:bg-gray-50 sm:text-base"
          >
            View Details
          </Link>

          <button
            type="button"
            onClick={handleProtectedInquiry}
            disabled={
              isLoading ||
              !authChecked ||
              selectedVariant?.stock === "out_of_stock"
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-green-500 py-3 text-sm font-bold text-white shadow-md transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
          >
            <PhoneForwarded size={16} />
            {!authChecked
              ? "Checking..."
              : isLoading
              ? "Opening WhatsApp..."
              : "WhatsApp Inquiry"}
          </button>
        </div>
      </div>
    </div>
  );
}
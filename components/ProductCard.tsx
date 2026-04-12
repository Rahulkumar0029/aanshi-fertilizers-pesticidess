"use client";

import Image from "next/image";
import Link from "next/link";
import { PhoneForwarded } from "lucide-react";

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

type ProductCardProps = {
  product: Product;
  onInquiry: (product: Product) => void;
  isLoading?: boolean;
};

const FALLBACK_IMAGE = "/placeholder.png";

function getSafeImageSrc(src?: string) {
  const value = src?.trim();
  return value ? value : FALLBACK_IMAGE;
}

export default function ProductCard({
  product,
  onInquiry,
  isLoading = false,
}: ProductCardProps) {
  const getDiscount = (mrp?: number, price?: number) => {
    if (!mrp || !price || mrp <= 0) return 0;
    return Math.floor(((mrp - price) / mrp) * 100);
  };

  const discount = getDiscount(product.mrp, product.price);

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

        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
            {discount}% OFF
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold sm:text-xl">{product.name}</h3>
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

        <div className="mt-auto flex flex-col gap-2 pt-2">
          <Link
            href={`/products/${product._id}`}
            className="rounded-lg border border-border py-2.5 text-center text-sm font-medium transition hover:bg-gray-50 sm:text-base"
          >
            View Details
          </Link>

          <button
            type="button"
            onClick={() => onInquiry(product)}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-lg bg-green-500 py-3 text-sm font-bold text-white shadow-md transition hover:bg-green-600 disabled:opacity-70 sm:text-base"
          >
            <PhoneForwarded size={16} />
            {isLoading ? "Opening WhatsApp..." : "WhatsApp Inquiry"}
          </button>
        </div>
      </div>
    </div>
  );
}
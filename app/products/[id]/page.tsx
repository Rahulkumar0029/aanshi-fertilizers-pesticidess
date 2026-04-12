import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { BUSINESS_DETAILS } from "@/lib/constants";
import { buildProductInquiryMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

async function getProduct(id: string) {
  try {
    const headerStore = headers();
    const host = headerStore.get("x-forwarded-host") || headerStore.get("host");
    const protocol = headerStore.get("x-forwarded-proto") || "https";

    if (!host) {
      return null;
    }

    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("API failed:", err);
    return null;
  }
}

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) return notFound();

  const getDiscount = (mrp?: number, price?: number) => {
    if (!mrp || !price || mrp <= 0) return 0;
    return Math.floor(((mrp - price) / mrp) * 100);
  };

  const discount = getDiscount(product.mrp, product.price);

  const whatsappMessage = buildProductInquiryMessage({
    productName: product.name,
    category: product.category,
    size: product.size,
    price: product.price,
    mrp: product.mrp,
    description: product.description,
  });

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
              <div className="relative h-72 overflow-hidden rounded-xl bg-gray-100 sm:h-80 lg:min-h-[460px]">
                <Image
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />

                {discount > 0 && (
                  <span className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow sm:text-sm">
                    {discount}% OFF
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-5">
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                    {product.name}
                  </h1>

                  <p className="text-sm text-gray-500 sm:text-base">
                    Category: {product.category}
                  </p>
                </div>

                {product.size && (
                  <div>
                    <h3 className="mb-2 text-base font-semibold sm:text-lg">
                      Available Size
                    </h3>
                    <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
                      {product.size}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="text-2xl font-bold text-primary sm:text-3xl">
                    {typeof product.price === "number"
                      ? `₹ ${product.price}`
                      : "Contact for Price"}
                  </span>

                  {typeof product.mrp === "number" && (
                    <span className="text-lg text-gray-400 line-through sm:text-xl">
                      ₹ {product.mrp}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="mb-2 text-base font-semibold sm:text-lg">
                    Description
                  </h3>
                  <p className="text-sm leading-7 text-gray-600 sm:text-base">
                    {product.description?.trim() ||
                      "High-quality agricultural product suitable for better crop yield."}
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-base font-semibold sm:text-lg">
                    Usage
                  </h3>
                  <p className="text-sm leading-7 text-gray-600 sm:text-base">
                    {product.usage?.trim() ||
                      "Use as per agricultural guidelines."}
                  </p>
                </div>

                <div className="rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-gray-700 sm:p-5">
                  <p className="font-semibold text-primary">
                    Need quick help before ordering?
                  </p>
                  <p className="mt-2 leading-6">
                    Message us on WhatsApp and our team will guide you with
                    price, availability, usage, and purchase details.
                  </p>
                  <p className="mt-3 break-words">
                    WhatsApp: +91 {BUSINESS_DETAILS.phone}
                  </p>
                  <p className="break-all">Email: {BUSINESS_DETAILS.email}</p>
                </div>

                <a
                  href={buildWhatsAppUrl(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 rounded-xl bg-green-500 px-4 py-4 text-center text-base font-bold text-white transition hover:bg-green-600 sm:text-lg"
                >
                  Order / Inquire on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
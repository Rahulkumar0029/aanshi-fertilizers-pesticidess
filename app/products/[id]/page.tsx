import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BUSINESS_DETAILS } from "@/lib/constants";

// 🔹 Fetch product by ID
async function getProduct(id: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`,
            {
                cache: "no-store",
            }
        );

        if (!res.ok) return null;

        return await res.json();
    } catch (err) {
        console.error("API failed:", err);
        return null;
    }
}

// 🔹 Product Details Page
export default async function ProductDetails({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const product = await getProduct(id);

    if (!product) return notFound();

    const getDiscount = (mrp?: number, price?: number) => {
        if (!mrp || !price) return 0;
        return Math.floor(((mrp - price) / mrp) * 100);
    };

    const discount = getDiscount(product.mrp, product.price);

    const whatsappMessage = `Hello, I am interested in ${product.name} (${product.category}${
        product.size ? `, Size: ${product.size}` : ""
    }). Please share details.`;

    return (
        <div className="min-h-screen bg-[#f8faf8] px-4 py-12">
            <div className="container mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-lg">
                <Link
                    href="/products"
                    className="mb-6 inline-block font-semibold text-primary hover:underline"
                >
                    ← Back to Products
                </Link>

                <div className="grid gap-10 md:grid-cols-2">
                    <div className="relative h-80 overflow-hidden rounded-xl md:h-full">
                        <Image
                            src={product.image || "/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />

                        {discount > 0 && (
                            <span className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white shadow">
                                {discount}% OFF
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-5">
                        <h1 className="text-3xl font-bold">
                            {product.name}
                        </h1>

                        <p className="text-sm text-gray-500">
                            Category: {product.category}
                        </p>

                        {product.size && (
                            <div>
                                <h3 className="mb-1 text-lg font-semibold">
                                    Available Size
                                </h3>
                                <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
                                    {product.size}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-primary">
                                {typeof product.price === "number"
                                    ? `₹ ${product.price}`
                                    : "Contact for Price"}
                            </span>

                            {typeof product.mrp === "number" && (
                                <span className="text-lg text-gray-400 line-through">
                                    ₹ {product.mrp}
                                </span>
                            )}
                        </div>

                        <div>
                            <h3 className="mb-1 text-lg font-semibold">
                                Description
                            </h3>
                            <p className="text-gray-600">
                                {product.description?.trim() ||
                                    "High-quality agricultural product suitable for better crop yield."}
                            </p>
                        </div>

                        <div>
                            <h3 className="mb-1 text-lg font-semibold">
                                Usage
                            </h3>
                            <p className="text-gray-600">
                                {product.usage?.trim() ||
                                    "Use as per agricultural guidelines."}
                            </p>
                        </div>

                        <a
                            href={`https://wa.me/${BUSINESS_DETAILS.whatsapp}?text=${encodeURIComponent(
                                whatsappMessage
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 rounded-xl bg-green-500 py-4 text-center text-lg font-bold text-white transition hover:bg-green-600"
                        >
                            Order on WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
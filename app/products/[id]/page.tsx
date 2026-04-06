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

    // ✅ DISCOUNT CALCULATION (NO DECIMALS)
    const getDiscount = (mrp?: number, price?: number) => {
        if (!mrp || !price) return 0;
        return Math.floor(((mrp - price) / mrp) * 100);
    };

    const discount = getDiscount(product.mrp, product.price);

    return (
        <div className="bg-[#f8faf8] min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-5xl bg-white rounded-2xl shadow-lg p-8">

                {/* 🔙 BACK */}
                <Link
                    href="/products"
                    className="text-primary font-semibold mb-6 inline-block hover:underline"
                >
                    ← Back to Products
                </Link>

                <div className="grid md:grid-cols-2 gap-10">

                    {/* 🖼 IMAGE */}
                    <div className="relative h-80 md:h-full rounded-xl overflow-hidden">

                        <Image
                            src={product.image || "/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />

                        {/* 🔥 DISCOUNT BADGE */}
                        {discount > 0 && (
                            <span className="absolute top-3 right-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow">
                                {discount}% OFF
                            </span>
                        )}
                    </div>

                    {/* 📦 CONTENT */}
                    <div className="flex flex-col gap-5">

                        <h1 className="text-3xl font-bold">
                            {product.name}
                        </h1>

                        <p className="text-sm text-gray-500">
                            Category: {product.category}
                        </p>

                        {/* 💰 PRICE SECTION */}
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-primary">
                                ₹ {product.price || "Contact"}
                            </span>

                            {product.mrp && (
                                <span className="text-gray-400 line-through text-lg">
                                    ₹ {product.mrp}
                                </span>
                            )}
                        </div>

                        {/* 📄 DESCRIPTION */}
                        <div>
                            <h3 className="font-semibold text-lg mb-1">
                                Description
                            </h3>
                            <p className="text-gray-600">
                                {product.description ||
                                    "High-quality agricultural product suitable for better crop yield."}
                            </p>
                        </div>

                        {/* 📘 USAGE */}
                        <div>
                            <h3 className="font-semibold text-lg mb-1">
                                Usage
                            </h3>
                            <p className="text-gray-600">
                                {product.usage ||
                                    "Use as per agricultural guidelines."}
                            </p>
                        </div>

                        {/* 📦 SIZE */}
                        {product.size && (
                            <div>
                                <h3 className="font-semibold text-lg mb-1">
                                    Available Sizes
                                </h3>
                                <p className="text-gray-600">
                                    {product.size}
                                </p>
                            </div>
                        )}

                        {/* 📲 WHATSAPP */}
                        <a
                            href={`https://wa.me/${BUSINESS_DETAILS.whatsapp}?text=Hello, I am interested in ${product.name} (${product.category}). Please share details.`}
                            target="_blank"
                            className="mt-6 bg-green-500 text-white py-4 rounded-xl text-center font-bold text-lg hover:bg-green-600 transition"
                        >
                            Order on WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
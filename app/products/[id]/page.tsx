import Image from "next/image";
import Link from "next/link";

// 🔹 Fetch product by ID
async function getProduct(id: string) {
    const res = await fetch("http://localhost:3000/api/products", {
        cache: "no-store",
    });

    const products = await res.json();

    return products.find((p: any) => String(p.id) === String(id));
}

// 🔹 Product Details Page
export default async function ProductDetails({ params }: any) {

    // ✅ FIX: handle params correctly
    const { id } = await params;

    const product = await getProduct(id);

    // ❌ If product not found
    if (!product) {
        return (
            <div className="text-center py-20 text-gray-500 text-xl">
                Product not found
            </div>
        );
    }

    return (
        <div className="bg-[#f8faf8] min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-5xl bg-white rounded-2xl shadow-lg p-8">

                {/* 🔙 Back Button */}
                <Link
                    href="/products"
                    className="text-primary font-semibold mb-6 inline-block hover:underline"
                >
                    ← Back to Products
                </Link>

                <div className="grid md:grid-cols-2 gap-10">

                    {/* 🖼 Image */}
                    <div className="relative h-80 md:h-full rounded-xl overflow-hidden">
                        <Image
                            src={product.image || "/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* 📦 Content */}
                    <div className="flex flex-col gap-5">

                        <h1 className="text-3xl font-bold text-foreground">
                            {product.name}
                        </h1>

                        <p className="text-sm text-gray-500">
                            Category: {product.category}
                        </p>

                        {/* 💰 Price */}
                        <p className="text-2xl font-bold text-primary">
                            ₹ {product.price || "Contact for price"}
                        </p>

                        {/* 📄 Description */}
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Description</h3>
                            <p className="text-gray-600">
                                {product.description ||
                                    "High-quality agricultural product suitable for better crop yield."}
                            </p>
                        </div>

                        {/* 🌾 Usage */}
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Usage</h3>
                            <p className="text-gray-600">
                                {product.usage || "Use as per agricultural guidelines."}
                            </p>
                        </div>

                        {/* 📦 Size */}
                        {product.size && (
                            <div>
                                <h3 className="font-semibold text-lg mb-1">
                                    Available Sizes
                                </h3>
                                <p className="text-gray-600">{product.size}</p>
                            </div>
                        )}

                        {/* 📲 WhatsApp Button */}
                        <a
                            href={`https://wa.me/91XXXXXXXXXX?text=Hello, I am interested in ${product.name}. Please share details.`}
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
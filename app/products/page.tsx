"use client";

export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, PhoneForwarded } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

const CATEGORIES = [
    "All",
    "Fertilizers",
    "Pesticides",
    "Seeds",
    "Plant Growth",
    "Organic",
    "Fungicides",
];

export default function Products() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const searchParams = useSearchParams();
    const router = useRouter();

    // Fetch products
    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch products", err);
                setLoading(false);
            });
    }, []);

    // Sync category from URL
    useEffect(() => {
        if (!searchParams) return;

        const categoryFromURL = searchParams.get("category");

        if (categoryFromURL) {
            setSelectedCategory(categoryFromURL);
        } else {
            setSelectedCategory("All");
        }
    }, [searchParams]);

    // Filter logic
    const filteredProducts = products.filter(
        (p) =>
            (selectedCategory === "All" ||
                p.category?.toLowerCase().trim() ===
                selectedCategory.toLowerCase().trim()) &&
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // WhatsApp Inquiry
    const handleInquiry = async (product: any) => {
        try {
            await fetch("/api/inquiries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId: product.id,
                    productName: product.name,
                    productCategory: product.category,
                }),
            });
        } catch (error) {
            console.error("Inquiry logging failed", error);
        }

        window.open(
            `https://wa.me/91XXXXXXXXXX?text=Hello, I am interested in ${product.name} (${product.category}). Please share details.`,
            "_blank"
        );
    };

    return (
        <div className="pt-10 bg-[#f8faf8] min-h-screen">
            {/* Header */}
            <section className="bg-primary text-white py-16 px-4">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Our Product Catalog
                    </h1>
                    <p className="text-xl opacity-90">
                        High-quality agricultural inputs for every farming need.
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="container mx-auto px-4 -mt-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col lg:flex-row gap-6 items-center">
                    {/* Search */}
                    <div className="relative w-full lg:w-1/3">
                        <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Category Buttons */}
                    <div className="flex flex-wrap justify-center gap-3 w-full lg:w-2/3">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    router.push(`/products?category=${cat}`);
                                }}
                                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === cat
                                    ? "bg-primary text-white shadow-md"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products */}
            <section className="container mx-auto px-4 py-20">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-gray-500 italic">Loading products...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition flex flex-col"
                                >
                                    {/* Image */}
                                    <div className="relative h-60">
                                        <Image
                                            src={product.image || "/placeholder.png"}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col gap-3 flex-grow">
                                        <h3 className="text-xl font-bold">{product.name}</h3>

                                        <p className="text-sm text-gray-500">
                                            {product.category}
                                        </p>

                                        {/* Price */}
                                        <p className="text-lg font-bold text-primary">
                                            ₹ {product.price || "Contact for price"}
                                        </p>

                                        <p className="text-sm text-gray-600">
                                            {product.usage}
                                        </p>

                                        {/* Buttons */}
                                        <div className="mt-auto flex flex-col gap-3 pt-4">
                                            {/* View Details */}
                                            <Link
                                                href={`/products/${product.id}`}
                                                className="border border-primary text-primary py-2 rounded-lg text-center font-semibold hover:bg-primary hover:text-white transition"
                                            >
                                                View Details
                                            </Link>

                                            {/* WhatsApp */}
                                            <button
                                                onClick={() => handleInquiry(product)}
                                                className="bg-green-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-bold hover:bg-green-600 transition"
                                            >
                                                <PhoneForwarded size={18} />
                                                WhatsApp Order
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty State */}
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-20 text-gray-400">
                                No products found.
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}
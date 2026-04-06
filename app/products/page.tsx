"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, PhoneForwarded } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { BUSINESS_DETAILS } from "@/lib/constants";

type Product = {
    _id: string;
    name: string;
    category: string;
    price?: number;
    mrp?: number;
    usage?: string;
    image?: string;
};

type AuthUser = {
    _id?: string;
    id?: string;
    name: string;
    email?: string;
    phone: string;
    role: string;
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

function ProductsContent() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const searchParams = useSearchParams();
    const router = useRouter();

    // ✅ FETCH PRODUCTS
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
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

    // ✅ CATEGORY SYNC
    useEffect(() => {
        const categoryFromURL = searchParams.get("category");
        setSelectedCategory(categoryFromURL || "All");
    }, [searchParams]);

    // ✅ FILTER
    const filteredProducts = products.filter((p) => {
        const matchCategory =
            selectedCategory === "All" ||
            p.category?.toLowerCase().trim() ===
                selectedCategory.toLowerCase().trim();

        const matchSearch = p.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());

        return matchCategory && matchSearch;
    });

    // ✅ DISCOUNT CALCULATOR
    const getDiscount = (mrp?: number, price?: number) => {
        if (!mrp || !price) return 0;
        return Math.floor(((mrp - price) / mrp) * 100);
    };

    // ✅ PROTECTED WHATSAPP / INQUIRY / ORDER FLOW
    const handleInquiry = async (product: Product) => {
        try {
            const authRes = await fetch("/api/auth/me", {
                method: "GET",
                credentials: "include",
            });

            if (!authRes.ok) {
                router.push(`/login?redirect=/products`);
                return;
            }

            const user: AuthUser = await authRes.json();
            const userId = user.id || user._id;

            if (!userId || !user.name || !user.phone) {
                alert("Your account details are incomplete. Please login again.");
                router.push("/login?redirect=/products");
                return;
            }

            // ✅ SAVE INQUIRY
            const inquiryRes = await fetch("/api/inquiries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    userId,
                    userName: user.name,
                    phone: user.phone,
                    productId: product._id,
                    productName: product.name,
                    productCategory: product.category,
                    status: "pending",
                }),
            });

            if (!inquiryRes.ok) {
                const inquiryError = await inquiryRes.json().catch(() => null);
                console.error("Inquiry save failed:", inquiryError);
            }

            // ✅ SAVE ORDER LEAD
            const orderRes = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    userId,
                    productId: product._id,
                    productName: product.name,
                    productCategory: product.category,
                    customerName: user.name,
                    phone: user.phone,
                    status: "Pending",
                    source: "WhatsApp",
                }),
            });

            if (!orderRes.ok) {
                const orderError = await orderRes.json().catch(() => null);
                console.error("Order save failed:", orderError);
            }

            const message = `Hello, I am ${user.name} and I am interested in ${product.name} (${product.category}). My phone number is ${user.phone}. Please share details.`;

            window.open(
                `https://wa.me/${BUSINESS_DETAILS.whatsapp}?text=${encodeURIComponent(message)}`,
                "_blank"
            );
        } catch (error) {
            console.error("Failed to handle inquiry/order:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="pt-10 bg-[#f8faf8] min-h-screen">
            {/* HEADER */}
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

            {/* FILTER */}
            <section className="container mx-auto px-4 -mt-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col lg:flex-row gap-6 items-center">
                    {/* SEARCH */}
                    <div className="relative w-full lg:w-1/3">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border"
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setSearchQuery(e.target.value)
                            }
                        />
                    </div>

                    {/* CATEGORY */}
                    <div className="flex flex-wrap gap-3 w-full lg:w-2/3 justify-center">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    router.push(`/products?category=${cat}`);
                                }}
                                className={`px-5 py-2 rounded-full ${
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
            </section>

            {/* PRODUCTS */}
            <section className="container mx-auto px-4 py-20">
                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {filteredProducts.map((product) => {
                                const discount = getDiscount(product.mrp, product.price);

                                return (
                                    <div
                                        key={product._id}
                                        className="bg-white rounded-2xl shadow overflow-hidden"
                                    >
                                        {/* IMAGE */}
                                        <div className="relative h-60">
                                            <Image
                                                src={product.image || "/placeholder.png"}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />

                                            {/* DISCOUNT BADGE */}
                                            {discount > 0 && (
                                                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                                    {discount}% OFF
                                                </span>
                                            )}
                                        </div>

                                        {/* CONTENT */}
                                        <div className="p-6 flex flex-col gap-2">
                                            <h3 className="font-bold text-lg">
                                                {product.name}
                                            </h3>

                                            <p className="text-sm text-gray-500">
                                                {product.category}
                                            </p>

                                            {/* PRICE */}
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-extrabold text-green-600">
                                                    ₹ {product.price || "Contact"}
                                                </span>

                                                {product.mrp && (
                                                    <span className="text-gray-400 line-through text-lg">
                                                        ₹ {product.mrp}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-sm text-gray-600">
                                                {product.usage}
                                            </p>

                                            {/* BUTTONS */}
                                            <div className="mt-3 flex flex-col gap-2">
                                                <Link
                                                    href={`/products/${product._id}`}
                                                    className="border text-center py-2 rounded"
                                                >
                                                    View Details
                                                </Link>

                                                <button
                                                    onClick={() => handleInquiry(product)}
                                                    className="bg-green-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-bold hover:bg-green-600 transition shadow-md"
                                                >
                                                    <PhoneForwarded size={16} />
                                                    WhatsApp
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {filteredProducts.length === 0 && (
                            <p className="text-center text-gray-400 mt-10">
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
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, PhoneForwarded } from "lucide-react";


const CATEGORIES = ["All", "Fertilizers", "Pesticides", "Seeds", "Plant Growth", "Organic", "Fungicides"];

export default function Products() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetch("/api/products")
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch products", err);
                setLoading(false);
            });
    }, []);

    const filteredProducts = products.filter(p =>
        (selectedCategory === "All" || p.category === selectedCategory) &&
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleInquiry = async (product: any) => {
        try {
            await fetch("/api/inquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: product.id,
                    productName: product.name,
                    productCategory: product.category
                })
            });
        } catch (error) {
            console.error("Inquiry logging failed", error);
        }
        // Redirect to WhatsApp
        window.open(`https://wa.me/91XXXXXXXXXX?text=I am interested in ${product.name}`, "_blank");
    };

    return (
        <div className="pt-10 bg-[#f8faf8] min-h-screen">
            {/* Header */}
            <section className="bg-primary text-white py-16 px-4">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Product Catalog</h1>
                    <p className="text-xl opacity-90">High-quality agricultural inputs for every farming need.</p>
                </div>
            </section>

            {/* Filters & Search */}
            <section className="container mx-auto px-4 -mt-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col lg:flex-row gap-6 items-center border border-border">
                    <div className="relative w-full lg:w-1/3">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 w-full lg:w-2/3">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === cat
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "bg-muted text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Grid */}
            <section className="container mx-auto px-4 py-20">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-gray-500 font-medium italic">Loading products...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="bg-white rounded-[2rem] overflow-hidden border border-border shadow-sm hover:shadow-2xl transition-all group flex flex-col">
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary border border-primary/20">
                                            {product.category}
                                        </div>
                                    </div>

                                    <div className="p-8 flex-grow space-y-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-2xl font-bold text-foreground leading-snug">{product.name}</h3>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <div className="text-sm">
                                                <span className="text-gray-400 font-medium block">Usage & Crops:</span>
                                                <span className="text-gray-700 font-bold">{product.usage}</span>
                                            </div>
                                            <div className="text-sm">
                                                <span className="text-gray-400 font-medium block">Available Sizes:</span>
                                                <span className="text-gray-700 font-bold">{product.size}</span>
                                            </div>
                                        </div>

                                        <div className="pt-6 mt-auto">
                                            <button
                                                onClick={() => handleInquiry(product)}
                                                className="w-full bg-accent text-primary py-4 rounded-xl flex items-center justify-center gap-3 font-bold hover:bg-primary hover:text-white transition-all group/btn"
                                            >
                                                <PhoneForwarded size={18} /> Order via WhatsApp
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-20">
                                <h3 className="text-2xl text-gray-400 italic">No products found matching your search.</h3>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Disclaimer */}
            <section className="bg-white py-12 border-t border-border">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm max-w-3xl">
                    <p>Note: Product images are for representation purposes only. Available brands and packaging may vary. All products are government certified and compliant with agricultural regulations.</p>
                </div>
            </section>
        </div>
    );
}

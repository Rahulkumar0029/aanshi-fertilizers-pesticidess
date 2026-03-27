"use client";
import { Handshake, Package, Globe, Truck, FileCheck, Phone } from "lucide-react";

export default function Wholesale() {
    return (
        <div className="pt-10">
            {/* Hero */}
            <section className="bg-primary text-white py-24 px-4 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />

                <div className="container mx-auto max-w-4xl text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Bulk Fertilizers & Pesticides Supply
                    </h1>

                    <p className="text-xl md:text-2xl opacity-90 leading-relaxed font-medium">
                        Get the best wholesale prices directly from a trusted supplier with 15+ years of experience.
                    </p>

                    <p className="mt-4 text-green-300 font-semibold">
                        Trusted by farmers & retailers across India
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <a
                            href="https://wa.me/91XXXXXXXXXX?text=Hello, I want wholesale details"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition"
                        >
                            WhatsApp Inquiry
                        </a>
                    </div>
                </div>
            </section>

            {/* Why Partner? */}
            <section className="py-24 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Why Partner With Us?</h2>
                        <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Handshake,
                                title: "Special Pricing",
                                desc: "Enjoy exclusive dealer rates and bulk discounts.",
                                link: "/contact"
                            },
                            {
                                icon: Package,
                                title: "Agricultural Combos",
                                desc: "Curated packages for crops.",
                                link: "/products"
                            },
                            {
                                icon: Globe,
                                title: "PAN India Supply",
                                desc: "We deliver across India.",
                                link: "/contact"
                            },
                            {
                                icon: Truck,
                                title: "Priority Delivery",
                                desc: "Fast logistics support.",
                                link: "/contact"
                            },
                            {
                                icon: FileCheck,
                                title: "License Support",
                                desc: "All legal docs provided.",
                                link: "/contact"
                            },
                            {
                                icon: Phone,
                                title: "Expert Support",
                                desc: "Talk to our experts.",
                                link: "https://wa.me/91XXXXXXXXXX"
                            }
                        ].map((feature, idx) => (
                            <a
                                key={idx}
                                href={feature.link}
                                target={feature.link.startsWith("http") ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                className="p-8 border border-border rounded-3xl hover:border-primary hover:shadow-xl transition-all flex flex-col items-center text-center space-y-4 cursor-pointer" >
                                <div className="bg-accent p-4 rounded-2xl text-primary">
                                    <feature.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Inquiry Form Section */}
            <section className="py-24 px-4 bg-accent/30">
                <div className="container mx-auto max-w-5xl">
                    <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                        {/* Left */}
                        <div className="p-12 md:p-16 bg-primary text-white space-y-8">
                            <h2 className="text-4xl font-bold">Apply for Partnership</h2>
                            <p className="text-lg opacity-90">
                                Fill out the form to register as a dealer. Our team will contact you within 24 hours with a catalog and wholesale pricing.
                            </p>

                            <div className="space-y-6 pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/10 p-3 rounded-full">
                                        <Handshake size={20} />
                                    </div>
                                    <span className="font-bold text-lg">Special Pricing for Shopkeepers</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="bg-white/10 p-3 rounded-full">
                                        <Globe size={20} />
                                    </div>
                                    <span className="font-bold text-lg">Distributor Opportunities</span>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="p-12 md:p-16 space-y-6">
                            <form className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500">Business Name</label>
                                        <input name="businessName" type="text" className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500">Owner Name</label>
                                        <input name="ownerName" type="text" className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500">Phone Number</label>
                                    <input name="phone" type="tel" className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500">Location (City/State)</label>
                                    <input name="location" type="text" className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500">Interested In</label>
                                    <select name="interest" className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all appearance-none cursor-pointer">
                                        <option>Retail Stock</option>
                                        <option>Distributorship</option>
                                        <option>Bulk Order Package</option>
                                        <option>Wholesale Pricing</option>
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        window.open(
                                            "https://wa.me/91XXXXXXXXXX?text=Hello, I want wholesale partnership.",
                                            "_blank"
                                        )
                                    }
                                    className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl active:scale-95 transition-all mt-4"
                                >
                                    Request on WhatsApp
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
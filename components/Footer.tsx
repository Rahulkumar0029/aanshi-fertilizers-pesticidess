import Link from "next/link";
import { Phone, Mail, MapPin, Leaf, Facebook, Instagram, Twitter } from "lucide-react";
import { BUSINESS_DETAILS } from "@/lib/constants";

export default function Footer() {
    return (
        <footer className="bg-[#1a2e1a] text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Leaf className="text-[#a8e6cf] w-10 h-10" />
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold tracking-tight">AANSHI</span>
                                <span className="text-[10px] text-gray-300 font-medium tracking-[0.2em] uppercase">
                                    Fertilizers & Pesticides
                                </span>
                            </div>
                        </Link>

                        <p className="text-gray-400 leading-relaxed">
                            15+ years of expertise in providing high-quality agricultural solutions. Trusted by farmers across India.
                        </p>

                        {/* Social */}
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-[#a8e6cf] transition-colors"><Facebook size={20} /></Link>
                            <Link href="#" className="hover:text-[#a8e6cf] transition-colors"><Instagram size={20} /></Link>
                            <Link href="#" className="hover:text-[#a8e6cf] transition-colors"><Twitter size={20} /></Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-[#a8e6cf]">Quick Links</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                            <li><Link href="/products" className="hover:text-white">Our Products</Link></li>
                            <li><Link href="/wholesale" className="hover:text-white">Wholesale Inquiry</Link></li>
                            <li><Link href="/support" className="hover:text-white">Farmer Support</Link></li>
                            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Categories (NOW WORKING FILTERS) */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-[#a8e6cf]">Categories</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link href="/products?category=Fertilizers" className="hover:text-white">Fertilizers</Link></li>
                            <li><Link href="/products?category=Pesticides" className="hover:text-white">Pesticides</Link></li>
                            <li><Link href="/products?category=Seeds" className="hover:text-white">Quality Seeds</Link></li>
                            <li><Link href="/products?category=Organic" className="hover:text-white">Organic Products</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-[#a8e6cf]">Visit Us</h4>
                        <ul className="space-y-4 text-gray-400">

                            <li className="flex items-start gap-3">
                                <MapPin className="text-[#a8e6cf] mt-1" size={18} />
                                <span>{BUSINESS_DETAILS.address}</span>
                            </li>

                            {/* CLICK TO CALL */}
                            <li className="flex items-center gap-3">
                                <Phone className="text-[#a8e6cf]" size={18} />
                                <a href={`tel:${BUSINESS_DETAILS.phone}`} className="hover:text-white">
                                    {BUSINESS_DETAILS.phone}
                                </a>
                            </li>

                            {/* EMAIL */}
                            <li className="flex items-center gap-3">
                                <Mail className="text-[#a8e6cf]" size={18} />
                                <a href={`mailto:${BUSINESS_DETAILS.email}`} className="hover:text-white">
                                    {BUSINESS_DETAILS.email}
                                </a>
                            </li>

                            {/* WHATSAPP BUTTON (VERY IMPORTANT) */}
                            <li className="pt-2">
                                <a
                                    href={`https://wa.me/${BUSINESS_DETAILS.whatsapp}?text=Hello, I want to inquire about your products.`}
                                    target="_blank"
                                    className="block text-center bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition-all"
                                >
                                    Chat on WhatsApp
                                </a>
                            </li>

                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
                    <p>
                        © {new Date().getFullYear()} Aanshi Fertilizers & Pesticides. All rights reserved.
                        <br />
                        Government Approved • Trusted by Farmers 🌱
                    </p>
                </div>
            </div>
        </footer>
    );
}
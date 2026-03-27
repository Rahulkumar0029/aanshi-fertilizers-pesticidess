import Image from "next/image";
import { Award, Target, Eye, Users } from "lucide-react";

export default function About() {
    return (
        <div className="pt-10">

            {/* Header */}
            <section className="bg-accent/30 py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-5xl font-bold text-primary mb-6">About Us</h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Trusted agricultural supplier helping farmers grow with quality products and expert guidance.
                    </p>
                </div>
            </section>

            {/* Main Section */}
            <section className="py-24 px-4 overflow-hidden">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Image */}
                        <div className="relative">
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full z-0" />

                            <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1594776208131-aa10aecee030?auto=format&fit=crop&w=1000&q=80"
                                    alt="Aanshi Fertilizers"
                                    width={800}
                                    height={1000}
                                    className="object-cover"
                                />
                            </div>

                            <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-3xl shadow-xl z-20 border border-border">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center text-white">
                                        <Award size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xl">15+ Years</h4>
                                        <p className="text-sm text-gray-500">Experience</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-8">
                            <div className="inline-block bg-accent px-4 py-2 rounded-lg text-primary font-bold text-sm uppercase">
                                About Aanshi Fertilizers
                            </div>

                            <h2 className="text-4xl font-bold leading-snug">
                                Supporting Farmers with Quality & Trust
                            </h2>

                            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">

                                <p>
                                    Founded by <strong>Anil Kumar Bishnoi</strong>, Aanshi Fertilizers and Pesticides is a trusted agricultural supplier based in Rajasthan, providing fertilizers, pesticides, and seeds to farmers and retailers.
                                </p>

                                <p>
                                    Located at <strong>30 PS A, Plot No. 123, Bishanpura, Sri Ganganagar, Rajasthan</strong>, we have built a strong reputation through genuine products, expert advice, and reliable service.
                                </p>

                                <p>
                                    With over <strong>15+ years of experience</strong>, we help farmers increase productivity and improve crop quality using scientifically backed solutions.
                                </p>
                            </div>

                            {/* Trust Info */}
                            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-2 text-gray-700">
                                <p><strong>GST Number:</strong> 08CGJPK3822P1ZV</p>
                                <p><strong>Business Type:</strong> Trader - Retailer</p>
                                <p><strong>Legal Status:</strong> Proprietorship</p>
                                <p><strong>Annual Turnover:</strong> ₹40 Lakh – ₹1.5 Crore</p>
                            </div>

                            {/* External Links */}
                            <div className="flex flex-wrap gap-4 pt-4">
                                <a
                                    href="https://www.indiamart.com/aanshi-fertilizers-and-pesticides/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                                >
                                    View on IndiaMART
                                </a>

                                <a
                                    href="https://www.facebook.com/profile.php?id=100092580835985"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-800 transition"
                                >
                                    Visit Facebook Page
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* Mission / Vision */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                        {/* Mission */}
                        <div className="bg-accent/20 p-10 rounded-[2.5rem] border border-accent/30 space-y-6">
                            <div className="bg-primary w-14 h-14 rounded-2xl flex items-center justify-center text-white">
                                <Target size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-primary">Our Mission</h3>
                            <p className="text-gray-600 leading-relaxed">
                                To empower farmers by providing genuine, high-quality, and government-approved agricultural products.
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm space-y-6">
                            <div className="bg-secondary w-14 h-14 rounded-2xl flex items-center justify-center text-white">
                                <Eye size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-secondary">Our Vision</h3>
                            <p className="text-gray-600 leading-relaxed">
                                To become India's most trusted agricultural supplier with strong farmer relationships and nationwide reach.
                            </p>
                        </div>

                        {/* Commitment */}
                        <div className="bg-accent/20 p-10 rounded-[2.5rem] border border-accent/30 space-y-6">
                            <div className="bg-primary w-14 h-14 rounded-2xl flex items-center justify-center text-white">
                                <Users size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-primary">Commitment</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We don’t just sell products—we guide farmers from sowing to harvest for better results.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
}
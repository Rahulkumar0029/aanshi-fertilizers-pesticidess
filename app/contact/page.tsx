import { Phone, Mail, MapPin, Clock, MessageSquare, Send } from "lucide-react";

export default function Contact() {
    return (
        <div className="pt-10 bg-[#fdfdfb]">

            {/* Header */}
            <section className="bg-accent/40 py-24 px-4 text-center">
                <h1 className="text-5xl font-bold text-primary mb-4">Contact Us</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
                    Have a question or looking for a bulk order? We&apos;re here to help you grow.
                </p>
            </section>

            {/* Main Grid */}
            <section className="container mx-auto px-4 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* LEFT SIDE */}
                    <div className="lg:col-span-5 space-y-12">

                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold">Visit Our Store</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Experience expert guidance in person. Our shop is fully stocked with the latest agricultural solutions.
                            </p>
                        </div>

                        <div className="space-y-6">

                            {/* Address */}
                            <div className="flex items-start gap-6 border-b border-border pb-6">
                                <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl">Physical Address</h4>
                                    <p className="text-lg text-gray-700 mt-1">
                                        30 Ps-A, Raisinghnagar, Sri Ganganagar, Rajasthan 335021
                                    </p>

                                    {/* Map Button */}
                                    <a
                                        href="#map"
                                        className="inline-block mt-2 text-primary font-semibold underline" >
                                        View Store Location
                                    </a>

                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-6 border-b border-border pb-6">
                                <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl">Phone Support</h4>
                                    <p className="text-lg text-gray-700 mt-1">+91 XXXXXXXXXX</p>
                                    <p className="text-sm text-gray-400 mt-1 font-medium">Mon-Sat, 9AM-8PM</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-6 border-b border-border pb-6">
                                <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl">Email Inquiry</h4>
                                    <p className="text-lg text-gray-700 mt-1">info@yourdomain.com</p>
                                </div>
                            </div>

                            {/* Timing */}
                            <div className="flex items-start gap-6">
                                <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl">Store Timings</h4>
                                    <p className="text-lg text-gray-700 mt-1">9:00 AM - 8:00 PM</p>
                                    <p className="text-sm text-gray-400 mt-1 font-medium">Sunday: Closed</p>
                                </div>
                            </div>

                        </div>

                        {/* WhatsApp Button */}
                        <div className="pt-8">
                            <a
                                href="https://wa.me/91XXXXXXXXXX"
                                className="w-full bg-[#25D366] text-white p-6 rounded-[2rem] flex items-center justify-center gap-4 text-xl font-bold hover:shadow-2xl transition-all shadow-lg active:scale-95"
                            >
                                <MessageSquare size={28} /> Chat on WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* RIGHT SIDE FORM */}
                    <div className="lg:col-span-7">
                        <div className="bg-white p-12 md:p-16 rounded-[3rem] shadow-2xl border border-border">

                            <h3 className="text-3xl font-bold mb-8">Send a Quick Inquiry</h3>

                            <form className="space-y-6 text-lg">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input
                                        placeholder="Full Name"
                                        className="w-full bg-muted/50 p-4 rounded-2xl border focus:border-primary outline-none"
                                    />
                                    <input
                                        placeholder="Phone Number"
                                        className="w-full bg-muted/50 p-4 rounded-2xl border focus:border-primary outline-none"
                                    />
                                </div>

                                <input
                                    placeholder="Crop/Product Interest"
                                    className="w-full bg-muted/50 p-4 rounded-2xl border focus:border-primary outline-none"
                                />

                                <textarea
                                    rows={5}
                                    placeholder="Your Message"
                                    className="w-full bg-muted/50 p-4 rounded-2xl border focus:border-primary outline-none"
                                />

                                <button className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:shadow-xl transition-all">
                                    <Send size={20} /> Send Inquiry
                                </button>

                                <p className="text-center text-sm text-gray-400">
                                    Your details are safe with us.
                                </p>

                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* REAL GOOGLE MAP */}
            <section id="map" className="py-24 container mx-auto px-4">
                <div className="rounded-[2rem] overflow-hidden border border-border shadow-lg">
                    <iframe
                        src="https://www.google.com/maps?q=29.5203878,73.3603732&z=17&output=embed"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        loading="lazy"
                    ></iframe>
                </div>
            </section>

        </div>
    );
}
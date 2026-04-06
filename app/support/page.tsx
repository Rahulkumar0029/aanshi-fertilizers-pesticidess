import { BookOpen, Calendar, ShieldAlert, BadgeCheck, Lightbulb, Activity } from "lucide-react";

export default function Support() {
    const guides = [
        { title: "Best Fertilizer Usage", desc: "Learn how to optimize nutrient application for different soil types.", icon: Activity },
        { title: "Pest Management", desc: "Identify and control common agricultural pests effectively.", icon: ShieldAlert },
        { title: "Seasonal Farming", desc: "A guide to choosing the right crops for every season in India.", icon: Calendar },
        { title: "Soil Health Tips", desc: "Simple ways to maintain and improve soil fertility over time.", icon: Lightbulb },
    ];

    return (
        <div className="pt-10">
            {/* Header */}
            <section className="bg-accent/40 py-24 px-4 overflow-hidden relative">
                <div className="container mx-auto max-w-4xl text-center space-y-6">
                    <BadgeCheck className="text-primary w-16 h-16 mx-auto" />
                    <h1 className="text-5xl font-bold text-foreground">Farmer Support & Guidance</h1>
                    <p className="text-xl text-gray-600 font-medium">
                        Expert knowledge and seasonal tips to help you achieve the best harvest.
                    </p>
                </div>
            </section>

            {/* Hindi Banner */}
            <section className="bg-primary py-12">
                <div className="container mx-auto px-4 text-center text-white">
                    <h2 className="text-2xl md:text-3xl font-bold">खेती और फसलों से जुड़ी हर समस्या का समाधान</h2>
                    <p className="mt-2 opacity-90">सही खाद, सही बीज, सही परिणाम।</p>
                </div>
            </section>

            {/* Main Guides */}
            <section className="py-24 px-4 container mx-auto lg:px-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {guides.map((guide, idx) => (
                        <div key={idx} className="bg-white p-10 rounded-[2rem] border border-border shadow-sm hover:shadow-xl transition-all flex items-start gap-8 group">
                            <div className="bg-accent p-5 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <guide.icon size={32} />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-bold">{guide.title}</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">{guide.desc}</p>
                                <button className="text-primary font-bold inline-flex items-center gap-2 hover:translate-x-1 transition-transform">
                                    Read Full Guide <BookOpen size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Insight */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-sm border border-border">
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <div className="lg:w-1/2 space-y-8">
                                <div className="inline-block bg-primary/10 px-4 py-2 rounded-lg text-primary font-bold text-sm">
                                    SEASONAL TIP
                                </div>
                                <h2 className="text-4xl font-bold">Optimizing Crop Nutrition</h2>
                                <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                                    <p>
                                        Effective crop nutrition is not just about the amount of fertilizer you use, but the timing and balance of nutrients.
                                    </p>
                                    <p className="font-bold text-foreground">
                                        &quot;Applying the right fertilizer at the early growth stage can increase your final yield by up to 25%.&quot;
                                    </p>
                                    <p>
                                        Always conduct a soil test before starting a new season to identify specific nutrient deficiencies in your field.
                                    </p>
                                </div>
                            </div>
                            <div className="lg:w-1/2 bg-accent/30 p-8 rounded-[2rem] space-y-6">
                                <h4 className="text-xl font-bold text-primary">Need Expert Advice?</h4>
                                <p className="text-gray-700 font-medium">Talk directly to our agricultural specialist for a personalized plan for your land.</p>
                                <div className="pt-4">
                                    <a href="/contact" className="bg-primary text-white px-8 py-4 rounded-full font-bold inline-block hover:shadow-lg transition-shadow">
                                        Get Free Consultation
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

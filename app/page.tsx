"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Truck, Award, ShieldCheck, ArrowRight, Wheat, Beaker, Sprout, LayoutDashboard, ShoppingBag, Clock, User } from "lucide-react";
import { useEffect, useState } from "react";
import { getRole, getUser } from "@/lib/auth";

export default function Home() {
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getRole().then(setRole);
    getUser().then(setUser);
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2e1a]/90 to-transparent z-10" />
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Lush green field"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="container mx-auto px-4 z-20 text-white">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md px-4 py-2 rounded-full border border-primary/30 text-accent font-semibold text-sm">
              <Award size={18} /> 15+ Years of Agriculture Excellence
            </div>
            
            {role === "owner" ? (
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Welcome Back, <br />
                <span className="text-primary italic">Administrator</span>
              </h1>
            ) : role === "user" ? (
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Hello, <br />
                <span className="text-primary italic">{user?.name}</span>
              </h1>
            ) : (
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Trusted Agricultural <br />
                <span className="text-primary italic">Solutions</span> for India
              </h1>
            )}

            <p className="text-xl text-gray-200 max-w-2xl leading-relaxed">
              Premium fertilizers, pesticides, and seeds to maximize your crop yield.
              Government certified products delivered straight to your farm or shop.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              {role === "owner" ? (
                <>
                  <Link href="/owner" className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 hover:translate-x-1 transition-all">
                    Admin Dashboard <LayoutDashboard size={20} />
                  </Link>
                  <Link href="/owner/orders" className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all">
                    View Inquiries
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/products" className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 hover:translate-x-1 transition-all">
                    Browse Products <ArrowRight size={20} />
                  </Link>
                  {role === "user" ? (
                    <Link href="/my-orders" className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all flex items-center gap-2">
                      My Activity <Clock size={20} />
                    </Link>
                  ) : (
                    <Link href="/wholesale" className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all">
                      Wholesale Inquiry
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Role Specific Quick Actions */}
      {role === "owner" && (
        <section className="py-12 bg-white border-b border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-foreground flex items-center gap-2">
              <ShieldCheck className="text-primary" /> Quick Admin Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/owner" className="p-6 bg-accent/30 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all flex items-center gap-4 group">
                <div className="bg-primary p-3 rounded-xl text-white group-hover:scale-110 transition-transform">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Manage Products</h3>
                  <p className="text-sm text-gray-500">Edit list, prices & images</p>
                </div>
              </Link>
              <Link href="/owner/orders" className="p-6 bg-accent/30 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all flex items-center gap-4 group">
                <div className="bg-primary p-3 rounded-xl text-white group-hover:scale-110 transition-transform">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Customer Inquiries</h3>
                  <p className="text-sm text-gray-500">View latest WhatsApp requests</p>
                </div>
              </Link>
              <Link href="/products" className="p-6 bg-accent/30 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all flex items-center gap-4 group">
                <div className="bg-primary p-3 rounded-xl text-white group-hover:scale-110 transition-transform">
                  <ArrowRight size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Public View</h3>
                  <p className="text-sm text-gray-500">See site as a customer</p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Standard Content Follows */}
      <section className="py-12 bg-[#f8faf8] border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, label: "Government Certified", sub: "Approved Licenses" },
              { icon: Truck, label: "PAN India Supply", sub: "Reliable Delivery" },
              { icon: CheckCircle, label: "Quality Assured", sub: "Geniune Products" },
              { icon: Award, label: "15+ Years Experience", sub: "Trusted Locally" },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-border group-hover:scale-110 transition-transform">
                  <stat.icon className="text-primary w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{stat.label}</h3>
                  <p className="text-sm text-gray-500">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sections (Shortened for brevity) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-4xl font-bold text-foreground">Complete Farming Solutions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We offer standard and customized products for every Indian farmer.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Fertilizers", icon: Wheat },
              { title: "Crop Protection", icon: Beaker },
              { title: "Seeds", icon: Sprout },
            ].map((cat, idx) => (
              <div key={idx} className="bg-accent/20 p-8 rounded-3xl border border-border hover:shadow-lg transition-all text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                  <cat.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{cat.title}</h3>
                <Link href="/products" className="text-primary font-bold hover:underline">View Catalog</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

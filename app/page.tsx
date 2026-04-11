"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle,
  Truck,
  Award,
  ShieldCheck,
  ArrowRight,
  Wheat,
  Beaker,
  Sprout,
  LayoutDashboard,
  ShoppingBag,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";

type AuthUser = {
  _id?: string;
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
};

export default function Home() {
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const fetchAuthUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          setRole(null);
          setUser(null);
          return;
        }

        const data: AuthUser = await res.json();
        setRole(data.role || null);
        setUser(data);
      } catch {
        setRole(null);
        setUser(null);
      }
    };

    fetchAuthUser();
  }, []);

  return (
    <div className="flex w-full flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#1a2e1a]/90 to-transparent" />
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Lush green field"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="container z-20 mx-auto px-4 text-white">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-4 py-2 text-sm font-semibold text-accent backdrop-blur-md">
              <Award size={18} /> 15+ Years of Agriculture Excellence
            </div>

            {role === "owner" ? (
              <h1 className="text-5xl font-bold leading-tight md:text-7xl">
                Welcome Back, <br />
                <span className="italic text-primary">
                  {user?.name || "Administrator"}
                </span>
              </h1>
            ) : role === "user" ? (
              <h1 className="text-5xl font-bold leading-tight md:text-7xl">
                Hello, <br />
                <span className="italic text-primary">{user?.name}</span>
              </h1>
            ) : (
              <h1 className="text-5xl font-bold leading-tight md:text-7xl">
                Trusted Fertilizers & Pesticides Supplier <br />
                <span className="italic text-primary">
                  with 15+ Years of Experience
                </span>
              </h1>
            )}

            <p className="max-w-2xl text-xl leading-relaxed text-gray-200">
              Providing high-quality fertilizers, pesticides, and agricultural
              solutions to farmers and retailers across India. Government-certified
              products with trusted expertise of Anil Kumar Bishnoi.
            </p>

            <p className="font-semibold text-green-300">
              Led by Anil Kumar Bishnoi – 15+ years of trusted agricultural expertise
            </p>

            <p className="mt-4 text-gray-300">
              Established on <strong>22 May 2023</strong> • Growing trusted farmer
              community 🌱
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              {role === "owner" ? (
                <>
                  <Link
                    href="/owner"
                    className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-white transition-all hover:translate-x-1"
                  >
                    Admin Dashboard <LayoutDashboard size={20} />
                  </Link>

                  <Link
                    href="/owner/orders"
                    className="rounded-full bg-white px-8 py-4 text-lg font-bold text-primary transition-all hover:bg-gray-100"
                  >
                    View Inquiries
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/products"
                    className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-white transition-all hover:translate-x-1"
                  >
                    Browse Products <ArrowRight size={20} />
                  </Link>

                  {role === "user" ? (
                    <Link
                      href="/my-orders"
                      className="flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-primary transition-all hover:bg-gray-100"
                    >
                      My Activity <Clock size={20} />
                    </Link>
                  ) : (
                    <Link
                      href="/wholesale"
                      className="rounded-full bg-white px-8 py-4 text-lg font-bold text-primary transition-all hover:bg-gray-100"
                    >
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
        <section className="border-b border-border bg-white py-12">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 flex items-center gap-2 text-2xl font-bold text-foreground">
              <ShieldCheck className="text-primary" /> Quick Admin Management
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Link
                href="/owner"
                className="group flex items-center gap-4 rounded-2xl border border-primary/10 bg-accent/30 p-6 transition-all hover:border-primary/30"
              >
                <div className="rounded-xl bg-primary p-3 text-white transition-transform group-hover:scale-110">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Manage Products</h3>
                  <p className="text-sm text-gray-500">
                    Edit list, prices & images
                  </p>
                </div>
              </Link>

              <Link
                href="/owner/orders"
                className="group flex items-center gap-4 rounded-2xl border border-primary/10 bg-accent/30 p-6 transition-all hover:border-primary/30"
              >
                <div className="rounded-xl bg-primary p-3 text-white transition-transform group-hover:scale-110">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Customer Inquiries</h3>
                  <p className="text-sm text-gray-500">
                    View latest WhatsApp requests
                  </p>
                </div>
              </Link>

              <Link
                href="/products"
                className="group flex items-center gap-4 rounded-2xl border border-primary/10 bg-accent/30 p-6 transition-all hover:border-primary/30"
              >
                <div className="rounded-xl bg-primary p-3 text-white transition-transform group-hover:scale-110">
                  <ArrowRight size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Public View</h3>
                  <p className="text-sm text-gray-500">
                    See site as a customer
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Standard Content */}
      <section className="border-b border-border bg-[#f8faf8] py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                label: "Government Certified",
                sub: "Fully Licensed & Approved Products",
              },
              {
                icon: Truck,
                label: "All India Supply",
                sub: "Fast & Reliable Delivery Anywhere",
              },
              {
                icon: CheckCircle,
                label: "Top Quality Products",
                sub: "From Trusted Agricultural Brands",
              },
              {
                icon: Award,
                label: "15+ Years Experience",
                sub: "Expert Guidance for Farmers",
              },
            ].map((stat, idx) => (
              <div key={idx} className="group flex items-center gap-4">
                <div className="rounded-2xl border border-border bg-white p-3 shadow-sm transition-transform group-hover:scale-110">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {stat.label}
                  </h3>
                  <p className="text-sm text-gray-500">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 space-y-2 text-center">
            <h2 className="text-4xl font-bold text-foreground">
              Complete Farming Solutions
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              We offer standard and customized products for every Indian farmer.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { title: "Fertilizers", icon: Wheat, value: "Fertilizers" },
              { title: "Crop Protection", icon: Beaker, value: "Pesticides" },
              { title: "Seeds", icon: Sprout, value: "Seeds" },
            ].map((cat, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-border bg-accent/20 p-8 text-center transition-all hover:shadow-lg"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <cat.icon size={32} />
                </div>

                <h3 className="mb-4 text-2xl font-bold">{cat.title}</h3>

                <Link
                  href={`/products?category=${cat.value}`}
                  className="font-bold text-primary hover:underline"
                >
                  View Catalog
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
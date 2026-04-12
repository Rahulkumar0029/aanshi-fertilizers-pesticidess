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
      <section className="relative flex min-h-[70vh] items-center overflow-hidden py-16 sm:min-h-[78vh] sm:py-20 lg:min-h-[82vh]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#1a2e1a]/90 via-[#1a2e1a]/70 to-[#1a2e1a]/35" />
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Lush green field"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div className="container-app relative z-20 text-white">
          <div className="max-w-4xl space-y-5 sm:space-y-6">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-4 py-2 text-xs font-semibold text-accent backdrop-blur-md sm:text-sm">
              <Award size={18} className="shrink-0" />
              <span className="truncate">15+ Years of Agriculture Excellence</span>
            </div>

            {role === "owner" ? (
              <h1 className="page-title max-w-3xl font-bold leading-tight text-white">
                Welcome Back,
                <br />
                <span className="italic text-primary">
                  {user?.name || "Administrator"}
                </span>
              </h1>
            ) : role === "user" ? (
              <h1 className="page-title max-w-3xl font-bold leading-tight text-white">
                Hello,
                <br />
                <span className="italic text-primary">{user?.name}</span>
              </h1>
            ) : (
              <h1 className="page-title max-w-4xl font-bold leading-tight text-white">
                Trusted Fertilizers & Pesticides Supplier
                <br />
                <span className="italic text-primary">
                  with 15+ Years of Experience
                </span>
              </h1>
            )}

            <p className="max-w-3xl text-base leading-7 text-gray-200 sm:text-lg sm:leading-8 lg:text-xl">
              Providing high-quality fertilizers, pesticides, and agricultural
              solutions to farmers and retailers across India. Government-certified
              products with trusted expertise of Anil Kumar Bishnoi.
            </p>

            <p className="text-sm font-semibold text-green-300 sm:text-base">
              Led by Anil Kumar Bishnoi – 15+ years of trusted agricultural expertise
            </p>

            <p className="text-sm text-gray-300 sm:text-base">
              Established on <strong>22 May 2023</strong> • Growing trusted farmer
              community 🌱
            </p>

            <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:flex-wrap sm:gap-4">
              {role === "owner" ? (
                <>
                  <Link
                    href="/owner"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:translate-x-1 sm:px-8 sm:py-4 sm:text-base"
                  >
                    Admin Dashboard <LayoutDashboard size={18} />
                  </Link>

                  <Link
                    href="/owner/orders"
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-gray-100 sm:px-8 sm:py-4 sm:text-base"
                  >
                    View Inquiries
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:translate-x-1 sm:px-8 sm:py-4 sm:text-base"
                  >
                    Browse Products <ArrowRight size={18} />
                  </Link>

                  {role === "user" ? (
                    <Link
                      href="/my-orders"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-gray-100 sm:px-8 sm:py-4 sm:text-base"
                    >
                      My Activity <Clock size={18} />
                    </Link>
                  ) : (
                    <Link
                      href="/wholesale"
                      className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-gray-100 sm:px-8 sm:py-4 sm:text-base"
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

      {role === "owner" && (
        <section className="border-b border-border bg-white py-10 sm:py-12">
          <div className="container-app">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground sm:mb-8 sm:text-3xl">
              <ShieldCheck className="text-primary" /> Quick Admin Management
            </h2>

            <div className="safe-grid-3">
              <Link
                href="/owner"
                className="group flex items-center gap-4 rounded-2xl border border-primary/10 bg-accent/30 p-5 transition-all hover:border-primary/30 sm:p-6"
              >
                <div className="rounded-xl bg-primary p-3 text-white transition-transform group-hover:scale-110">
                  <ShoppingBag size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold">Manage Products</h3>
                  <p className="text-sm text-gray-500">
                    Edit list, prices & images
                  </p>
                </div>
              </Link>

              <Link
                href="/owner/orders"
                className="group flex items-center gap-4 rounded-2xl border border-primary/10 bg-accent/30 p-5 transition-all hover:border-primary/30 sm:p-6"
              >
                <div className="rounded-xl bg-primary p-3 text-white transition-transform group-hover:scale-110">
                  <Clock size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold">Customer Inquiries</h3>
                  <p className="text-sm text-gray-500">
                    View latest WhatsApp requests
                  </p>
                </div>
              </Link>

              <Link
                href="/products"
                className="group flex items-center gap-4 rounded-2xl border border-primary/10 bg-accent/30 p-5 transition-all hover:border-primary/30 sm:p-6"
              >
                <div className="rounded-xl bg-primary p-3 text-white transition-transform group-hover:scale-110">
                  <ArrowRight size={24} />
                </div>
                <div className="min-w-0">
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

      <section className="border-b border-border bg-[#f8faf8] py-10 sm:py-12">
        <div className="container-app">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 xl:gap-8">
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
              <div
                key={idx}
                className="group flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="rounded-2xl border border-border bg-white p-3 shadow-sm transition-transform group-hover:scale-110">
                  <stat.icon className="h-7 w-7 text-primary sm:h-8 sm:w-8" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-foreground sm:text-lg">
                    {stat.label}
                  </h3>
                  <p className="text-sm text-gray-500">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container-app">
          <div className="mb-12 space-y-3 text-center sm:mb-16">
            <h2 className="section-title font-bold text-foreground">
              Complete Farming Solutions
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-gray-600 sm:text-base">
              We offer standard and customized products for every Indian farmer.
            </p>
          </div>

          <div className="safe-grid-3">
            {[
              { title: "Fertilizers", icon: Wheat, value: "Fertilizers" },
              { title: "Crop Protection", icon: Beaker, value: "Pesticides" },
              { title: "Seeds", icon: Sprout, value: "Seeds" },
            ].map((cat, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-border bg-accent/20 p-6 text-center transition-all hover:shadow-lg sm:p-8"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:h-16 sm:w-16">
                  <cat.icon size={30} />
                </div>

                <h3 className="mb-3 text-xl font-bold sm:text-2xl">{cat.title}</h3>

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
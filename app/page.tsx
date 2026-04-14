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
  Clock,
  Loader2,
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
  const [pageLoading, setPageLoading] = useState(true);

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
      } finally {
        setPageLoading(false);
      }
    };

    fetchAuthUser();
  }, []);

  return (
    <div className="flex w-full flex-col">
      <section className="relative flex min-h-[72vh] items-center overflow-hidden py-16 sm:min-h-[78vh] sm:py-20 lg:min-h-[84vh]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#07140c]/95 via-[#10351c]/82 to-[#1a2e1a]/50" />
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Agricultural field"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div className="container-app relative z-20 text-white">
          <div className="max-w-4xl space-y-5 sm:space-y-6">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-green-400/20 bg-green-500/10 px-4 py-2 text-xs font-semibold text-green-100 backdrop-blur-md sm:text-sm">
              <Award size={18} className="shrink-0" />
              <span className="truncate">
                Trusted Agricultural Solutions • 15+ Years of Experience
              </span>
            </div>

            {pageLoading ? (
              <div className="flex items-center gap-2 text-sm text-green-200 sm:text-base">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : role === "owner" || role === "user" ? (
              <p className="text-sm font-medium text-green-200 sm:text-base">
                Welcome back, {user?.name}
              </p>
            ) : null}

            <h1 className="max-w-4xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
              Strong Crops Start With
              <br />
              <span className="text-green-400">
                Trusted Fertilizers, Pesticides & Seeds
              </span>
            </h1>

            <p className="max-w-2xl text-base leading-7 text-gray-200 sm:text-lg sm:leading-8 lg:text-xl">
              Aanshi Fertilizers & Pesticides supplies reliable agricultural
              products for farmers, retailers, and wholesale buyers with a focus
              on quality, guidance, and long-term trust.
            </p>

            <div className="flex flex-wrap gap-3 text-sm font-medium text-green-200 sm:text-base">
              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                Government-approved product support
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                Retail + wholesale supply
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                Trusted guidance for farmers
              </span>
            </div>

            <p className="max-w-3xl text-sm font-semibold leading-6 text-green-300 sm:text-base">
              Led by <span className="text-white">Anil Kumar Bishnoi</span> with
              15+ years of agricultural experience, in collaboration with{" "}
              <span className="text-white">Anuj Bishnoi</span>.
            </p>

            <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:flex-wrap sm:gap-4">
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

              {role === "owner" && (
                <Link
                  href="/owner"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition-all hover:bg-white/15 sm:px-8 sm:py-4 sm:text-base"
                >
                  Owner Panel <ShieldCheck size={18} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

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
                  <p className="text-sm text-gray-600 sm:text-[15px]">
  {stat.sub}
</p>
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

                <h3 className="mb-3 text-xl font-bold sm:text-2xl">
                  {cat.title}
                </h3>

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
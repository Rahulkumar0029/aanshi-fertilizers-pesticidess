"use client";

import { useState } from "react";
import {
  Handshake,
  Package,
  Globe,
  Truck,
  FileCheck,
  Phone,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { BUSINESS_DETAILS } from "@/lib/constants";
import {
  buildWholesaleInquiryMessage,
  buildWhatsAppUrl,
} from "@/lib/whatsapp";

export default function Wholesale() {
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    phone: "",
    location: "",
    interest: "Retail Stock",
  });

  const [loading, setLoading] = useState(false);

  const features = [
    {
      icon: Handshake,
      title: "Special Pricing",
      desc: "Enjoy exclusive dealer rates and bulk discounts.",
      link: "/contact",
      external: false,
    },
    {
      icon: Package,
      title: "Agricultural Combos",
      desc: "Curated packages for crops.",
      link: "/products",
      external: false,
    },
    {
      icon: Globe,
      title: "PAN India Supply",
      desc: "We deliver across India.",
      link: "/contact",
      external: false,
    },
    {
      icon: Truck,
      title: "Priority Delivery",
      desc: "Fast logistics support.",
      link: "/contact",
      external: false,
    },
    {
      icon: FileCheck,
      title: "License Support",
      desc: "All legal docs provided.",
      link: "/contact",
      external: false,
    },
    {
      icon: Phone,
      title: "Expert Support",
      desc: "Talk to our experts.",
      link: buildWhatsAppUrl(
        buildWholesaleInquiryMessage({
          interest: "Wholesale support call request",
        })
      ),
      external: true,
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const whatsappMessage = buildWholesaleInquiryMessage(form);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.ownerName.trim() || !form.phone.trim()) {
      toast.error("Owner name and phone are required");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userName: form.ownerName.trim(),
        phone: form.phone.trim(),
        productName: form.interest,
        productCategory: "Wholesale",
        status: "pending",
        message: `Business Name: ${form.businessName}\nLocation: ${form.location}`,
      };

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Wholesale inquiry failed");
      }

      toast.success("Wholesale inquiry sent successfully");

      setForm({
        businessName: "",
        ownerName: "",
        phone: "",
        location: "",
        interest: "Retail Stock",
      });
    } catch (error: any) {
      toast.error(error?.message || "Wholesale inquiry failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toaster position="top-right" />

      <section className="relative overflow-hidden bg-primary px-4 py-16 text-white sm:py-20 lg:py-24">
        <div className="absolute right-0 top-0 -mr-32 -mt-32 h-80 w-80 rounded-full bg-white/5 blur-3xl sm:h-96 sm:w-96" />

        <div className="container-app relative z-10 text-center">
          <h1 className="mx-auto mb-5 max-w-4xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl xl:text-6xl">
            Bulk Fertilizers & Pesticides Supply
          </h1>

          <p className="mx-auto max-w-3xl text-base font-medium leading-7 opacity-90 sm:text-xl sm:leading-8 md:text-2xl">
            Get the best wholesale prices directly from a trusted supplier with
            15+ years of experience.
          </p>

          <p className="mt-4 text-sm font-semibold text-green-300 sm:text-base">
            Trusted by farmers & retailers across India
          </p>

          <div className="mt-8 flex justify-center">
            <a
              href={buildWhatsAppUrl(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-green-500 px-6 py-3 text-sm font-bold transition hover:bg-green-600 sm:text-base"
            >
              WhatsApp Inquiry
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20 lg:py-24">
        <div className="container-app">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl lg:text-4xl">
              Why Partner With Us?
            </h2>
            <div className="mx-auto h-1.5 w-24 rounded-full bg-primary" />
          </div>

          <div className="safe-grid-3">
            {features.map((feature, idx) =>
              feature.external ? (
                <a
                  key={idx}
                  href={feature.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center space-y-4 rounded-3xl border border-border p-6 text-center transition-all hover:border-primary hover:shadow-xl sm:p-8"
                >
                  <div className="rounded-2xl bg-accent p-4 text-primary">
                    <feature.icon size={32} />
                  </div>
                  <h3 className="text-lg font-bold sm:text-xl">{feature.title}</h3>
                  <p className="text-sm leading-7 text-gray-600 sm:text-base">
                    {feature.desc}
                  </p>
                </a>
              ) : (
                <Link
                  key={idx}
                  href={feature.link}
                  className="flex flex-col items-center space-y-4 rounded-3xl border border-border p-6 text-center transition-all hover:border-primary hover:shadow-xl sm:p-8"
                >
                  <div className="rounded-2xl bg-accent p-4 text-primary">
                    <feature.icon size={32} />
                  </div>
                  <h3 className="text-lg font-bold sm:text-xl">{feature.title}</h3>
                  <p className="text-sm leading-7 text-gray-600 sm:text-base">
                    {feature.desc}
                  </p>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      <section className="bg-accent/30 py-14 sm:py-20 lg:py-24">
        <div className="container-app">
          <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-2 lg:rounded-[3rem]">
            <div className="space-y-8 bg-primary p-6 text-white sm:p-10 lg:p-12 xl:p-16">
              <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                Apply for Partnership
              </h2>
              <p className="text-base leading-7 opacity-90 sm:text-lg">
                Fill out the form to register as a dealer. Our team will contact
                you with catalog and wholesale pricing details.
              </p>

              <div className="space-y-5 pt-2 sm:space-y-6 sm:pt-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-white/10 p-3">
                    <Handshake size={20} />
                  </div>
                  <span className="text-base font-bold sm:text-lg">
                    Special Pricing for Shopkeepers
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-white/10 p-3">
                    <Globe size={20} />
                  </div>
                  <span className="text-base font-bold sm:text-lg">
                    Distributor Opportunities
                  </span>
                </div>

                <div className="rounded-2xl bg-white/10 p-4 text-sm sm:text-base">
                  <p className="break-words">Phone: +91 {BUSINESS_DETAILS.phone}</p>
                  <p className="break-all">Email: {BUSINESS_DETAILS.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6 sm:p-10 lg:p-12 xl:p-16">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">
                      Business Name
                    </label>
                    <input
                      name="businessName"
                      type="text"
                      value={form.businessName}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-border px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">
                      Owner Name
                    </label>
                    <input
                      name="ownerName"
                      type="text"
                      value={form.ownerName}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-border px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500">
                    Location (City/State)
                  </label>
                  <input
                    name="location"
                    type="text"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500">
                    Interested In
                  </label>
                  <select
                    name="interest"
                    value={form.interest}
                    onChange={handleChange}
                    className="w-full cursor-pointer appearance-none rounded-xl border border-border px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-primary"
                  >
                    <option>Retail Stock</option>
                    <option>Distributorship</option>
                    <option>Bulk Order Package</option>
                    <option>Wholesale Pricing</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full rounded-xl bg-primary py-4 text-base font-bold text-white transition-all hover:shadow-xl active:scale-95 disabled:opacity-70 sm:text-lg"
                >
                  {loading ? "Sending..." : "Send Wholesale Inquiry"}
                </button>

                <a
                  href={buildWhatsAppUrl(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-green-500 py-4 text-base font-bold text-white transition hover:bg-green-600 sm:text-lg"
                >
                  <MessageSquare size={20} />
                  Request on WhatsApp
                </a>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
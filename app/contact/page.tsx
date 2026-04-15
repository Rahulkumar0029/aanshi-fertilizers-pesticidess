"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
} from "lucide-react";
import { BUSINESS_DETAILS } from "@/lib/constants";
import {
  buildGeneralInquiryMessage,
  buildWhatsAppUrl,
} from "@/lib/whatsapp";
import toast, { Toaster } from "react-hot-toast";

export default function Contact() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    interest: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.fullName.trim() || !form.phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userName: form.fullName.trim(),
        phone: form.phone.trim(),
        productName: form.interest.trim() || "General Inquiry",
        productCategory: "Contact",
        status: "pending",
        message: form.message.trim(),
      };

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Inquiry submission failed");
      }

      toast.success("Inquiry sent successfully");

      setForm({
        fullName: "",
        phone: "",
        interest: "",
        message: "",
      });
    } catch (error: any) {
      toast.error(error?.message || "Inquiry submission failed");
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = buildGeneralInquiryMessage({
    name: form.fullName || "Customer",
    phone: form.phone,
    purpose: form.interest || "General business inquiry",
    details: form.message || "I want to know more about your products/services.",
  });

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fdfdfb]">
      <Toaster position="top-right" />

      <section className="bg-accent/40 px-4 py-14 text-center sm:py-20 lg:py-24">
        <div className="container-app">
          <h1 className="mb-4 text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto max-w-2xl text-base font-medium text-gray-600 sm:text-lg lg:text-xl">
            Have a question or looking for a bulk order? We&apos;re here to help
            you grow.
          </p>
        </div>
      </section>

      <section className="container-app py-12 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-10 lg:col-span-5">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold sm:text-3xl">Visit Our Store</h2>
              <p className="text-base leading-7 text-gray-600 sm:text-lg">
                Experience expert guidance in person. Our shop is fully stocked
                with the latest agricultural solutions.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 border-b border-border pb-6 sm:gap-6">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary sm:p-4">
                  <MapPin size={22} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-lg font-bold sm:text-xl">Physical Address</h4>
                  <p className="mt-1 text-base text-gray-700 sm:text-lg">
                    {BUSINESS_DETAILS.address}
                  </p>
                  <a
                    href="#map"
                    className="mt-2 inline-block font-semibold text-primary underline"
                  >
                    View Store Location
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 border-b border-border pb-6 sm:gap-6">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary sm:p-4">
                  <Phone size={22} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-lg font-bold sm:text-xl">Phone Support</h4>
                  <a
                    href={`tel:${String(BUSINESS_DETAILS.phone).replace(/\s+/g, "")}`}
                    className="mt-1 inline-block whitespace-nowrap text-base text-gray-700 hover:text-primary sm:text-lg"
                  >
                    {BUSINESS_DETAILS.phone}
                  </a>
                  <p className="mt-1 text-sm font-medium text-gray-400">
                    {BUSINESS_DETAILS.timings}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 border-b border-border pb-6 sm:gap-6">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary sm:p-4">
                  <Mail size={22} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-lg font-bold sm:text-xl">Email Inquiry</h4>
                  <a
                    href={`mailto:${BUSINESS_DETAILS.email}`}
                    className="mt-1 break-all text-base text-gray-700 hover:text-primary sm:text-lg"
                  >
                    {BUSINESS_DETAILS.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 sm:gap-6">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary sm:p-4">
                  <Clock size={22} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-lg font-bold sm:text-xl">Store Timings</h4>
                  <p className="mt-1 text-base text-gray-700 sm:text-lg">
                    9:00 AM - 8:00 PM
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-400">
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={buildWhatsAppUrl(
                  buildGeneralInquiryMessage({
                    name: form.fullName || "Customer",
                    phone: form.phone,
                    purpose: form.interest || "General inquiry",
                    details:
                      form.message ||
                      "I want information about your products and services.",
                  })
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-3 rounded-[2rem] bg-[#25D366] px-5 py-4 text-base font-bold text-white shadow-lg transition-all hover:shadow-2xl active:scale-95 sm:gap-4 sm:p-5 sm:text-lg lg:text-xl"
              >
                <MessageSquare size={24} />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-[2rem] border border-border bg-white p-5 shadow-2xl sm:rounded-[2.5rem] sm:p-8 lg:rounded-[3rem] lg:p-12">
              <h3 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl">
                Send a Quick Inquiry
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                  <input
                    name="fullName"
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-border bg-muted/50 p-4 text-sm outline-none transition focus:border-primary sm:text-base"
                  />
                  <input
                    name="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-border bg-muted/50 p-4 text-sm outline-none transition focus:border-primary sm:text-base"
                  />
                </div>

                <input
                  name="interest"
                  placeholder="Crop/Product Interest"
                  value={form.interest}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-border bg-muted/50 p-4 text-sm outline-none transition focus:border-primary sm:text-base"
                />

                <textarea
                  name="message"
                  rows={5}
                  placeholder="Your Message"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-border bg-muted/50 p-4 text-sm outline-none transition focus:border-primary sm:text-base"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 text-base font-bold text-white transition-all hover:shadow-xl disabled:opacity-70 sm:py-5 sm:text-lg"
                >
                  <Send size={20} />
                  {loading ? "Sending..." : "Send Inquiry"}
                </button>

                <a
                  href={buildWhatsAppUrl(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-green-500 py-4 text-base font-bold text-white transition hover:bg-green-600 sm:text-lg"
                >
                  <MessageSquare size={20} />
                  Send on WhatsApp Instead
                </a>

                <p className="text-center text-sm text-gray-400">
                  Your details are safe with us.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section id="map" className="container-app pb-12 sm:pb-16 lg:pb-24">
        <div className="overflow-hidden rounded-[1.5rem] border border-border shadow-lg sm:rounded-[2rem]">
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
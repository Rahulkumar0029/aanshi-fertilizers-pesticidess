import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
} from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { BUSINESS_DETAILS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-[#1a2e1a] pb-8 pt-14 text-white sm:pt-16">
      <div className="container-app">
        <div className="grid grid-cols-1 gap-10 pb-10 sm:gap-12 lg:grid-cols-4">
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-3"
              aria-label="Aanshi Farms Home"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10 sm:h-16 sm:w-16">
                <Image
                  src="/logo.png"
                  alt="Aanshi Farms Logo"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-col">
                <span className="truncate text-2xl font-black tracking-tight sm:text-3xl">
                  AANSHI
                </span>
                <span className="pt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-300 sm:text-xs">
                  Fertilizers &amp; Pesticides
                </span>
              </div>
            </Link>

            <p className="max-w-md text-sm leading-7 text-gray-300 sm:text-base">
              15+ years of expertise in providing high-quality agricultural
              solutions. Trusted by farmers across India.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 sm:gap-4">
              <Link
                href="https://www.facebook.com/people/Aanshi-Farms/100092580835985/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Aanshi Farms Facebook"
                className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#a8e6cf]/40 hover:bg-[#a8e6cf]/10 hover:text-[#a8e6cf] focus:outline-none focus:ring-2 focus:ring-[#a8e6cf]/40"
              >
                <Facebook className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              </Link>

              <Link
                href="https://www.instagram.com/aanshifarms/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Aanshi Farms Instagram"
                className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#a8e6cf]/40 hover:bg-[#a8e6cf]/10 hover:text-[#a8e6cf] focus:outline-none focus:ring-2 focus:ring-[#a8e6cf]/40"
              >
                <Instagram className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              </Link>

              <Link
                href="https://x.com/AanshiFarms"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Aanshi Farms X"
                className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#a8e6cf]/40 hover:bg-[#a8e6cf]/10 hover:text-[#a8e6cf] focus:outline-none focus:ring-2 focus:ring-[#a8e6cf]/40"
              >
                <FaXTwitter className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-lg font-bold text-[#a8e6cf]">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-gray-300 sm:text-base">
              <li>
                <Link href="/about" className="transition-colors hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition-colors hover:text-white">
                  Our Products
                </Link>
              </li>
              <li>
                <Link href="/wholesale" className="transition-colors hover:text-white">
                  Wholesale Inquiry
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-lg font-bold text-[#a8e6cf]">
              Categories
            </h4>
            <ul className="space-y-3 text-sm text-gray-300 sm:text-base">
              <li>
                <Link
                  href="/products?category=Fertilizers"
                  className="transition-colors hover:text-white"
                >
                  Fertilizers
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Pesticides"
                  className="transition-colors hover:text-white"
                >
                  Pesticides
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Seeds"
                  className="transition-colors hover:text-white"
                >
                  Quality Seeds
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Organic"
                  className="transition-colors hover:text-white"
                >
                  Organic Products
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-lg font-bold text-[#a8e6cf]">Visit Us</h4>
            <ul className="space-y-4 text-sm text-gray-300 sm:text-base">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-[18px] w-[18px] shrink-0 text-[#a8e6cf]" />
                <span className="leading-6">{BUSINESS_DETAILS.address}</span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="h-[18px] w-[18px] shrink-0 text-[#a8e6cf]" />
                <a
                  href={`tel:${BUSINESS_DETAILS.phone}`}
                  className="break-words transition-colors hover:text-white"
                >
                  {BUSINESS_DETAILS.phone}
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="h-[18px] w-[18px] shrink-0 text-[#a8e6cf]" />
                <a
                  href={`mailto:${BUSINESS_DETAILS.email}`}
                  className="break-all transition-colors hover:text-white"
                >
                  {BUSINESS_DETAILS.email}
                </a>
              </li>

              <li className="pt-2">
                <a
                  href={`https://wa.me/${BUSINESS_DETAILS.whatsapp}?text=Hello, I want to inquire about your products.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl bg-green-500 px-4 py-3 text-center text-sm font-bold text-white transition-all hover:bg-green-600 sm:text-base"
                >
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-xs leading-6 text-gray-400 sm:text-sm">
          <p>
            © {new Date().getFullYear()} Aanshi Fertilizers &amp; Pesticides. All
            rights reserved.
            <br />
            Government Approved • Trusted by Farmers 🌱
          </p>
        </div>
      </div>
    </footer>
  );
}
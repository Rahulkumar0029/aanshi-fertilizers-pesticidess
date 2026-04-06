
"use client";

import Link from "next/link";
import { Menu, X, Leaf } from "lucide-react";
import { usePathname } from "next/navigation";
import { getRole, logout } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    getRole().then(setRole);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
  ];

  if (role === "owner") {
    navLinks.push({ name: "Admin Dashboard", href: "/owner" });
    navLinks.push({ name: "Order Inquiries", href: "/owner/orders" });
  } else if (role === "user") {
    navLinks.push({ name: "My Activity", href: "/my-orders" });
    navLinks.push({ name: "Wholesale", href: "/wholesale" });
  } else {
    navLinks.push({ name: "About Us", href: "/about" });
    navLinks.push({ name: "Wholesale", href: "/wholesale" });
    navLinks.push({ name: "Login", href: "/login" });
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="text-primary w-8 h-8" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primary leading-tight">AANSHI</span>
            <span className="text-xs text-secondary font-medium tracking-wider uppercase">Fertilizers & Pesticides</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-foreground hover:text-primary font-medium transition-colors"
            >
          {link.name}
            </Link>
          ))}
          {role !== null && (
            <button
              onClick={async () => {
                const { logout } = await import("@/lib/auth");
                await logout();
                window.location.href = "/login";
              }}
              className="bg-red-50 text-red-600 px-5 py-2 rounded-full font-semibold hover:bg-red-100 transition-all cursor-pointer"
            >
              Logout
            </button>
          )}
          <Link href="/wholesale" className="bg-primary text-white px-5 py-2 rounded-full font-semibold hover:opacity-90 transition-all">
            Wholesale Inquiry
          </Link>
        </nav>
        
        {/* Mobile Toggle */}
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="md:hidden bg-white border-t border-border px-4 py-6 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg font-medium py-2 border-b border-muted hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {role !== null && (
            <button
              onClick={async () => {
                const { logout } = await import("@/lib/auth");
                await logout();
                window.location.href = "/login";
              }}
              className="text-left text-lg font-medium py-2 border-b border-muted text-red-600 hover:text-red-700 transition-colors"
            >
              Logout
            </button>
          )}
          <Link href="/wholesale" className="bg-primary text-white text-center py-3 rounded-lg font-bold mt-2" onClick={() => setIsOpen(false)}>
            Wholesale Inquiry
          </Link>
        </nav>
      )}
    </header>
  );
}

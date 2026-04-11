"use client";

import Link from "next/link";
import { Menu, X, Leaf } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          setRole(null);
        } else {
          const data = await res.json();
          setRole(data.role || null);
        }
      } catch {
        setRole(null);
      } finally {
        setLoadingRole(false);
      }
    };

    fetchRole();
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    ...(role === "owner"
      ? [
          { name: "Admin Dashboard", href: "/owner" },
          { name: "Order Inquiries", href: "/owner/orders" },
        ]
      : role === "user"
      ? [
          { name: "My Activity", href: "/my-orders" },
          { name: "Wholesale", href: "/wholesale" },
        ]
      : !loadingRole
      ? [
          { name: "About Us", href: "/about" },
          { name: "Wholesale", href: "/wholesale" },
          { name: "Login", href: "/login" },
        ]
      : []),
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      window.location.href = "/login";
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <span className="text-xl font-bold leading-tight text-primary">
              AANSHI
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-secondary">
              Fertilizers & Pesticides
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-medium text-foreground transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}

          {role !== null && !loadingRole && (
            <button
              onClick={handleLogout}
              className="cursor-pointer rounded-full bg-red-50 px-5 py-2 font-semibold text-red-600 transition-all hover:bg-red-100"
            >
              Logout
            </button>
          )}

          <Link
            href="/wholesale"
            className="rounded-full bg-primary px-5 py-2 font-semibold text-white transition-all hover:opacity-90"
          >
            Wholesale Inquiry
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="text-foreground md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="animate-in slide-in-from-top flex flex-col gap-4 border-t border-border bg-white px-4 py-6 shadow-lg duration-300 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="border-b border-muted py-2 text-lg font-medium transition-colors hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {role !== null && !loadingRole && (
            <button
              onClick={async () => {
                setIsOpen(false);
                await handleLogout();
              }}
              className="border-b border-muted py-2 text-left text-lg font-medium text-red-600 transition-colors hover:text-red-700"
            >
              Logout
            </button>
          )}

          <Link
            href="/wholesale"
            className="mt-2 rounded-lg bg-primary py-3 text-center font-bold text-white"
            onClick={() => setIsOpen(false)}
          >
            Wholesale Inquiry
          </Link>
        </nav>
      )}
    </header>
  );
}
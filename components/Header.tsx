"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
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

  useEffect(() => {
    setIsOpen(false);
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
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="container-app">
        <div className="flex min-h-16 items-center justify-between gap-3 py-3 sm:min-h-20 sm:py-4">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 sm:gap-4"
            aria-label="Aanshi Farms Home"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl ring-1 ring-black/5 sm:h-14 sm:w-14">
              <Image
                src="/logo.png"
                alt="Aanshi Farms Logo"
                fill
                sizes="56px"
                className="object-cover"
                priority
              />
            </div>

            <div className="flex min-w-0 flex-col justify-center">
              <span className="truncate text-xl font-black leading-none tracking-tight text-primary sm:text-3xl">
                AANSHI
              </span>
              <span className="truncate pt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary sm:text-xs">
                Fertilizers &amp; Pesticides
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="whitespace-nowrap text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                {link.name}
              </Link>
            ))}

            {role !== null && !loadingRole && (
              <button
                onClick={handleLogout}
                className="cursor-pointer whitespace-nowrap rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-all hover:bg-red-100"
                type="button"
              >
                Logout
              </button>
            )}

            <Link
              href="/wholesale"
              className="whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 xl:px-5"
            >
              Wholesale Inquiry
            </Link>
          </nav>

          <button
            className="inline-flex shrink-0 items-center justify-center rounded-md p-2 text-foreground transition hover:bg-muted lg:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            type="button"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav
          id="mobile-menu"
          className="border-t border-border bg-white shadow-lg lg:hidden"
        >
          <div className="container-app flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-primary"
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
                className="rounded-lg px-3 py-3 text-left text-base font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                type="button"
              >
                Logout
              </button>
            )}

            <Link
              href="/wholesale"
              className="mt-2 rounded-xl bg-primary px-4 py-3 text-center text-sm font-bold text-white transition-all hover:opacity-90"
              onClick={() => setIsOpen(false)}
            >
              Wholesale Inquiry
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
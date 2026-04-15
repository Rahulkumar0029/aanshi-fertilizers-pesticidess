"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  UserCircle2,
  ChevronDown,
  LayoutDashboard,
  ClipboardList,
  LogOut,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type AuthUser = {
  role?: string;
  name?: string;
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const pathname = usePathname();
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          setAuthUser(null);
        } else {
          const data = await res.json();
          setAuthUser({
            role: data?.role || null,
            name: data?.name || "",
          });
        }
      } catch {
        setAuthUser(null);
      } finally {
        setLoadingRole(false);
      }
    };

    fetchUser();
  }, [pathname]);

  useEffect(() => {
    setIsOpen(false);
    setProfileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const role = authUser?.role ?? null;
  const isLoggedIn = !!role && !loadingRole;

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

  const userDisplayName = authUser?.name?.trim()
    ? authUser.name.trim().split(" ")[0]
    : "Profile";

  const profileMenuItems =
    role === "owner"
      ? [
          {
            label: "My Profile",
            href: "/profile",
            icon: <User className="h-4 w-4" />,
          },
          {
            label: "Dashboard",
            href: "/owner",
            icon: <LayoutDashboard className="h-4 w-4" />,
          },
          {
            label: "Order Inquiries",
            href: "/owner/orders",
            icon: <ClipboardList className="h-4 w-4" />,
          },
        ]
      : [
          {
            label: "My Profile",
            href: "/profile",
            icon: <User className="h-4 w-4" />,
          },
          {
            label: "My Activity",
            href: "/my-orders",
            icon: <ClipboardList className="h-4 w-4" />,
          },
        ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="container-app">
        <div className="flex min-h-[72px] items-center justify-between gap-4 py-4 sm:min-h-[84px] sm:py-5">
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

          <nav className="hidden items-center gap-8 lg:flex xl:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="whitespace-nowrap text-base font-semibold text-gray-700 transition-all hover:text-primary"
              >
                {link.name}
              </Link>
            ))}

            {!loadingRole && !isLoggedIn ? (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-primary px-6 py-3 text-base font-bold !text-white shadow-md transition-all hover:scale-[1.05] hover:shadow-lg"
              >
                Login
              </Link>
            ) : null}

            {isLoggedIn ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-primary px-6 py-3 text-base font-bold text-white shadow-md transition-all hover:scale-[1.03] hover:shadow-lg"
                >
                  <UserCircle2 size={18} />
                  <span>{userDisplayName}</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${
                      profileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileMenuOpen ? (
                  <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
                    <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
                      <p className="text-sm font-semibold text-gray-900">
                        {authUser?.name || "User"}
                      </p>
                      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                        {role === "owner" ? "Owner Account" : "Customer Account"}
                      </p>
                    </div>

                    <div className="py-2">
                      {profileMenuItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-primary"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      ))}

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700"
                        type="button"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
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
          <div className="container-app flex flex-col gap-2 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="rounded-xl px-4 py-3 text-base font-semibold text-gray-700 transition-colors hover:bg-accent hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {!loadingRole && !isLoggedIn ? (
              <Link
                href="/login"
                className="mt-2 rounded-2xl bg-primary px-5 py-3 text-center text-base font-bold text-white transition-all hover:opacity-90"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            ) : null}

            {isLoggedIn ? (
              <>
                <div className="mt-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">
                    {authUser?.name || "User"}
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                    {role === "owner" ? "Owner Account" : "Customer Account"}
                  </p>
                </div>

                {profileMenuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-gray-700 transition-colors hover:bg-accent hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}

                <button
                  onClick={async () => {
                    setIsOpen(false);
                    await handleLogout();
                  }}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-base font-semibold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                  type="button"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : null}
          </div>
        </nav>
      )}
    </header>
  );
}
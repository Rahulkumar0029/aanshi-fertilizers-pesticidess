"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type WhatsAppButtonProps = {
  message: string;
  requireAuth?: boolean;
  isLoggedIn?: boolean;
  className?: string;
  children: React.ReactNode;
};

export default function WhatsAppButton({
  message,
  requireAuth = false,
  isLoggedIn = false,
  className = "",
  children,
}: WhatsAppButtonProps) {
  const pathname = usePathname();

  if (requireAuth && !isLoggedIn) {
    const redirect = encodeURIComponent(pathname || "/");
    return (
      <Link
        href={`/login?redirect=${redirect}`}
        className={className}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
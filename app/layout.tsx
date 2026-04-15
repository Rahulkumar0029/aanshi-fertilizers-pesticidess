import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aanshifarms.in"),

  title: "Aanshi Fertilizers & Pesticides | Trusted Agricultural Solutions",
  description:
    "Government approved agricultural licenses. Supplying fertilizers, pesticides, and seeds across India. 15+ years of experience in agriculture.",

  keywords: [
    "Aanshi Farms",
    "Aanshi Fertilizers",
    "Aanshi Pesticides",
    "fertilizers",
    "pesticides",
    "seeds",
    "agriculture",
    "Sri Ganganagar",
    "Rajasthan",
  ],

  applicationName: "Aanshi Farms",
  authors: [{ name: "Aanshi Farms" }],
  creator: "Aanshi Farms",
  publisher: "Aanshi Farms",

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: ["/logo.png"],
    apple: ["/logo.png"],
  },

  openGraph: {
    title: "Aanshi Fertilizers & Pesticides | Trusted Agricultural Solutions",
    description:
      "Government approved agricultural licenses. Supplying fertilizers, pesticides, and seeds across India. 15+ years of experience in agriculture.",
    url: "https://aanshifarms.in",
    siteName: "Aanshi Farms",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aanshi Farms",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Aanshi Fertilizers & Pesticides | Trusted Agricultural Solutions",
    description:
      "Government approved agricultural licenses. Supplying fertilizers, pesticides, and seeds across India. 15+ years of experience in agriculture.",
    images: ["/og-image.png"],
  },

  category: "Agriculture",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1f4d2e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Aanshi Fertilizers & Pesticides",
    alternateName: "Aanshi Farms",
    url: "https://aanshifarms.in",
    logo: "https://aanshifarms.in/logo.png",
    image: "https://aanshifarms.in/og-image.png",
    description:
      "Government approved agricultural licenses. Supplying fertilizers, pesticides, and seeds across India. 15+ years of experience in agriculture.",
    telephone: "+91 70146 39562",
    address: {
      "@type": "PostalAddress",
      streetAddress: "30 Ps-A, Raisinghnagar",
      addressLocality: "Sri Ganganagar",
      addressRegion: "Rajasthan",
      postalCode: "335021",
      addressCountry: "IN",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-E4R07WLCFP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E4R07WLCFP');
          `}
        </Script>

        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <div className="flex min-h-screen flex-col">
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
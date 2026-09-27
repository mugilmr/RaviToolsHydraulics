import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/siteConfig";

const oswald = Oswald({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-oswald" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Borewell Hardware & Hydraulics`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: `${siteConfig.tagline}. Browse ${siteConfig.productCount} borewell hardware and hydraulic parts, order online, delivered across India.`,
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

// Deliberately minimal: this wraps EVERY route, including the whole /admin
// section, so it holds only truly global concerns (fonts, metadata, the
// <html>/<body> shell). Storefront-only chrome (header, footer, the sticky
// call/WhatsApp button, cart context) lives in (storefront)/layout.tsx so
// the admin panel gets its own separate chrome instead of the customer site's.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}

import Link from "next/link";
import { Logo } from "./Logo";
import { siteConfig } from "@/lib/siteConfig";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-charcoal-100 bg-steel-900 text-steel-100">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-3">
        <div>
          <Logo className="[&_span]:text-white" />
          <p className="mt-3 max-w-xs text-sm text-steel-200">{siteConfig.tagline}.</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-heading tracking-wide text-white">Shop</h3>
          <ul className="space-y-2 text-sm text-steel-200">
            <li><Link href="/categories" className="hover:text-white">All categories</Link></li>
            <li><Link href="/search" className="hover:text-white">Search products</Link></li>
            <li><Link href="/enquiry" className="hover:text-white">Enquiry / bulk order</Link></li>
            <li><Link href="/about" className="hover:text-white">About &amp; location</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-heading tracking-wide text-white">Contact</h3>
          <ul className="space-y-2 text-sm text-steel-200">
            <li>{siteConfig.phoneDisplay}</li>
            <li>{siteConfig.email}</li>
            <li>{siteConfig.hours}</li>
            <li>{siteConfig.deliveryNote}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-steel-300">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}

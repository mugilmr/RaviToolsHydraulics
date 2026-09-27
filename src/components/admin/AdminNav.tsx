"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="flex flex-wrap items-center gap-1 border-b border-charcoal-100 bg-white px-2">
      {LINKS.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-t-md px-3 py-2.5 text-sm font-semibold ${
              active ? "border-b-2 border-safety-500 text-steel-900" : "text-charcoal-500 hover:text-steel-800"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      <button onClick={logout} className="ml-auto px-3 py-2.5 text-sm font-semibold text-charcoal-500 hover:text-safety-600">
        Log out
      </button>
    </nav>
  );
}

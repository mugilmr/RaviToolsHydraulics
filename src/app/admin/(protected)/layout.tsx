import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-charcoal-50/40">
      <header className="border-b border-charcoal-100 bg-white">
        <div className="container-page flex h-14 items-center justify-between">
          <Link href="/admin"><Logo /></Link>
          <div className="flex items-center gap-3 text-xs text-charcoal-500">
            <span>{admin.email}</span>
            <Link href="/" className="font-semibold text-steel-700 hover:underline" target="_blank">
              View storefront ↗
            </Link>
          </div>
        </div>
        <div className="container-page">
          <AdminNav />
        </div>
      </header>
      <main className="container-page py-6">{children}</main>
    </div>
  );
}

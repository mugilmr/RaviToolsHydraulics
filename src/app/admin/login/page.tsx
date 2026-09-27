import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/Logo";

export const dynamic = "force-dynamic";
export const metadata = { title: "Owner Sign In" };

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-steel-900 px-4 py-12">
      <Logo className="[&_span]:text-white" />
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}

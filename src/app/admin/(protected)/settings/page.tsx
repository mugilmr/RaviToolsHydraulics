import { getCurrentAdmin } from "@/lib/auth";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const admin = await getCurrentAdmin();

  return (
    <div>
      <h1 className="mb-1 text-2xl text-charcoal-800">Settings</h1>
      <p className="mb-6 text-sm text-charcoal-500">Signed in as {admin?.email}.</p>
      <ChangePasswordForm />
    </div>
  );
}

import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getCurrentAdmin();
  return NextResponse.json({ admin: admin ? { id: admin.id, email: admin.email } : null });
}

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { listCategories, createCategory } from "@/lib/models/category";
import { categoryInputSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ categories: listCategories() });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const body = await request.json();
  const parsed = categoryInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const category = createCategory(parsed.data);
  return NextResponse.json({ category }, { status: 201 });
}

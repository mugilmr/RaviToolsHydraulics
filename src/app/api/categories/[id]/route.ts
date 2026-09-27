import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import {
  updateCategory,
  deleteCategory,
  mergeCategories,
  getCategoryById,
} from "@/lib/models/category";
import { categoryInputSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;
  const { id } = await params;

  const body = await request.json();

  if (typeof body.mergeInto === "string") {
    const target = getCategoryById(body.mergeInto);
    if (!target) return NextResponse.json({ error: "Target category not found." }, { status: 404 });
    if (target.id === id) {
      return NextResponse.json({ error: "Choose a different category to merge into." }, { status: 400 });
    }
    mergeCategories(id, body.mergeInto);
    return NextResponse.json({ ok: true });
  }

  const parsed = categoryInputSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const category = updateCategory(id, parsed.data);
  if (!category) return NextResponse.json({ error: "Category not found." }, { status: 404 });
  return NextResponse.json({ category });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;
  const { id } = await params;

  const result = deleteCategory(id);
  if (!result.ok) return NextResponse.json({ error: result.reason }, { status: 409 });
  return NextResponse.json({ ok: true });
}

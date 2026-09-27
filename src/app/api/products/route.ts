import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { getCurrentAdmin } from "@/lib/auth";
import { listProducts, createProduct } from "@/lib/models/product";
import { productInputSchema } from "@/lib/validators";
import { getCategoryById } from "@/lib/models/category";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const admin = await getCurrentAdmin();

  const products = listProducts({
    categorySlug: searchParams.get("category") ?? undefined,
    query: searchParams.get("q") ?? undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
    // Public callers only ever see published stock; the admin product list
    // calls this same endpoint signed in, so it can also see unpublished items.
    publishedOnly: !admin,
  });

  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const body = await request.json();
  const parsed = productInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const category = getCategoryById(parsed.data.categoryId);
  if (!category) return NextResponse.json({ error: "Choose a valid category." }, { status: 400 });

  const product = createProduct(parsed.data);
  return NextResponse.json({ product }, { status: 201 });
}

import { notFound } from "next/navigation";
import { listCategories } from "@/lib/models/category";
import { getProductById } from "@/lib/models/product";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Product" };

type Params = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Params) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  const categories = listCategories();

  return (
    <div>
      <h1 className="mb-1 text-2xl text-charcoal-800">Edit product</h1>
      <p className="mb-6 text-sm text-charcoal-500">Changes go live immediately.</p>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}

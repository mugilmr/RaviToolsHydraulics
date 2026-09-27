import { listCategories } from "@/lib/models/category";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Add Product" };

export default function NewProductPage() {
  const categories = listCategories();

  return (
    <div>
      <h1 className="mb-1 text-2xl text-charcoal-800">Add a product</h1>
      <p className="mb-6 text-sm text-charcoal-500">
        It appears on the storefront and in search the moment you publish it.
      </p>
      {categories.length === 0 ? (
        <div className="card p-6 text-charcoal-600">
          Create a category first from <a href="/admin/categories" className="text-steel-700 underline">Manage categories</a>.
        </div>
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  );
}

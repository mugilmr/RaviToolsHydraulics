import { listCategories, countProductsInCategory } from "@/lib/models/category";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Categories" };

export default function AdminCategoriesPage() {
  const categories = listCategories().map((c) => ({ ...c, productCount: countProductsInCategory(c.id) }));

  return (
    <div>
      <h1 className="mb-1 text-2xl text-charcoal-800">Categories</h1>
      <p className="mb-6 text-sm text-charcoal-500">
        Rename, merge, or add categories as the catalog grows. Deleting a category requires moving or removing its
        products first.
      </p>
      <CategoryManager categories={categories} />
    </div>
  );
}

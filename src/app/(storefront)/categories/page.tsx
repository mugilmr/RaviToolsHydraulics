import type { Metadata } from "next";
import { listCategories, countProductsInCategory } from "@/lib/models/category";
import { CategoryCard } from "@/components/CategoryCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "All Categories" };

export default function CategoriesPage() {
  const categories = listCategories();

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />
      <h1 className="mb-1 text-2xl text-charcoal-800">All categories</h1>
      <p className="mb-6 text-sm text-charcoal-500">
        {categories.length} categories, growing as more stock is added.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} productCount={countProductsInCategory(cat.id)} />
        ))}
      </div>
    </div>
  );
}

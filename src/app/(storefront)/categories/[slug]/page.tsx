import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/models/category";
import { listProducts } from "@/lib/models/product";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  return { title: category?.name ?? "Category" };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const products = listProducts({ categorySlug: slug, publishedOnly: true });

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }, { label: category.name }]} />

      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-steel-700 text-white">
          <CategoryIcon icon={category.icon} className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl text-charcoal-800">{category.name}</h1>
          {category.description && <p className="text-sm text-charcoal-500">{category.description}</p>}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="card p-8 text-center text-charcoal-500">
          No products published in this category yet — check back soon, or{" "}
          <a href="/enquiry" className="text-safety-600 underline">ask us directly</a>.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

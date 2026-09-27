import type { Metadata } from "next";
import { listProducts } from "@/lib/models/product";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Search" };

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? listProducts({ query, publishedOnly: true, limit: 60 }) : [];

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <h1 className="mb-1 text-2xl text-charcoal-800">
        {query ? (
          <>
            Results for <span className="text-safety-600">&quot;{query}&quot;</span>
          </>
        ) : (
          "Search products"
        )}
      </h1>
      <p className="mb-6 text-sm text-charcoal-500">
        {query ? `${results.length} product${results.length === 1 ? "" : "s"} found` : "Use the search bar above to find a product by name, description or category."}
      </p>

      {query && results.length === 0 && (
        <div className="card p-8 text-center text-charcoal-500">
          Nothing matched &quot;{query}&quot;. Try a shorter or more general term, or{" "}
          <a href="/enquiry" className="text-safety-600 underline">send us an enquiry</a> and we&apos;ll help you find it.
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

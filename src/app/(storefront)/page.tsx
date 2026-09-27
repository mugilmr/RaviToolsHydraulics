import Link from "next/link";
import { listCategories, countProductsInCategory } from "@/lib/models/category";
import { listProducts } from "@/lib/models/product";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { TrustBadgeIcon } from "@/components/icons";
import { siteConfig } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const categories = listCategories();
  const latestProducts = listProducts({ publishedOnly: true, limit: 8 });

  return (
    <div>
      <section className="border-b border-charcoal-100 bg-gradient-to-b from-steel-50 to-white">
        <div className="container-page grid gap-8 py-12 sm:py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 inline-block rounded-full bg-safety-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-safety-700">
              {siteConfig.yearsInBusiness} years in Tiruchengode
            </p>
            <h1 className="text-3xl leading-tight text-steel-900 sm:text-4xl">
              Borewell hardware &amp; hydraulics,
              <span className="block text-safety-600">ready when your rig needs it.</span>
            </h1>
            <p className="mt-4 max-w-lg text-base text-charcoal-600">
              {siteConfig.productCount} bolts, pipes, pumps, hydraulic fittings and body-building
              parts — browse by category, search by name, and order online. {siteConfig.deliveryNote}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/categories" className="btn-primary">
                Browse categories
              </Link>
              <Link href="/enquiry" className="btn-outline">
                Bulk or custom order?
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { kind: "catalog" as const, title: siteConfig.productCount, subtitle: "Parts in stock" },
              { kind: "years" as const, title: `${siteConfig.yearsInBusiness} yrs`, subtitle: "In business" },
              { kind: "delivery" as const, title: "Pan-India", subtitle: "No delivery charge" },
              { kind: "shield" as const, title: siteConfig.hours, subtitle: "Always reachable" },
            ].map((b) => (
              <div key={b.subtitle} className="card flex flex-col items-start gap-2 p-4">
                <span className="text-steel-700">
                  <TrustBadgeIcon kind={b.kind} />
                </span>
                <span className="font-heading text-lg text-charcoal-800">{b.title}</span>
                <span className="text-xs text-charcoal-500">{b.subtitle}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl text-charcoal-800 sm:text-2xl">Shop by category</h2>
            <p className="mt-1 text-sm text-charcoal-500">More categories are added regularly — check back often.</p>
          </div>
          <Link href="/categories" className="hidden text-sm font-semibold text-steel-700 hover:underline sm:block">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} productCount={countProductsInCategory(cat.id)} />
          ))}
        </div>
      </section>

      {latestProducts.length > 0 && (
        <section className="border-t border-charcoal-100 bg-charcoal-50/40 py-10 sm:py-14">
          <div className="container-page">
            <h2 className="mb-6 text-xl text-charcoal-800 sm:text-2xl">Recently added</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {latestProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-page py-10 sm:py-14">
        <div className="card flex flex-col items-start gap-4 bg-steel-800 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="text-xl text-white sm:text-2xl">Not sure which part you need?</h2>
            <p className="mt-1 text-sm text-steel-100">
              Call us or request a callback — we&apos;ll confirm the right part before you pay.
            </p>
          </div>
          <div className="flex gap-3">
            <a href={`tel:${siteConfig.phone}`} className="btn-primary">
              Call {siteConfig.phoneDisplay}
            </a>
            <Link href="/enquiry" className="btn-outline !border-white !bg-transparent !text-white hover:!bg-white/10">
              Send an enquiry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

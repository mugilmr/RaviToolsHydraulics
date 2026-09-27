import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TrustBadgeIcon } from "@/components/icons";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = { title: "About & Location" };

export default function AboutPage() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(siteConfig.mapQuery)}&output=embed`;

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About & Location" }]} />

      <h1 className="mb-2 text-2xl text-charcoal-800">About {siteConfig.name}</h1>
      <p className="mb-8 max-w-2xl text-charcoal-600">
        For {siteConfig.yearsInBusiness} years, {siteConfig.shortName} has supplied borewell hardware and hydraulic
        parts from Tiruchengode — India&apos;s borewell-mounting hub — to workshops and vehicle owners across the
        country. We stock {siteConfig.productCount} items: bolts and nuts, MS items, hydraulic fittings, lights,
        spanners, pipes, bearings and seals, pumps and motors, shafts and couplings, valves and fittings, borewell
        maintenance accessories, and custom parts.
      </p>

      <div className="mb-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {[
          { kind: "years" as const, title: `${siteConfig.yearsInBusiness} years`, sub: "In business" },
          { kind: "catalog" as const, title: siteConfig.productCount, sub: "Products stocked" },
          { kind: "delivery" as const, title: "Pan-India", sub: siteConfig.deliveryNote },
          { kind: "shield" as const, title: siteConfig.hours, sub: "Always reachable by phone" },
        ].map((b) => (
          <div key={b.sub} className="card flex flex-col items-start gap-2 p-4">
            <span className="text-steel-700"><TrustBadgeIcon kind={b.kind} /></span>
            <span className="font-heading text-lg text-charcoal-800">{b.title}</span>
            <span className="text-xs text-charcoal-500">{b.sub}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-xl text-charcoal-800">Visit or contact us</h2>
          <dl className="card divide-y divide-charcoal-100 p-5 text-sm">
            <div className="flex justify-between gap-4 py-2.5 first:pt-0">
              <dt className="font-semibold text-charcoal-500">Address</dt>
              <dd className="text-right text-charcoal-800">{siteConfig.address}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="font-semibold text-charcoal-500">Phone</dt>
              <dd><a href={`tel:${siteConfig.phone}`} className="text-steel-700 hover:underline">{siteConfig.phoneDisplay}</a></dd>
            </div>
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="font-semibold text-charcoal-500">Email</dt>
              <dd><a href={`mailto:${siteConfig.email}`} className="text-steel-700 hover:underline">{siteConfig.email}</a></dd>
            </div>
            <div className="flex justify-between gap-4 py-2.5 last:pb-0">
              <dt className="font-semibold text-charcoal-500">Hours</dt>
              <dd className="text-charcoal-800">{siteConfig.hours}</dd>
            </div>
          </dl>
        </div>

        <div className="overflow-hidden rounded-lg border border-charcoal-100">
          <iframe
            title="Shop location map"
            src={mapSrc}
            className="h-72 w-full lg:h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}

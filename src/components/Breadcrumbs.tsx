import Link from "next/link";
import { ChevronRightIcon } from "./icons";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-charcoal-500">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRightIcon className="h-3.5 w-3.5 text-charcoal-300" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-steel-700 hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-charcoal-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

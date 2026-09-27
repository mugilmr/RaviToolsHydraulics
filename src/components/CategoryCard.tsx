import Link from "next/link";
import Image from "next/image";
import { CategoryIcon } from "./icons";
import type { Category } from "@/lib/models/category";

export function CategoryCard({ category, productCount }: { category: Category; productCount?: number }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="card group relative flex flex-col overflow-hidden transition-shadow hover:shadow-lg"
    >
      <div className="relative flex aspect-[4/3] items-center justify-center bg-steel-700">
        {category.imageUrl && (
          <Image src={category.imageUrl} alt="" fill sizes="(max-width: 640px) 50vw, 280px" className="object-cover opacity-90" />
        )}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
          <CategoryIcon icon={category.icon} className="h-7 w-7" />
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-heading text-sm tracking-wide text-charcoal-800">{category.name}</h3>
        {category.description && (
          <p className="mt-1 line-clamp-2 text-xs text-charcoal-500">{category.description}</p>
        )}
        {typeof productCount === "number" && (
          <p className="mt-1.5 text-xs font-semibold text-safety-600">{productCount} products</p>
        )}
      </div>
    </Link>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatINR } from "@/lib/format";
import { useCart } from "@/lib/cart";
import type { ProductWithCategory } from "@/lib/models/product";

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <div className="card group flex flex-col overflow-hidden">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] bg-charcoal-50">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
            className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-charcoal-300">No photo yet</div>
        )}
        {!product.inStock && (
          <span className="badge absolute left-2 top-2 bg-charcoal-800/90 text-white">Out of stock</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link href={`/categories/${product.categorySlug}`} className="text-[11px] font-semibold uppercase tracking-wide text-safety-600 hover:underline">
          {product.categoryName}
        </Link>
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-semibold text-charcoal-800">{product.name}</h3>
        </Link>
        <p className="line-clamp-2 flex-1 text-xs text-charcoal-500">{product.description}</p>

        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-base font-bold text-steel-900">{formatINR(product.price)}</span>
          <button
            disabled={!product.inStock}
            onClick={() => {
              addItem(
                { productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl },
                1,
              );
              setAdded(true);
              setTimeout(() => setAdded(false), 1200);
            }}
            className="btn-primary !px-3 !py-1.5 !text-xs"
          >
            {added ? "Added ✓" : product.inStock ? "Order" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}

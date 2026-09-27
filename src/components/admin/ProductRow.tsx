"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatINR } from "@/lib/format";
import type { ProductWithCategory } from "@/lib/models/product";

export function ProductRow({ product }: { product: ProductWithCategory }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    await fetch(`/api/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    setBusy(true);
    await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <tr className={`border-b border-charcoal-50 last:border-0 ${busy ? "opacity-50" : ""}`}>
      <td className="p-3">
        <div className="relative h-12 w-12 overflow-hidden rounded bg-charcoal-50">
          {product.imageUrl && <Image src={product.imageUrl} alt="" fill sizes="48px" className="object-cover" />}
        </div>
      </td>
      <td className="p-3">
        <p className="font-medium text-charcoal-800">{product.name}</p>
        {product.isSample && <span className="badge mt-1 bg-safety-50 text-safety-700">Sample data</span>}
      </td>
      <td className="p-3 text-sm text-charcoal-500">{product.categoryName}</td>
      <td className="p-3 text-sm font-semibold text-charcoal-800">{formatINR(product.price)}</td>
      <td className="p-3">
        <button
          onClick={() => patch({ inStock: !product.inStock })}
          className={`badge ${product.inStock ? "bg-green-50 text-green-700" : "bg-charcoal-100 text-charcoal-500"}`}
        >
          {product.inStock ? "In stock" : "Out of stock"}
        </button>
      </td>
      <td className="p-3">
        <button
          onClick={() => patch({ published: !product.published })}
          className={`badge ${product.published ? "bg-steel-50 text-steel-700" : "bg-charcoal-100 text-charcoal-500"}`}
        >
          {product.published ? "Published" : "Hidden"}
        </button>
      </td>
      <td className="p-3 text-right">
        <Link href={`/admin/products/${product.id}/edit`} className="mr-3 text-sm font-semibold text-steel-700 hover:underline">
          Edit
        </Link>
        <button onClick={remove} className="text-sm font-semibold text-safety-600 hover:underline">
          Delete
        </button>
      </td>
    </tr>
  );
}

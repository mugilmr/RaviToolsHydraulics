"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/siteConfig";

export function ProductActions({
  productId,
  name,
  price,
  imageUrl,
  inStock,
}: {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  inStock: boolean;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const callMessage = `Hi, I'd like to ask about "${name}" before ordering — could someone call me back?`;

  return (
    <div className="flex flex-col gap-3">
      {inStock ? (
        <>
          <div className="flex items-center gap-3">
            <span className="label !mb-0">Qty</span>
            <div className="flex items-center rounded-md border border-charcoal-200">
              <button
                className="px-3 py-1.5 text-lg text-charcoal-600 disabled:opacity-40"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-semibold tabular-nums">{qty}</span>
              <button
                className="px-3 py-1.5 text-lg text-charcoal-600"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              className="btn-primary flex-1"
              onClick={() => {
                addItem({ productId, name, price, imageUrl }, qty);
                setAdded(true);
                setTimeout(() => setAdded(false), 1500);
              }}
            >
              {added ? "Added to cart ✓" : "Add to cart"}
            </button>
            <Link href="/cart" className="btn-secondary flex-1">
              View cart &amp; checkout
            </Link>
          </div>
        </>
      ) : (
        <div className="card border-charcoal-200 bg-charcoal-50 p-3 text-sm text-charcoal-600">
          This item is currently out of stock. Ask us for an ETA or an alternative.
        </div>
      )}

      <a
        href={buildWhatsAppLink(callMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline"
      >
        Not sure? Request a call
      </a>
      <a href={`tel:${siteConfig.phone}`} className="text-center text-sm font-semibold text-steel-700 hover:underline">
        or call {siteConfig.phoneDisplay} directly
      </a>
    </div>
  );
}

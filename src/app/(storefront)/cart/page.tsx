"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/format";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function CartPage() {
  const { items, updateQty, removeItem, total } = useCart();

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="mb-6 text-2xl text-charcoal-800">Your cart</h1>

      {items.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-charcoal-500">Your cart is empty.</p>
          <Link href="/categories" className="btn-primary mt-4 inline-flex">
            Browse categories
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="card divide-y divide-charcoal-100 lg:col-span-2">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3 p-3 sm:p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-charcoal-50">
                  {item.imageUrl && <Image src={item.imageUrl} alt="" fill sizes="64px" className="object-cover" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-2 text-sm font-semibold text-charcoal-800">{item.name}</p>
                    <button
                      className="shrink-0 text-charcoal-400 hover:text-safety-600"
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-charcoal-500">{formatINR(item.price)} each</p>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center rounded-md border border-charcoal-200">
                      <button
                        className="px-2 py-1 text-charcoal-600"
                        onClick={() => updateQty(item.productId, item.qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-7 text-center text-sm tabular-nums">{item.qty}</span>
                      <button
                        className="px-2 py-1 text-charcoal-600"
                        onClick={() => updateQty(item.productId, item.qty + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-charcoal-800">
                      {formatINR(item.price * item.qty)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card h-fit p-4 sm:p-6">
            <h2 className="mb-4 font-heading text-lg text-charcoal-800">Order summary</h2>
            <div className="flex justify-between text-sm text-charcoal-600">
              <span>Subtotal</span>
              <span>{formatINR(total)}</span>
            </div>
            <div className="flex justify-between text-sm text-charcoal-600">
              <span>Delivery</span>
              <span className="text-safety-600">Free</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-charcoal-100 pt-2 text-base font-bold text-charcoal-900">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
            <Link href="/checkout" className="btn-primary mt-4 w-full">
              Proceed to checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

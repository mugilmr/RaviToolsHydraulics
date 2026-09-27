"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/format";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { loadRazorpayScript } from "@/lib/loadRazorpayScript";
import { siteConfig } from "@/lib/siteConfig";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<"checkout" | "request-call" | null>(null);

  async function submitOrder(mode: "checkout" | "request-call") {
    setError(null);
    setSubmitting(mode);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          address,
          mode,
          items: items.map((i) => ({ productId: i.productId, name: i.name, price: i.price, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not place your order.");

      const { order, razorpay } = data as {
        order: { id: string };
        razorpay: { keyId: string; razorpayOrderId: string; amount: number; currency: string } | null;
      };

      if (razorpay) {
        const loaded = await loadRazorpayScript();
        if (!loaded || !window.Razorpay) {
          // Script blocked or offline — fall back to the pay-on-delivery flow.
          clear();
          router.push(`/checkout/success?order=${order.id}`);
          return;
        }
        const rzp = new window.Razorpay({
          key: razorpay.keyId,
          amount: razorpay.amount,
          currency: razorpay.currency,
          order_id: razorpay.razorpayOrderId,
          name: siteConfig.name,
          description: "Order payment",
          prefill: { name: customerName, contact: phone },
          theme: { color: "#f76a00" },
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            await fetch(`/api/orders/${order.id}/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            clear();
            router.push(`/checkout/success?order=${order.id}`);
          },
          modal: {
            ondismiss: () => setSubmitting(null),
          },
        });
        rzp.open();
      } else {
        clear();
        router.push(`/checkout/success?order=${order.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-page max-w-lg py-12 text-center">
        <p className="mb-4 text-charcoal-500">Your cart is empty.</p>
        <Link href="/categories" className="btn-primary inline-flex">Browse categories</Link>
      </div>
    );
  }

  const formValid = customerName.trim().length > 1 && phone.trim().length >= 10 && address.trim().length >= 5;

  return (
    <div className="container-page max-w-2xl py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <h1 className="mb-6 text-2xl text-charcoal-800">Checkout</h1>

      {error && <div className="mb-4 rounded-md bg-safety-50 p-3 text-sm text-safety-700">{error}</div>}

      <div className="card mb-6 p-5">
        <h2 className="mb-3 font-heading text-lg text-charcoal-800">Delivery details</h2>
        <div className="space-y-4">
          <div>
            <label className="label" htmlFor="customerName">Full name</label>
            <input id="customerName" className="input" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone number</label>
            <input id="phone" type="tel" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="address">Delivery address</label>
            <textarea id="address" rows={3} className="input" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card mb-6 p-5">
        <h2 className="mb-3 font-heading text-lg text-charcoal-800">Order summary</h2>
        <ul className="mb-3 divide-y divide-charcoal-50">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between py-2 text-sm">
              <span>{item.name} × {item.qty}</span>
              <span className="font-medium">{formatINR(item.price * item.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-charcoal-100 pt-2 text-base font-bold text-charcoal-900">
          <span>Total</span>
          <span>{formatINR(total)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          disabled={!formValid || submitting !== null}
          onClick={() => submitOrder("checkout")}
          className="btn-primary flex-1"
        >
          {submitting === "checkout" ? "Processing…" : "Pay & place order"}
        </button>
        <button
          disabled={!formValid || submitting !== null}
          onClick={() => submitOrder("request-call")}
          className="btn-outline flex-1"
        >
          {submitting === "request-call" ? "Sending…" : "Not sure — request a call"}
        </button>
      </div>
      {!formValid && <p className="mt-2 text-xs text-charcoal-400">Fill in your name, phone and address to continue.</p>}
    </div>
  );
}

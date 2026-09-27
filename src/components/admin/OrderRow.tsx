"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatINR } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/models/order";

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAID",
  "CALL_REQUESTED",
  "CONFIRMED",
  "FULFILLED",
  "CANCELLED",
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "bg-safety-50 text-safety-700",
  PAID: "bg-green-50 text-green-700",
  CALL_REQUESTED: "bg-steel-50 text-steel-700",
  CONFIRMED: "bg-steel-50 text-steel-700",
  FULFILLED: "bg-charcoal-100 text-charcoal-600",
  CANCELLED: "bg-charcoal-100 text-charcoal-400 line-through",
};

export function OrderRow({ order }: { order: Order }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function setStatus(status: OrderStatus) {
    setBusy(true);
    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className={`card p-4 ${busy ? "opacity-60" : ""}`}>
      <button onClick={() => setOpen((v) => !v)} className="flex w-full flex-wrap items-center justify-between gap-3 text-left">
        <div>
          <p className="font-semibold text-charcoal-800">
            {order.customerName} <span className="font-normal text-charcoal-400">· {order.phone}</span>
          </p>
          <p className="text-xs text-charcoal-400">
            #{order.id.slice(-6).toUpperCase()} · {new Date(order.createdAt).toLocaleString("en-IN")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-charcoal-800">{formatINR(order.total)}</span>
          <span className={`badge ${STATUS_COLORS[order.status]}`}>{order.status.replace(/_/g, " ")}</span>
        </div>
      </button>

      {open && (
        <div className="mt-4 border-t border-charcoal-100 pt-4">
          <p className="mb-2 text-sm text-charcoal-600"><strong>Address:</strong> {order.address}</p>
          <p className="mb-3 text-sm text-charcoal-600">
            <strong>Payment:</strong> {order.paymentMethod === "RAZORPAY" ? "Online (Razorpay)" : "Pay on delivery / UPI"}
          </p>
          <ul className="mb-4 divide-y divide-charcoal-50 rounded-md border border-charcoal-100">
            {order.items.map((item) => (
              <li key={item.productId} className="flex justify-between p-2.5 text-sm">
                <span>{item.name} × {item.qty}</span>
                <span className="font-medium">{formatINR(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          {order.notes && <p className="mb-3 text-sm text-charcoal-600"><strong>Notes:</strong> {order.notes}</p>}

          <div className="flex flex-wrap items-center gap-2">
            <span className="label !mb-0">Status:</span>
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                disabled={s === order.status}
                className={`badge ${s === order.status ? STATUS_COLORS[s] : "bg-white border border-charcoal-200 text-charcoal-500 hover:bg-charcoal-50"}`}
              >
                {s.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { getOrderById } from "@/lib/models/order";
import { buildWhatsAppLink, orderWhatsAppMessage } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";
export const metadata = { title: "Order Placed" };

type Props = { searchParams: Promise<{ order?: string }> };

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order: orderId } = await searchParams;
  const order = orderId ? getOrderById(orderId) : null;

  if (!order) {
    return (
      <div className="container-page max-w-lg py-16 text-center">
        <p className="mb-4 text-charcoal-500">We couldn&apos;t find that order.</p>
        <Link href="/" className="btn-primary inline-flex">Back to home</Link>
      </div>
    );
  }

  const isCallRequest = order.status === "CALL_REQUESTED";
  const isPaid = order.status === "PAID";

  const whatsappLink = buildWhatsAppLink(
    orderWhatsAppMessage({
      orderId: order.id,
      customerName: order.customerName,
      phone: order.phone,
      items: order.items,
      total: order.total,
      mode: isCallRequest ? "request-call" : "confirm-and-pay",
    }),
  );

  return (
    <div className="container-page max-w-lg py-12">
      <div className="card p-6 text-center sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="mb-2 text-2xl text-charcoal-800">
          {isCallRequest ? "We'll call you shortly" : isPaid ? "Payment received" : "Order placed"}
        </h1>
        <p className="mb-1 text-sm text-charcoal-500">Order #{order.id.slice(-6).toUpperCase()}</p>

        <p className="mb-6 text-charcoal-600">
          {isCallRequest
            ? `Thanks, ${order.customerName} — we'll call ${order.phone} shortly to confirm the right part before anything is charged.`
            : isPaid
              ? `Thanks, ${order.customerName} — your payment is confirmed. We'll prepare your order for delivery.`
              : `Thanks, ${order.customerName} — your order is noted. Pay by UPI or cash when it's delivered, or confirm now on WhatsApp.`}
        </p>

        <ul className="mb-6 divide-y divide-charcoal-50 rounded-md border border-charcoal-100 text-left text-sm">
          {order.items.map((item) => (
            <li key={item.productId} className="flex justify-between p-2.5">
              <span>{item.name} × {item.qty}</span>
              <span className="font-medium">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
            </li>
          ))}
        </ul>
        <div className="mb-6 flex justify-between text-base font-bold text-charcoal-900">
          <span>Total</span>
          <span>₹{order.total.toLocaleString("en-IN")}</span>
        </div>

        <div className="flex flex-col gap-3">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary">
            {isCallRequest ? "Message us on WhatsApp" : "Confirm on WhatsApp"}
          </a>
          <a href={`tel:${siteConfig.phone}`} className="btn-outline">Call {siteConfig.phoneDisplay}</a>
          <Link href="/categories" className="text-sm text-steel-700 hover:underline">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}

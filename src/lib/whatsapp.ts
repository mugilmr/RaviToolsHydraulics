import { siteConfig } from "./siteConfig";

/**
 * Builds a wa.me deep link with a pre-filled message. Works with no
 * backend or API keys — it just opens WhatsApp (app or web) with the
 * message ready to send to the shop's number.
 */
export function buildWhatsAppLink(message: string): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsapp}?text=${text}`;
}

export function orderWhatsAppMessage(params: {
  orderId: string;
  customerName: string;
  phone: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  mode: "confirm-and-pay" | "request-call";
}): string {
  const lines = [
    params.mode === "request-call"
      ? `Hi, I'd like a call back to confirm an order (Order #${params.orderId.slice(-6).toUpperCase()}).`
      : `Hi, I've placed an order (Order #${params.orderId.slice(-6).toUpperCase()}) and will pay on delivery/UPI.`,
    "",
    `Name: ${params.customerName}`,
    `Phone: ${params.phone}`,
    "",
    "Items:",
    ...params.items.map((i) => `- ${i.name} x${i.qty} — ₹${i.price * i.qty}`),
    "",
    `Total: ₹${params.total}`,
  ];
  return lines.join("\n");
}

export function enquiryWhatsAppMessage(name: string, message: string): string {
  return `Hi, I'm ${name}. ${message}`;
}

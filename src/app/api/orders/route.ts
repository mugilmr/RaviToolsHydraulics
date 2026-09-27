import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { createOrder, listOrders } from "@/lib/models/order";
import { orderInputSchema } from "@/lib/validators";
import { getProductById } from "@/lib/models/product";
import { isRazorpayConfigured, createRazorpayOrder } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;
  return NextResponse.json({ orders: listOrders() });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = orderInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid order." }, { status: 400 });
  }
  const { customerName, phone, address, items, mode, notes } = parsed.data;

  // Never trust client-supplied prices — re-price every line from the
  // database so a tampered request can't check out at a different amount.
  const authoritativeItems: { productId: string; name: string; price: number; qty: number }[] = [];
  for (const line of items) {
    const product = getProductById(line.productId);
    if (!product || !product.published) {
      return NextResponse.json({ error: `"${line.name}" is no longer available.` }, { status: 409 });
    }
    const qty = Math.min(Math.max(Math.round(line.qty), 1), 500);
    authoritativeItems.push({ productId: product.id, name: product.name, price: product.price, qty });
  }
  const total = authoritativeItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (mode === "request-call") {
    const order = createOrder({
      customerName,
      phone,
      address,
      items: authoritativeItems,
      total,
      paymentMethod: "CALL_AND_PAY_ON_DELIVERY",
      status: "CALL_REQUESTED",
      notes,
    });
    return NextResponse.json({ order, razorpay: null }, { status: 201 });
  }

  // mode === "checkout"
  if (!isRazorpayConfigured()) {
    const order = createOrder({
      customerName,
      phone,
      address,
      items: authoritativeItems,
      total,
      paymentMethod: "CALL_AND_PAY_ON_DELIVERY",
      status: "PENDING_PAYMENT",
      notes,
    });
    return NextResponse.json({ order, razorpay: null }, { status: 201 });
  }

  const order = createOrder({
    customerName,
    phone,
    address,
    items: authoritativeItems,
    total,
    paymentMethod: "RAZORPAY",
    status: "PENDING_PAYMENT",
    notes,
  });

  try {
    const rpOrder = await createRazorpayOrder(total, order.id);
    const { attachRazorpayOrderId } = await import("@/lib/models/order");
    attachRazorpayOrderId(order.id, rpOrder.id);
    return NextResponse.json({
      order: { ...order, razorpayOrderId: rpOrder.id },
      razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID,
        razorpayOrderId: rpOrder.id,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
      },
    }, { status: 201 });
  } catch (err) {
    console.error("Razorpay order creation failed, falling back to pay-on-delivery:", err);
    return NextResponse.json({ order, razorpay: null }, { status: 201 });
  }
}

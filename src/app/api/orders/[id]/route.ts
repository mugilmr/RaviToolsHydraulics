import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { getOrderById, updateOrderStatus, type OrderStatus } from "@/lib/models/order";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

const VALID_STATUSES: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAID",
  "CALL_REQUESTED",
  "CONFIRMED",
  "FULFILLED",
  "CANCELLED",
];

/** Public by design: this is the guest order-confirmation lookup, keyed by
 * an unguessable id (same pattern as most checkout "thank you" pages). */
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;
  const { id } = await params;

  const body = await request.json();
  if (!VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  const order = updateOrderStatus(id, body.status);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  return NextResponse.json({ order });
}

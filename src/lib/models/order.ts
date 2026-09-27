import { db } from "../db";
import { newId } from "../id";

export type OrderItem = { productId: string; name: string; price: number; qty: number };

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "CALL_REQUESTED"
  | "CONFIRMED"
  | "FULFILLED"
  | "CANCELLED";

export type PaymentMethod = "RAZORPAY" | "CALL_AND_PAY_ON_DELIVERY";

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

type OrderRow = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  items: string;
  total: number;
  payment_method: PaymentMethod;
  status: OrderStatus;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

function mapRow(row: OrderRow): Order {
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    address: row.address,
    items: JSON.parse(row.items) as OrderItem[],
    total: row.total,
    paymentMethod: row.payment_method,
    status: row.status,
    razorpayOrderId: row.razorpay_order_id,
    razorpayPaymentId: row.razorpay_payment_id,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createOrder(input: {
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  paymentMethod: PaymentMethod;
  status?: OrderStatus;
  notes?: string;
}): Order {
  const id = newId("order");
  db.prepare(
    `INSERT INTO orders (id, customer_name, phone, address, items, total, payment_method, status, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    input.customerName,
    input.phone,
    input.address,
    JSON.stringify(input.items),
    input.total,
    input.paymentMethod,
    input.status ?? "PENDING_PAYMENT",
    input.notes ?? null,
  );
  return getOrderById(id)!;
}

export function getOrderById(id: string): Order | null {
  const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as OrderRow | undefined;
  return row ? mapRow(row) : null;
}

export function listOrders(): Order[] {
  const rows = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all() as OrderRow[];
  return rows.map(mapRow);
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus,
  extra?: { razorpayOrderId?: string; razorpayPaymentId?: string },
): Order | null {
  db.prepare(
    `UPDATE orders SET status = ?, razorpay_order_id = COALESCE(?, razorpay_order_id),
       razorpay_payment_id = COALESCE(?, razorpay_payment_id), updated_at = datetime('now')
     WHERE id = ?`,
  ).run(status, extra?.razorpayOrderId ?? null, extra?.razorpayPaymentId ?? null, id);
  return getOrderById(id);
}

export function attachRazorpayOrderId(id: string, razorpayOrderId: string): void {
  db.prepare("UPDATE orders SET razorpay_order_id = ?, updated_at = datetime('now') WHERE id = ?").run(
    razorpayOrderId,
    id,
  );
}

export function countOrdersByStatus(status: OrderStatus): number {
  const row = db.prepare("SELECT COUNT(*) as c FROM orders WHERE status = ?").get(status) as {
    c: number;
  };
  return row.c;
}

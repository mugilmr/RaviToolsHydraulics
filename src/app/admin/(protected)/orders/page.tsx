import { listOrders } from "@/lib/models/order";
import { OrderRow } from "@/components/admin/OrderRow";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders" };

export default function AdminOrdersPage() {
  const orders = listOrders();

  return (
    <div>
      <h1 className="mb-1 text-2xl text-charcoal-800">Orders</h1>
      <p className="mb-6 text-sm text-charcoal-500">Tap an order to see items, address and update its status.</p>

      {orders.length === 0 ? (
        <div className="card p-8 text-center text-charcoal-500">No orders yet.</div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <OrderRow key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { listCategories } from "@/lib/models/category";
import { listProducts } from "@/lib/models/product";
import { listOrders, countOrdersByStatus } from "@/lib/models/order";
import { countNewEnquiries } from "@/lib/models/enquiry";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default function AdminDashboard() {
  const categories = listCategories();
  const products = listProducts();
  const sampleCount = products.filter((p) => p.isSample).length;
  const pendingOrders = countOrdersByStatus("PENDING_PAYMENT") + countOrdersByStatus("CALL_REQUESTED");
  const newEnquiries = countNewEnquiries();
  const recentOrders = listOrders().slice(0, 5);

  const stats = [
    { label: "Products", value: products.length, href: "/admin/products" },
    { label: "Categories", value: categories.length, href: "/admin/categories" },
    { label: "Orders needing attention", value: pendingOrders, href: "/admin/orders" },
    { label: "New enquiries", value: newEnquiries, href: "/admin/enquiries" },
  ];

  return (
    <div>
      <h1 className="mb-1 text-2xl text-charcoal-800">Dashboard</h1>
      <p className="mb-6 text-sm text-charcoal-500">A quick look at the shop.</p>

      {sampleCount > 0 && (
        <div className="card mb-6 flex flex-wrap items-center justify-between gap-3 border-safety-200 bg-safety-50 p-4">
          <p className="text-sm text-safety-800">
            <strong>{sampleCount} sample product{sampleCount === 1 ? "" : "s"}</strong> are still live on the site
            (placeholder photos and prices) — replace them as real stock is photographed.
          </p>
          <Link href="/admin/products?filter=sample" className="btn-outline !border-safety-300 !text-safety-700">
            Review sample products
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-4 hover:shadow-md">
            <p className="font-heading text-3xl text-steel-900">{s.value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-charcoal-500">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/products/new" className="btn-primary">+ Add a product</Link>
        <Link href="/admin/categories" className="btn-outline">Manage categories</Link>
      </div>

      <div className="card mt-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-charcoal-100 p-4">
          <h2 className="font-heading text-lg text-charcoal-800">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-steel-700 hover:underline">View all →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="p-4 text-sm text-charcoal-500">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-charcoal-50 last:border-0">
                  <td className="p-3 font-medium text-charcoal-800">{o.customerName}</td>
                  <td className="p-3 text-charcoal-500">{o.phone}</td>
                  <td className="p-3 text-charcoal-500">₹{o.total.toLocaleString("en-IN")}</td>
                  <td className="p-3">
                    <span className="badge bg-steel-50 text-steel-700">{o.status.replace(/_/g, " ")}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

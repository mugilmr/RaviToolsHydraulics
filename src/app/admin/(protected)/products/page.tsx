import Link from "next/link";
import { listProducts } from "@/lib/models/product";
import { ProductRow } from "@/components/admin/ProductRow";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products" };

type Props = { searchParams: Promise<{ filter?: string }> };

export default async function AdminProductsPage({ searchParams }: Props) {
  const { filter } = await searchParams;
  const allProducts = listProducts();
  const products = filter === "sample" ? allProducts.filter((p) => p.isSample) : allProducts;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-charcoal-800">Products</h1>
          <p className="text-sm text-charcoal-500">
            {filter === "sample" ? "Showing sample placeholder products only." : `${products.length} products.`}
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">+ Add product</Link>
      </div>

      {filter === "sample" && (
        <Link href="/admin/products" className="mb-4 inline-block text-sm text-steel-700 hover:underline">
          ← Show all products
        </Link>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-charcoal-100 text-left text-xs font-semibold uppercase tracking-wide text-charcoal-400">
              <th className="p-3 font-semibold">Photo</th>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Category</th>
              <th className="p-3 font-semibold">Price</th>
              <th className="p-3 font-semibold">Stock</th>
              <th className="p-3 font-semibold">Visibility</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <ProductRow key={p.id} product={p} />
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-6 text-center text-charcoal-500">No products yet.</p>}
      </div>
    </div>
  );
}

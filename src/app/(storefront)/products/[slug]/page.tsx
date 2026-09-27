import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug } from "@/lib/models/product";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductActions } from "@/components/ProductActions";
import { formatINR } from "@/lib/format";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || !product.published) notFound();

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: product.categoryName, href: `/categories/${product.categorySlug}` },
          { label: product.name },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-charcoal-50">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-charcoal-300">No photo yet</div>
          )}
        </div>

        <div>
          <h1 className="text-2xl text-charcoal-900">{product.name}</h1>
          <p className="mt-2 text-3xl font-bold text-steel-900">{formatINR(product.price)}</p>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-charcoal-600">
            {product.description}
          </p>

          <div className="mt-6">
            <ProductActions
              productId={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
              inStock={product.inStock}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

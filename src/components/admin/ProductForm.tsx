"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { compressImage } from "@/lib/compressImage";
import type { Category } from "@/lib/models/category";
import type { Product } from "@/lib/models/product";

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? "");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [published, setPublished] = useState(product?.published ?? true);
  const [imageUrl, setImageUrl] = useState<string | null>(product?.imageUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const compressed = await compressImage(file);
      const form = new FormData();
      form.append("file", compressed);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed.");
      setImageUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload image.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let finalCategoryId = categoryId;

      if (showNewCategory && newCategoryName.trim()) {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategoryName.trim() }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not create category.");
        finalCategoryId = data.category.id;
      }

      if (!finalCategoryId) throw new Error("Choose or create a category.");

      const payload = {
        name,
        description,
        price: Number(price),
        categoryId: finalCategoryId,
        imageUrl,
        inStock,
        published,
      };

      const res = await fetch(isEdit ? `/api/products/${product!.id}` : "/api/products", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save product.");

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr,320px]">
      <div className="card space-y-4 p-5">
        {error && <div className="rounded-md bg-safety-50 p-3 text-sm text-safety-700">{error}</div>}

        <div>
          <label className="label" htmlFor="name">Product name</label>
          <input id="name" required className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea
            id="description"
            required
            rows={4}
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="price">Price (₹)</label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              required
              className="input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor="category">Category</label>
            {!showNewCategory ? (
              <select id="category" className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            ) : (
              <input
                className="input"
                placeholder="New category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            )}
            <button
              type="button"
              onClick={() => setShowNewCategory((v) => !v)}
              className="mt-1 text-xs font-semibold text-steel-700 hover:underline"
            >
              {showNewCategory ? "Choose existing category instead" : "+ Create a new category"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-charcoal-700">
            <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
            In stock
          </label>
          <label className="flex items-center gap-2 text-sm text-charcoal-700">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Published (visible on the site)
          </label>
        </div>
      </div>

      <div className="card h-fit space-y-3 p-5">
        <label className="label">Photo</label>
        <div className="relative aspect-square overflow-hidden rounded-md bg-charcoal-50">
          {imageUrl ? (
            <Image src={imageUrl} alt="" fill sizes="320px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-charcoal-400">No photo yet</div>
          )}
        </div>
        <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="text-sm" />
        {uploading && <p className="text-xs text-charcoal-500">Uploading…</p>}

        <button type="submit" disabled={saving || uploading} className="btn-primary w-full">
          {saving ? "Saving…" : isEdit ? "Save changes" : "Publish product"}
        </button>
      </div>
    </form>
  );
}

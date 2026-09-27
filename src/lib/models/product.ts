import { db } from "../db";
import { newId } from "../id";
import { slugify } from "../format";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string | null;
  inStock: boolean;
  published: boolean;
  isSample: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductWithCategory = Product & {
  categoryName: string;
  categorySlug: string;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string | null;
  in_stock: number;
  published: number;
  is_sample: number;
  category_id: string;
  created_at: string;
  updated_at: string;
  category_name?: string;
  category_slug?: string;
};

function mapRow(row: ProductRow): ProductWithCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    imageUrl: row.image_url,
    inStock: !!row.in_stock,
    published: !!row.published,
    isSample: !!row.is_sample,
    categoryId: row.category_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    categoryName: row.category_name ?? "",
    categorySlug: row.category_slug ?? "",
  };
}

const BASE_SELECT = `
  SELECT p.*, c.name as category_name, c.slug as category_slug
  FROM products p JOIN categories c ON c.id = p.category_id
`;

export function listProducts(opts: {
  categorySlug?: string;
  query?: string;
  publishedOnly?: boolean;
  includeSampleFlag?: boolean;
  limit?: number;
} = {}): ProductWithCategory[] {
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (opts.publishedOnly) clauses.push("p.published = 1");
  if (opts.categorySlug) {
    clauses.push("c.slug = ?");
    params.push(opts.categorySlug);
  }
  if (opts.query && opts.query.trim()) {
    clauses.push("(p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)");
    const like = `%${opts.query.trim()}%`;
    params.push(like, like, like);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const limit = opts.limit ? `LIMIT ${Math.min(Math.max(opts.limit, 1), 200)}` : "";
  const rows = db
    .prepare(`${BASE_SELECT} ${where} ORDER BY p.created_at DESC ${limit}`)
    .all(...params) as ProductRow[];
  return rows.map(mapRow);
}

export function getProductBySlug(slug: string): ProductWithCategory | null {
  const row = db.prepare(`${BASE_SELECT} WHERE p.slug = ?`).get(slug) as ProductRow | undefined;
  return row ? mapRow(row) : null;
}

export function getProductById(id: string): ProductWithCategory | null {
  const row = db.prepare(`${BASE_SELECT} WHERE p.id = ?`).get(id) as ProductRow | undefined;
  return row ? mapRow(row) : null;
}

function uniqueSlug(base: string, ignoreId?: string): string {
  const slug = slugify(base);
  let attempt = slug;
  let n = 1;
  while (true) {
    const existing = db.prepare("SELECT id FROM products WHERE slug = ?").get(attempt) as
      | { id: string }
      | undefined;
    if (!existing || existing.id === ignoreId) return attempt;
    n += 1;
    attempt = `${slug}-${n}`;
  }
}

export function createProduct(input: {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl?: string | null;
  inStock?: boolean;
  published?: boolean;
}): Product {
  const id = newId("prod");
  const slug = uniqueSlug(input.name);
  db.prepare(
    `INSERT INTO products (id, name, slug, description, price, image_url, category_id, in_stock, published)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    input.name,
    slug,
    input.description,
    input.price,
    input.imageUrl ?? null,
    input.categoryId,
    input.inStock === false ? 0 : 1,
    input.published === false ? 0 : 1,
  );
  return getProductById(id)!;
}

export function updateProduct(
  id: string,
  input: {
    name?: string;
    description?: string;
    price?: number;
    categoryId?: string;
    imageUrl?: string | null;
    inStock?: boolean;
    published?: boolean;
  },
): Product | null {
  const existing = getProductById(id);
  if (!existing) return null;

  const name = input.name?.trim() || existing.name;
  const slug = input.name && input.name !== existing.name ? uniqueSlug(input.name, id) : existing.slug;

  db.prepare(
    `UPDATE products SET name = ?, slug = ?, description = ?, price = ?, category_id = ?,
       image_url = ?, in_stock = ?, published = ?, updated_at = datetime('now')
     WHERE id = ?`,
  ).run(
    name,
    slug,
    input.description ?? existing.description,
    input.price ?? existing.price,
    input.categoryId ?? existing.categoryId,
    input.imageUrl !== undefined ? input.imageUrl : existing.imageUrl,
    input.inStock !== undefined ? (input.inStock ? 1 : 0) : existing.inStock ? 1 : 0,
    input.published !== undefined ? (input.published ? 1 : 0) : existing.published ? 1 : 0,
    id,
  );
  return getProductById(id);
}

export function deleteProduct(id: string): void {
  db.prepare("DELETE FROM products WHERE id = ?").run(id);
}

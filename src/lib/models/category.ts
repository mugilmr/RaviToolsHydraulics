import { db } from "../db";
import { newId } from "../id";
import { slugify } from "../format";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  imageUrl: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

function mapRow(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    icon: row.icon,
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function listCategories(): Category[] {
  const rows = db
    .prepare("SELECT * FROM categories ORDER BY sort_order ASC, name ASC")
    .all() as CategoryRow[];
  return rows.map(mapRow);
}

export function getCategoryBySlug(slug: string): Category | null {
  const row = db.prepare("SELECT * FROM categories WHERE slug = ?").get(slug) as
    | CategoryRow
    | undefined;
  return row ? mapRow(row) : null;
}

export function getCategoryById(id: string): Category | null {
  const row = db.prepare("SELECT * FROM categories WHERE id = ?").get(id) as
    | CategoryRow
    | undefined;
  return row ? mapRow(row) : null;
}

export function countProductsInCategory(categoryId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) as c FROM products WHERE category_id = ?")
    .get(categoryId) as { c: number };
  return row.c;
}

function uniqueSlug(base: string, ignoreId?: string): string {
  let slug = slugify(base);
  let attempt = slug;
  let n = 1;
  while (true) {
    const existing = db.prepare("SELECT id FROM categories WHERE slug = ?").get(attempt) as
      | { id: string }
      | undefined;
    if (!existing || existing.id === ignoreId) return attempt;
    n += 1;
    attempt = `${slug}-${n}`;
  }
}

export function createCategory(input: {
  name: string;
  description?: string | null;
  icon?: string;
  imageUrl?: string | null;
}): Category {
  const id = newId("cat");
  const slug = uniqueSlug(input.name);
  const maxOrder = (
    db.prepare("SELECT COALESCE(MAX(sort_order), -1) as m FROM categories").get() as { m: number }
  ).m;
  db.prepare(
    `INSERT INTO categories (id, name, slug, description, icon, image_url, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(id, input.name, slug, input.description ?? null, input.icon ?? "wrench", input.imageUrl ?? null, maxOrder + 1);
  return getCategoryById(id)!;
}

export function updateCategory(
  id: string,
  input: { name?: string; description?: string | null; icon?: string; imageUrl?: string | null },
): Category | null {
  const existing = getCategoryById(id);
  if (!existing) return null;

  const name = input.name?.trim() || existing.name;
  const slug = input.name && input.name !== existing.name ? uniqueSlug(input.name, id) : existing.slug;

  db.prepare(
    `UPDATE categories SET name = ?, slug = ?, description = ?, icon = ?, image_url = ?, updated_at = datetime('now')
     WHERE id = ?`,
  ).run(
    name,
    slug,
    input.description !== undefined ? input.description : existing.description,
    input.icon ?? existing.icon,
    input.imageUrl !== undefined ? input.imageUrl : existing.imageUrl,
    id,
  );
  return getCategoryById(id);
}

/** Reassigns every product out of `fromId` into `toId`, then deletes `fromId`. */
export function mergeCategories(fromId: string, toId: string): void {
  const tx = db.transaction(() => {
    db.prepare("UPDATE products SET category_id = ? WHERE category_id = ?").run(toId, fromId);
    db.prepare("DELETE FROM categories WHERE id = ?").run(fromId);
  });
  tx();
}

export function deleteCategory(id: string): { ok: boolean; reason?: string } {
  const count = countProductsInCategory(id);
  if (count > 0) {
    return { ok: false, reason: `This category still has ${count} product(s). Move or delete them first, or merge into another category.` };
  }
  db.prepare("DELETE FROM categories WHERE id = ?").run(id);
  return { ok: true };
}

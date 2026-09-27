import type Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { newId } from "../id";

function placeholderSvg(label: string, bg: string): string {
  const words = label.split(" ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
    <rect width="600" height="450" fill="${bg}"/>
    <g fill="none" stroke="#ffffff" stroke-width="6" opacity="0.35">
      <circle cx="300" cy="180" r="70"/>
      <circle cx="300" cy="180" r="24"/>
      <path d="M300 110 L300 60 M300 250 L300 300 M230 180 L180 180 M370 180 L420 180" stroke-width="10"/>
    </g>
    <text x="300" y="380" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#ffffff" text-anchor="middle">${words[0] ?? ""}</text>
    <text x="300" y="415" font-family="Arial, sans-serif" font-size="22" fill="#ffffffcc" text-anchor="middle">${words.slice(1).join(" ")}</text>
  </svg>`;
}

function writePlaceholder(slug: string, label: string, bg: string): string {
  const dir = path.join(process.cwd(), "public", "uploads", "samples");
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, `${slug}.svg`), placeholderSvg(label, bg));
  return `/uploads/samples/${slug}.svg`;
}

const CATEGORY_SEED = [
  {
    name: "Bolts and Nuts",
    slug: "bolts-and-nuts",
    icon: "bolt",
    description: "MS and HT bolts, nuts, washers and fasteners in every common size.",
    bg: "#2f5c81",
    products: [
      { name: "Hex Bolt M12 x 50mm (MS)", price: 12, desc: "Standard MS hex bolt, M12 thread, 50mm length. Sold per piece; box quantities available." },
      { name: "High-Tensile Nut M16", price: 8, desc: "Grade 8 high-tensile nut, M16, for structural and borewell-mount fastening." },
    ],
  },
  {
    name: "Screw Drivers",
    slug: "screw-drivers",
    icon: "screwdriver",
    description: "Flat and Phillips screwdrivers for workshop and field maintenance use.",
    bg: "#d65900",
    products: [
      { name: "Phillips Screwdriver 8-inch", price: 95, desc: "Heavy-duty PH2 screwdriver with insulated grip, 8-inch shaft." },
      { name: "Flat-Head Screwdriver Set (3pc)", price: 220, desc: "3-piece flat-head screwdriver set, sizes 4mm/6mm/8mm, forged steel tips." },
    ],
  },
  {
    name: "Double End and Rings",
    slug: "double-end-and-rings",
    icon: "wrench",
    description: "Double-end spanners and ring spanners across the full metric range.",
    bg: "#284a65",
    products: [
      { name: "Double End Spanner 17x19mm", price: 140, desc: "Drop-forged chrome-vanadium double-end spanner, 17mm and 19mm." },
      { name: "Ring Spanner Set 8-24mm", price: 850, desc: "8-piece ring spanner set covering 8mm to 24mm, chrome-plated finish." },
    ],
  },
  {
    name: "Hydraulic Fittings",
    slug: "hydraulic-fittings",
    icon: "gauge",
    description: "Hydraulic hose fittings, adapters and couplings for borewell rigs.",
    bg: "#7a3200",
    products: [
      { name: 'Hydraulic Hose Adapter 1/2" BSP', price: 180, desc: "1/2 inch BSP male-to-male hydraulic hose adapter, zinc-plated." },
      { name: "Quick-Release Hydraulic Coupling", price: 460, desc: "Quick-release hydraulic coupling set for fast line changes in the field." },
    ],
  },
  {
    name: "MS Pipe Fittings",
    slug: "ms-pipe-fittings",
    icon: "pipe",
    description: "MS elbows, tees, sockets and reducers for pipe and body-building work.",
    bg: "#1f3a4f",
    products: [
      { name: "MS Elbow 2 inch", price: 210, desc: "2-inch mild steel elbow fitting, welded joint quality." },
      { name: "MS Pipe Socket 1.5 inch", price: 95, desc: "1.5-inch MS pipe socket for straight pipe joins." },
    ],
  },
];

function slugifyName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function seedIfEmpty(db: Database.Database) {
  const adminCount = (db.prepare("SELECT COUNT(*) as c FROM admins").get() as { c: number }).c;
  if (adminCount === 0) {
    const email = (process.env.ADMIN_EMAIL || "ravitools76@gmail.com").trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "change-me-on-first-login";
    const passwordHash = bcrypt.hashSync(password, 10);
    db.prepare(
      "INSERT INTO admins (id, email, password_hash) VALUES (?, ?, ?)",
    ).run(newId("admin"), email, passwordHash);
    console.log(`[seed] Admin account created: ${email}`);
  }

  const categoryCount = (db.prepare("SELECT COUNT(*) as c FROM categories").get() as { c: number }).c;
  if (categoryCount > 0) return;

  const insertCategory = db.prepare(
    "INSERT INTO categories (id, name, slug, description, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
  );
  const insertProduct = db.prepare(
    `INSERT INTO products (id, name, slug, description, price, image_url, category_id, is_sample)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
  );

  const seedTx = db.transaction(() => {
    CATEGORY_SEED.forEach((cat, index) => {
      const categoryId = newId("cat");
      insertCategory.run(categoryId, cat.name, cat.slug, cat.description, cat.icon, index);

      for (const p of cat.products) {
        const slug = `${cat.slug}-${slugifyName(p.name)}`;
        const imageUrl = writePlaceholder(slug, p.name, cat.bg);
        insertProduct.run(newId("prod"), p.name, slug, p.desc, p.price, imageUrl, categoryId);
      }
    });
  });

  seedTx();
  console.log("[seed] 5 launch categories with sample products created (marked isSample — replace from the admin panel).");
}

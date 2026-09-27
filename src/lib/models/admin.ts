import { db } from "../db";

export type Admin = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

type AdminRow = {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
};

function mapRow(row: AdminRow): Admin {
  return { id: row.id, email: row.email, passwordHash: row.password_hash, createdAt: row.created_at };
}

export function findAdminByEmail(email: string): Admin | null {
  const row = db.prepare("SELECT * FROM admins WHERE email = ?").get(email) as AdminRow | undefined;
  return row ? mapRow(row) : null;
}

export function findAdminById(id: string): Admin | null {
  const row = db.prepare("SELECT * FROM admins WHERE id = ?").get(id) as AdminRow | undefined;
  return row ? mapRow(row) : null;
}

export function updateAdminPassword(id: string, passwordHash: string): void {
  db.prepare("UPDATE admins SET password_hash = ? WHERE id = ?").run(passwordHash, id);
}

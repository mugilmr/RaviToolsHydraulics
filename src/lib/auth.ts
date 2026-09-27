import { cookies } from "next/headers";
import { db } from "./db";
import { newId } from "./id";
import { findAdminById, type Admin } from "./models/admin";
import { SESSION_COOKIE_NAME } from "./constants";

const SESSION_COOKIE = SESSION_COOKIE_NAME;
const SESSION_DAYS = 30;

export function sessionCookieName() {
  return SESSION_COOKIE;
}

export function createSession(adminId: string): string {
  const id = newId("sess");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  db.prepare("INSERT INTO sessions (id, admin_id, expires_at) VALUES (?, ?, ?)").run(
    id,
    adminId,
    expiresAt,
  );
  return id;
}

export async function getCurrentAdmin(): Promise<Admin | null> {
  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const session = db.prepare("SELECT * FROM sessions WHERE id = ?").get(sessionId) as
    | { id: string; admin_id: string; expires_at: string }
    | undefined;
  if (!session) return null;
  if (new Date(session.expires_at) < new Date()) {
    db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
    return null;
  }
  return findAdminById(session.admin_id);
}

export function destroySession(sessionId: string) {
  db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
}

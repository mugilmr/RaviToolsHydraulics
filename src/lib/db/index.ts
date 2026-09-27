import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { SCHEMA_SQL } from "./schema";
import { seedIfEmpty } from "./seed";

// Reuse one connection across hot reloads in dev and across invocations on
// a warm serverless/long-running instance in production.
const globalForDb = globalThis as unknown as { __raviDb?: Database.Database };

function openDatabase(): Database.Database {
  const dbPath = process.env.DATABASE_PATH || "./data/app.db";
  const resolved = path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });

  const database = new Database(resolved);
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  database.exec(SCHEMA_SQL);
  return database;
}

export const db = globalForDb.__raviDb ?? openDatabase();
if (process.env.NODE_ENV !== "production") globalForDb.__raviDb = db;

// Populate launch categories + sample products + the admin account on a
// fresh database. Safe to call on every boot — it no-ops once seeded.
seedIfEmpty(db);

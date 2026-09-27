// Wipes the local database file and reseeds from scratch. Useful in
// development when you want to throw away test orders/products and start
// clean. NEVER run this against a live database with real orders in it.
import fs from "fs";
import path from "path";

const dbPath = process.env.DATABASE_PATH || "./data/app.db";
const resolved = path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath);

for (const suffix of ["", "-wal", "-shm"]) {
  const file = `${resolved}${suffix}`;
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

console.log(`Removed ${resolved} (and its -wal/-shm files, if present).`);

// Re-importing triggers schema creation + seeding again.
import("../src/lib/db").then(() => {
  console.log("Database recreated and reseeded.");
});

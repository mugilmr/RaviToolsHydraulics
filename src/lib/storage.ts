import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

/**
 * Image storage adapter. Default driver ("local") writes to
 * /public/uploads — fine for a VPS, Railway, Render or Docker deploy
 * with a persistent disk. On a serverless host with an ephemeral
 * filesystem (Vercel), set STORAGE_DRIVER=cloudinary and fill in the
 * CLOUDINARY_* env vars — swap the implementation below for an
 * unsigned Cloudinary upload call; the call sites elsewhere in the
 * app never change.
 */
export async function saveUploadedImage(
  buffer: Buffer,
  originalName: string,
): Promise<string> {
  const driver = process.env.STORAGE_DRIVER || "local";

  if (driver === "cloudinary") {
    throw new Error(
      "STORAGE_DRIVER=cloudinary is selected but not implemented yet — " +
        "fill in src/lib/storage.ts with your Cloudinary credentials, or set STORAGE_DRIVER=local.",
    );
  }

  const ext = path.extname(originalName).toLowerCase() || ".jpg";
  const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext) ? ext : ".jpg";
  const filename = `${crypto.randomBytes(12).toString("hex")}${safeExt}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/${filename}`;
}

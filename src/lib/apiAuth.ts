import { NextResponse } from "next/server";
import { getCurrentAdmin } from "./auth";
import type { Admin } from "./models/admin";

/** Use at the top of any admin-only API route. Returns the admin, or an
 * already-built 401 NextResponse to return immediately (`if (result instanceof NextResponse) return result;`). */
export async function requireAdmin(): Promise<Admin | NextResponse> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  return admin;
}

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findAdminByEmail } from "@/lib/models/admin";
import { createSession, sessionCookieName } from "@/lib/auth";
import { loginInputSchema } from "@/lib/validators";
import { isRateLimited, recordFailedAttempt, clearAttempts } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Wait 15 minutes and try again." },
      { status: 429 },
    );
  }

  const body = await request.json();
  const parsed = loginInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  const admin = findAdminByEmail(parsed.data.email.trim().toLowerCase());
  const validPassword = admin ? await bcrypt.compare(parsed.data.password, admin.passwordHash) : false;

  if (!admin || !validPassword) {
    recordFailedAttempt(ip);
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  clearAttempts(ip);
  const sessionId = createSession(admin.id);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieName(), sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

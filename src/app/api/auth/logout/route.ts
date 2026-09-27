import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySession, sessionCookieName } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const store = await cookies();
  const sessionId = store.get(sessionCookieName())?.value;
  if (sessionId) destroySession(sessionId);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieName(), "", { path: "/", maxAge: 0 });
  return response;
}

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { createEnquiry, listEnquiries } from "@/lib/models/enquiry";
import { enquiryInputSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;
  return NextResponse.json({ enquiries: listEnquiries() });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = enquiryInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const enquiry = createEnquiry(parsed.data);
  return NextResponse.json({ enquiry }, { status: 201 });
}

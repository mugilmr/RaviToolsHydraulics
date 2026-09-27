import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { setEnquiryStatus } from "@/lib/models/enquiry";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;
  const { id } = await params;

  const body = await request.json();
  if (body.status !== "NEW" && body.status !== "RESOLVED") {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  setEnquiryStatus(id, body.status);
  return NextResponse.json({ ok: true });
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Enquiry } from "@/lib/models/enquiry";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function EnquiryRow({ enquiry }: { enquiry: Enquiry }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggleStatus() {
    setBusy(true);
    await fetch(`/api/enquiries/${enquiry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: enquiry.status === "NEW" ? "RESOLVED" : "NEW" }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className={`card p-4 ${busy ? "opacity-60" : ""} ${enquiry.status === "NEW" ? "border-safety-200" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-charcoal-800">
            {enquiry.name} <span className="font-normal text-charcoal-400">· {enquiry.phone}</span>
          </p>
          <p className="mt-1 text-sm text-charcoal-600">{enquiry.message}</p>
          <p className="mt-1 text-xs text-charcoal-400">{new Date(enquiry.createdAt).toLocaleString("en-IN")}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className={`badge ${enquiry.status === "NEW" ? "bg-safety-50 text-safety-700" : "bg-charcoal-100 text-charcoal-500"}`}>
            {enquiry.status}
          </span>
          <a
            href={buildWhatsAppLink(`Hi ${enquiry.name}, this is Ravi Tools and Hydraulics — following up on your enquiry.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-steel-700 hover:underline"
          >
            Reply on WhatsApp
          </a>
          <button onClick={toggleStatus} className="text-xs font-semibold text-charcoal-500 hover:underline">
            Mark {enquiry.status === "NEW" ? "resolved" : "new"}
          </button>
        </div>
      </div>
    </div>
  );
}

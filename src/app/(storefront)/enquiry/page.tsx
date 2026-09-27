"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildWhatsAppLink, enquiryWhatsAppMessage } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/siteConfig";

export default function EnquiryPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not send your enquiry.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-page max-w-xl py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Enquiry" }]} />
      <h1 className="mb-1 text-2xl text-charcoal-800">Enquiry / bulk order</h1>
      <p className="mb-6 text-sm text-charcoal-500">
        Questions, bulk quantities or a custom part — tell us what you need and we&apos;ll get back to you.
      </p>

      {submitted ? (
        <div className="card p-6">
          <p className="mb-4 text-charcoal-700">
            Thanks, {name || "we"} — your enquiry has been sent to {siteConfig.shortName}. We&apos;ll call or message
            you at {phone}.
          </p>
          <a href={buildWhatsAppLink(enquiryWhatsAppMessage(name, message))} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Also message us on WhatsApp
          </a>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="card space-y-4 p-5">
          {error && <div className="rounded-md bg-safety-50 p-3 text-sm text-safety-700">{error}</div>}
          <div>
            <label className="label" htmlFor="name">Your name</label>
            <input id="name" required className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone number</label>
            <input id="phone" required type="tel" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="message">Message</label>
            <textarea
              id="message"
              required
              rows={5}
              className="input"
              placeholder="What do you need? Include quantity, size or part details if you know them."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Sending…" : "Send enquiry"}
          </button>
        </form>
      )}
    </div>
  );
}

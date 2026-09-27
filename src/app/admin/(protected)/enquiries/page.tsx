import { listEnquiries } from "@/lib/models/enquiry";
import { EnquiryRow } from "@/components/admin/EnquiryRow";

export const dynamic = "force-dynamic";
export const metadata = { title: "Enquiries" };

export default function AdminEnquiriesPage() {
  const enquiries = listEnquiries();

  return (
    <div>
      <h1 className="mb-1 text-2xl text-charcoal-800">Enquiries</h1>
      <p className="mb-6 text-sm text-charcoal-500">Questions and bulk/custom requests from the enquiry form.</p>

      {enquiries.length === 0 ? (
        <div className="card p-8 text-center text-charcoal-500">No enquiries yet.</div>
      ) : (
        <div className="space-y-3">
          {enquiries.map((e) => (
            <EnquiryRow key={e.id} enquiry={e} />
          ))}
        </div>
      )}
    </div>
  );
}

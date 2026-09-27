import { db } from "../db";
import { newId } from "../id";

export type EnquiryStatus = "NEW" | "RESOLVED";

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
};

type EnquiryRow = {
  id: string;
  name: string;
  phone: string;
  message: string;
  status: EnquiryStatus;
  created_at: string;
};

function mapRow(row: EnquiryRow): Enquiry {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function createEnquiry(input: { name: string; phone: string; message: string }): Enquiry {
  const id = newId("enq");
  db.prepare("INSERT INTO enquiries (id, name, phone, message) VALUES (?, ?, ?, ?)").run(
    id,
    input.name,
    input.phone,
    input.message,
  );
  return getEnquiryById(id)!;
}

export function getEnquiryById(id: string): Enquiry | null {
  const row = db.prepare("SELECT * FROM enquiries WHERE id = ?").get(id) as EnquiryRow | undefined;
  return row ? mapRow(row) : null;
}

export function listEnquiries(): Enquiry[] {
  const rows = db.prepare("SELECT * FROM enquiries ORDER BY created_at DESC").all() as EnquiryRow[];
  return rows.map(mapRow);
}

export function setEnquiryStatus(id: string, status: EnquiryStatus): void {
  db.prepare("UPDATE enquiries SET status = ? WHERE id = ?").run(status, id);
}

export function countNewEnquiries(): number {
  const row = db.prepare("SELECT COUNT(*) as c FROM enquiries WHERE status = 'NEW'").get() as {
    c: number;
  };
  return row.c;
}

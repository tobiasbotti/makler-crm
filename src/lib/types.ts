// ============================================================
// Airtable Schema Definition for Sales CRM Overlay
// ============================================================
// Table: Leads
// Fields:
//   - Name (Single line text) — Full name of the contact
//   - Email (Email) — Used for duplicate detection
//   - Telefon (Phone) — Primary phone number
//   - Status (Single select) — Neu | Kontaktiert | Qualifiziert | Abgeschlossen | Verloren
//   - Propstack_UID (Single line text) — Unique ID from Propstack
//   - Letzter_Kontakt (Date) — Last contact timestamp
//   - Quelle (Single line text) — Lead source (e.g. "Propstack", "onOffice")
//   - Kommentar_Historie (Long text) — JSON-encoded comment history
//   - Objekt_Referenz (Single line text) — Property reference
//   - Erstellt_Am (Created time) — Auto-created timestamp
// ============================================================

export type LeadStatus =
  | "Neu"
  | "Kontaktiert"
  | "Qualifiziert"
  | "Abgeschlossen"
  | "Verloren";

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  telefon: string;
  status: LeadStatus;
  propstackUid: string;
  letzterKontakt: string | null;
  quelle: string;
  kommentarHistorie: Comment[];
  objektReferenz: string;
  erstelltAm: string;
}

export interface LeadCreateInput {
  name: string;
  email: string;
  telefon: string;
  status?: LeadStatus;
  propstackUid?: string;
  quelle?: string;
  objektReferenz?: string;
}

export interface LeadUpdateInput {
  name?: string;
  email?: string;
  telefon?: string;
  status?: LeadStatus;
  letzterKontakt?: string;
  objektReferenz?: string;
}

// Propstack API types
export interface PropstackContact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  mobile: string;
  created_at: string;
  updated_at: string;
  tags: string[];
}

export interface PropstackNote {
  content: string;
  contact_id: number;
}

export interface SyncResult {
  created: number;
  skipped: number;
  errors: string[];
}

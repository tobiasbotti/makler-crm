import { Lead, LeadCreateInput, LeadUpdateInput, Comment, LeadStatus } from "./types";

// ============================================================
// Airtable REST API Client
// Uses Personal Access Token for authentication
// ============================================================

const AIRTABLE_API_URL = "https://api.airtable.com/v0";

function getConfig() {
  const token = process.env.AIRTABLE_PAT;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_TABLE_NAME || "Leads";

  if (!token || !baseId) {
    throw new Error(
      "Missing Airtable configuration. Set AIRTABLE_PAT and AIRTABLE_BASE_ID in .env.local"
    );
  }

  return { token, baseId, tableId };
}

function headers() {
  const { token } = getConfig();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function baseUrl() {
  const { baseId, tableId } = getConfig();
  return `${AIRTABLE_API_URL}/${baseId}/${encodeURIComponent(tableId)}`;
}

// Map Airtable record to our Lead type
function mapRecord(record: Record<string, unknown>): Lead {
  const fields = record.fields as Record<string, unknown>;
  let kommentare: Comment[] = [];
  try {
    const raw = fields.Kommentar_Historie as string;
    if (raw) {
      kommentare = JSON.parse(raw);
    }
  } catch {
    kommentare = [];
  }

  return {
    id: record.id as string,
    name: (fields.Name as string) || "",
    email: (fields.Email as string) || "",
    telefon: (fields.Telefon as string) || "",
    status: (fields.Status as LeadStatus) || "Neu",
    propstackUid: (fields.Propstack_UID as string) || "",
    letzterKontakt: (fields.Letzter_Kontakt as string) || null,
    quelle: (fields.Quelle as string) || "",
    kommentarHistorie: kommentare,
    objektReferenz: (fields.Objekt_Referenz as string) || "",
    erstelltAm: (fields.Erstellt_Am as string) || "",
  };
}

// Map our Lead fields to Airtable fields
function toAirtableFields(input: LeadCreateInput | LeadUpdateInput) {
  const fields: Record<string, unknown> = {};

  if ("name" in input && input.name !== undefined) fields.Name = input.name;
  if ("email" in input && input.email !== undefined) fields.Email = input.email;
  if ("telefon" in input && input.telefon !== undefined) fields.Telefon = input.telefon;
  if ("status" in input && input.status !== undefined) fields.Status = input.status;
  if ("propstackUid" in input && input.propstackUid !== undefined)
    fields.Propstack_UID = input.propstackUid;
  if ("quelle" in input && input.quelle !== undefined) fields.Quelle = input.quelle;
  if ("objektReferenz" in input && input.objektReferenz !== undefined)
    fields.Objekt_Referenz = input.objektReferenz;
  if ("letzterKontakt" in input && input.letzterKontakt !== undefined)
    fields.Letzter_Kontakt = input.letzterKontakt;

  return fields;
}

// ---- CRUD Operations ----

export async function getLeads(filterByStatus?: LeadStatus): Promise<Lead[]> {
  let url = `${baseUrl()}?sort%5B0%5D%5Bfield%5D=Letzter_Kontakt&sort%5B0%5D%5Bdirection%5D=desc`;

  if (filterByStatus) {
    url += `&filterByFormula=${encodeURIComponent(`{Status}="${filterByStatus}"`)}`;
  }

  const allRecords: Lead[] = [];
  let offset: string | undefined;

  do {
    const pageUrl = offset ? `${url}&offset=${offset}` : url;
    const res = await fetch(pageUrl, { headers: headers(), cache: "no-store" });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Airtable API error: ${res.status} - ${err}`);
    }

    const data = await res.json();
    const records = (data.records || []).map(mapRecord);
    allRecords.push(...records);
    offset = data.offset;
  } while (offset);

  return allRecords;
}

export async function getLead(id: string): Promise<Lead | null> {
  const res = await fetch(`${baseUrl()}/${id}`, {
    headers: headers(),
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    const err = await res.text();
    throw new Error(`Airtable API error: ${res.status} - ${err}`);
  }

  const record = await res.json();
  return mapRecord(record);
}

export async function createLead(input: LeadCreateInput): Promise<Lead> {
  const res = await fetch(baseUrl(), {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      fields: {
        ...toAirtableFields(input),
        Status: input.status || "Neu",
        Quelle: input.quelle || "Manuell",
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airtable API error: ${res.status} - ${err}`);
  }

  const record = await res.json();
  return mapRecord(record);
}

export async function updateLead(id: string, input: LeadUpdateInput): Promise<Lead> {
  const res = await fetch(`${baseUrl()}/${id}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({ fields: toAirtableFields(input) }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airtable API error: ${res.status} - ${err}`);
  }

  const record = await res.json();
  return mapRecord(record);
}

export async function addComment(id: string, comment: Comment): Promise<Lead> {
  // First get existing comments
  const lead = await getLead(id);
  if (!lead) throw new Error("Lead not found");

  const history = [...lead.kommentarHistorie, comment];

  const res = await fetch(`${baseUrl()}/${id}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({
      fields: {
        Kommentar_Historie: JSON.stringify(history),
        Letzter_Kontakt: new Date().toISOString(),
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airtable API error: ${res.status} - ${err}`);
  }

  const record = await res.json();
  return mapRecord(record);
}

export async function findLeadByEmail(email: string): Promise<Lead | null> {
  const formula = encodeURIComponent(`{Email}="${email}"`);
  const res = await fetch(`${baseUrl()}?filterByFormula=${formula}&maxRecords=1`, {
    headers: headers(),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airtable API error: ${res.status} - ${err}`);
  }

  const data = await res.json();
  if (data.records && data.records.length > 0) {
    return mapRecord(data.records[0]);
  }

  return null;
}

import { Lead, Comment } from "./types";

/**
 * In-memory demo store.
 * Simulates a full Airtable backend so the MVP is
 * fully interactive without any external connections.
 */

const now = Date.now();
const h = (hours: number) => new Date(now - hours * 3600000).toISOString();
const d = (days: number) => new Date(now - days * 86400000).toISOString();

let LEADS: Lead[] = [
  {
    id: "demo-1",
    name: "Max Mustermann",
    email: "max@beispiel.de",
    telefon: "+49 170 1234567",
    status: "Neu",
    propstackUid: "PS-10421",
    letzterKontakt: null,
    quelle: "Propstack",
    kommentarHistorie: [],
    objektReferenz: "WE-2024-001",
    erstelltAm: h(2),
  },
  {
    id: "demo-2",
    name: "Erika Schmidt",
    email: "erika.schmidt@web.de",
    telefon: "+49 171 9876543",
    status: "Kontaktiert",
    propstackUid: "PS-10422",
    letzterKontakt: d(1),
    quelle: "Propstack",
    kommentarHistorie: [
      {
        id: "c1",
        text: "Interessiert an 3-Zimmer-Wohnung in München-Schwabing. Budget bis 650k.",
        author: "Sales-Mitarbeiter",
        timestamp: d(1),
      },
    ],
    objektReferenz: "WE-2024-002",
    erstelltAm: d(3),
  },
  {
    id: "demo-3",
    name: "Thomas Weber",
    email: "t.weber@gmail.com",
    telefon: "+49 172 5551234",
    status: "Qualifiziert",
    propstackUid: "PS-10423",
    letzterKontakt: h(6),
    quelle: "Propstack",
    kommentarHistorie: [
      {
        id: "c2",
        text: "Budget: 500k–700k. Sucht im Raum Hamburg-Eppendorf.",
        author: "Sales-Mitarbeiter",
        timestamp: d(2),
      },
      {
        id: "c3",
        text: "Besichtigung für Samstag 14:00 vereinbart. Objekt Eppendorfer Weg 12.",
        author: "Sales-Mitarbeiter",
        timestamp: h(6),
      },
    ],
    objektReferenz: "WE-2024-003",
    erstelltAm: d(7),
  },
  {
    id: "demo-4",
    name: "Laura Fischer",
    email: "laura.fischer@outlook.de",
    telefon: "+49 173 4449876",
    status: "Neu",
    propstackUid: "",
    letzterKontakt: null,
    quelle: "onOffice",
    kommentarHistorie: [],
    objektReferenz: "",
    erstelltAm: h(1),
  },
  {
    id: "demo-5",
    name: "Stefan Braun",
    email: "s.braun@firma.de",
    telefon: "+49 174 7778899",
    status: "Verloren",
    propstackUid: "PS-10425",
    letzterKontakt: d(3),
    quelle: "Propstack",
    kommentarHistorie: [
      {
        id: "c4",
        text: "Hat sich für ein anderes Objekt bei Konkurrenz entschieden. Preis war zu hoch.",
        author: "Sales-Mitarbeiter",
        timestamp: d(3),
      },
    ],
    objektReferenz: "WE-2024-005",
    erstelltAm: d(14),
  },
  {
    id: "demo-6",
    name: "Anna Hoffmann",
    email: "anna.hoffmann@gmx.de",
    telefon: "+49 176 3332211",
    status: "Kontaktiert",
    propstackUid: "PS-10426",
    letzterKontakt: h(12),
    quelle: "Propstack",
    kommentarHistorie: [
      {
        id: "c5",
        text: "Rückruf gewünscht nach 17 Uhr. Arbeitet tagsüber.",
        author: "Sales-Mitarbeiter",
        timestamp: h(12),
      },
    ],
    objektReferenz: "WE-2024-006",
    erstelltAm: d(5),
  },
  {
    id: "demo-7",
    name: "Markus Klein",
    email: "m.klein@icloud.com",
    telefon: "+49 151 8887766",
    status: "Qualifiziert",
    propstackUid: "PS-10427",
    letzterKontakt: h(3),
    quelle: "Propstack",
    kommentarHistorie: [
      {
        id: "c6",
        text: "Kapitalanleger. Sucht 2-Zimmer bis 300k in Berlin-Neukölln.",
        author: "Sales-Mitarbeiter",
        timestamp: d(4),
      },
      {
        id: "c7",
        text: "Finanzierung vorab geklärt. Bereit für Besichtigung.",
        author: "Sales-Mitarbeiter",
        timestamp: h(3),
      },
    ],
    objektReferenz: "WE-2024-007",
    erstelltAm: d(10),
  },
  {
    id: "demo-8",
    name: "Sandra Richter",
    email: "sandra.r@yahoo.de",
    telefon: "+49 160 1122334",
    status: "Abgeschlossen",
    propstackUid: "PS-10428",
    letzterKontakt: d(1),
    quelle: "Propstack",
    kommentarHistorie: [
      {
        id: "c8",
        text: "Kaufvertrag unterzeichnet! Übergabe am 01.03.",
        author: "Sales-Mitarbeiter",
        timestamp: d(1),
      },
    ],
    objektReferenz: "WE-2024-008",
    erstelltAm: d(21),
  },
  {
    id: "demo-9",
    name: "Peter Schulz",
    email: "peter.schulz@t-online.de",
    telefon: "+49 157 6655443",
    status: "Neu",
    propstackUid: "PS-10429",
    letzterKontakt: null,
    quelle: "Propstack",
    kommentarHistorie: [],
    objektReferenz: "WE-2024-009",
    erstelltAm: h(4),
  },
  {
    id: "demo-10",
    name: "Julia Wagner",
    email: "j.wagner@posteo.de",
    telefon: "+49 178 9988776",
    status: "Kontaktiert",
    propstackUid: "PS-10430",
    letzterKontakt: h(24),
    quelle: "onOffice",
    kommentarHistorie: [
      {
        id: "c9",
        text: "Sucht Haus mit Garten im Speckgürtel Frankfurt. Bis 800k.",
        author: "Sales-Mitarbeiter",
        timestamp: h(24),
      },
    ],
    objektReferenz: "",
    erstelltAm: d(6),
  },
];

// ---- In-memory CRUD ----

export function isDemoMode(): boolean {
  return !process.env.AIRTABLE_PAT || process.env.AIRTABLE_PAT === "your_airtable_personal_access_token";
}

export function demoGetLeads(status?: string): Lead[] {
  let result = [...LEADS];
  if (status) {
    result = result.filter((l) => l.status === status);
  }
  // Sort: newest first
  result.sort((a, b) => {
    const dateA = a.letzterKontakt || a.erstelltAm;
    const dateB = b.letzterKontakt || b.erstelltAm;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
  return result;
}

export function demoGetLead(id: string): Lead | null {
  return LEADS.find((l) => l.id === id) || null;
}

export function demoUpdateLead(id: string, updates: Partial<Lead>): Lead | null {
  const idx = LEADS.findIndex((l) => l.id === id);
  if (idx === -1) return null;

  LEADS[idx] = { ...LEADS[idx], ...updates };
  return LEADS[idx];
}

export function demoAddComment(id: string, comment: Comment): Lead | null {
  const idx = LEADS.findIndex((l) => l.id === id);
  if (idx === -1) return null;

  LEADS[idx] = {
    ...LEADS[idx],
    kommentarHistorie: [...LEADS[idx].kommentarHistorie, comment],
    letzterKontakt: new Date().toISOString(),
  };
  return LEADS[idx];
}

export function demoSyncPropstack(): { created: number; skipped: number } {
  // Simulate a sync that "finds" 2 new contacts
  const newLeads: Lead[] = [
    {
      id: `demo-sync-${Date.now()}-1`,
      name: "Neuer Kontakt (Sync)",
      email: `sync-${Date.now()}@propstack.de`,
      telefon: "+49 170 0000001",
      status: "Neu",
      propstackUid: `PS-${Date.now()}`,
      letzterKontakt: null,
      quelle: "Propstack",
      kommentarHistorie: [],
      objektReferenz: "",
      erstelltAm: new Date().toISOString(),
    },
  ];

  LEADS = [...newLeads, ...LEADS];
  return { created: newLeads.length, skipped: 3 };
}

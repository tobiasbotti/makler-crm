import { getLead } from "@/lib/airtable";
import { Header } from "@/components/header";
import { PowerDialer } from "@/components/power-dialer";
import { Lead } from "@/lib/types";
import { notFound } from "next/navigation";

// Demo data for when Airtable is not configured
const DEMO_LEADS: Record<string, Lead> = {
  "demo-1": {
    id: "demo-1",
    name: "Max Mustermann",
    email: "max@beispiel.de",
    telefon: "+49 170 1234567",
    status: "Neu",
    propstackUid: "12345",
    letzterKontakt: null,
    quelle: "Propstack",
    kommentarHistorie: [],
    objektReferenz: "WE-2024-001",
    erstelltAm: new Date().toISOString(),
  },
  "demo-2": {
    id: "demo-2",
    name: "Erika Schmidt",
    email: "erika@beispiel.de",
    telefon: "+49 171 9876543",
    status: "Kontaktiert",
    propstackUid: "12346",
    letzterKontakt: new Date(Date.now() - 86400000).toISOString(),
    quelle: "Propstack",
    kommentarHistorie: [
      {
        id: "c1",
        text: "Interessiert an 3-Zimmer-Wohnung in München",
        author: "Sales-Mitarbeiter",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    objektReferenz: "WE-2024-002",
    erstelltAm: new Date(Date.now() - 172800000).toISOString(),
  },
  "demo-3": {
    id: "demo-3",
    name: "Thomas Weber",
    email: "thomas@beispiel.de",
    telefon: "+49 172 5551234",
    status: "Qualifiziert",
    propstackUid: "12347",
    letzterKontakt: new Date(Date.now() - 43200000).toISOString(),
    quelle: "Propstack",
    kommentarHistorie: [
      {
        id: "c2",
        text: "Budget: 500k - 700k. Sucht im Raum Hamburg.",
        author: "Sales-Mitarbeiter",
        timestamp: new Date(Date.now() - 43200000).toISOString(),
      },
      {
        id: "c3",
        text: "Besichtigung für Samstag vereinbart.",
        author: "Sales-Mitarbeiter",
        timestamp: new Date(Date.now() - 21600000).toISOString(),
      },
    ],
    objektReferenz: "WE-2024-003",
    erstelltAm: new Date(Date.now() - 604800000).toISOString(),
  },
  "demo-4": {
    id: "demo-4",
    name: "Laura Fischer",
    email: "laura@beispiel.de",
    telefon: "+49 173 4449876",
    status: "Neu",
    propstackUid: "12348",
    letzterKontakt: null,
    quelle: "onOffice",
    kommentarHistorie: [],
    objektReferenz: "",
    erstelltAm: new Date(Date.now() - 3600000).toISOString(),
  },
  "demo-5": {
    id: "demo-5",
    name: "Stefan Braun",
    email: "stefan@beispiel.de",
    telefon: "+49 174 7778899",
    status: "Verloren",
    propstackUid: "12349",
    letzterKontakt: new Date(Date.now() - 259200000).toISOString(),
    quelle: "Propstack",
    kommentarHistorie: [
      {
        id: "c4",
        text: "Hat sich für ein anderes Objekt entschieden.",
        author: "Sales-Mitarbeiter",
        timestamp: new Date(Date.now() - 259200000).toISOString(),
      },
    ],
    objektReferenz: "WE-2024-005",
    erstelltAm: new Date(Date.now() - 1209600000).toISOString(),
  },
};

async function loadLead(id: string): Promise<Lead | null> {
  try {
    return await getLead(id);
  } catch {
    // Return demo data if Airtable is not configured
    return DEMO_LEADS[id] || null;
  }
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await loadLead(id);

  if (!lead) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      <main className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6">
        <PowerDialer lead={lead} />
      </main>
    </div>
  );
}

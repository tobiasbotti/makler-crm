import { getLeads } from "@/lib/airtable";
import { Header } from "@/components/header";
import { LeadTable } from "@/components/lead-table";
import { Lead } from "@/lib/types";
import { Users, PhoneCall, UserCheck, TrendingUp } from "lucide-react";

// Demo data for when Airtable is not configured
const DEMO_LEADS: Lead[] = [
  {
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
  {
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
  {
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
  {
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
  {
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
];

async function loadLeads(): Promise<Lead[]> {
  try {
    return await getLeads();
  } catch {
    // Return demo data if Airtable is not configured
    return DEMO_LEADS;
  }
}

export default async function DashboardPage() {
  const leads = await loadLeads();

  const stats = {
    total: leads.length,
    neu: leads.filter((l) => l.status === "Neu").length,
    kontaktiert: leads.filter((l) => l.status === "Kontaktiert").length,
    qualifiziert: leads.filter((l) => l.status === "Qualifiziert").length,
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      <main className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6">
        {/* Stats Bar */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Users className="h-4 w-4" />
              Gesamt
            </div>
            <div className="mt-1 text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="flex items-center gap-2 text-sm text-blue-400">
              <PhoneCall className="h-4 w-4" />
              Neue Leads
            </div>
            <div className="mt-1 text-2xl font-bold text-blue-400">
              {stats.neu}
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="flex items-center gap-2 text-sm text-yellow-400">
              <TrendingUp className="h-4 w-4" />
              Kontaktiert
            </div>
            <div className="mt-1 text-2xl font-bold text-yellow-400">
              {stats.kontaktiert}
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <UserCheck className="h-4 w-4" />
              Qualifiziert
            </div>
            <div className="mt-1 text-2xl font-bold text-emerald-400">
              {stats.qualifiziert}
            </div>
          </div>
        </div>

        {/* Lead Table */}
        <LeadTable initialLeads={leads} />
      </main>
    </div>
  );
}

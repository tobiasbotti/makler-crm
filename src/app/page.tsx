import { getLeads } from "@/lib/airtable";
import { isDemoMode, demoGetLeads } from "@/lib/demo-data";
import { Header } from "@/components/header";
import { LeadTable } from "@/components/lead-table";
import { Lead } from "@/lib/types";
import { Users, PhoneCall, UserCheck, TrendingUp } from "lucide-react";

async function loadLeads(): Promise<Lead[]> {
  if (isDemoMode()) return demoGetLeads();
  return getLeads();
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

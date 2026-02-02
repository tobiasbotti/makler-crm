import { getLead } from "@/lib/airtable";
import { isDemoMode, demoGetLead } from "@/lib/demo-data";
import { Header } from "@/components/header";
import { PowerDialer } from "@/components/power-dialer";
import { Lead } from "@/lib/types";
import { notFound } from "next/navigation";

async function loadLead(id: string): Promise<Lead | null> {
  if (isDemoMode()) return demoGetLead(id);
  return getLead(id);
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

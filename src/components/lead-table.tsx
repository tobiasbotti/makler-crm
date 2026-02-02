"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, MessageSquare, Clock, Search, RefreshCw, ChevronRight } from "lucide-react";
import { Lead, LeadStatus } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate, formatPhone } from "@/lib/utils";

const STATUS_OPTIONS: (LeadStatus | "Alle")[] = [
  "Alle",
  "Neu",
  "Kontaktiert",
  "Qualifiziert",
  "Abgeschlossen",
  "Verloren",
];

export function LeadTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "Alle">("Alle");
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshLeads = async () => {
    setIsLoading(true);
    try {
      const params = statusFilter !== "Alle" ? `?status=${statusFilter}` : "";
      const res = await fetch(`/api/leads${params}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const syncPropstack = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/sync/propstack", { method: "POST" });
      if (res.ok) {
        const result = await res.json();
        alert(`Sync abgeschlossen: ${result.summary}`);
        await refreshLeads();
      } else {
        alert("Sync fehlgeschlagen");
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      !search ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.telefon.includes(search);

    const matchesStatus =
      statusFilter === "Alle" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Suche nach Name, E-Mail, Telefon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshLeads}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Aktualisieren
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={syncPropstack}
            disabled={isSyncing}
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            Propstack Sync
          </Button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-1 rounded-lg border border-zinc-800 bg-zinc-900/50 p-1">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === status
                ? "bg-zinc-700 text-zinc-100"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {status}
            {status !== "Alle" && (
              <span className="ml-1.5 text-zinc-600">
                {leads.filter((l) => l.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                Telefon
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                <Clock className="inline h-3.5 w-3.5 mr-1" />
                Letzter Kontakt
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                <MessageSquare className="inline h-3.5 w-3.5 mr-1" />
                Notizen
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                Quelle
              </th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-zinc-500">
                  {isLoading
                    ? "Lade Leads..."
                    : "Keine Leads gefunden. Starten Sie einen Propstack-Sync oder erstellen Sie manuell einen Lead."}
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="lead-row group">
                  <td className="px-4 py-3">
                    <Link
                      href={`/leads/${lead.id}`}
                      className="font-medium text-zinc-100 hover:text-emerald-400 transition-colors"
                    >
                      {lead.name}
                    </Link>
                    <div className="text-xs text-zinc-500">{lead.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    {lead.telefon ? (
                      <a
                        href={`tel:${formatPhone(lead.telefon)}`}
                        className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {lead.telefon}
                      </a>
                    ) : (
                      <span className="text-sm text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-400">
                    {formatDate(lead.letzterKontakt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-500">
                    {lead.kommentarHistorie.length > 0 ? (
                      <span className="text-zinc-400">
                        {lead.kommentarHistorie.length} Notiz
                        {lead.kommentarHistorie.length !== 1 ? "en" : ""}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-500">
                    {lead.quelle || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/leads/${lead.id}`}>
                      <ChevronRight className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-zinc-400" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>
          {filteredLeads.length} von {leads.length} Leads
        </span>
        <span>Letzte Aktualisierung: {new Date().toLocaleTimeString("de-DE")}</span>
      </div>
    </div>
  );
}

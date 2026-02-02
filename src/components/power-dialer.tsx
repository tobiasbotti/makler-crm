"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  PhoneOff,
  Send,
  ArrowLeft,
  Clock,
  User,
  Mail,
  Building,
  Tag,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { Lead, LeadStatus, Comment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, formatPhone } from "@/lib/utils";

const STATUS_OPTIONS: LeadStatus[] = [
  "Neu",
  "Kontaktiert",
  "Qualifiziert",
  "Abgeschlossen",
  "Verloren",
];

export function PowerDialer({ lead: initialLead }: { lead: Lead }) {
  const router = useRouter();
  const [lead, setLead] = useState<Lead>(initialLead);
  const [noteText, setNoteText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const saveNote = async () => {
    if (!noteText.trim()) return;

    setIsSaving(true);
    setSavedMessage("");

    try {
      const res = await fetch(`/api/leads/${lead.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: noteText.trim(),
          author: "Sales-Mitarbeiter",
        }),
      });

      if (res.ok) {
        const updatedLead = await res.json();
        setLead(updatedLead);
        setNoteText("");
        setSavedMessage("Notiz gespeichert & an Propstack gesendet");
        setTimeout(() => setSavedMessage(""), 3000);
      } else {
        setSavedMessage("Fehler beim Speichern");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const updateStatus = async (newStatus: LeadStatus) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updatedLead = await res.json();
        setLead(updatedLead);
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      saveNote();
    }
  };

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/")}
        className="text-zinc-400 hover:text-zinc-100"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Zurück zum Dashboard
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Contact Info + Call */}
        <div className="space-y-4 lg:col-span-1">
          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-zinc-400" />
                {lead.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lead.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-zinc-500" />
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-zinc-300 hover:text-emerald-400 transition-colors"
                  >
                    {lead.email}
                  </a>
                </div>
              )}
              {lead.telefon && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-zinc-500" />
                  <span className="text-zinc-300">{lead.telefon}</span>
                </div>
              )}
              {lead.objektReferenz && (
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-zinc-500" />
                  <span className="text-zinc-300">{lead.objektReferenz}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Tag className="h-4 w-4 text-zinc-500" />
                <span className="text-zinc-300">{lead.quelle || "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-zinc-500" />
                <span className="text-zinc-400">
                  Letzter Kontakt: {formatDate(lead.letzterKontakt)}
                </span>
              </div>
              {lead.propstackUid && (
                <div className="pt-2 text-xs text-zinc-600">
                  Propstack #{lead.propstackUid}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Call Button */}
          <a
            href={lead.telefon ? `tel:${formatPhone(lead.telefon)}` : undefined}
            className={!lead.telefon ? "pointer-events-none" : ""}
          >
            <Button
              variant="call"
              size="xl"
              className="w-full"
              disabled={!lead.telefon}
            >
              <Phone className="h-6 w-6" />
              Jetzt Anrufen
            </Button>
          </a>

          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-zinc-400">
                Status ändern
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(status)}
                    disabled={isUpdatingStatus || lead.status === status}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                      lead.status === status
                        ? "bg-emerald-600 text-white ring-2 ring-emerald-500 ring-offset-2 ring-offset-zinc-900"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                    } disabled:opacity-50`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Notes */}
        <div className="space-y-4 lg:col-span-2">
          {/* New Note */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-zinc-400" />
                Gesprächsnotiz hinzufügen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Was wurde besprochen? Ergebnis des Gesprächs..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={4}
                className="resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600">
                  Strg+Enter zum Speichern
                </span>
                <div className="flex items-center gap-3">
                  {savedMessage && (
                    <span className="flex items-center gap-1 text-sm text-emerald-400">
                      <CheckCircle className="h-4 w-4" />
                      {savedMessage}
                    </span>
                  )}
                  <Button
                    onClick={saveNote}
                    disabled={isSaving || !noteText.trim()}
                    variant="success"
                  >
                    <Send className="h-4 w-4" />
                    {isSaving ? "Speichert..." : "Notiz speichern"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comment History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-zinc-400" />
                Kommentar-Historie
                <span className="text-sm font-normal text-zinc-500">
                  ({lead.kommentarHistorie.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lead.kommentarHistorie.length === 0 ? (
                <div className="py-8 text-center text-sm text-zinc-500">
                  Noch keine Notizen vorhanden. Fügen Sie die erste Gesprächsnotiz hinzu.
                </div>
              ) : (
                <div className="space-y-3">
                  {[...lead.kommentarHistorie].reverse().map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-300">
                          {comment.author}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {formatDate(comment.timestamp)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-zinc-400">
                        {comment.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

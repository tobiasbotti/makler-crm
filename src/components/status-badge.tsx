import { Badge } from "@/components/ui/badge";
import { LeadStatus } from "@/lib/types";

const statusVariantMap: Record<LeadStatus, "neu" | "kontaktiert" | "qualifiziert" | "abgeschlossen" | "verloren"> = {
  Neu: "neu",
  Kontaktiert: "kontaktiert",
  Qualifiziert: "qualifiziert",
  Abgeschlossen: "abgeschlossen",
  Verloren: "verloren",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return <Badge variant={statusVariantMap[status]}>{status}</Badge>;
}

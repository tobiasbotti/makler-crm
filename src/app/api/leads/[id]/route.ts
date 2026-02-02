import { NextRequest, NextResponse } from "next/server";
import { getLead, updateLead } from "@/lib/airtable";
import { isDemoMode, demoGetLead, demoUpdateLead } from "@/lib/demo-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (isDemoMode()) {
      const lead = demoGetLead(id);
      if (!lead) return NextResponse.json({ error: "Lead nicht gefunden" }, { status: 404 });
      return NextResponse.json(lead);
    }

    const lead = await getLead(id);
    if (!lead) {
      return NextResponse.json({ error: "Lead nicht gefunden" }, { status: 404 });
    }
    return NextResponse.json(lead);
  } catch (error) {
    console.error("Error fetching lead:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Fehler beim Laden des Leads" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (isDemoMode()) {
      const lead = demoUpdateLead(id, body);
      if (!lead) return NextResponse.json({ error: "Lead nicht gefunden" }, { status: 404 });
      return NextResponse.json(lead);
    }

    const lead = await updateLead(id, body);
    return NextResponse.json(lead);
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Fehler beim Aktualisieren des Leads" },
      { status: 500 }
    );
  }
}

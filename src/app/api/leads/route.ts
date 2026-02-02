import { NextRequest, NextResponse } from "next/server";
import { getLeads, createLead } from "@/lib/airtable";
import { LeadStatus } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as LeadStatus | null;

    const leads = await getLeads(status || undefined);
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Fehler beim Laden der Leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Name und E-Mail sind Pflichtfelder" },
        { status: 400 }
      );
    }

    const lead = await createLead(body);
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Fehler beim Erstellen des Leads" },
      { status: 500 }
    );
  }
}

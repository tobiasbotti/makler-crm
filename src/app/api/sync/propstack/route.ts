import { NextRequest, NextResponse } from "next/server";
import { getAllContacts } from "@/lib/propstack";
import { createLead, findLeadByEmail } from "@/lib/airtable";
import { isDemoMode, demoSyncPropstack } from "@/lib/demo-data";
import { SyncResult } from "@/lib/types";

/**
 * POST /api/sync/propstack
 *
 * Syncs contacts from Propstack into Airtable.
 * In demo mode: simulates a sync with fake new contacts.
 */
export async function POST(request: NextRequest) {
  try {
    if (isDemoMode()) {
      const result = demoSyncPropstack();
      return NextResponse.json({
        success: true,
        summary: `${result.created} erstellt, ${result.skipped} übersprungen, 0 Fehler`,
        ...result,
        errors: [],
      });
    }

    const body = await request.json().catch(() => ({}));
    const updatedAfter = body.updated_after as string | undefined;

    const contacts = await getAllContacts(updatedAfter);

    const result: SyncResult = {
      created: 0,
      skipped: 0,
      errors: [],
    };

    for (const contact of contacts) {
      try {
        const email = contact.email;

        if (!email) {
          result.skipped++;
          continue;
        }

        const existing = await findLeadByEmail(email);
        if (existing) {
          result.skipped++;
          continue;
        }

        const name = [contact.first_name, contact.last_name]
          .filter(Boolean)
          .join(" ")
          .trim();

        await createLead({
          name: name || "Unbekannt",
          email,
          telefon: contact.phone || contact.mobile || "",
          propstackUid: String(contact.id),
          quelle: "Propstack",
          status: "Neu",
        });

        result.created++;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        result.errors.push(`Contact ${contact.id}: ${message}`);
      }
    }

    return NextResponse.json({
      success: true,
      summary: `${result.created} erstellt, ${result.skipped} übersprungen, ${result.errors.length} Fehler`,
      ...result,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Sync fehlgeschlagen",
      },
      { status: 500 }
    );
  }
}

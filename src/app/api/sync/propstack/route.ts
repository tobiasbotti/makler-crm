import { NextRequest, NextResponse } from "next/server";
import { getAllContacts } from "@/lib/propstack";
import { createLead, findLeadByEmail } from "@/lib/airtable";
import { SyncResult } from "@/lib/types";

/**
 * POST /api/sync/propstack
 *
 * Syncs contacts from Propstack into Airtable.
 * - Fetches all contacts (or only updated after a given date)
 * - Checks for duplicates by email
 * - Creates new leads for contacts not yet in Airtable
 */
export async function POST(request: NextRequest) {
  try {
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

        // Skip contacts without email (can't deduplicate)
        if (!email) {
          result.skipped++;
          continue;
        }

        // Duplicate check by email
        const existing = await findLeadByEmail(email);
        if (existing) {
          result.skipped++;
          continue;
        }

        // Create new lead
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

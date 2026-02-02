import { NextRequest, NextResponse } from "next/server";
import { addComment, getLead } from "@/lib/airtable";
import { createNote } from "@/lib/propstack";
import { Comment } from "@/lib/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.text) {
      return NextResponse.json(
        { error: "Kommentartext ist erforderlich" },
        { status: 400 }
      );
    }

    const comment: Comment = {
      id: crypto.randomUUID(),
      text: body.text,
      author: body.author || "Sales-Mitarbeiter",
      timestamp: new Date().toISOString(),
    };

    // Save comment to Airtable
    const updatedLead = await addComment(id, comment);

    // Write-Back to Propstack (if lead has a Propstack UID)
    if (updatedLead.propstackUid) {
      try {
        await createNote({
          content: `[CRM] ${comment.author}: ${comment.text}`,
          contact_id: parseInt(updatedLead.propstackUid, 10),
        });
      } catch (propstackError) {
        // Log but don't fail - Airtable is the source of truth
        console.error("Propstack write-back failed:", propstackError);
      }
    }

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Fehler beim Speichern des Kommentars" },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = await getLead(id);

    if (!lead) {
      return NextResponse.json(
        { error: "Lead nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json(lead.kommentarHistorie);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Fehler beim Laden der Kommentare" },
      { status: 500 }
    );
  }
}

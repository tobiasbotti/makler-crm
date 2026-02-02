import { PropstackContact, PropstackNote } from "./types";

// ============================================================
// Propstack API Client
// Documentation: https://docs.propstack.de
// ============================================================

const PROPSTACK_API_URL = "https://api.propstack.de/v1";

function getToken(): string {
  const token = process.env.PROPSTACK_API_KEY;
  if (!token) {
    throw new Error("Missing PROPSTACK_API_KEY in environment variables");
  }
  return token;
}

function headers() {
  return {
    "X-API-KEY": getToken(),
    "Content-Type": "application/json",
  };
}

/**
 * Fetch contacts from Propstack, optionally filtered by updated_after date.
 * Uses pagination to fetch all results.
 */
export async function getContacts(
  updatedAfter?: string,
  page: number = 1,
  perPage: number = 100
): Promise<PropstackContact[]> {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });

  if (updatedAfter) {
    params.set("updated_after", updatedAfter);
  }

  const res = await fetch(`${PROPSTACK_API_URL}/contacts?${params}`, {
    headers: headers(),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Propstack API error: ${res.status} - ${err}`);
  }

  const data = await res.json();

  // Propstack returns an array of contacts or a paginated object
  if (Array.isArray(data)) {
    return data;
  }

  return data.data || data.contacts || [];
}

/**
 * Fetch all contacts using pagination
 */
export async function getAllContacts(updatedAfter?: string): Promise<PropstackContact[]> {
  const allContacts: PropstackContact[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const contacts = await getContacts(updatedAfter, page, 100);
    allContacts.push(...contacts);

    if (contacts.length < 100) {
      hasMore = false;
    } else {
      page++;
    }
  }

  return allContacts;
}

/**
 * Create a note (Notiz) on a Propstack contact
 */
export async function createNote(note: PropstackNote): Promise<void> {
  const res = await fetch(`${PROPSTACK_API_URL}/contacts/${note.contact_id}/notes`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      note: {
        content: note.content,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Propstack API error: ${res.status} - ${err}`);
  }
}

/**
 * Fetch a single contact from Propstack by ID
 */
export async function getContact(id: number): Promise<PropstackContact | null> {
  const res = await fetch(`${PROPSTACK_API_URL}/contacts/${id}`, {
    headers: headers(),
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    const err = await res.text();
    throw new Error(`Propstack API error: ${res.status} - ${err}`);
  }

  return res.json();
}

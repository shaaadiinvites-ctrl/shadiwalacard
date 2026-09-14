import { WeddingFormData } from "@/types/wedding";

// Server-side length caps. The form UI already limits input, but the API
// routes must enforce this independently — nothing stops a script from
// calling them directly with arbitrarily large payloads, which would bloat
// the database and, at scale, become a storage-cost / DoS concern.
const LIMITS: Record<string, number> = {
  brideName: 60,
  groomName: 60,
  hashtag: 60,
  contactNumber: 20,
  primaryEmail: 100,
  ourStory: 5000,
  videoLink: 500,
  musicLink: 500,
  brideFamilyDetails: 3000,
  groomFamilyDetails: 3000,
  weddingParty: 3000,
  giftPolicy: 100,
  giftPolicyCustom: 1000,
  digitalShagunDetails: 1000,
  liveStreamLink: 500,
  liveStreamNotes: 1000,
  visualTheme: 100,
  specialInstructions: 2000,
};

const MAX_EVENTS = 20;
const EVENT_LIMITS: Record<string, number> = {
  name: 200,
  date: 40,
  time: 40,
  venue: 300,
  mapsLink: 500,
  dressCode: 200,
  notes: 1000,
};

export function validateWeddingPayload(body: Partial<WeddingFormData>, isUpdate = false): string | null {
  // Required fields on creation
  if (!isUpdate) {
    if (!body.brideName || !body.brideName.trim()) {
      return "Bride's name is required.";
    }
    if (!body.groomName || !body.groomName.trim()) {
      return "Groom's name is required.";
    }
    if (!body.events || !Array.isArray(body.events) || body.events.length === 0) {
      return "At least one event or ceremony is required.";
    }
  } else {
    // If fields are passed during an update, they must not be empty strings
    if (body.brideName !== undefined && !body.brideName.trim()) {
      return "Bride's name cannot be empty.";
    }
    if (body.groomName !== undefined && !body.groomName.trim()) {
      return "Groom's name cannot be empty.";
    }
    if (body.events !== undefined && (!Array.isArray(body.events) || body.events.length === 0)) {
      return "At least one event or ceremony is required.";
    }
  }

  // Length caps
  for (const [field, max] of Object.entries(LIMITS)) {
    const value = (body as Record<string, unknown>)[field];
    if (typeof value === "string" && value.length > max) {
      return `"${field}" is too long (max ${max} characters).`;
    }
  }

  if (body.events) {
    if (!Array.isArray(body.events)) return `"events" must be a list.`;
    if (body.events.length > MAX_EVENTS) return `You can add at most ${MAX_EVENTS} events.`;
    for (const ev of body.events) {
      for (const [field, max] of Object.entries(EVENT_LIMITS)) {
        const value = (ev as unknown as Record<string, unknown>)?.[field];
        if (typeof value === "string" && value.length > max) {
          return `An event's "${field}" is too long (max ${max} characters).`;
        }
      }
    }
  }

  return null; // valid
}

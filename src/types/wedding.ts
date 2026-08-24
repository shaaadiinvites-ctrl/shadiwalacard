export interface WeddingEvent {
  name: string;
  customName?: string;
  isMainEvent?: boolean;
  date: string;
  time: string;
  venue: string;
  mapsLink: string;
  dressCode: string;
  notes: string;
}

export const EVENT_NAME_OPTIONS = [
  "Roka",
  "Engagement",
  "Haldi",
  "Mehendi",
  "Sangeet",
  "Shaadi",
  "Reception",
  "Other"
] as const;

export interface WeddingFormData {
  // Section 1: The Basics
  brideName: string;
  groomName: string;
  nameOrder: "bride_first" | "groom_first";
  hashtag: string;
  contactNumber: string;
  primaryEmail: string;

  // Section 2: Events
  events: WeddingEvent[];

  // Section 3: Love Story & Media
  ourStory: string;
  coverPhoto: FileList | null;
  galleryImages: FileList | null;
  videoLink: string;
  musicLink: string;

  // Section 4: Family Details
  brideMotherName: string;
  brideFatherName: string;
  groomMotherName: string;
  groomFatherName: string;
  weddingParty: string;

  // Section 5: RSVP Details
  rsvp1Name: string;
  rsvp1Phone: string;
  rsvp2Name: string;
  rsvp2Phone: string;

  // Section 6: Virtual Wedding
  liveStreamLink: string;
  liveStreamNotes: string;

  // Section 7: Theme & Instructions
  visualTheme: string;
  specialInstructions: string;
}

export const GIFT_POLICY_OPTIONS = [
  "No boxed gifts",
  "Blessings only",
  "Custom",
] as const;

export const VISUAL_THEME_OPTIONS = [
  { value: "royal-gold-crimson", label: "Royal Gold & Crimson" },
  { value: "modern-pastel", label: "Modern Pastel" },
  { value: "minimalist-monochrome", label: "Minimalist Monochrome" },
  { value: "floral-earthy", label: "Floral / Earthy" },
] as const;

// Shape of a row from the `weddings` table, as read back from Supabase and
// passed into template components for rendering the live invite page.
export interface WeddingRecord {
  id?: string;
  slug: string;
  bride_name: string;
  groom_name: string;
  name_order?: string;
  hashtag?: string;
  contact_number?: string;
  primary_email?: string;
  events: WeddingEvent[];
  our_story?: string;
  cover_photo_url?: string;
  gallery_urls?: string[];
  video_link?: string;
  music_link?: string;
  bride_mother_name?: string;
  bride_father_name?: string;
  groom_mother_name?: string;
  groom_father_name?: string;
  wedding_party?: string;
  rsvp1_name?: string;
  rsvp1_phone?: string;
  rsvp2_name?: string;
  rsvp2_phone?: string;
  live_stream_link?: string;
  live_stream_notes?: string;
  visual_theme?: string;
  special_instructions?: string;
  template_id?: string;
  edit_token?: string;
}

export const STEPS = [
  { id: 1, title: "The Happy Couple", short: "Basics" },
  { id: 2, title: "Event Schedule", short: "Events" },
  { id: 3, title: "Love Story & Media", short: "Media" },
  { id: 4, title: "R.S.V.P Details", short: "RSVP" },
] as const;

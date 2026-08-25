import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import WeddingForm from "@/components/WeddingForm";
import { WeddingFormData } from "@/types/wedding";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function EditWeddingPage({ params }: Props) {
  const { token } = await params;
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("weddings")
    .select("*")
    .eq("edit_token", token)
    .maybeSingle();

  if (error || !data) notFound();

  // Map the DB row (snake_case) back into the camelCase shape the form uses.
  const initialData: Partial<WeddingFormData> = {
    brideName: data.bride_name,
    groomName: data.groom_name,
    nameOrder: data.name_order as "bride_first" | "groom_first",
    hashtag: data.hashtag ?? "",
    contactNumber: data.contact_number ?? "",
    primaryEmail: data.primary_email ?? "",
    events: data.events ?? [],
    ourStory: data.our_story ?? "",
    videoLink: data.video_link ?? "",
    musicLink: data.music_link ?? "",
    brideMotherName: data.bride_mother_name ?? "",
    brideFatherName: data.bride_father_name ?? "",
    groomMotherName: data.groom_mother_name ?? "",
    groomFatherName: data.groom_father_name ?? "",
    weddingParty: data.wedding_party ?? "",
    rsvp1Name: data.rsvp1_name ?? "",
    rsvp1Phone: data.rsvp1_phone ?? "",
    rsvp2Name: data.rsvp2_name ?? "",
    rsvp2Phone: data.rsvp2_phone ?? "",
    liveStreamLink: data.live_stream_link ?? "",
    liveStreamNotes: data.live_stream_notes ?? "",
    visualTheme: data.visual_theme ?? "",
    specialInstructions: data.special_instructions ?? "",
  };

  return (
    <WeddingForm
      mode="edit"
      editToken={token}
      initialData={initialData}
      existingSlug={data.slug}
      existingCoverPhotoUrl={data.cover_photo_url ?? null}
      existingGalleryUrls={data.gallery_urls ?? []}
    />
  );
}

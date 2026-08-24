import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import TemplateRenderer from "@/components/templates/TemplateRenderer";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createServerSupabaseClient();

  // IMPORTANT: never select("*") here. This page hands `data` straight to
  // "use client" template components, and Next.js embeds whatever we pass
  // as plain text in the page's HTML for hydration — visible to anyone via
  // "View Page Source". Only list columns the templates actually render.
  // In particular: edit_token, razorpay_order_id, razorpay_payment_id, and
  // price_inr must NEVER appear in this select — edit_token is the secret
  // that grants edit access to this invite.
  // NOTE: this must be a single string literal (not built via + concatenation)
  // — supabase-js infers the return shape from the literal text of the
  // select string, and falls back to an unusable error type otherwise.
  const { data, error } = await supabase
    .from("weddings")
    .select(
      `slug, bride_name, groom_name, name_order, hashtag, contact_number, primary_email,
       events, our_story, cover_photo_url, gallery_urls, video_link, music_link,
       bride_mother_name, bride_father_name, groom_mother_name, groom_father_name,
       wedding_party, rsvp1_name, rsvp1_phone, rsvp2_name, rsvp2_phone,
       live_stream_link, live_stream_notes, visual_theme, special_instructions, template_id`
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) notFound();

  return <TemplateRenderer wedding={data} />;
}

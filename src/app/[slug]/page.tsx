import { cache } from "react";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import TemplateRenderer from "@/components/templates/TemplateRenderer";

interface Props {
  params: Promise<{ slug: string }>;
}

// React cache dedupes the Supabase query between generateMetadata and SlugPage
const getWeddingBySlug = cache(async (slug: string) => {
  const supabase = createServerSupabaseClient();
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

  return { data, error };
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: wedding } = await getWeddingBySlug(slug);

  if (!wedding) {
    return {
      title: "Wedding Invitation | ShadiwalaCard",
      description: "Digital Wedding Invitation",
    };
  }

  const coupleNames =
    wedding.name_order === "bride_first"
      ? `${wedding.bride_name} & ${wedding.groom_name}`
      : `${wedding.groom_name} & ${wedding.bride_name}`;

  const title = `${coupleNames}'s Wedding Invitation 💍`;

  // Extract main event or first event details for rich snippet
  const events = Array.isArray(wedding.events) ? (wedding.events as any[]) : [];
  const mainEvent = events.find((e: any) => e.isMainEvent) || events[0];

  let eventSummary = "";
  if (mainEvent) {
    if (mainEvent.name) eventSummary += `${mainEvent.name}`;
    if (mainEvent.date) eventSummary += ` on ${mainEvent.date}`;
    if (mainEvent.venue) eventSummary += ` at ${mainEvent.venue}`;
  }

  const hashtagPart = wedding.hashtag ? ` ${wedding.hashtag} •` : "";
  const description = eventSummary
    ? `You are cordially invited to celebrate the wedding of ${coupleNames}!${hashtagPart} ${eventSummary}. Tap to view ceremony schedule, Google Maps venue navigation, and photo gallery.`
    : `You are cordially invited to celebrate the wedding of ${coupleNames}!${hashtagPart} Tap to view ceremony schedule, 1-tap Google Maps venue navigation, and our royal invitation.`;

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "shadiwalacard.com";
  const canonicalUrl = `https://${slug}.${rootDomain}`;

  // Dynamic OpenGraph image generated via Next.js ImageResponse + Sharp:
  // Guaranteed < 60KB JPEG, pixel-perfect on WhatsApp & social platforms
  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set("names", coupleNames);
  if (mainEvent?.date) ogSearchParams.set("date", mainEvent.date);
  if (mainEvent?.venue) ogSearchParams.set("venue", mainEvent.venue);
  if (wedding.hashtag) ogSearchParams.set("hashtag", wedding.hashtag);
  if (wedding.cover_photo_url && wedding.cover_photo_url.startsWith("http")) {
    ogSearchParams.set("photo", wedding.cover_photo_url);
  }

  const dynamicOgUrl = `https://${rootDomain}/api/og?${ogSearchParams.toString()}`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      url: `https://${rootDomain}/${slug}`,
      title,
      description,
      siteName: "ShadiwalaCard",
      images: [
        {
          url: dynamicOgUrl,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: `${coupleNames} Wedding Invitation`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [dynamicOgUrl],
    },
  };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const { data, error } = await getWeddingBySlug(slug);

  if (error || !data) notFound();

  return <TemplateRenderer wedding={data} />;
}


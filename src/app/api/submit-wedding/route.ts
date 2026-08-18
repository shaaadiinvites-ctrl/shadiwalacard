import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { WeddingFormData } from "@/types/wedding";
import { getTemplate } from "@/lib/templates";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { isAllowedImage } from "@/lib/imageValidation";
import { validateWeddingPayload } from "@/lib/validateWedding";
import { sendInviteReadyEmail } from "@/lib/sendEmail";

type SubmitBody = WeddingFormData & { paymentOrderId?: string; templateId?: string };

const MEDIA_BUCKET = "wedding-media";
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB per image
const MAX_GALLERY_IMAGES = 15;

// ── Slug generator ────────────────────────────────────────────────────────────
// The slug becomes a DNS subdomain label (e.g. aditya-weds-ananya-2026.shadiwalacard.com),
// so keep it lowercase, hyphenated, and comfortably under the 63-char label limit.
function generateSlug(brideName: string, groomName: string, nameOrder: string = "groom_first"): string {
  const clean = (s: string) =>
    s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 20);
  const year = new Date().getFullYear();
  if (nameOrder === "bride_first") {
    return `${clean(brideName)}-weds-${clean(groomName)}-${year}`;
  }
  return `${clean(groomName)}-weds-${clean(brideName)}-${year}`;
}

function extFromFile(file: File): string {
  const fromName = file.name?.match(/\.([a-zA-Z0-9]+)$/)?.[1];
  if (fromName) return fromName.toLowerCase();
  const fromType = file.type?.split("/")[1];
  return fromType ? fromType.toLowerCase() : "jpg";
}

// ── Upload a single image to Supabase Storage, return its public URL ────────
async function uploadImage(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  file: File,
  path: string
): Promise<string> {
  if (!file.type?.startsWith("image/")) {
    throw new Error(`"${file.name}" is not an image file.`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`"${file.name}" is larger than 8MB — please use a smaller image.`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Don't trust the declared content-type/extension — verify the actual
  // file signature. Rejects SVGs and mislabeled/renamed non-image files.
  if (!isAllowedImage(buffer)) {
    throw new Error(`"${file.name}" doesn't look like a valid JPEG, PNG, GIF, or WebP image.`);
  }

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });

  if (error) {
    // Most common cause: the "wedding-media" bucket hasn't been created yet.
    // Run supabase-storage-setup.sql in the Supabase SQL editor to fix this.
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ── POST /api/submit-wedding ─────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { ok } = await checkRateLimit("submit-wedding", ip, 5, 600); // 5 per 10 min per IP
    if (!ok) {
      return NextResponse.json({ error: "Too many attempts. Please wait a few minutes and try again." }, { status: 429 });
    }

    const contentType = req.headers.get("content-type") || "";

    let body: SubmitBody;
    let coverPhotoFile: File | null = null;
    let galleryFiles: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      // Files were sent — parse the multipart body
      const formData = await req.formData();
      const payloadRaw = formData.get("payload");
      body = JSON.parse(typeof payloadRaw === "string" ? payloadRaw : "{}");

      const cp = formData.get("coverPhoto");
      if (cp instanceof File && cp.size > 0) coverPhotoFile = cp;

      galleryFiles = formData
        .getAll("galleryImages")
        .filter((f): f is File => f instanceof File && f.size > 0)
        .slice(0, MAX_GALLERY_IMAGES);
    } else {
      // No files — plain JSON body (kept for backwards compatibility)
      body = await req.json();
    }

    const validationError = validateWeddingPayload(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // ── Payment gate ──────────────────────────────────────────────────────
    // A wedding row can only be created against a payment_orders row that
    // has been verified (HMAC-checked in /api/razorpay/verify-payment) and
    // not already consumed by an earlier submission.
    if (!body.paymentOrderId) {
      return NextResponse.json({ error: "Missing payment reference. Please pay before submitting." }, { status: 402 });
    }

    // Atomically claim this payment order: flip verified -> used in one
    // conditional UPDATE. If two requests race with the same paymentOrderId
    // (double-click, retry, or a deliberate script), only the first UPDATE
    // actually matches a row (status = 'verified'); the second sees 0 rows
    // affected and is rejected. This prevents one payment from producing
    // two wedding sites. Do this BEFORE any expensive work (image uploads,
    // insert) so nothing downstream runs unless the claim succeeded.
    const { data: paymentOrder, error: paymentLookupError } = await supabase
      .from("payment_orders")
      .update({ status: "used", used_at: new Date().toISOString() })
      .eq("id", body.paymentOrderId)
      .eq("status", "verified")
      .select("id, template_id, amount_inr, status, razorpay_order_id, razorpay_payment_id")
      .maybeSingle();

    if (paymentLookupError || !paymentOrder) {
      return NextResponse.json({ error: "Payment not verified, or this payment was already used." }, { status: 402 });
    }

    const template = getTemplate(body.templateId || paymentOrder.template_id);
    const editToken = crypto.randomBytes(24).toString("hex");

    // Build slug — ensure uniqueness by appending a short random suffix if needed
    let slug = generateSlug(body.brideName, body.groomName, body.nameOrder);

    // Check if slug already exists
    const { data: existing } = await supabase
      .from("weddings")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      // Append 4-char random suffix for uniqueness
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    }

    // Upload images (now that we have a unique slug to namespace storage paths)
    let coverPhotoUrl: string | null = null;
    const galleryUrls: string[] = [];

    try {
      if (coverPhotoFile) {
        coverPhotoUrl = await uploadImage(
          supabase,
          coverPhotoFile,
          `${slug}/cover-${Date.now()}.${extFromFile(coverPhotoFile)}`
        );
      }
      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i];
        const url = await uploadImage(
          supabase,
          file,
          `${slug}/gallery-${i}-${Date.now()}.${extFromFile(file)}`
        );
        galleryUrls.push(url);
      }
    } catch (uploadErr) {
      // Upload failed after we'd already claimed the payment order — give the
      // customer their payment back (as far as this flag is concerned) so
      // they can retry the submission instead of losing it.
      await supabase.from("payment_orders").update({ status: "verified", used_at: null }).eq("id", paymentOrder.id);
      const message = uploadErr instanceof Error ? uploadErr.message : "Image upload failed.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from("weddings")
      .insert({
        slug,

        // Section 1
        bride_name: body.brideName,
        groom_name: body.groomName,
        name_order: body.nameOrder,
        hashtag: body.hashtag || null,
        contact_number: body.contactNumber || null,
        primary_email: body.primaryEmail || null,

        // Section 2 — events array stored as JSONB
        events: body.events ?? [],

        // Section 3
        our_story: body.ourStory || null,
        cover_photo_url: coverPhotoUrl,
        gallery_urls: galleryUrls,
        video_link: body.videoLink || null,
        music_link: body.musicLink || null,

        // Section 4
        bride_mother_name: body.brideMotherName || null,
        bride_father_name: body.brideFatherName || null,
        groom_mother_name: body.groomMotherName || null,
        groom_father_name: body.groomFatherName || null,
        wedding_party: body.weddingParty || null,

        // Section 5
        rsvp1_name: body.rsvp1Name || null,
        rsvp1_phone: body.rsvp1Phone || null,
        rsvp2_name: body.rsvp2Name || null,
        rsvp2_phone: body.rsvp2Phone || null,

        // Section 6
        live_stream_link: body.liveStreamLink || null,
        live_stream_notes: body.liveStreamNotes || null,

        // Section 7
        visual_theme: body.visualTheme || null,
        special_instructions: body.specialInstructions || null,

        // Template + payment (payment verified above via Razorpay signature check)
        template_id: template.id,
        price_inr: paymentOrder.amount_inr,
        edit_token: editToken,
        razorpay_order_id: paymentOrder.razorpay_order_id,
        razorpay_payment_id: paymentOrder.razorpay_payment_id,
        payment_status: "paid",
      })
      .select("id, slug, edit_token")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      // Same rollback as above — the wedding row was never created, so give
      // the payment order back to 'verified' rather than burning it.
      await supabase.from("payment_orders").update({ status: "verified", used_at: null }).eq("id", paymentOrder.id);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Payment order was already atomically flipped to 'used' when we claimed
    // it above — just backfill which wedding it paid for.
    await supabase
      .from("payment_orders")
      .update({ wedding_id: data.id })
      .eq("id", paymentOrder.id);

    const editUrl = `${req.nextUrl.origin}/edit/${data.edit_token}`;
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "shadiwalacard.com";
    const siteUrl = `https://${data.slug}.${rootDomain}`;

    // Email is best-effort: the couple already paid and their site already
    // exists, so a failed/slow send must never turn into a failed
    // submission — errors are caught and only logged. We await it (rather
    // than fire-and-forget) because Vercel can freeze the serverless
    // function the instant the response is returned, which would silently
    // drop an un-awaited send.
    if (body.primaryEmail) {
      try {
        const result = await sendInviteReadyEmail({
          to: body.primaryEmail,
          coupleNames: `${body.groomName} & ${body.brideName}`,
          siteUrl,
          editUrl,
        });
        if (!result.sent) console.error("Invite-ready email not sent:", result.reason);
      } catch (err) {
        console.error("Invite-ready email threw:", err);
      }
    }

    return NextResponse.json(
      { success: true, slug: data.slug, id: data.id, editUrl, siteUrl },
      { status: 201 }
    );
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

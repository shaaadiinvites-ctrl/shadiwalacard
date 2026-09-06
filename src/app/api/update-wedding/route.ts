import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { WeddingFormData } from "@/types/wedding";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { isAllowedImage } from "@/lib/imageValidation";
import { validateWeddingPayload } from "@/lib/validateWedding";

const MEDIA_BUCKET = "wedding-media";
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_GALLERY_IMAGES = 15;

type UpdateBody = WeddingFormData & { editToken?: string; existingGalleryUrls?: string[] };

function extFromFile(file: File): string {
  const fromName = file.name?.match(/\.([a-zA-Z0-9]+)$/)?.[1];
  if (fromName) return fromName.toLowerCase();
  const fromType = file.type?.split("/")[1];
  return fromType ? fromType.toLowerCase() : "jpg";
}

async function uploadImage(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  file: File,
  path: string
): Promise<string> {
  if (!file.type?.startsWith("image/")) throw new Error(`"${file.name}" is not an image file.`);
  if (file.size > MAX_FILE_SIZE) throw new Error(`"${file.name}" is larger than 8MB — please use a smaller image.`);

  const buffer = Buffer.from(await file.arrayBuffer());

  if (!isAllowedImage(buffer)) {
    throw new Error(`"${file.name}" doesn't look like a valid JPEG, PNG, GIF, or WebP image.`);
  }

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, buffer, {
    contentType: file.type || "image/jpeg",
    upsert: true,
  });
  if (error) throw new Error(`Image upload failed: ${error.message}`);

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// POST /api/update-wedding
// Body: multipart/form-data with a "payload" field (JSON, includes editToken)
// plus optional coverPhoto / galleryImages files. Used by the secret-token
// edit link (/edit/[token]) — no payment check, since the wedding already
// exists and was paid for at creation time.
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { ok } = await checkRateLimit("update-wedding", ip, 10, 600); // 10 per 10 min per IP
    if (!ok) {
      return NextResponse.json({ error: "Too many attempts. Please wait a few minutes and try again." }, { status: 429 });
    }

    const formData = await req.formData();
    const payloadRaw = formData.get("payload");
    const body: UpdateBody = JSON.parse(typeof payloadRaw === "string" ? payloadRaw : "{}");

    if (!body.editToken) {
      return NextResponse.json({ error: "Missing edit link token." }, { status: 400 });
    }

    const validationError = validateWeddingPayload(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    const { data: existing, error: lookupError } = await supabase
      .from("weddings")
      .select("id, slug, primary_email, contact_number")
      .eq("edit_token", body.editToken)
      .maybeSingle();

    if (lookupError || !existing) {
      return NextResponse.json({ error: "Invalid or expired edit link." }, { status: 404 });
    }

    const cp = formData.get("coverPhoto");
    const coverPhotoFile = cp instanceof File && cp.size > 0 ? cp : null;
    const galleryFiles = formData
      .getAll("galleryImages")
      .filter((f): f is File => f instanceof File && f.size > 0)
      .slice(0, MAX_GALLERY_IMAGES);

    const imageUpdates: { cover_photo_url?: string; gallery_urls?: string[] } = {};

    // If existingGalleryUrls is provided in the payload, start with those.
    // If not, we don't update the gallery_urls column unless there are new files.
    if (body.existingGalleryUrls !== undefined) {
      imageUpdates.gallery_urls = [...body.existingGalleryUrls];
    }

    try {
      if (coverPhotoFile) {
        imageUpdates.cover_photo_url = await uploadImage(
          supabase,
          coverPhotoFile,
          `${existing.slug}/cover-${Date.now()}.${extFromFile(coverPhotoFile)}`
        );
      }
      if (galleryFiles.length > 0) {
        const urls: string[] = [];
        for (let i = 0; i < galleryFiles.length; i++) {
          urls.push(
            await uploadImage(supabase, galleryFiles[i], `${existing.slug}/gallery-${i}-${Date.now()}.${extFromFile(galleryFiles[i])}`)
          );
        }
        if (imageUpdates.gallery_urls) {
          imageUpdates.gallery_urls.push(...urls);
        } else {
          imageUpdates.gallery_urls = urls;
        }
      }
    } catch (uploadErr) {
      const message = uploadErr instanceof Error ? uploadErr.message : "Image upload failed.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("weddings")
      .update({
        bride_name: body.brideName,
        groom_name: body.groomName,
        hashtag: body.hashtag || null,
        contact_number: (body.contactNumber && body.contactNumber.trim()) || existing.contact_number || null,
        primary_email: (body.primaryEmail && body.primaryEmail.trim()) || existing.primary_email || null,
        events: body.events ?? [],
        our_story: body.ourStory || null,
        video_link: body.videoLink || null,
        music_link: body.musicLink || null,
        bride_mother_name: body.brideMotherName || null,
        bride_father_name: body.brideFatherName || null,
        groom_mother_name: body.groomMotherName || null,
        groom_father_name: body.groomFatherName || null,
        wedding_party: body.weddingParty || null,
        rsvp1_name: body.rsvp1Name || null,
        rsvp1_phone: body.rsvp1Phone || null,
        rsvp2_name: body.rsvp2Name || null,
        rsvp2_phone: body.rsvp2Phone || null,
        live_stream_link: body.liveStreamLink || null,
        live_stream_notes: body.liveStreamNotes || null,
        visual_theme: body.visualTheme || null,
        special_instructions: body.specialInstructions || null,
        ...imageUpdates,
      })
      .eq("edit_token", body.editToken)
      .select("slug")
      .single();

    if (error) {
      console.error("update-wedding error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, slug: data.slug });
  } catch (err) {
    console.error("update-wedding route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

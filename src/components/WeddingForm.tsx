"use client";

import { useState } from "react";
import { useForm, FieldPath } from "react-hook-form";
import { WeddingFormData, STEPS } from "@/types/wedding";
import { CheckCircle, Circle } from "lucide-react";
import { clsx } from "clsx";
import { usePostHog } from 'posthog-js/react';

import Step1Basics from "@/components/steps/Step1Basics";
import Step2Events from "@/components/steps/Step2Events";
import Step3Media from "@/components/steps/Step3Media";
import Step5RSVP from "@/components/steps/Step5RSVP";
import Step6Virtual from "@/components/steps/Step6Virtual";
import Step7Theme from "@/components/steps/Step7Theme";

const DEFAULT_VALUES: Partial<WeddingFormData> = {
  nameOrder: "groom_first",
  events: [
    { name: "", date: "", time: "", venue: "", mapsLink: "", dressCode: "", notes: "" },
  ],
};

interface WeddingFormProps {
  /** id of the verified payment_orders row — required to submit (payment gate) */
  paymentOrderId?: string;
  templateId?: string;
  /** "edit" is used by the secret-token edit link (/edit/[token]) — skips the
   *  payment gate and PATCHes an existing wedding instead of creating one. */
  mode?: "create" | "edit";
  editToken?: string;
  initialData?: Partial<WeddingFormData>;
  existingSlug?: string;
  existingCoverPhotoUrl?: string | null;
}

export default function WeddingForm({
  paymentOrderId,
  templateId,
  mode = "create",
  editToken,
  initialData,
  existingSlug,
}: WeddingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [slug, setSlug] = useState<string | null>(existingSlug ?? null);
  const [editUrl, setEditUrl] = useState<string | null>(null);
  const posthog = usePostHog();

  // Payment gate: only applies to new submissions. This page should only
  // ever be reached via /checkout after a verified Razorpay payment, which
  // appends ?po=<id>&template=<id>.
  if (mode === "create" && !paymentOrderId) {
    return (
      <div className="min-h-screen flex items-center justify-center relative p-6 font-sans">
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#F2F4F8', zIndex: -2 }} />
        <div className="rounded-2xl border border-[rgba(26,32,44,0.1)] p-8 text-center max-w-md w-full space-y-5" style={{ background: '#ffffff', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
          <div className="text-5xl">🔒</div>
          <h2 className="text-2xl font-bold text-[#2e1065]" style={{ fontFamily: "'Playfair Display', serif" }}>Choose your template first</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Your personalized customization dashboard unlocks immediately after you select a royal design and complete your order.
          </p>
          <a
            href="/"
            className="inline-block w-full px-6 py-3 rounded-full bg-[#2e1065] hover:bg-[#3b0764] text-white text-sm font-bold shadow-md transition duration-200"
          >
            Browse ShadiwalaCard Designs →
          </a>
        </div>
      </div>
    );
  }

  const {
    register,
    control,
    watch,
    handleSubmit,
    trigger,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<WeddingFormData>({
    mode: "onChange",
    defaultValues: mode === "edit" ? { ...DEFAULT_VALUES, ...initialData } : DEFAULT_VALUES,
  });

  // Fields validated per step
  const STEP_FIELDS: Record<number, FieldPath<WeddingFormData>[]> = {
    1: ["brideName", "groomName", "nameOrder"],
    2: ["events"],
    3: [],
    4: [],
    5: [],
    6: ["contactNumber", "primaryEmail"],
  };

  const goNext = async () => {
    const fields = STEP_FIELDS[currentStep];
    const valid = fields.length > 0 ? await trigger(fields) : true;
    
    // Custom Validation for Step 2: Main Event
    if (currentStep === 2 && valid) {
      const events = getValues("events");
      const hasMainEvent = events && events.some(e => e.isMainEvent);
      if (!hasMainEvent) {
        alert("Please select at least one event as the Main Event to proceed.");
        return;
      }
    }

    if (valid) {
      setCurrentStep((s) => Math.min(s + 1, STEPS.length));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: WeddingFormData) => {
    // Prevent mobile keyboards from submitting the form early via 'Enter'/'Go'
    if (currentStep < STEPS.length) {
      goNext();
      return;
    }

    setSubmitError(null);
    try {
      const { coverPhoto, galleryImages, ...rest } = data;

      const formData = new FormData();
      const extra = mode === "edit" ? { editToken } : { paymentOrderId, templateId };
      formData.append("payload", JSON.stringify({ ...rest, ...extra }));

      if (coverPhoto && coverPhoto.length > 0) {
        formData.append("coverPhoto", coverPhoto[0]);
      }
      if (galleryImages && galleryImages.length > 0) {
        Array.from(galleryImages).forEach((file) => formData.append("galleryImages", file));
      }

      const res = await fetch(mode === "edit" ? "/api/update-wedding" : "/api/submit-wedding", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        setSubmitError(json.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSlug(json.slug);
      setEditUrl(json.editUrl ?? null);
      setSubmitted(true);
      posthog?.capture("form_submitted", { mode, edit_token: editToken, template_id: templateId });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    }
  };

  if (submitted) {
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "shadiwalacard.com";
    const isLocal =
      typeof window !== "undefined" &&
      /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
    const inviteUrl = slug
      ? isLocal
        ? `${window.location.origin}/${slug}`
        : `https://${slug}.${rootDomain}`
      : "";

    return (
      <div className="min-h-screen flex items-center justify-center relative p-6 font-sans">
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#F2F4F8', zIndex: -2 }} />
        <div className="rounded-2xl border border-gray-200 p-8 text-center max-w-lg w-full space-y-6" style={{ background: '#ffffff', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
          <div className="text-6xl">💍</div>
          <h2 className="text-3xl font-extrabold text-[#2e1065]" style={{ fontFamily: "'Playfair Display', serif" }}>
            {mode === "edit" ? "Invite Updated!" : "Royal Invite Ready!"}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {mode === "edit"
              ? "Your wedding details have been seamlessly updated. Check your live invite below:"
              : "Your personalized ShadiwalaCard details are saved and ready for the world:"}
          </p>
          {inviteUrl && (
            <a
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-50 rounded-2xl border border-gray-200 p-4 text-[#9d174d] font-bold font-mono text-sm hover:border-[#9d174d] hover:bg-[#9d174d]/5 transition duration-200 break-all"
            >
              {inviteUrl} →
            </a>
          )}
          {mode === "edit" && (
            <p className="text-xs text-gray-400">
              Keep your secret edit link bookmarked for making any future changes.
            </p>
          )}
          {editUrl && (
            <div className="text-left border border-gray-200 rounded-2xl p-5 space-y-2.5" style={{ background: '#F9FAFB' }}>
              <p className="text-xs font-extrabold text-[#2e1065] uppercase tracking-wider flex items-center gap-1.5">
                <span>🔑</span> Save Your Private Edit Link
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Anyone with this private URL can modify your invitation later—keep it bookmarked or share it with your inner circle to update events, maps, or rsvp details anytime!
              </p>
              <a
                href={editUrl}
                className="block bg-white rounded-xl border border-gray-200 px-3.5 py-2.5 text-[#9d174d] font-mono text-xs font-semibold break-all hover:border-[#2e1065] transition"
              >
                {editUrl}
              </a>
            </div>
          )}
          <a
            href="/"
            className="inline-block mt-2 text-xs font-semibold text-gray-400 hover:text-[#2e1065] transition"
          >
            ← Return to Home Page
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col md:flex-row font-sans text-[#1A202C]">
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#F2F4F8', zIndex: -2 }} />
      {/* ── Mobile Top Header & Stepper (Visible only on mobile `< md`) ── */}
      <header className="md:hidden sticky top-0 z-30 border-b border-gray-200 px-4 py-3 shadow-sm bg-white">
        <div className="flex items-center justify-between mb-2">
          <a href="/" className="font-extrabold text-lg tracking-tight no-underline flex items-center gap-1.5">
            <img src="/uploads/envelope_icon_transparent.png" alt="Logo" width={24} height={24} className="object-contain rounded" />
            <span className="text-[#2e1065]">Shadiwala</span>
            <span className="text-[#9d174d]">Card</span>
          </a>
          <span className="text-[11px] font-extrabold text-[#9d174d] bg-[#9d174d]/10 px-3 py-1 rounded-full border border-[#9d174d]/20">
            Step {currentStep} of {STEPS.length}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs font-medium text-[#2e1065] mb-1.5">
          <span className="truncate pr-2 font-bold">{STEPS.find((s) => s.id === currentStep)?.title}</span>
          <span className="text-gray-400 font-normal">{Math.round(((currentStep - 1) / STEPS.length) * 100)}% done</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2e1065] to-[#9d174d] rounded-full transition-all duration-500"
            style={{ width: `${((currentStep - 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </header>

      {/* ── Desktop Sidebar (Hidden on mobile, visible on `md:flex`) ───── */}
      <aside className="hidden md:flex flex-col md:w-72 lg:w-80 border-r border-gray-200 p-6 lg:p-8 shrink-0 bg-white sticky top-0 h-screen overflow-y-auto">
        <div className="mb-8">
          <a href="/" className="text-2xl font-extrabold tracking-tight flex items-center gap-2 mb-2 no-underline">
            <img src="/uploads/envelope_icon_transparent.png" alt="Logo" width={32} height={32} className="object-contain rounded" />
            <div>
              <span className="text-[#2e1065]">Shadiwala</span>
              <span className="text-[#9d174d]">Card</span>
            </div>
          </a>
          <h1 className="text-xl font-bold text-[#1A202C]" style={{ fontFamily: "'Playfair Display', serif" }}>
            {mode === "edit" ? "Edit Your Invite" : "Customize Your Invite"}
          </h1>
          <p className="text-xs text-gray-500 mt-1">{mode === "edit" ? "Update any section, then save changes" : "Complete the steps below to make your shadi site live"}</p>
        </div>

        <nav className="space-y-1.5 flex-1">
          {STEPS.map((step) => {
            const done = currentStep > step.id;
            const active = currentStep === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => done && setCurrentStep(step.id)}
                className={clsx(
                  "w-full flex items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm transition-all duration-200 border",
                  active ? "bg-[#2e1065] text-white font-bold border-[#2e1065] shadow-md" : "border-transparent",
                  done ? "text-gray-700 bg-gray-50 hover:bg-[#2e1065]/5 border-gray-200/80 cursor-pointer font-semibold" : "",
                  !active && !done ? "text-gray-400 cursor-default font-medium" : ""
                )}
              >
                {done ? (
                  <CheckCircle size={18} className="text-[#9d174d] shrink-0" />
                ) : (
                  <Circle
                    size={18}
                    className={clsx("shrink-0", active ? "text-[#9d174d]" : "text-gray-300")}
                  />
                )}
                <span className="truncate">
                  <span className={clsx("text-[11px] block mb-0.5 uppercase tracking-wider", active ? "text-white/70" : "text-gray-400")}>Step {step.id}</span>
                  {step.title}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex justify-between text-xs font-bold text-[#2e1065] mb-2">
            <span>Completion Progress</span>
            <span>{Math.round(((currentStep - 1) / STEPS.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#2e1065] to-[#9d174d] rounded-full transition-all duration-500"
              style={{ width: `${((currentStep - 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </aside>

      {/* ── Main Form Area ── */}
      <main className="flex-1 flex flex-col min-w-0 md:min-h-screen">
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col justify-between">
          <div className="flex-1 flex gap-0 w-full min-w-0">
            <div className="flex-1 p-4 sm:p-6 lg:p-10 w-full min-w-0 pb-28 md:pb-16">
              <div className="max-w-3xl mx-auto">
                {currentStep === 1 && (
                  <Step1Basics register={register} errors={errors} watch={watch} />
                )}
                {currentStep === 2 && (
                  <Step2Events register={register} errors={errors} control={control} setValue={setValue} />
                )}
                {currentStep === 3 && (
                  <Step3Media register={register} errors={errors} />
                )}
                {currentStep === 4 && (
                  <Step5RSVP register={register} errors={errors} />
                )}
                {currentStep === 5 && (
                  <Step6Virtual register={register} errors={errors} />
                )}
                {currentStep === 6 && (
                  <Step7Theme register={register} errors={errors} watch={watch} />
                )}
              </div>
            </div>
          </div>

          {/* ── Sticky Footer Navigation ── */}
          <div className="p-4 sm:p-5 md:px-8 border-t border-gray-100 bg-[#F9FAFB] flex justify-between items-center shrink-0">
            <div className="max-w-3xl w-full mx-auto flex items-center justify-between gap-3 sm:gap-4">
              <button
                type="button"
                onClick={goBack}
                disabled={currentStep === 1}
                className="disabled:opacity-30 disabled:cursor-not-allowed h-[46px] px-4 sm:px-6 rounded-xl border border-gray-800/20 bg-transparent text-[#1A202C] font-medium text-[0.95rem] cursor-pointer transition-colors flex items-center justify-center hover:bg-gray-100"
              >
                ← Back
              </button>

              <span className="text-xs font-bold text-[#2e1065] text-center truncate px-2">
                Step {currentStep} <span className="text-gray-400 font-normal">of {STEPS.length}</span>
              </span>

              {currentStep < STEPS.length ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="h-[46px] px-6 sm:px-8 rounded-xl border-none bg-[#2e1065] text-white font-medium text-[0.95rem] cursor-pointer transition-colors flex items-center justify-center shadow-md hover:bg-[#4c1d95]"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#2e1065] to-[#9d174d] hover:opacity-95 text-white text-xs sm:text-sm font-extrabold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 shrink-0"
                >
                  {isSubmitting ? (mode === "edit" ? "Saving…" : "Submitting…") : mode === "edit" ? "Save Changes ✓" : "Submit Invite ✓"}
                </button>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

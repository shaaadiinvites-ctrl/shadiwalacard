"use client";

import { useState, useEffect } from "react";
import { useForm, FieldPath } from "react-hook-form";
import { WeddingFormData, STEPS } from "@/types/wedding";
import { CheckCircle, Circle } from "lucide-react";
import { clsx } from "clsx";
import { usePostHog } from 'posthog-js/react';

import Step1Basics from "@/components/steps/Step1Basics";
import Step2Events from "@/components/steps/Step2Events";
import Step3Media from "@/components/steps/Step3Media";
import Step5RSVP from "@/components/steps/Step5RSVP";

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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [ghostClickLock, setGhostClickLock] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);



  useEffect(() => {
    if (currentStep === STEPS.length) {
      setGhostClickLock(true);
      const timer = setTimeout(() => setGhostClickLock(false), 600);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

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
    defaultValues: { ...DEFAULT_VALUES, ...(initialData || {}) },
  });

  useEffect(() => {
    if (mode === "create") {
      try {
        const draft = localStorage.getItem("weddingFormDraft");
        if (draft) {
          const parsed = JSON.parse(draft);
          const merged = { ...parsed, ...(initialData || {}) };
          Object.keys(merged).forEach((key) => {
            if (merged[key] !== undefined) {
              setValue(key as FieldPath<WeddingFormData>, merged[key]);
            }
          });
        }
      } catch (err) {
        console.error("Could not load draft", err);
      }
    }
  }, [mode, initialData, setValue]);

  // Fields validated per step
  const STEP_FIELDS: Record<number, FieldPath<WeddingFormData>[]> = {
    1: ["brideName", "groomName", "nameOrder"],
    2: ["events"],
    3: [],
    4: [],
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
      if (mode === "create") {
        try {
          const { coverPhoto, galleryImages, ...textData } = getValues();
          localStorage.setItem("weddingFormDraft", JSON.stringify(textData));
        } catch (err) {
          console.error("Could not save draft", err);
        }
      }

      setCurrentStep((s) => Math.min(s + 1, STEPS.length));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: WeddingFormData) => {
    // Prevent mobile keyboards from submitting the form early via 'Enter'/'Go'
    if (currentStep < STEPS.length) {
      goNext();
      return;
    }

    setSubmitError(null);
    try {
      // Helper function to capitalize first letter of each word
      const toTitleCase = (str?: string) => {
        if (!str) return str;
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
      };

      const formattedData = {
        ...data,
        brideName: toTitleCase(data.brideName),
        groomName: toTitleCase(data.groomName),
        brideMotherName: toTitleCase(data.brideMotherName),
        brideFatherName: toTitleCase(data.brideFatherName),
        groomMotherName: toTitleCase(data.groomMotherName),
        groomFatherName: toTitleCase(data.groomFatherName),
        rsvp1Name: toTitleCase(data.rsvp1Name),
        rsvp2Name: toTitleCase(data.rsvp2Name),
        events: data.events?.map(event => ({
          ...event,
          name: event.name === "Other" ? event.name : (toTitleCase(event.name) as any),
          customName: toTitleCase(event.customName)
        }))
      };

      const { coverPhoto, galleryImages, ...rest } = formattedData;

      const formData = new FormData();
      const extra = mode === "edit" ? { editToken } : { paymentOrderId, templateId };
      formData.append("payload", JSON.stringify({ ...rest, ...extra }));

      if (coverPhoto && coverPhoto.length > 0) {
        formData.append("coverPhoto", coverPhoto[0]);
      }
      if (galleryImages && galleryImages.length > 0) {
        Array.from(galleryImages).forEach((file) => formData.append("galleryImages", file));
      }

      const endpoint = mode === "edit" ? "/api/update-wedding" : "/api/submit-wedding";
      
      const uploadPromise = new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentComplete);
          }
        });
        
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (e) {
              resolve({});
            }
          } else {
            try {
              reject(JSON.parse(xhr.responseText));
            } catch (e) {
              reject(new Error("Upload failed"));
            }
          }
        });
        
        xhr.addEventListener("error", () => reject(new Error("Network error")));
        
        xhr.open("POST", endpoint);
        xhr.send(formData);
      });

      const json = await uploadPromise;

      setSlug(json.slug);
      setEditUrl(json.editUrl ?? null);
      setSubmitted(true);
      
      if (mode === "create") {
        try {
          localStorage.removeItem("weddingFormDraft");
        } catch (err) {
          console.error("Could not clear draft", err);
        }
      }

      posthog?.capture("form_submitted", { mode, edit_token: editToken, template_id: templateId });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      if (err?.error) {
        setSubmitError(err.error);
      } else {
        setSubmitError("Network error. Please check your connection and try again.");
      }
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
          <div className="text-6xl">✨</div>
          <h2 className="text-3xl font-extrabold text-[#2e1065]" style={{ fontFamily: "'Playfair Display', serif" }}>
            {mode === "edit" ? "Your Invite is Updated!" : "Your Royal Invite is Ready!"}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {mode === "edit"
              ? "Your wedding details have been successfully updated. You can view your live digital invitation below:"
              : "Congratulations! Your personalized ShadiwalaCard is now live and ready to be shared with your loved ones:"}
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
          {mode === "create" && (
            <div className="mt-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg p-3 border border-emerald-200">
              <span className="font-semibold">✉️ Note:</span> We have also sent your customized invitation link to your primary email address.
            </div>
          )}
          {mode === "edit" && (
            <p className="text-xs text-gray-400">
              Keep your secret edit link bookmarked for making any future changes.
            </p>
          )}
          {editUrl && (
            <div className="text-left border border-gray-200 rounded-2xl p-5 space-y-2.5" style={{ background: '#F9FAFB' }}>
              <p className="text-xs font-extrabold text-[#2e1065] uppercase tracking-wider flex items-center gap-1.5">
                <span>🔑</span> Your Private Edit Link
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                You can use this private link to modify your invitation details anytime. We recommend keeping it bookmarked!
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
      
      {/* ── Full Screen Upload Overlay ── */}
      {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-auto text-center space-y-4 relative overflow-hidden">
            {/* Animated background pulse */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2e1065]/5 to-[#9d174d]/5 animate-pulse" />
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-[#2e1065]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Uploading Media
              </h3>
              <p className="text-sm text-gray-500 mt-1 mb-6">Please wait while we securely upload your images. Do not close this tab.</p>
              
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden relative shadow-inner">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#2e1065] to-[#9d174d] rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm font-extrabold text-[#9d174d] mt-3">{uploadProgress}% Complete</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Top Header & Stepper (Visible only on mobile `< md`) ── */}
      <header className="md:hidden sticky top-0 z-30 border-b border-gray-200 px-4 py-3 shadow-sm bg-white">
        <div className="flex items-center justify-between mb-2">
          <a href="/" className="font-extrabold text-lg tracking-tight no-underline flex items-center gap-1.5">
            <img src="/uploads/envelope_icon_transparent.png" alt="Logo" width={24} height={24} className="object-contain rounded" />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: '#2e1065', letterSpacing: '0.2px' }}>
              Shadiwala<span style={{ color: '#9d174d' }}>Card</span>
            </span>
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
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: '#2e1065', letterSpacing: '0.2px' }}>
              Shadiwala<span style={{ color: '#9d174d' }}>Card</span>
            </span>
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
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (currentStep < STEPS.length) goNext();
          }} 
          className="flex-1 flex flex-col justify-between"
        >
          <input type="hidden" {...register("primaryEmail")} />
          <input type="hidden" {...register("contactNumber")} />
          <div className="flex-1 flex gap-0 w-full min-w-0">
            <div className="flex-1 p-4 sm:p-6 lg:p-10 w-full min-w-0 pb-8">
              <div className="max-w-3xl mx-auto">
                {currentStep === 1 && (
                  <Step1Basics register={register} errors={errors} watch={watch} />
                )}
                {currentStep === 2 && (
                  <Step2Events register={register} errors={errors} control={control} setValue={setValue} />
                )}
                {currentStep === 3 && (
                  <Step3Media register={register} errors={errors} watch={watch} setValue={setValue} />
                )}
                {currentStep === 4 && (
                  <Step5RSVP register={register} errors={errors} />
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
                <div className="relative shrink-0 sm:w-auto">
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting || ghostClickLock}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#2e1065] to-[#9d174d] hover:opacity-95 text-white text-xs sm:text-sm font-extrabold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 shrink-0"
                  >
                    {isSubmitting 
                      ? (mode === "edit" ? "Saving…" : "Submitting…")
                      : (mode === "edit" ? "Save Changes" : "Submit Invite")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

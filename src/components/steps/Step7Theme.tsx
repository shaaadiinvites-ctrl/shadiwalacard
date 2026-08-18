"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { WeddingFormData, VISUAL_THEME_OPTIONS } from "@/types/wedding";
import { FieldWrapper, Textarea, Input } from "@/components/FormFields";
import { UseFormWatch } from "react-hook-form";

interface Props {
  register: UseFormRegister<WeddingFormData>;
  errors: FieldErrors<WeddingFormData>;
  watch: UseFormWatch<WeddingFormData>;
}

const THEME_PREVIEWS: Record<string, { bg: string; text: string; accent: string; description: string }> = {
  "royal-gold-crimson": {
    bg: "bg-red-950",
    text: "text-amber-300",
    accent: "border-amber-400",
    description: "Rich reds and gold — classic Indian royalty aesthetic",
  },
  "modern-pastel": {
    bg: "bg-pink-50",
    text: "text-pink-600",
    accent: "border-pink-300",
    description: "Soft blush tones with a contemporary, airy feel",
  },
  "minimalist-monochrome": {
    bg: "bg-gray-50",
    text: "text-gray-800",
    accent: "border-gray-400",
    description: "Clean whites and blacks — timeless and sophisticated",
  },
  "floral-earthy": {
    bg: "bg-green-50",
    text: "text-emerald-700",
    accent: "border-emerald-400",
    description: "Natural greens and terracotta — garden / boho inspired",
  },
};

export default function Step7Theme({ register, errors, watch }: Props) {
  const selected = watch("visualTheme");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2e1065]" style={{ fontFamily: "'Playfair Display', serif" }}>Final Details</h2>
        <p className="text-sm text-gray-500 mt-1">
          Almost done! Where should we send your setup links and payment receipts?
        </p>
      </div>

      <div className="border border-[#2e1065]/15 rounded-2xl p-5 bg-[#F2F4F8]/70 space-y-5 shadow-inner mt-6">
        <h3 className="text-sm font-extrabold text-[#9d174d] uppercase tracking-wider">Account & Notifications</h3>
        <p className="text-xs text-gray-500">Provide your primary contact details.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldWrapper label="Primary Contact Number" error={errors.contactNumber?.message}>
            <Input
              {...register("contactNumber", { required: "Required" })}
              placeholder="+91 XXXXX XXXXX"
              type="tel"
            />
          </FieldWrapper>

          <FieldWrapper label="Primary Email Address" error={errors.primaryEmail?.message}>
            <Input
              {...register("primaryEmail", {
                required: "Required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
              })}
              placeholder="hello@yourwedding.com"
              type="email"
            />
          </FieldWrapper>
        </div>
      </div>

      <div className="rounded-2xl bg-[#9d174d]/10 border border-[#9d174d]/20 p-5 text-xs sm:text-sm font-bold text-[#2e1065] shadow-inner flex items-center gap-3">
        <span className="text-2xl">🎉</span>
        <span>You are all set! Review your details and click <strong className="text-[#9d174d]">Submit Invite ✓</strong> below to bring your royal shadi website to life!</span>
      </div>
    </div>
  );
}

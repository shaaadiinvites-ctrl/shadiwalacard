"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { WeddingFormData } from "@/types/wedding";
import { FieldWrapper, Input, Textarea } from "@/components/FormFields";

interface Props {
  register: UseFormRegister<WeddingFormData>;
  errors: FieldErrors<WeddingFormData>;
}

export default function Step6Virtual({ register, errors }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2e1065]" style={{ fontFamily: "'Playfair Display', serif" }}>Virtual Wedding Stream</h2>
        <p className="text-sm text-gray-500 mt-1">
          Let remote guests join the celebration online from anywhere in the world.
        </p>
      </div>

      <FieldWrapper
        label="Live Stream Link"
        hint="YouTube, Zoom, or any private streaming link"
        error={errors.liveStreamLink?.message}
      >
        <Input
          {...register("liveStreamLink")}
          placeholder="https://youtube.com/live/..."
          type="url"
        />
      </FieldWrapper>

      <FieldWrapper
        label="Live Stream Notes"
        hint="Any instructions or timing info for remote guests"
        error={errors.liveStreamNotes?.message}
      >
        <Textarea
          {...register("liveStreamNotes")}
          placeholder='e.g. "Streaming will begin 15 minutes before the Pheras. Password: wedding2026"'
          rows={3}
        />
      </FieldWrapper>

      <div className="rounded-2xl bg-[#F2F4F8] border border-[#2e1065]/15 p-4.5 text-xs font-semibold text-[#2e1065] shadow-inner flex items-start gap-2.5 leading-relaxed">
        <span className="text-base">💡</span>
        <span>Leave these blank if you are not planning a live stream — this section will automatically be hidden on your digital shadi invite!</span>
      </div>
    </div>
  );
}

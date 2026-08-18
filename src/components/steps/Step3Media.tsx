"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { WeddingFormData } from "@/types/wedding";
import { FieldWrapper, Input, Textarea } from "@/components/FormFields";

interface Props {
  register: UseFormRegister<WeddingFormData>;
  errors: FieldErrors<WeddingFormData>;
}

export default function Step3Media({ register, errors }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2e1065]" style={{ fontFamily: "'Playfair Display', serif" }}>Love Story & Media</h2>
        <p className="text-sm text-gray-500 mt-1">Share your romantic story and the visuals that tell it.</p>
      </div>

      <FieldWrapper
        label="Gallery Images"
        hint="Select multiple photos — these appear in your gallery section"
        error={undefined}
      >
        <input
          {...register("galleryImages")}
          type="file"
          accept="image/*"
          multiple
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#2e1065]/10 file:text-[#2e1065] hover:file:bg-[#2e1065]/20 cursor-pointer border border-[#2e1065]/20 rounded-xl p-1.5 shadow-xs transition"
        />
      </FieldWrapper>

      <FieldWrapper
        label="Pre-Wedding Video / Save the Date Link"
        hint="YouTube or Vimeo link"
        error={errors.videoLink?.message}
      >
        <Input
          {...register("videoLink")}
          placeholder="https://youtube.com/..."
          type="url"
        />
      </FieldWrapper>

      <FieldWrapper
        label="Background Music Track Link"
        hint="Spotify or YouTube link — plays softly on your invitation page"
        error={errors.musicLink?.message}
      >
        <Input
          {...register("musicLink")}
          placeholder="https://open.spotify.com/..."
          type="url"
        />
      </FieldWrapper>
    </div>
  );
}

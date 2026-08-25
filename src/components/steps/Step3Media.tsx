"use client";

import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { WeddingFormData } from "@/types/wedding";
import { FieldWrapper, Input, Textarea } from "@/components/FormFields";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface Props {
  register: UseFormRegister<WeddingFormData>;
  errors: FieldErrors<WeddingFormData>;
  watch: UseFormWatch<WeddingFormData>;
  setValue: UseFormSetValue<WeddingFormData>;
}

export default function Step3Media({ register, errors, watch, setValue }: Props) {
  const galleryImages = watch("galleryImages");
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!galleryImages || galleryImages.length === 0) {
      setPreviews([]);
      return;
    }

    const objectUrls = Array.from(galleryImages).map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [galleryImages]);

  const removeImage = (indexToRemove: number) => {
    if (!galleryImages) return;
    const dt = new DataTransfer();
    Array.from(galleryImages).forEach((file, idx) => {
      if (idx !== indexToRemove) {
        dt.items.add(file);
      }
    });
    setValue("galleryImages", dt.files, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2e1065]" style={{ fontFamily: "'Playfair Display', serif" }}>Love Story & Media</h2>
        <p className="text-sm text-gray-500 mt-1">Share your romantic story and the visuals that tell it.</p>
      </div>

      <FieldWrapper
        label="Gallery Images"
        hint="Select up to 6 photos (Supported formats: JPG, JPEG, PNG) — these appear in your gallery section"
        error={undefined}
      >
        <input
          {...(() => {
            const { onChange, ...rest } = register("galleryImages");
            return {
              ...rest,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                const dt = new DataTransfer();
                if (galleryImages) {
                  Array.from(galleryImages).forEach((file) => dt.items.add(file));
                }
                if (e.target.files) {
                  Array.from(e.target.files).forEach((file) => dt.items.add(file));
                }
                
                if (dt.items.length > 6) {
                  alert("You can only upload a maximum of 6 gallery images. The first 6 have been kept.");
                  const newDt = new DataTransfer();
                  for (let i = 0; i < 6; i++) {
                    newDt.items.add(dt.items[i].getAsFile()!);
                  }
                  e.target.files = newDt.files;
                } else {
                  e.target.files = dt.files;
                }
                
                onChange(e);
              }
            };
          })()}
          type="file"
          accept="image/jpeg, image/png"
          multiple
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#2e1065]/10 file:text-[#2e1065] hover:file:bg-[#2e1065]/20 cursor-pointer border border-[#2e1065]/20 rounded-xl p-1.5 shadow-xs transition"
        />
        {previews.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {previews.map((preview, idx) => (
              <div key={idx} className="relative aspect-square w-20 sm:w-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <img
                  src={preview}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-white hover:bg-red-50 text-red-600 rounded-full p-1 shadow-sm transition-colors"
                >
                  <X size={14} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        )}
      </FieldWrapper>


    </div>
  );
}

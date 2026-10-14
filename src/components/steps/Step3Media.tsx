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
  existingGalleryUrls?: string[];
  onRemoveExistingGalleryUrl?: (url: string) => void;
}

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const MAX_PHOTOS = 6;

interface FilePreview {
  url: string;
  name: string;
  sizeMb: string;
  isOversized: boolean;
}

export default function Step3Media({ register, errors, watch, setValue, existingGalleryUrls = [], onRemoveExistingGalleryUrl }: Props) {
  const galleryImages = watch("galleryImages");
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileWarning, setFileWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!galleryImages || galleryImages.length === 0) {
      setPreviews([]);
      return;
    }

    const filesArray = Array.from(galleryImages);
    const previewList: FilePreview[] = filesArray.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      sizeMb: (file.size / (1024 * 1024)).toFixed(1),
      isOversized: file.size > MAX_FILE_SIZE,
    }));
    setPreviews(previewList);

    return () => {
      previewList.forEach((item) => URL.revokeObjectURL(item.url));
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

    // Check if any oversized files remain
    const remaining = Array.from(dt.files);
    if (!remaining.some(f => f.size > MAX_FILE_SIZE)) {
      setFileError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    setFileWarning(null);

    const incomingFiles = e.target.files ? Array.from(e.target.files) : [];
    if (incomingFiles.length === 0) return;

    const oversizedList: { name: string; sizeMb: string }[] = [];
    const validIncoming: File[] = [];

    incomingFiles.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        oversizedList.push({
          name: file.name,
          sizeMb: (file.size / (1024 * 1024)).toFixed(1),
        });
      } else {
        validIncoming.push(file);
      }
    });

    if (oversizedList.length > 0) {
      const details = oversizedList
        .map((f) => `• "${f.name}" (${f.sizeMb} MB)`)
        .join("\n");
      setFileError(
        `The following photo${oversizedList.length > 1 ? "s" : ""} exceeded the 4MB limit and could not be added:\n${details}\nPlease compress or select photos under 4MB.`
      );
    }

    const existingCount = existingGalleryUrls?.length || 0;
    const currentNewFiles = galleryImages ? Array.from(galleryImages).filter(f => f.size <= MAX_FILE_SIZE) : [];
    const availableSlots = Math.max(0, MAX_PHOTOS - existingCount - currentNewFiles.length);

    if (availableSlots <= 0) {
      setFileWarning(`You have already selected all ${MAX_PHOTOS} photos. Please delete an existing photo below to upload a different one.`);
      e.target.value = "";
      return;
    }

    if (validIncoming.length > availableSlots) {
      setFileWarning(`Limit reached: You selected ${validIncoming.length} photos, but only ${availableSlots} slot${availableSlots > 1 ? "s were" : " was"} remaining. The first ${availableSlots} photo${availableSlots > 1 ? "s were" : ""} kept (max ${MAX_PHOTOS} photos total).`);
    }

    const dt = new DataTransfer();
    // Keep already selected valid files
    currentNewFiles.forEach((file) => dt.items.add(file));

    // Add new files up to available slots
    const filesToAdd = validIncoming.slice(0, availableSlots);
    filesToAdd.forEach((file) => dt.items.add(file));

    setValue("galleryImages", dt.files, { shouldValidate: true, shouldDirty: true });

    // Reset input value to allow re-selecting same file if needed
    e.target.value = "";
  };

  const totalPhotos = (existingGalleryUrls?.length || 0) + previews.length;
  const isLimitReached = totalPhotos >= MAX_PHOTOS;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[28px] font-bold text-[#2e1065] mb-2 tracking-tight">Love Story & Media</h2>
        <p className="text-[14px] font-normal text-gray-500">Share your romantic story and the visuals that tell it.</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-[15px] font-bold text-[#1A202C] flex items-center gap-2">
            <span>Gallery Images</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-[#4a148c]">
              Max {MAX_PHOTOS} Photos
            </span>
          </label>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full font-mono ${
            totalPhotos === 0
              ? "bg-gray-100 text-gray-600"
              : isLimitReached
              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
              : "bg-purple-50 text-[#4a148c] border border-purple-200"
          }`}>
            {totalPhotos} / {MAX_PHOTOS} Photos Selected
          </span>
        </div>

        {/* Prominent beforehand limit card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-50/70 to-pink-50/50 border border-purple-100 text-xs text-gray-700 space-y-1">
          <p className="font-bold text-[#2e1065] flex items-center gap-1.5">
            <span>📸</span> Gallery limit: Maximum 6 photos
          </p>
          <p className="text-gray-500 leading-relaxed">
            Your 3D royal invitation card displays up to 6 photos in the gallery. Supported formats: JPG, JPEG, PNG (max 4MB per photo).
          </p>
        </div>

        {isLimitReached ? (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm">
            <span>✓ All 6 photo slots are full. To change photos, click ✕ on any photo below.</span>
          </div>
        ) : (
          <input
            {...(() => {
              const { onChange, ...rest } = register("galleryImages");
              return {
                ...rest,
                onChange: handleFileChange,
              };
            })()}
            type="file"
            accept="image/jpeg, image/png, image/webp"
            multiple
            className="block w-full text-[14px] font-medium text-[#1A202C] file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-[14px] file:font-semibold file:bg-purple-50 file:text-[#4a148c] hover:file:bg-purple-100 cursor-pointer border border-gray-300 rounded-xl bg-white p-1 shadow-sm transition"
          />
        )}

        {/* Immediate In-Page 4MB File Size Error Banner */}
        {fileError && (
          <div className="mt-3 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 shadow-sm">
            <span className="text-xl leading-none shrink-0">⚠️</span>
            <div className="flex-1">
              <p className="font-bold text-red-800 mb-0.5">Photo Too Large (Max 4MB per photo)</p>
              <p className="text-xs text-red-600 whitespace-pre-line leading-relaxed">{fileError}</p>
            </div>
            <button
              type="button"
              onClick={() => setFileError(null)}
              className="text-red-400 hover:text-red-700 font-bold text-sm p-1 cursor-pointer"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* In-Page Count Warning Banner */}
        {fileWarning && (
          <div className="mt-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-start gap-3 shadow-sm">
            <span className="text-xl leading-none shrink-0">ℹ️</span>
            <div className="flex-1">
              <p className="font-bold text-amber-900 mb-0.5">Photo Limit Reached</p>
              <p className="text-xs text-amber-700 leading-relaxed">{fileWarning}</p>
            </div>
            <button
              type="button"
              onClick={() => setFileWarning(null)}
              className="text-amber-400 hover:text-amber-800 font-bold text-sm p-1 cursor-pointer"
              aria-label="Dismiss warning"
            >
              ✕
            </button>
          </div>
        )}

        {(existingGalleryUrls.length > 0 || previews.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-3">
            {/* Existing Images */}
            {existingGalleryUrls.map((url, idx) => (
              <div key={`existing-${idx}`} className="relative aspect-square w-20 sm:w-24 rounded-xl overflow-hidden border border-[#4a148c]/20 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                <img
                  src={url}
                  alt={`Existing ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemoveExistingGalleryUrl && onRemoveExistingGalleryUrl(url)}
                  className="absolute top-1 right-1 bg-white hover:bg-red-50 text-red-600 rounded-full p-1 shadow-sm transition-colors"
                  aria-label="Remove existing image"
                >
                  <X size={14} strokeWidth={3} />
                </button>
              </div>
            ))}

            {/* New Previews with Size Indicators */}
            {previews.map((preview, idx) => (
              <div 
                key={`new-${idx}`} 
                className={`relative aspect-square w-20 sm:w-24 rounded-xl overflow-hidden border shadow-sm flex flex-col justify-end ${
                  preview.isOversized ? "border-red-500 ring-2 ring-red-400" : "border-gray-200"
                }`}
              >
                <img
                  src={preview.url}
                  alt={preview.name || `Preview ${idx + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Size pill overlay */}
                <div className="relative z-10 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-3 pb-1 px-1 text-center">
                  <span className="text-[10px] font-semibold text-white/95">
                    {preview.sizeMb} MB
                  </span>
                </div>
                {preview.isOversized && (
                  <div className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow z-10">
                    &gt;4MB
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-white hover:bg-red-50 text-red-600 rounded-full p-1 shadow-sm transition-colors z-20"
                  aria-label="Remove image"
                >
                  <X size={14} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Love Story Textarea */}
      <FieldWrapper
        label="Our Love Story (Optional)"
        hint="Share how you first met, your journey together, or a heartfelt message to your guests."
        error={errors.ourStory?.message}
      >
        <Textarea
          {...register("ourStory")}
          rows={5}
          placeholder="It all began on a quiet evening in Delhi... From college best friends to lifelong partners, we cannot wait to celebrate our big day with you!"
          className="w-full text-[14px]"
        />
      </FieldWrapper>
    </div>
  );
}


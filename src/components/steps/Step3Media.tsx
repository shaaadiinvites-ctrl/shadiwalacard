"use client";

import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { WeddingFormData } from "@/types/wedding";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { compressImage } from "@/lib/imageCompression";

interface Props {
  register: UseFormRegister<WeddingFormData>;
  errors: FieldErrors<WeddingFormData>;
  watch: UseFormWatch<WeddingFormData>;
  setValue: UseFormSetValue<WeddingFormData>;
  existingGalleryUrls?: string[];
  onRemoveExistingGalleryUrl?: (url: string) => void;
  selectedFiles?: File[];
  onFilesChange?: (files: File[]) => void;
}

const MAX_PHOTOS = 6;

interface FilePreview {
  url: string;
  name: string;
  sizeFormatted: string;
}

export default function Step3Media({
  existingGalleryUrls = [],
  onRemoveExistingGalleryUrl,
  selectedFiles = [],
  onFilesChange,
}: Props) {
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [fileWarning, setFileWarning] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setPreviews([]);
      return;
    }

    const previewList: FilePreview[] = selectedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      sizeFormatted:
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`,
    }));
    setPreviews(previewList);

    return () => {
      previewList.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [selectedFiles]);

  const removeImage = (indexToRemove: number) => {
    const updated = selectedFiles.filter((_, idx) => idx !== indexToRemove);
    if (onFilesChange) {
      onFilesChange(updated);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileWarning(null);

    const incomingFiles = e.target.files ? Array.from(e.target.files) : [];
    if (incomingFiles.length === 0) return;

    // Reset input value so re-selecting same file triggers change
    e.target.value = "";

    const existingCount = existingGalleryUrls?.length || 0;
    const currentFiles = selectedFiles || [];
    const availableSlots = Math.max(0, MAX_PHOTOS - existingCount - currentFiles.length);

    if (availableSlots <= 0) {
      setFileWarning(`You have already selected all ${MAX_PHOTOS} photos. Please delete an existing photo below to replace it.`);
      return;
    }

    if (incomingFiles.length > availableSlots) {
      setFileWarning(
        `Limit reached: You selected ${incomingFiles.length} photos, but only ${availableSlots} slot${
          availableSlots > 1 ? "s were" : " was"
        } remaining. The first ${availableSlots} photo${availableSlots > 1 ? "s were" : ""} added.`
      );
    }

    const filesToProcess = incomingFiles.slice(0, availableSlots);
    setIsCompressing(true);

    try {
      const processedFiles: File[] = [];
      for (const file of filesToProcess) {
        if (!file.type.startsWith("image/")) continue;
        const compressed = await compressImage(file, 1600, 0.82);
        processedFiles.push(compressed);
      }

      if (processedFiles.length > 0 && onFilesChange) {
        onFilesChange([...currentFiles, ...processedFiles]);
      }
    } catch (err) {
      console.error("Error processing photos:", err);
      if (onFilesChange) {
        onFilesChange([...currentFiles, ...filesToProcess]);
      }
    } finally {
      setIsCompressing(false);
    }
  };

  const totalPhotos = (existingGalleryUrls?.length || 0) + previews.length;
  const isLimitReached = totalPhotos >= MAX_PHOTOS;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[28px] font-bold text-[#2e1065] mb-2 tracking-tight">Photos & Media</h2>
        <p className="text-[14px] font-normal text-gray-500">
          Upload your favorite couple photos for your royal 3D invitation gallery.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-[15px] font-bold text-[#1A202C] flex items-center gap-2">
            <span>Gallery Images</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-[#4a148c]">
              Max {MAX_PHOTOS} Photos
            </span>
          </label>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full font-mono ${
              totalPhotos === 0
                ? "bg-gray-100 text-gray-600"
                : isLimitReached
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-purple-50 text-[#4a148c] border border-purple-200"
            }`}
          >
            {totalPhotos} / {MAX_PHOTOS} Photos Selected
          </span>
        </div>

        {/* Prominent beforehand limit card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-50/70 to-pink-50/50 border border-purple-100 text-xs text-gray-700 space-y-1">
          <p className="font-bold text-[#2e1065] flex items-center gap-1.5">
            <span>📸</span> Gallery limit: Maximum 6 photos
          </p>
          <p className="text-gray-500 leading-relaxed">
            Your 3D royal invitation card displays up to 6 couple photos in the coverflow gallery. Mobile and camera photos are automatically optimized for fast loading.
          </p>
        </div>

        {isLimitReached ? (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm">
            <span>✓ All 6 photo slots are full. To change photos, click ✕ on any photo below.</span>
          </div>
        ) : (
          <div className="relative">
            <input
              type="file"
              accept="image/jpeg, image/png, image/webp"
              multiple
              disabled={isCompressing}
              onChange={handleFileChange}
              className="block w-full text-[14px] font-medium text-[#1A202C] file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-[14px] file:font-semibold file:bg-purple-50 file:text-[#4a148c] hover:file:bg-purple-100 cursor-pointer border border-gray-300 rounded-xl bg-white p-1 shadow-sm transition disabled:opacity-50"
            />
            {isCompressing && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-xs rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-[#4a148c] shadow-sm">
                <span className="animate-spin inline-block">⏳</span> Optimizing photos for instant upload...
              </div>
            )}
          </div>
        )}

        {/* In-Page Count Warning Banner */}
        {fileWarning && (
          <div className="mt-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-start gap-3 shadow-sm">
            <span className="text-xl leading-none shrink-0">ℹ️</span>
            <div className="flex-1">
              <p className="font-bold text-amber-900 mb-0.5">Photo Notice</p>
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
              <div
                key={`existing-${idx}`}
                className="relative aspect-square w-20 sm:w-24 rounded-xl overflow-hidden border border-[#4a148c]/20 shadow-sm opacity-90 hover:opacity-100 transition-opacity"
              >
                <img src={url} alt={`Existing ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onRemoveExistingGalleryUrl && onRemoveExistingGalleryUrl(url)}
                  className="absolute top-1 right-1 bg-white hover:bg-red-50 text-red-600 rounded-full p-1 shadow-sm transition-colors cursor-pointer"
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
                className="relative aspect-square w-20 sm:w-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm flex flex-col justify-end"
              >
                <img
                  src={preview.url}
                  alt={preview.name || `Preview ${idx + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Size pill overlay */}
                <div className="relative z-10 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-3 pb-1 px-1 text-center">
                  <span className="text-[10px] font-semibold text-white/95">{preview.sizeFormatted}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-white hover:bg-red-50 text-red-600 rounded-full p-1 shadow-sm transition-colors z-20 cursor-pointer"
                  aria-label="Remove image"
                >
                  <X size={14} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

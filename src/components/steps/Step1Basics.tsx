"use client";

import { UseFormRegister, FieldErrors, UseFormWatch, Control, Controller, UseFormSetValue, UseFormGetValues } from "react-hook-form";
import { WeddingFormData } from "@/types/wedding";
import { FieldWrapper, Input } from "@/components/FormFields";
import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";

interface Props {
  register: UseFormRegister<WeddingFormData>;
  errors: FieldErrors<WeddingFormData>;
  watch: UseFormWatch<WeddingFormData>;
  control: Control<WeddingFormData>;
  setValue: UseFormSetValue<WeddingFormData>;
  getValues: UseFormGetValues<WeddingFormData>;
}

export default function Step1Basics({ register, errors, watch, control, setValue, getValues }: Props) {
  const nameOrder = watch("nameOrder");
  const language = watch("language");
  const isBrideFirst = nameOrder === "bride_first";

  const prevLangRef = useRef<"en" | "hi" | undefined>(language);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (prevLangRef.current && prevLangRef.current !== language) {
      const doTranslation = async () => {
        setIsTranslating(true);
        const data = getValues();
        
        const pathsToTranslate: { path: any, value: string }[] = [];
        const rootFields: (keyof WeddingFormData)[] = [
          "brideName", "groomName", "brideMotherName", "brideFatherName",
          "groomMotherName", "groomFatherName", "ourStory", "weddingParty",
          "rsvp1Name", "rsvp2Name", "liveStreamNotes"
        ];
        
        for (const f of rootFields) {
           if (data[f] && typeof data[f] === 'string') {
              pathsToTranslate.push({ path: f, value: data[f] as string });
           }
        }
        
        if (data.events && Array.isArray(data.events)) {
           data.events.forEach((ev, idx) => {
              if (ev.customName) pathsToTranslate.push({ path: `events.${idx}.customName`, value: ev.customName });
              if (ev.venue) pathsToTranslate.push({ path: `events.${idx}.venue`, value: ev.venue });
              if (ev.dressCode) pathsToTranslate.push({ path: `events.${idx}.dressCode`, value: ev.dressCode });
              if (ev.notes) pathsToTranslate.push({ path: `events.${idx}.notes`, value: ev.notes });
           });
        }
        
        if (pathsToTranslate.length > 0) {
           let pathsToCallApi = pathsToTranslate;
           const original = { ...(data.originalEnglishTexts || {}) };
           
           if (language === 'en') {
              // Switching to English, try to restore from original first
              pathsToCallApi = [];
              pathsToTranslate.forEach(pt => {
                 if (original[pt.path]) {
                    setValue(pt.path, original[pt.path], { shouldDirty: true, shouldValidate: true });
                 } else {
                    pathsToCallApi.push(pt);
                 }
              });
           } else {
              // Switching to Hindi, save current English texts
              pathsToTranslate.forEach(pt => {
                 if (/[a-zA-Z]/.test(pt.value)) {
                    original[pt.path] = pt.value;
                 }
              });
              setValue('originalEnglishTexts', original);
           }

           if (pathsToCallApi.length > 0) {
              try {
                const res = await fetch('/api/translate-bulk', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    texts: pathsToCallApi.map(t => t.value), 
                    targetLang: language 
                  })
                });
                const resultData = await res.json();
                if (resultData.results && resultData.results.length === pathsToCallApi.length) {
                   resultData.results.forEach((translatedText: string, i: number) => {
                      setValue(pathsToCallApi[i].path as any, translatedText, { shouldDirty: true, shouldValidate: true });
                   });
                }
              } catch (err) {
                console.error(err);
              }
           }
        }
        setIsTranslating(false);
      };
      
      doTranslation();
    }
    prevLangRef.current = language;
  }, [language, getValues, setValue]);

  const handleBlurTranslate = async (e: React.FocusEvent<HTMLInputElement>, fieldName: keyof WeddingFormData) => {
    if (language === 'hi' && e.target.value && /[a-zA-Z]/.test(e.target.value)) {
      const originalText = e.target.value;
      try {
        const res = await fetch('/api/transliterate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: originalText })
        });
        const data = await res.json();
        if (data.result) {
          setValue(fieldName, data.result, { shouldValidate: true, shouldDirty: true });
          
          const currentOriginals = getValues('originalEnglishTexts') || {};
          setValue('originalEnglishTexts', { ...currentOriginals, [fieldName]: originalText });
        }
      } catch (err) {}
    }
  };

  const SmartInput = ({ name, placeholder, required }: { name: keyof WeddingFormData; placeholder?: string; required?: string }) => {
    const reg = register(name, { required });
    return (
      <Input
        {...reg}
        placeholder={placeholder}
        className="capitalize"
        onBlur={async (e) => {
          reg.onBlur(e);
          await handleBlurTranslate(e, name);
        }}
      />
    );
  };

  const brideNameField = (
    <FieldWrapper label="Bride's Full Name" error={errors.brideName?.message}>
      <SmartInput name="brideName" required="Required" />
    </FieldWrapper>
  );

  const groomNameField = (
    <FieldWrapper label="Groom's Full Name" error={errors.groomName?.message}>
      <SmartInput name="groomName" required="Required" />
    </FieldWrapper>
  );

  const brideMotherField = (
    <FieldWrapper label="Bride's Mother's Name" error={errors.brideMotherName?.message}>
      <SmartInput name="brideMotherName" />
    </FieldWrapper>
  );

  const brideFatherField = (
    <FieldWrapper label="Bride's Father's Name" error={errors.brideFatherName?.message}>
      <SmartInput name="brideFatherName" />
    </FieldWrapper>
  );

  const groomMotherField = (
    <FieldWrapper label="Groom's Mother's Name" error={errors.groomMotherName?.message}>
      <SmartInput name="groomMotherName" />
    </FieldWrapper>
  );

  const groomFatherField = (
    <FieldWrapper label="Groom's Father's Name" error={errors.groomFatherName?.message}>
      <SmartInput name="groomFatherName" />
    </FieldWrapper>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[28px] font-bold text-[#2e1065] mb-2 tracking-tight">The Happy Couple</h2>
        <p className="text-[14px] font-normal text-gray-500">Tell us about the two of you to personalize your digital invite.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <FieldWrapper 
          label={
            <div className="flex items-center gap-2">
              Invitation Language
              {isTranslating && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold animate-pulse">
                  <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  TRANSLATING...
                </div>
              )}
            </div>
          } 
          error={errors.language?.message}
        >
          <div className="flex gap-4">
            <label className={clsx(
              "flex-1 flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all",
              language === "en" || !language ? "border-[#4a148c] bg-purple-50" : "border-gray-200 bg-white hover:border-[#4a148c]/30"
            )}>
              <div className="flex items-center gap-3">
                <div className={clsx("flex items-center justify-center w-5 h-5 rounded-full border-2", language === "en" || !language ? "border-[#4a148c]" : "border-gray-300")}>
                  {(language === "en" || !language) && <div className="w-2.5 h-2.5 bg-[#4a148c] rounded-full" />}
                </div>
                <span className={clsx("font-semibold text-[15px]", language === "en" || !language ? "text-[#4a148c]" : "text-gray-600")}>English</span>
              </div>
              <input
                type="radio"
                value="en"
                {...register("language")}
                className="sr-only"
              />
            </label>
            <label className={clsx(
              "flex-1 flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all",
              language === "hi" ? "border-[#4a148c] bg-purple-50" : "border-gray-200 bg-white hover:border-[#4a148c]/30"
            )}>
              <div className="flex items-center gap-3">
                <div className={clsx("flex items-center justify-center w-5 h-5 rounded-full border-2", language === "hi" ? "border-[#4a148c]" : "border-gray-300")}>
                  {language === "hi" && <div className="w-2.5 h-2.5 bg-[#4a148c] rounded-full" />}
                </div>
                <span className={clsx("font-semibold text-[15px]", language === "hi" ? "text-[#4a148c]" : "text-gray-600")}>Hindi (हिंदी)</span>
              </div>
              <input
                type="radio"
                value="hi"
                {...register("language")}
                className="sr-only"
              />
            </label>
          </div>
        </FieldWrapper>

        <FieldWrapper label="Name Display Order" error={errors.nameOrder?.message}>
          <div className="flex gap-4">
            <label className={clsx(
              "flex-1 flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all",
              !isBrideFirst ? "border-[#4a148c] bg-purple-50" : "border-gray-200 bg-white hover:border-[#4a148c]/30"
            )}>
              <div className="flex items-center gap-3">
                <div className={clsx("flex items-center justify-center w-5 h-5 rounded-full border-2", !isBrideFirst ? "border-[#4a148c]" : "border-gray-300")}>
                  {!isBrideFirst && <div className="w-2.5 h-2.5 bg-[#4a148c] rounded-full" />}
                </div>
                <span className={clsx("font-semibold text-[15px]", !isBrideFirst ? "text-[#4a148c]" : "text-gray-600")}>Groom First</span>
              </div>
              <input
                type="radio"
                value="groom_first"
                {...register("nameOrder", { required: "Required" })}
                className="sr-only"
              />
            </label>
            <label className={clsx(
              "flex-1 flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all",
              isBrideFirst ? "border-[#4a148c] bg-purple-50" : "border-gray-200 bg-white hover:border-[#4a148c]/30"
            )}>
              <div className="flex items-center gap-3">
                <div className={clsx("flex items-center justify-center w-5 h-5 rounded-full border-2", isBrideFirst ? "border-[#4a148c]" : "border-gray-300")}>
                  {isBrideFirst && <div className="w-2.5 h-2.5 bg-[#4a148c] rounded-full" />}
                </div>
                <span className={clsx("font-semibold text-[15px]", isBrideFirst ? "text-[#4a148c]" : "text-gray-600")}>Bride First</span>
              </div>
              <input
                type="radio"
                value="bride_first"
                {...register("nameOrder", { required: "Required" })}
                className="sr-only"
              />
            </label>
          </div>
        </FieldWrapper>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isBrideFirst ? (
          <>
            <div className="space-y-6 border border-gray-200 border-l-4 border-l-[#9d174d] rounded-xl p-6 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
              <h3 className="text-[12px] font-bold text-[#9d174d] uppercase tracking-widest">Bride's Details</h3>
              {brideNameField}
              {brideMotherField}
              {brideFatherField}
            </div>
            <div className="space-y-6 border border-gray-200 border-l-4 border-l-[#2e1065] rounded-xl p-6 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
              <h3 className="text-[12px] font-bold text-[#2e1065] uppercase tracking-widest">Groom's Details</h3>
              {groomNameField}
              {groomMotherField}
              {groomFatherField}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-6 border border-gray-200 border-l-4 border-l-[#2e1065] rounded-xl p-6 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
              <h3 className="text-[12px] font-bold text-[#2e1065] uppercase tracking-widest">Groom's Details</h3>
              {groomNameField}
              {groomMotherField}
              {groomFatherField}
            </div>
            <div className="space-y-6 border border-gray-200 border-l-4 border-l-[#9d174d] rounded-xl p-6 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
              <h3 className="text-[12px] font-bold text-[#9d174d] uppercase tracking-widest">Bride's Details</h3>
              {brideNameField}
              {brideMotherField}
              {brideFatherField}
            </div>
          </>
        )}
      </div>

      <FieldWrapper label="Wedding Hashtag" error={errors.hashtag?.message}>
        <Input
          placeholder="e.g. #SharmaGayi, #Virushka"
          {...register("hashtag")}
        />
      </FieldWrapper>
    </div>
  );
}

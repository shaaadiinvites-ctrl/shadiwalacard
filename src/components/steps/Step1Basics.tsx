"use client";

import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { WeddingFormData } from "@/types/wedding";
import { FieldWrapper, Input } from "@/components/FormFields";
import { clsx } from "clsx";

interface Props {
  register: UseFormRegister<WeddingFormData>;
  errors: FieldErrors<WeddingFormData>;
  watch: UseFormWatch<WeddingFormData>;
}

export default function Step1Basics({ register, errors, watch }: Props) {
  const nameOrder = watch("nameOrder");
  const isBrideFirst = nameOrder === "bride_first";

  const brideNameField = (
    <FieldWrapper label="Bride's Full Name" error={errors.brideName?.message}>
      <Input
        {...register("brideName", { required: "Required" })}
        className="capitalize"
      />
    </FieldWrapper>
  );

  const groomNameField = (
    <FieldWrapper label="Groom's Full Name" error={errors.groomName?.message}>
      <Input
        {...register("groomName", { required: "Required" })}
        className="capitalize"
      />
    </FieldWrapper>
  );

  const brideMotherField = (
    <FieldWrapper label="Bride's Mother's Name" error={errors.brideMotherName?.message}>
      <Input
        {...register("brideMotherName")}
        className="capitalize"
      />
    </FieldWrapper>
  );

  const brideFatherField = (
    <FieldWrapper label="Bride's Father's Name" error={errors.brideFatherName?.message}>
      <Input
        {...register("brideFatherName")}
        className="capitalize"
      />
    </FieldWrapper>
  );

  const groomMotherField = (
    <FieldWrapper label="Groom's Mother's Name" error={errors.groomMotherName?.message}>
      <Input
        {...register("groomMotherName")}
        className="capitalize"
      />
    </FieldWrapper>
  );

  const groomFatherField = (
    <FieldWrapper label="Groom's Father's Name" error={errors.groomFatherName?.message}>
      <Input
        {...register("groomFatherName")}
        className="capitalize"
      />
    </FieldWrapper>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[28px] font-bold text-[#2e1065] mb-2 tracking-tight">The Happy Couple</h2>
        <p className="text-[14px] font-normal text-gray-500">Tell us about the two of you to personalize your digital invite.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="hidden md:block"></div>
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

"use client";

import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { WeddingFormData } from "@/types/wedding";
import { FieldWrapper, Input } from "@/components/FormFields";

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
        placeholder="e.g. Ananya Sharma" className="capitalize"
      />
    </FieldWrapper>
  );

  const groomNameField = (
    <FieldWrapper label="Groom's Full Name" error={errors.groomName?.message}>
      <Input
        {...register("groomName", { required: "Required" })}
        placeholder="e.g. Aditya Verma" className="capitalize"
      />
    </FieldWrapper>
  );

  const brideMotherField = (
    <FieldWrapper label="Bride's Mother's Name" error={errors.brideMotherName?.message}>
      <Input
        {...register("brideMotherName")}
        placeholder="e.g. Mrs. Shalini Mittal" className="capitalize"
      />
    </FieldWrapper>
  );

  const brideFatherField = (
    <FieldWrapper label="Bride's Father's Name" error={errors.brideFatherName?.message}>
      <Input
        {...register("brideFatherName")}
        placeholder="e.g. Mr. Aakash Mittal" className="capitalize"
      />
    </FieldWrapper>
  );

  const groomMotherField = (
    <FieldWrapper label="Groom's Mother's Name" error={errors.groomMotherName?.message}>
      <Input
        {...register("groomMotherName")}
        placeholder="e.g. Mrs. Premika Kapoor" className="capitalize"
      />
    </FieldWrapper>
  );

  const groomFatherField = (
    <FieldWrapper label="Groom's Father's Name" error={errors.groomFatherName?.message}>
      <Input
        {...register("groomFatherName")}
        placeholder="e.g. Mr. Prem Kapoor" className="capitalize"
      />
    </FieldWrapper>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2e1065]" style={{ fontFamily: "'Playfair Display', serif" }}>The Happy Couple</h2>
        <p className="text-sm text-gray-500 mt-1">Tell us about the two of you to personalize your digital invite.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FieldWrapper label="Name Display Order" error={errors.nameOrder?.message}>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80">
              <input
                type="radio"
                value="groom_first"
                {...register("nameOrder", { required: "Required" })}
                className="w-4 h-4 text-[#2e1065] border-gray-300 focus:ring-[#2e1065]"
              />
              <span>Groom First</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80">
              <input
                type="radio"
                value="bride_first"
                {...register("nameOrder", { required: "Required" })}
                className="w-4 h-4 text-[#2e1065] border-gray-300 focus:ring-[#2e1065]"
              />
              <span>Bride First</span>
            </label>
          </div>
        </FieldWrapper>
        <div className="hidden md:block"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {isBrideFirst ? (
          <>
            {brideNameField}
            {groomNameField}
          </>
        ) : (
          <>
            {groomNameField}
            {brideNameField}
          </>
        )}
      </div>

      <FieldWrapper label="Wedding Hashtag" error={errors.hashtag?.message}>
        <Input
          {...register("hashtag")}
          placeholder="e.g. #AdityaKiAnanya (Leave empty if not required)"
        />
      </FieldWrapper>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {isBrideFirst ? (
          <>
            {brideMotherField}
            {groomMotherField}
          </>
        ) : (
          <>
            {groomMotherField}
            {brideMotherField}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {isBrideFirst ? (
          <>
            {brideFatherField}
            {groomFatherField}
          </>
        ) : (
          <>
            {groomFatherField}
            {brideFatherField}
          </>
        )}
      </div>
    </div>
  );
}

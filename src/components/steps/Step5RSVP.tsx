"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { WeddingFormData } from "@/types/wedding";
import { FieldWrapper, Input } from "@/components/FormFields";

interface Props {
  register: UseFormRegister<WeddingFormData>;
  errors: FieldErrors<WeddingFormData>;
}

export default function Step5RSVP({ register, errors }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[28px] font-bold text-[#2e1065] mb-2 tracking-tight">R.S.V.P Details</h2>
        <p className="text-[14px] font-normal text-gray-500">Provide contact points for guests who have questions or need to RSVP.</p>
      </div>

      <div className="border border-gray-200/60 rounded-xl p-6 bg-white shadow-sm space-y-6">
        <h3 className="text-[12px] font-bold text-[#9d174d] uppercase tracking-widest">RSVP 1</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldWrapper label="Contact Name" error={errors.rsvp1Name?.message}>
            <Input
              {...register("rsvp1Name")}
              className="capitalize"
            />
          </FieldWrapper>
          <FieldWrapper label="Contact Number" error={errors.rsvp1Phone?.message}>
            <Input
              {...register("rsvp1Phone", {
                pattern: {
                  value: /^[0-9+\-\s()]*$/,
                  message: "Invalid phone number format",
                },
                validate: (val) => {
                  if (!val) return true;
                  const digits = val.replace(/\D/g, '').length;
                  if (digits < 10) return "Phone number must be at least 10 digits";
                  if (digits > 15) return "Phone number is too long";
                  return true;
                },
              })}
              type="tel"
              maxLength={20}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(/[^\d+\-\s()]/g, '');
              }}
            />
          </FieldWrapper>
        </div>
      </div>

      <div className="border border-gray-200/60 rounded-xl p-6 bg-white shadow-sm space-y-6">
        <h3 className="text-[12px] font-bold text-[#9d174d] uppercase tracking-widest">RSVP 2</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldWrapper label="Contact Name" error={errors.rsvp2Name?.message}>
            <Input
              {...register("rsvp2Name")}
              className="capitalize"
            />
          </FieldWrapper>
          <FieldWrapper label="Contact Number" error={errors.rsvp2Phone?.message}>
            <Input
              {...register("rsvp2Phone", {
                pattern: {
                  value: /^[0-9+\-\s()]*$/,
                  message: "Invalid phone number format",
                },
                validate: (val) => {
                  if (!val) return true;
                  const digits = val.replace(/\D/g, '').length;
                  if (digits < 10) return "Phone number must be at least 10 digits";
                  if (digits > 15) return "Phone number is too long";
                  return true;
                },
              })}
              type="tel"
              maxLength={20}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(/[^\d+\-\s()]/g, '');
              }}
            />
          </FieldWrapper>
        </div>
      </div>
    </div>
  );
}

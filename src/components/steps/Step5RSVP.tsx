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
        <h2 className="text-2xl font-bold text-[#2e1065]" style={{ fontFamily: "'Playfair Display', serif" }}>R.S.V.P Details</h2>
        <p className="text-sm text-gray-500 mt-1">Provide contact points for guests who have questions or need to RSVP.</p>
      </div>

      <div className="border border-[#2e1065]/15 rounded-2xl p-5 bg-[#F2F4F8]/70 space-y-5 shadow-inner">
        <h3 className="text-sm font-extrabold text-[#9d174d] uppercase tracking-wider">RSVP 1</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldWrapper label="Contact Name *" error={errors.rsvp1Name?.message}>
            <Input
              {...register("rsvp1Name", { required: "Please enter a contact name for RSVP" })}
              placeholder="e.g. Mr. & Mrs. Sharma"
            />
          </FieldWrapper>
          <FieldWrapper label="Contact Number *" error={errors.rsvp1Phone?.message}>
            <Input
              {...register("rsvp1Phone", { required: "Please enter a contact number for RSVP" })}
              placeholder="e.g. +91 98765 43210"
              type="tel"
            />
          </FieldWrapper>
        </div>
      </div>

      <div className="border border-[#2e1065]/15 rounded-2xl p-5 bg-[#F2F4F8]/70 space-y-5 shadow-inner">
        <h3 className="text-sm font-extrabold text-[#9d174d] uppercase tracking-wider">RSVP 2</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldWrapper label="Contact Name" error={errors.rsvp2Name?.message}>
            <Input
              {...register("rsvp2Name")}
              placeholder="e.g. The Verma Family"
            />
          </FieldWrapper>
          <FieldWrapper label="Contact Number" error={errors.rsvp2Phone?.message}>
            <Input
              {...register("rsvp2Phone")}
              placeholder="e.g. +91 87654 32109"
              type="tel"
            />
          </FieldWrapper>
        </div>
      </div>
    </div>
  );
}

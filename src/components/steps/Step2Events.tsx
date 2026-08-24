"use client";

import { UseFormRegister, FieldErrors, useFieldArray, Control, UseFormSetValue, useWatch, Controller } from "react-hook-form";
import { WeddingFormData, EVENT_NAME_OPTIONS } from "@/types/wedding";
import { FieldWrapper, Input, Textarea, LocationInput, Select } from "@/components/FormFields";
import { MobileSheetSelect, MobileSheetDatePicker } from "@/components/MobileSheetPickers";
import { WheelTimePickerSheet } from "@/components/ui/WheelTimePickerSheet";
import { Plus, Trash2, Clock } from "lucide-react";
import { useState } from "react";

interface Props {
  register: UseFormRegister<WeddingFormData>;
  errors: FieldErrors<WeddingFormData>;
  control: Control<WeddingFormData>;
  setValue: UseFormSetValue<WeddingFormData>;
}

export default function Step2Events({ register, errors, control, setValue }: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: "events" });
  
  // Watch all events to conditionally render the "Other" text box
  const watchedEvents = useWatch({ control, name: "events" });
  const [activeTimePicker, setActiveTimePicker] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2e1065]" style={{ fontFamily: "'Playfair Display', serif" }}>Event Schedule</h2>
        <p className="text-sm text-gray-500 mt-1">
          Add each ceremony — Mehendi, Haldi, Sangeet, Wedding, Reception, etc.
        </p>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border border-[#2e1065]/15 rounded-2xl p-5 bg-[#F2F4F8]/70 space-y-5 relative shadow-inner"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-[#9d174d] uppercase tracking-wider">
                Event {index + 1}
              </span>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

              <div className="flex items-center gap-3 mt-1 mb-2">
                  <label className="flex items-center gap-2 mt-2 cursor-pointer bg-white p-2 rounded-lg border border-gray-100 shadow-sm hover:border-[#2e1065]/30 transition-all">
                    <input
                      type="radio"
                      value="true"
                      {...register(`events.${index}.isMainEvent`)}
                      checked={String(watchedEvents?.[index]?.isMainEvent) === "true"}
                      onChange={() => {
                        // Deselect all others, select this one
                        watchedEvents?.forEach((_, i) => {
                          setValue(`events.${i}.isMainEvent`, i === index);
                        });
                      }}
                      className="w-4 h-4 text-[#2e1065] border-gray-300 focus:ring-[#2e1065]"
                    />
                  <span className="font-semibold text-[#2e1065]">Set as Main Event</span>
                </label>
                <span className="text-xs text-gray-400">(Used for Countdown)</span>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldWrapper
                label="Event Name"
                error={errors.events?.[index]?.name?.message}
              >
                <Controller
                  control={control}
                  name={`events.${index}.name`}
                  rules={{ required: "Required" }}
                  render={({ field }) => (
                    <>
                      <div className="hidden md:block">
                        <Select {...field}>
                          <option value="">Select Event...</option>
                          {EVENT_NAME_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div className="md:hidden">
                        <MobileSheetSelect
                          value={field.value}
                          onChange={field.onChange}
                          options={EVENT_NAME_OPTIONS}
                          placeholder="Select Event..."
                        />
                      </div>
                    </>
                  )}
                />
              </FieldWrapper>

              {watchedEvents?.[index]?.name === "Other" && (
                <FieldWrapper
                  label={<>Custom Event Name <span className="text-red-500">*</span></>}
                  error={errors.events?.[index]?.customName?.message}
                >
                  <Input
                    {...register(`events.${index}.customName`, { required: "Required" })}
                    placeholder="e.g. Pool Party" className="capitalize"
                  />
                </FieldWrapper>
              )}

              <FieldWrapper
                label="Date"
                error={errors.events?.[index]?.date?.message}
              >
                <Controller
                  control={control}
                  name={`events.${index}.date`}
                  rules={{
                    required: "Required",
                    validate: (val) => {
                      const selected = new Date(val);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return selected >= today || "Date cannot be in the past";
                    }
                  }}
                  render={({ field }) => (
                    <>
                      <div className="hidden md:block">
                        <Input {...field} type="date" min={new Date().toISOString().split("T")[0]} />
                      </div>
                      <div className="md:hidden">
                        <MobileSheetDatePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </div>
                    </>
                  )}
                />
              </FieldWrapper>

              <FieldWrapper
                label="Time"
                error={errors.events?.[index]?.time?.message}
              >
                <Controller
                  control={control}
                  name={`events.${index}.time`}
                  rules={{ required: "Required" }}
                  render={({ field }) => (
                    <>
                      <div 
                        onClick={() => setActiveTimePicker(index)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-purple-600 focus-within:border-transparent outline-none transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span className={field.value ? "text-gray-900" : "text-gray-400"}>
                          {field.value || "Select time"}
                        </span>
                        <Clock size={18} className="text-gray-400" />
                      </div>
                      <WheelTimePickerSheet
                        isOpen={activeTimePicker === index}
                        onClose={() => setActiveTimePicker(null)}
                        initialTime={field.value}
                        onSelect={(time) => {
                          field.onChange(time);
                        }}
                      />
                    </>
                  )}
                />
              </FieldWrapper>
            </div>

            <FieldWrapper
              label="Venue Name & Location"
              hint="Search your venue name to automatically generate the Google Maps link."
              error={errors.events?.[index]?.venue?.message}
            >
              <LocationInput
                {...register(`events.${index}.venue`, { required: "Required" })}
                placeholder="Map Search: Type venue name..."
                onPlaceSelected={(address, url) => {
                  setValue(`events.${index}.venue`, address, { shouldValidate: true });
                  setValue(`events.${index}.mapsLink`, url, { shouldValidate: true });
                }}
              />
            </FieldWrapper>

            <FieldWrapper
              label="Google Maps Link"
              error={errors.events?.[index]?.mapsLink?.message}
            >
              <Input
                {...register(`events.${index}.mapsLink`)}
                placeholder="https://maps.google.com/..."
                type="url"
              />
            </FieldWrapper>

            <FieldWrapper
              label="Special Event Notes"
              error={errors.events?.[index]?.notes?.message}
            >
              <Textarea
                {...register(`events.${index}.notes`)}
                placeholder='e.g. "Join us for dinner after the ceremony"'
                rows={2}
              />
            </FieldWrapper>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          append({ name: "", customName: "", isMainEvent: fields.length === 0, date: "", time: "", venue: "", mapsLink: "", dressCode: "", notes: "" })
        }
        className="flex items-center gap-2 text-[#9d174d] hover:text-[#2e1065] font-bold text-sm border-2 border-[#9d174d]/30 hover:border-[#9d174d] bg-[#9d174d]/5 hover:bg-[#9d174d]/10 rounded-full px-5 py-3 transition-all w-full justify-center shadow-xs"
      >
        <Plus size={18} />
        Add Another Event
      </button>
    </div>
  );
}

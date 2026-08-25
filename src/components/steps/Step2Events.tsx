"use client";

import { UseFormRegister, FieldErrors, useFieldArray, Control, UseFormSetValue, useWatch, Controller } from "react-hook-form";
import { WeddingFormData, EVENT_NAME_OPTIONS } from "@/types/wedding";
import { FieldWrapper, Input, Textarea, LocationInput, Select } from "@/components/FormFields";
import { MobileSheetSelect, MobileSheetDatePicker } from "@/components/MobileSheetPickers";
import { WheelTimePickerSheet } from "@/components/ui/WheelTimePickerSheet";
import { Plus, Trash2, Clock } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

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
        <h2 className="text-[28px] font-bold text-[#2e1065] mb-2 tracking-tight">Event Schedule</h2>
        <p className="text-[14px] font-normal text-gray-500">
          Add each ceremony — Mehendi, Haldi, Sangeet, Wedding, Reception, etc.
        </p>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border border-gray-200/60 rounded-xl p-6 bg-white shadow-sm relative space-y-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-[#9d174d] uppercase tracking-widest">
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

            <div>
              <label className={clsx(
                "flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all",
                String(watchedEvents?.[index]?.isMainEvent) === "true" 
                  ? "border-[#4a148c] bg-purple-50" 
                  : "border-gray-200 bg-white hover:border-[#4a148c]/30"
              )}>
                <div className="flex items-center gap-3">
                  <div className={clsx("flex items-center justify-center w-5 h-5 rounded-full border-2", String(watchedEvents?.[index]?.isMainEvent) === "true" ? "border-[#4a148c]" : "border-gray-300")}>
                    {String(watchedEvents?.[index]?.isMainEvent) === "true" && <div className="w-2.5 h-2.5 bg-[#4a148c] rounded-full" />}
                  </div>
                  <div className="flex flex-col">
                    <span className={clsx("font-semibold text-[15px]", String(watchedEvents?.[index]?.isMainEvent) === "true" ? "text-[#4a148c]" : "text-gray-600")}>
                      Set as Main Event
                    </span>
                    <span className={clsx("text-[12px]", String(watchedEvents?.[index]?.isMainEvent) === "true" ? "text-[#4a148c]/70" : "text-gray-400")}>
                      This event will be used for countdown.
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  value="true"
                  {...register(`events.${index}.isMainEvent`)}
                  checked={String(watchedEvents?.[index]?.isMainEvent) === "true"}
                  onChange={() => {
                    watchedEvents?.forEach((_, i) => {
                      setValue(`events.${i}.isMainEvent`, i === index);
                    });
                  }}
                  className="sr-only"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="e.g. Pool Party"
                    className="capitalize"
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
                        className="w-full px-4 h-[44px] bg-white border border-gray-300 rounded-xl focus-within:border-[#4a148c] outline-none transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span className={clsx("text-[14px] font-medium", field.value ? "text-[#1A202C]" : "text-gray-400")}>
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
              error={errors.events?.[index]?.venue?.message}
            >
              <LocationInput
                {...register(`events.${index}.venue`, { required: "Required" })}
                placeholder="Search venue on Google Maps..."
                onPlaceSelected={(address, url) => {
                  setValue(`events.${index}.venue`, address, { shouldValidate: true });
                  setValue(`events.${index}.mapsLink`, url, { shouldValidate: true });
                }}
              />
            </FieldWrapper>

            <input type="hidden" {...register(`events.${index}.mapsLink`)} />
            {watchedEvents?.[index]?.mapsLink && (
              <div className="flex flex-col gap-1.5 mt-2 max-w-full overflow-hidden">
                <span className="text-[14px] font-medium text-[#1A202C]">Google Maps Link</span>
                <a 
                  href={watchedEvents[index].mapsLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[14px] text-[#4a148c] hover:text-[#2e1065] underline truncate block w-full"
                >
                  {watchedEvents[index].mapsLink}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          append({ name: "", customName: "", isMainEvent: fields.length === 0, date: "", time: "", venue: "", mapsLink: "", dressCode: "", notes: "" })
        }
        className="flex items-center gap-2 bg-transparent border border-[#4a148c] text-[#4a148c] font-semibold text-[14px] hover:bg-purple-50 rounded-xl px-5 h-[44px] transition-all w-full justify-center"
      >
        <Plus size={18} />
        Add Another Event
      </button>
    </div>
  );
}

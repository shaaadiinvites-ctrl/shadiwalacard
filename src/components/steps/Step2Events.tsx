"use client";

import { UseFormRegister, FieldErrors, useFieldArray, Control, UseFormSetValue, useWatch, Controller } from "react-hook-form";
import { WeddingFormData, EVENT_NAME_OPTIONS } from "@/types/wedding";
import { FieldWrapper, Input, Textarea, LocationInput, Select } from "@/components/FormFields";
import { MobileSheetSelect, MobileSheetDatePicker } from "@/components/MobileSheetPickers";
import { WheelTimePickerSheet } from "@/components/ui/WheelTimePickerSheet";
import { Plus, Trash2, Clock, MapPin } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { clsx } from "clsx";
import { formatTime12 } from "@/lib/utils";

function isShaadiEvent(event?: { name?: string; customName?: string }): boolean {
  if (!event) return false;
  const name = (event.name || "").trim().toLowerCase();
  const custom = (event.customName || "").trim().toLowerCase();
  return name === "shaadi" || name === "shadi" || custom === "shaadi" || custom === "shadi";
}

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

  // Auto-manage main event logic (auto-selects "Shaadi" as main event if present)
  const lastAppliedShaadiIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (!watchedEvents || watchedEvents.length === 0) return;

    // 1. If any event is "Shaadi", automatically select it as the main event
    const shaadiIndex = watchedEvents.findIndex(isShaadiEvent);

    if (shaadiIndex !== -1) {
      if (lastAppliedShaadiIndexRef.current !== shaadiIndex) {
        lastAppliedShaadiIndexRef.current = shaadiIndex;
        watchedEvents.forEach((_, i) => {
          setValue(`events.${i}.isMainEvent`, i === shaadiIndex, { shouldValidate: true, shouldDirty: true });
        });
        return;
      }
    } else {
      lastAppliedShaadiIndexRef.current = null;
    }
    
    // 2. If only 1 event, force it to be the main event
    if (watchedEvents.length === 1) {
      if (String(watchedEvents[0]?.isMainEvent) !== "true") {
        setValue('events.0.isMainEvent', true, { shouldValidate: true, shouldDirty: true });
      }
    } 
    // 3. If multiple events, ensure exactly one is selected. If none is, select the first one.
    else {
      const hasMain = watchedEvents.some(e => String(e?.isMainEvent) === "true");
      if (!hasMain) {
        setValue('events.0.isMainEvent', true, { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [watchedEvents, setValue]);

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
            className="event-card border border-gray-200/60 rounded-xl p-6 bg-white shadow-sm relative space-y-6"
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
                        <Select {...field} data-first-field="true">
                          <option value="">Select Event...</option>
                          {EVENT_NAME_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt === "Custom" ? "Custom (add your own)" : opt}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div className="md:hidden" data-first-field-container="true">
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

              {(watchedEvents?.[index]?.name === "Custom" || watchedEvents?.[index]?.name === "Other") && (
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
                      const selected = new Date(val + "T00:00:00");
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return selected >= today || "Date cannot be in the past";
                    }
                  }}
                  render={({ field }) => (
                    <>
                      <div className="hidden md:block">
                        <Input 
                          {...field} 
                          type="date" 
                          min={new Date().toISOString().split("T")[0]} 
                          onClick={(e) => {
                             try { (e.target as any).showPicker?.(); } catch(e){}
                          }}
                          onFocus={(e) => {
                             try { (e.target as any).showPicker?.(); } catch(e){}
                          }}
                        />
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
                          {field.value ? formatTime12(field.value) : "Select time"}
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

            <div className="space-y-3">
              <label className="text-[14px] font-bold text-[#1A202C] block">
                Venue & Location <span className="text-red-500">*</span>
              </label>

              {/* Segmented Toggle Bar */}
              <div className="p-1 bg-gray-100/80 rounded-xl flex items-center gap-1 border border-gray-200/60 shadow-inner">
                <button
                  type="button"
                  onClick={() => {
                    if (watchedEvents?.[index]?.venue?.trim() === "At Residence") {
                      setValue(`events.${index}.venue`, "", { shouldValidate: true, shouldDirty: true });
                    }
                  }}
                  className={clsx(
                    "flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                    watchedEvents?.[index]?.venue?.trim() !== "At Residence"
                      ? "bg-white text-[#2e1065] shadow-sm border border-gray-200/50"
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  <MapPin size={14} className={watchedEvents?.[index]?.venue?.trim() !== "At Residence" ? "text-[#9d174d]" : "text-gray-400"} />
                  <span>Hotel / Banquet Venue</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setValue(`events.${index}.venue`, "At Residence", { shouldValidate: true, shouldDirty: true });
                  }}
                  className={clsx(
                    "flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                    watchedEvents?.[index]?.venue?.trim() === "At Residence"
                      ? "bg-gradient-to-r from-[#2e1065] to-[#4a148c] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  <span>🏠</span>
                  <span>At Residence (Home)</span>
                </button>
              </div>

              {watchedEvents?.[index]?.venue?.trim() === "At Residence" ? (
                <div className="p-4 bg-gradient-to-br from-purple-50/60 to-pink-50/30 border border-purple-200/60 rounded-xl space-y-3 shadow-sm">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-purple-100">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                    <p className="text-xs text-[#2e1065] font-medium leading-relaxed">
                      Venue will appear as <strong className="font-bold text-[#9d174d]">"At Residence"</strong> on your digital invite.
                    </p>
                  </div>

                  <div>
                    <label className="text-[12px] font-bold text-gray-700 block mb-1">
                      Home Address <span className="text-gray-400 font-normal">(Optional — shown on card)</span>
                    </label>
                    <Input
                      {...register(`events.${index}.notes`)}
                      placeholder="e.g. 42, Park Avenue, Opp. City Mall, Jaipur"
                      className="text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[12px] font-bold text-gray-700 block mb-1">
                      Google Maps Link <span className="text-gray-400 font-normal">(Optional — for 1-tap navigation)</span>
                    </label>
                    <Input
                      {...register(`events.${index}.mapsLink`)}
                      placeholder="https://maps.app.goo.gl/..."
                      className="text-sm font-mono bg-white"
                    />
                  </div>
                </div>
              ) : (
                <FieldWrapper error={errors.events?.[index]?.venue?.message}>
                  <LocationInput
                    {...register(`events.${index}.venue`, { required: "Required" })}
                    placeholder="Search venue or hotel on Google Maps..."
                    onPlaceSelected={(address, url) => {
                      setValue(`events.${index}.venue`, address, { shouldValidate: true });
                      setValue(`events.${index}.mapsLink`, url, { shouldValidate: true });
                    }}
                  />
                </FieldWrapper>
              )}

              <input type="hidden" {...register(`events.${index}.mapsLink`)} />
              {watchedEvents?.[index]?.mapsLink && watchedEvents?.[index]?.venue?.trim() !== "At Residence" && (
                <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-purple-50/60 rounded-lg border border-purple-100 text-xs">
                  <span className="text-emerald-600 font-bold">✓ Map Attached:</span>
                  <a 
                    href={watchedEvents[index].mapsLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#4a148c] hover:underline font-mono truncate flex-1"
                  >
                    {watchedEvents[index].mapsLink}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          // 1. Immediately blur any active focused input to dismiss the mobile keyboard
          if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }

          // 2. Append new event with shouldFocus: false to prevent react-hook-form from auto-focusing the venue input!
          append(
            {
              name: "",
              customName: "",
              isMainEvent: false,
              date: "",
              time: "",
              venue: "",
              mapsLink: "",
              dressCode: "",
              notes: "",
            },
            { shouldFocus: false }
          );

          // 3. Scroll smoothly to the START of the new card with fixed header clearance
          requestAnimationFrame(() => {
            setTimeout(() => {
              const elements = document.querySelectorAll('.event-card');
              if (elements.length > 0) {
                const newCard = elements[elements.length - 1] as HTMLElement;
                const headerOffset = 75;
                const cardTop = newCard.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                  top: Math.max(0, cardTop - headerOffset),
                  behavior: 'smooth',
                });

                // Ensure mobile keyboard remains closed
                if (document.activeElement instanceof HTMLElement && document.activeElement.tagName === "INPUT") {
                  document.activeElement.blur();
                }
              }
            }, 120);
          });
        }}
        className="flex items-center gap-2 bg-transparent border border-[#4a148c] text-[#4a148c] font-semibold text-[14px] hover:bg-purple-50 rounded-xl px-5 h-[44px] transition-all w-full justify-center"
      >
        <Plus size={18} />
        Add Another Event
      </button>

      {fields.length > 1 && (
        <div className="border border-gray-200/60 rounded-xl p-6 bg-white shadow-sm space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#9d174d] uppercase tracking-widest">
              Set Main Event
            </span>
          </div>
          <p className="text-[14px] text-gray-500 mt-[-16px]">Select the event to be used for your invitation's countdown timer.</p>
          <div className="grid grid-cols-1 gap-4">
            <Select
              value={watchedEvents?.findIndex(e => String(e?.isMainEvent) === "true")?.toString() || "0"}
              onChange={(e) => {
                const selectedIdx = parseInt(e.target.value);
                watchedEvents?.forEach((_, i) => {
                  setValue(`events.${i}.isMainEvent`, i === selectedIdx);
                });
              }}
            >
              {fields.map((field, index) => {
                const isCustom = watchedEvents?.[index]?.name === "Custom" || watchedEvents?.[index]?.name === "Other";
                const eventName = isCustom
                  ? (watchedEvents?.[index]?.customName || `Custom (add your own)`)
                  : (watchedEvents?.[index]?.name || `Event ${index + 1}`);
                return (
                  <option key={`main-event-select-${field.id}`} value={index}>
                    {eventName}
                  </option>
                );
              })}
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}


"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calendar as CalendarIcon, Clock, X, Check } from "lucide-react";
import clsx from "clsx";

// --- Base Bottom Sheet Wrapper ---
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[10000] bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh]"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#2e1065]">{title}</h3>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:text-gray-800 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 overscroll-contain">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// --- Custom Bottom Sheet Select ---
interface MobileSheetSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: readonly string[];
  placeholder?: string;
  disabled?: boolean;
}

export function MobileSheetSelect({ value, onChange, options, placeholder = "Select...", disabled }: MobileSheetSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className="w-full text-left px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-[#9d174d] outline-none flex items-center justify-between shadow-sm disabled:opacity-50"
      >
        <span className={clsx("truncate", !value && "text-gray-400")}>{value || placeholder}</span>
        <ChevronDown size={18} className="text-gray-400" />
      </button>

      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title={placeholder}>
        <div className="space-y-2">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={clsx(
                "w-full text-left px-4 py-4 rounded-xl flex items-center justify-between font-medium transition-colors",
                value === opt ? "bg-[#2e1065] text-white" : "bg-gray-50 text-gray-800 hover:bg-gray-100"
              )}
            >
              {opt}
              {value === opt && <Check size={18} />}
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}

// --- Custom Bottom Sheet Calendar Picker ---
interface MobileSheetDatePickerProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MobileSheetDatePicker({ value, onChange, placeholder = "Select Date", disabled }: MobileSheetDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => value ? new Date(value) : new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate calendar grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const blanks = Array.from({ length: firstDayOfMonth });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const handleSelectDate = (day: number) => {
    const selected = new Date(year, month, day);
    if (selected < today) return; // Prevent past dates
    
    // Format to YYYY-MM-DD
    const pad = (n: number) => n.toString().padStart(2, '0');
    onChange(`${selected.getFullYear()}-${pad(selected.getMonth() + 1)}-${pad(selected.getDate())}`);
    setIsOpen(false);
  };

  // Format display value
  const displayValue = value ? new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "";

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className="w-full text-left px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-[#9d174d] outline-none flex items-center justify-between shadow-sm disabled:opacity-50"
      >
        <span className={clsx("truncate", !displayValue && "text-gray-400")}>{displayValue || placeholder}</span>
        <CalendarIcon size={18} className="text-gray-400" />
      </button>

      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title="Select Date">
        <div className="flex items-center justify-between mb-6">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full text-[#2e1065] font-bold">←</button>
          <div className="font-bold text-lg text-[#1A202C]">
            {currentMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </div>
          <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full text-[#2e1065] font-bold">→</button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="text-xs font-bold text-gray-400">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {blanks.map((_, i) => <div key={`blank-${i}`} />)}
          {days.map(day => {
            const dateObj = new Date(year, month, day);
            const isPast = dateObj < today;
            const pad = (n: number) => n.toString().padStart(2, '0');
            const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
            const isSelected = value === dateStr;

            return (
              <button
                key={day}
                disabled={isPast}
                onClick={() => handleSelectDate(day)}
                className={clsx(
                  "aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-colors",
                  isSelected ? "bg-[#9d174d] text-white shadow-md" : 
                  isPast ? "text-gray-300 cursor-not-allowed" : "text-gray-800 hover:bg-[#9d174d]/10"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </BottomSheet>
    </>
  );
}

// --- Custom Bottom Sheet Time Picker ---
interface MobileSheetTimePickerProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MobileSheetTimePicker({ value, onChange, placeholder = "Select Time", disabled }: MobileSheetTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Generate time slots (every 30 mins)
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const isPM = h >= 12;
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const displayM = m === 0 ? '00' : '30';
      const ampm = isPM ? 'PM' : 'AM';
      
      const valH = h.toString().padStart(2, '0');
      const valM = m.toString().padStart(2, '0');
      
      times.push({
        value: `${valH}:${valM}`, // 24h format for standard HTML time input compatibility
        display: `${displayH}:${displayM} ${ampm}` // 12h format for UI
      });
    }
  }

  // Find display value
  const selectedDisplay = times.find(t => t.value === value)?.display || value;

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className="w-full text-left px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-[#9d174d] outline-none flex items-center justify-between shadow-sm disabled:opacity-50"
      >
        <span className={clsx("truncate", !selectedDisplay && "text-gray-400")}>{selectedDisplay || placeholder}</span>
        <Clock size={18} className="text-gray-400" />
      </button>

      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title="Select Time">
        <div className="grid grid-cols-2 gap-3">
          {times.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => {
                onChange(t.value);
                setIsOpen(false);
              }}
              className={clsx(
                "py-3 px-2 text-center rounded-xl font-medium transition-colors text-sm",
                value === t.value ? "bg-[#2e1065] text-white shadow-md" : "bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-100"
              )}
            >
              {t.display}
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Check, Clock } from "lucide-react";
import clsx from "clsx";

import { BottomSheet } from "@/components/MobileSheetPickers";
import { parseTimeTo12h, timeTo24h } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (time: string) => void;
  initialTime?: string; // e.g. "19:30" or "07:30 PM"
}

export function WheelTimePickerSheet({ isOpen, onClose, onSelect, initialTime }: Props) {
  const [hour, setHour] = useState("07");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState<"AM" | "PM">("PM");

  useEffect(() => {
    if (isOpen) {
      const parsed = parseTimeTo12h(initialTime);
      setHour(parsed.hour);
      setMinute(parsed.minute);
      setPeriod(parsed.period);
    }
  }, [isOpen, initialTime]);

  const hours = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

  const handleSave = () => {
    const formatted24 = timeTo24h(`${hour}:${minute} ${period}`);
    onSelect(formatted24);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Select Event Time">
      <div className="flex flex-col items-center w-full max-w-sm mx-auto pt-1 pb-4 px-2">
        
        {/* Real-time formatted time preview */}
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-purple-50 border border-purple-100 shadow-sm">
            <Clock size={18} className="text-[#2e1065]" />
            <span className="text-[22px] font-extrabold text-[#2e1065] tracking-wide font-mono">
              {hour}:{minute} {period}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1 font-medium">12-hour format with AM / PM</p>
        </div>

        {/* Interactive Wheels + AM/PM selection container */}
        <div className="relative flex justify-center items-center h-[200px] w-full my-2 px-2">
          {/* Highlight bar across the active row */}
          <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 h-[48px] bg-[#2e1065]/5 border-y border-[#2e1065]/15 rounded-xl pointer-events-none" />

          <div className="flex items-center justify-center gap-3 sm:gap-4 z-10">
            {/* Hours Wheel */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Hour</span>
              <Wheel column={hours} value={hour} onChange={setHour} />
            </div>

            {/* Colon Separator */}
            <div className="text-2xl font-bold text-[#2e1065] pt-4 select-none">:</div>

            {/* Minutes Wheel */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Minute</span>
              <Wheel column={minutes} value={minute} onChange={setMinute} />
            </div>

            {/* AM / PM Segmented Control */}
            <div className="flex flex-col items-center ml-1 sm:ml-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Period</span>
              <div className="flex flex-col gap-1.5 p-1 bg-gray-100/90 rounded-2xl border border-gray-200/80 shadow-inner">
                <button
                  type="button"
                  onClick={() => setPeriod("AM")}
                  className={clsx(
                    "w-[56px] h-[38px] flex items-center justify-center rounded-xl text-[13px] font-bold tracking-wider transition-all cursor-pointer",
                    period === "AM"
                      ? "bg-[#2e1065] text-white shadow-md scale-[1.02]"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                  )}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod("PM")}
                  className={clsx(
                    "w-[56px] h-[38px] flex items-center justify-center rounded-xl text-[13px] font-bold tracking-wider transition-all cursor-pointer",
                    period === "PM"
                      ? "bg-[#2e1065] text-white shadow-md scale-[1.02]"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                  )}
                >
                  PM
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Confirm button */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full mt-5 py-3.5 bg-[#2e1065] hover:bg-[#3b137d] active:scale-[0.99] text-white text-[15px] font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#2e1065]/20 transition-all cursor-pointer"
        >
          <Check size={18} strokeWidth={2.5} />
          <span>Set Time • {hour}:{minute} {period}</span>
        </button>

      </div>
    </BottomSheet>
  );
}

function Wheel({ column, value, onChange }: { column: string[]; value: string; onChange: (v: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const ITEM_HEIGHT = 44;
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (scrollRef.current && !isScrolling.current) {
      const idx = column.indexOf(value);
      if (idx !== -1) {
        const timer = setTimeout(() => {
          if (scrollRef.current && !isScrolling.current) {
            scrollRef.current.scrollTop = idx * ITEM_HEIGHT;
          }
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [value, column]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    isScrolling.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    const top = e.currentTarget.scrollTop;
    const idx = Math.round(top / ITEM_HEIGHT);

    scrollTimeout.current = setTimeout(() => {
      isScrolling.current = false;
      if (column[idx] && column[idx] !== value) {
        onChange(column[idx]);
      }
    }, 120);
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="h-[200px] w-[62px] sm:w-[68px] overflow-y-auto snap-y snap-mandatory relative text-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
    >
      <div style={{ height: (200 - ITEM_HEIGHT) / 2 }} /> {/* Top padding */}
      {column.map((item) => (
        <div
          key={item}
          className={clsx(
            "h-[44px] flex items-center justify-center snap-center text-[22px] transition-all duration-150 cursor-pointer select-none",
            item === value ? "text-[#2e1065] font-extrabold scale-110" : "text-gray-400 font-medium hover:text-gray-600"
          )}
          onClick={() => {
            onChange(item);
            if (scrollRef.current) {
              const idx = column.indexOf(item);
              scrollRef.current.scrollTo({ top: idx * ITEM_HEIGHT, behavior: "smooth" });
            }
          }}
        >
          {item}
        </div>
      ))}
      <div style={{ height: (200 - ITEM_HEIGHT) / 2 }} /> {/* Bottom padding */}
    </div>
  );
}

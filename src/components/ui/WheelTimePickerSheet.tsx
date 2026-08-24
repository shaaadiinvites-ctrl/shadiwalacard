"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import clsx from "clsx";

import { BottomSheet } from "@/components/MobileSheetPickers";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (time: string) => void;
  initialTime?: string; // "14:30"
}

export function WheelTimePickerSheet({ isOpen, onClose, onSelect, initialTime }: Props) {
  const [hour, setHour] = useState("10");
  const [minute, setMinute] = useState("00");

  useEffect(() => {
    if (isOpen) {
      if (initialTime) {
        const [h, m] = initialTime.split(":");
        if (h && m) {
          setHour(h);
          setMinute(m);
        }
      }
    }
  }, [isOpen, initialTime]);

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

  const handleSave = () => {
    onSelect(`${hour}:${minute}`);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Select Time">
      <div className="relative flex justify-center items-center h-[200px] mt-4 mb-2 px-8">
        {/* Highlight bar behind */}
        <div className="absolute top-1/2 -translate-y-1/2 left-8 right-8 h-[44px] bg-[#2e1065]/5 border-y border-[#2e1065]/10 rounded-lg pointer-events-none" />
        
        <div className="flex gap-8 z-10 w-full max-w-[160px] justify-between items-center">
          <Wheel column={hours} value={hour} onChange={setHour} />
          <div className="text-2xl font-bold pb-1 text-[#2e1065]">:</div>
          <Wheel column={minutes} value={minute} onChange={setMinute} />
        </div>
      </div>

      <div className="flex justify-center mt-2 px-6">
        <button
          type="button"
          onClick={handleSave}
          className="w-14 h-14 bg-[#2e1065] hover:bg-[#3b0764] text-white rounded-2xl flex items-center justify-center transition-all shadow-md hover:shadow-lg hover:scale-105"
        >
          <Check size={28} />
        </button>
      </div>
    </BottomSheet>
  );
}

function Wheel({ column, value, onChange }: { column: string[], value: string, onChange: (v: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const ITEM_HEIGHT = 44;
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (scrollRef.current && !isScrolling.current) {
      const idx = column.indexOf(value);
      if (idx !== -1) {
        scrollRef.current.scrollTop = idx * ITEM_HEIGHT;
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
    }, 150);
  };

  return (
    <div 
      ref={scrollRef}
      onScroll={handleScroll}
      className="h-[200px] w-[60px] overflow-y-auto snap-y snap-mandatory relative text-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
    >
      <div style={{ height: (200 - ITEM_HEIGHT) / 2 }} /> {/* Top padding */}
      {column.map((item) => (
        <div 
          key={item} 
          className={clsx(
            "h-[44px] flex items-center justify-center snap-center text-[22px] transition-colors duration-200 cursor-pointer select-none",
            item === value ? "text-[#2e1065] font-bold" : "text-gray-400 font-medium"
          )}
          onClick={() => {
            if (scrollRef.current) {
               const idx = column.indexOf(item);
               scrollRef.current.scrollTo({ top: idx * ITEM_HEIGHT, behavior: 'smooth' });
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

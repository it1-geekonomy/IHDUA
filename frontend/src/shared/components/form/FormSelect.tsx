"use client";

import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "@/shared/hooks/useClickOutside";
import { cn } from "@/lib/utils";

interface FormSelectProps {
  label: string;
  required?: boolean;
  value: string;
  placeholder?: string;
  options: readonly string[];
  onChange: (value: string) => void;
  error?: string;
}

export function FormSelect({
  label,
  required,
  value,
  placeholder = "Select an option",
  options,
  onChange,
  error,
}: FormSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  return (
    <div ref={containerRef} className="relative w-full font-figtree">
      <label className="block text-[13px] font-medium text-[#111827] mb-1.5">
        {label}
        {required && <span className="text-[#9739A8] ml-0.5">*</span>}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-full bg-[#F8F9FA] border rounded-md px-3.5 py-2.5 text-[14px] flex items-center justify-between text-left outline-none transition-colors cursor-pointer",
          error
            ? "border-red-500 ring-1 ring-red-500"
            : "border-[#E5E7EB] focus:border-[#9739A8] focus:ring-1 focus:ring-[#9739A8]"
        )}
      >
        <span className={value ? "text-[#111827]" : "text-[#9CA3AF]"}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-[#9CA3AF] transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#E5E7EB] rounded-md shadow-xl z-50 max-h-56 overflow-y-auto py-1 animate-in fade-in-50 zoom-in-95 duration-150">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-3.5 py-2 text-[14px] transition-colors flex items-center justify-between cursor-pointer",
                value === option
                  ? "bg-[#FAF5FC] text-[#9739A8] font-semibold"
                  : "text-[#374151] hover:bg-[#F9FAFB] hover:text-[#111827]"
              )}
            >
              <span>{option}</span>
              {value === option && (
                <span className="text-[#9739A8] font-bold text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

"use client";

import { useState, useRef, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";
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
  direction?: "up" | "down";
  searchable?: boolean;
  dropdownWidthClass?: string;
}

export function FormSelect({
  label,
  required,
  value,
  placeholder = "Select an option",
  options,
  onChange,
  error,
  direction = "down",
  searchable = false,
  dropdownWidthClass = "min-w-full sm:min-w-[220px]",
}: FormSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(
    containerRef,
    () => {
      setIsOpen(false);
      setSearchQuery("");
    },
    isOpen
  );

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, searchable, searchQuery]);

  return (
    <div ref={containerRef} className="relative w-full font-figtree">
      <label className="text-[13px] font-medium text-[#111827] mb-1.5 h-5 flex items-center leading-none">
        <span>{label}</span>
        {required && <span className="text-[#9739A8] ml-0.5">*</span>}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-full h-11 bg-[#F8F9FA] border rounded-md px-3.5 text-[14px] flex items-center justify-between text-left outline-none transition-colors cursor-pointer",
          error
            ? "border-red-500 ring-1 ring-red-500"
            : "border-[#E5E7EB] focus:border-[#9739A8] focus:ring-1 focus:ring-[#9739A8]",
          isOpen && "border-[#9739A8] ring-1 ring-[#9739A8]"
        )}
      >
        <span
          className={cn(
            "truncate whitespace-nowrap min-w-0 pr-1.5",
            value ? "text-[#111827]" : "text-[#9CA3AF]"
          )}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-[#9CA3AF] shrink-0 transition-transform duration-200",
            isOpen && (direction === "up" ? "-rotate-180" : "rotate-180")
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute left-0 bg-white border border-[#E5E7EB] rounded-md shadow-2xl z-50 max-h-60 flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150",
            dropdownWidthClass,
            direction === "up" ? "bottom-full mb-1.5" : "top-full mt-1.5"
          )}
        >
          {searchable && (
            <div className="p-2 border-b border-gray-100 flex items-center gap-2 bg-gray-50/60 sticky top-0">
              <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs outline-none bg-transparent text-[#111827] placeholder:text-[#9CA3AF]"
                autoFocus
              />
            </div>
          )}

          <div className="overflow-y-auto py-1 flex-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3.5 py-3 text-xs text-gray-400 text-center">
                No matching options
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "w-full text-left px-3.5 py-2 text-[14px] transition-colors flex items-center justify-between cursor-pointer",
                    value === option
                      ? "bg-[#FAF5FC] text-[#9739A8] font-semibold"
                      : "text-[#374151] hover:bg-[#F9FAFB] hover:text-[#111827]"
                  )}
                >
                  <span className="truncate pr-2">{option}</span>
                  {value === option && (
                    <span className="text-[#9739A8] font-bold text-xs shrink-0">✓</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

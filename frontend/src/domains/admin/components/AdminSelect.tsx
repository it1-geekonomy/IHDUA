"use client";

import { useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { useClickOutside } from "@/shared/hooks/useClickOutside";
import { cn } from "@/lib/utils";

export interface AdminSelectOption<T extends string = string> {
  value: T;
  label: string;
  dotColor?: string;
  
  badge?: string;
}

export interface AdminSelectProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: readonly (AdminSelectOption<T> | T)[];
  placeholder?: string;
  className?: string;
  dropdownClassName?: string;
  direction?: "up" | "down";
  searchable?: boolean;
  disabled?: boolean;
  size?: "sm" | "md";
}

export function AdminSelect<T extends string = string>({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className,
  dropdownClassName,
  direction = "down",
  searchable = false,
  disabled = false,
  size = "sm",
}: AdminSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(
    containerRef,
    () => {
      setIsOpen(false);
      setSearchQuery("");
    },
    isOpen,
  );

  const normalizedOptions: AdminSelectOption<T>[] = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === "object" && opt !== null && "value" in opt) {
        return opt as AdminSelectOption<T>;
      }
      return {
        value: opt as T,
        label: String(opt),
      };
    });
  }, [options]);

  const selectedOption = useMemo(() => {
    return normalizedOptions.find((opt) => opt.value === value);
  }, [normalizedOptions, value]);

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return normalizedOptions;
    const q = searchQuery.toLowerCase().trim();
    return normalizedOptions.filter((opt) =>
      opt.label.toLowerCase().includes(q),
    );
  }, [normalizedOptions, searchable, searchQuery]);

  return (
    <div ref={containerRef} className="relative inline-block text-left font-figtree">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "inline-flex items-center justify-between gap-2 rounded-lg border border-[#D9D3C9] bg-white text-left font-figtree text-xs text-[#0F1C1D] shadow-2xs transition-all cursor-pointer focus:outline-hidden",
          size === "sm" ? "h-8 px-3 py-1.5" : "h-10 px-3.5 py-2",
          isOpen
            ? "border-[#9739A8] ring-2 ring-[#9739A8]/15 bg-white"
            : "hover:border-[#8A847A] hover:bg-[#FAF8F4]/50",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className,
        )}
      >
        <div className="flex items-center gap-2 truncate min-w-0 pr-1">
          {selectedOption?.dotColor && (
            <span
              className={cn("h-2 w-2 shrink-0 rounded-full", selectedOption.dotColor)}
            />
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="rounded bg-neutral-100 px-1.5 py-0.2 font-mono text-[10px] text-[#5F6C6D]">
              {selectedOption.badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-[#8A847A] transition-transform duration-200",
            isOpen && (direction === "up" ? "-rotate-180" : "rotate-180"),
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute left-0 z-50 min-w-full rounded-xl border border-[#E5E0D8] bg-white p-1 shadow-xl animate-in fade-in-50 zoom-in-95 duration-150",
            direction === "up" ? "bottom-full mb-1.5" : "top-full mt-1.5",
            dropdownClassName || "w-48",
          )}
        >
          {searchable && (
            <div className="mb-1 flex items-center gap-2 border-b border-[#E5E0D8] px-2.5 py-1.5">
              <Search className="h-3.5 w-3.5 shrink-0 text-[#8A847A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent font-figtree text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:outline-hidden"
                autoFocus
              />
            </div>
          )}

          <div className="max-h-56 overflow-y-auto space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-center text-xs text-[#8A847A]">
                No options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors cursor-pointer",
                      isSelected
                        ? "bg-[#FAF5FC] font-semibold text-[#9739A8]"
                        : "text-[#0F1C1D] hover:bg-[#FAF8F4] hover:text-[#9739A8]",
                    )}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      {opt.dotColor && (
                        <span
                          className={cn("h-2 w-2 shrink-0 rounded-full", opt.dotColor)}
                        />
                      )}
                      <span className="truncate">{opt.label}</span>
                    </div>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 shrink-0 text-[#9739A8]" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

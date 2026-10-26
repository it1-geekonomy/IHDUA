"use client";

import { useState, useRef, useEffect } from "react";
import Typography from "@/lib/Typography";
import { DONATION_COPY } from "@/shared/constants/donation";
import { useClickOutside } from "@/shared/hooks/useClickOutside";
import {
  AmountConfirmHint,
  DonationTrustNote,
} from "./DonationFormPrimitives";
import type { DonationFormState } from "./useDonationForm";

type AmountStepProps = Pick<
  DonationFormState,
  | "currencySymbol"
  | "presets"
  | "selectedDigits"
  | "customDigits"
  | "usingCustom"
  | "showLargeAmountHint"
  | "pickPreset"
  | "setCustomFromInput"
  | "setUsingCustom"
  | "cause"
  | "setCause"
  | "causes"
  | "goToDetails"
> & {
  compact?: boolean;
};

export function AmountStep({
  currencySymbol,
  presets,
  selectedDigits,
  customDigits,
  usingCustom,
  showLargeAmountHint,
  pickPreset,
  setCustomFromInput,
  setUsingCustom,
  cause,
  setCause,
  causes,
  goToDetails,
  compact = false,
}: AmountStepProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false), isDropdownOpen);

  // Close dropdown on Escape key
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDropdownOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDropdownOpen]);

  return (
    <div className={`flex flex-col ${compact ? "mt-2 gap-2" : "mt-4 sm:mt-5 gap-3 sm:gap-3.5"}`}>
      <Typography
        variant="caption"
        className={`font-bold font-figtree tracking-normal text-[#1E1E1E] !normal-case ${
          compact ? "text-[12.5px] sm:text-[13px]" : "text-[14px] sm:text-[15px]"
        }`}
      >
        {DONATION_COPY.chooseAmountStep}
      </Typography>

      {/* Preset amount pills (4 equal columns) */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {presets.map((preset) => {
          const active = !usingCustom && selectedDigits === preset.digits;
          return (
            <button
              key={preset.digits}
              type="button"
              onClick={() => pickPreset(preset.digits)}
              className={`rounded-sm sm:rounded-md border text-center font-figtree font-semibold transition-all cursor-pointer whitespace-nowrap ${
                compact
                  ? "py-1.5 sm:py-2 px-1 text-[12px] sm:text-[13px]"
                  : "py-2.5 sm:py-3 px-1 sm:px-2 text-[13px] sm:text-[15px]"
              } ${
                active
                  ? "border-[#9739A8] bg-[#9739A8] text-white shadow-sm"
                  : "border-[#D6CFC4] bg-[#EDE8E0] text-[#1E1E1E] hover:border-[#9739A8]/40 hover:bg-[#E6DFD5]"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Other amount input field */}
      <div
        className={`flex items-center rounded-sm sm:rounded-md border bg-[#EDE8E0] transition-colors ${
          compact ? "px-3 py-1.5 sm:py-2" : "px-3.5 sm:px-4 py-2.5 sm:py-3.5"
        } ${
          usingCustom
            ? "border-[#9739A8] ring-1 ring-[#9739A8]"
            : "border-[#D6CFC4] focus-within:border-[#9739A8]"
        }`}
      >
        <span
          className={`shrink-0 font-figtree font-medium text-[#554F47] ${
            compact ? "text-[13px]" : "text-[15px]"
          }`}
        >
          {currencySymbol}
        </span>
        <input
          type="text"
          inputMode="numeric"
          placeholder={DONATION_COPY.otherAmountPlaceholder}
          value={usingCustom ? customDigits : ""}
          onChange={(e) => setCustomFromInput(e.target.value)}
          onFocus={() => {
            setUsingCustom(true);
            setIsDropdownOpen(false);
          }}
          className={`ml-1.5 w-full bg-transparent font-figtree text-[#1E1E1E] outline-none placeholder:text-[#7A746B] ${
            compact ? "text-[12.5px] sm:text-[13px]" : "text-[14px] sm:text-[15px]"
          }`}
        />
      </div>

      {/* Custom Cause / Purpose Dropdown */}
      <div ref={dropdownRef} className="relative w-full">
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className={`flex w-full items-center justify-between rounded-sm sm:rounded-md border bg-[#EDE8E0] text-left font-figtree font-medium text-[#1E1E1E] transition-colors cursor-pointer outline-none ${
            compact
              ? "px-3 py-1.5 sm:py-2 text-[12.5px] sm:text-[13px]"
              : "px-3.5 sm:px-4 py-2.5 sm:py-3.5 text-[14px] sm:text-[15px]"
          } ${
            isDropdownOpen
              ? "border-[#9739A8] ring-1 ring-[#9739A8]"
              : "border-[#D6CFC4] hover:border-[#9739A8]/40"
          }`}
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
        >
          <span className="truncate pr-2">{cause}</span>
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`w-3.5 h-3.5 shrink-0 text-[#1E1E1E] transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          >
            <path d="M12 16L4 8h16l-8 8z" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div
            role="listbox"
            className="absolute left-0 right-0 bottom-full mb-1 z-50 max-h-52 overflow-y-auto rounded-lg border border-[#DED7CE] bg-white py-1 shadow-2xl origin-bottom animate-in fade-in-50 zoom-in-95 duration-150 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#D6CFC4]"
          >
            {causes.map((item) => {
              const isSelected = cause === item;
              return (
                <button
                  key={item}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setCause(item);
                    setIsDropdownOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3.5 py-2 text-left font-figtree transition-colors cursor-pointer ${
                    compact
                      ? "text-[12px] sm:text-[13px]"
                      : "text-[13.5px] sm:text-[14px]"
                  } ${
                    isSelected
                      ? "bg-[#FAF5FC] font-semibold text-[#9739A8]"
                      : "text-[#2B2B2B] hover:bg-[#F7F3F8] hover:text-[#9739A8]"
                  }`}
                >
                  <span className="truncate pr-2">{item}</span>
                  {isSelected && (
                    <span className="text-xs font-bold text-[#9739A8] shrink-0">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {showLargeAmountHint ? (
        <div className="-mt-0.5">
          <AmountConfirmHint message={DONATION_COPY.confirmBeforeContinue} />
        </div>
      ) : null}

      {/* Donate Now Button */}
      <button
        type="button"
        onClick={goToDetails}
        className={`w-full rounded-sm sm:rounded-md bg-[#FFD638] hover:bg-[#FACC15] active:scale-[0.99] font-figtree font-bold text-[#1C1C1C] transition-all cursor-pointer shadow-sm ${
          compact ? "py-2 sm:py-2.5 text-[14px] sm:text-[15px]" : "py-3.5 sm:py-4 text-[15px] sm:text-[16px]"
        }`}
      >
        {DONATION_COPY.donateNow}
      </button>

      {/* Trust note */}
      <DonationTrustNote />
    </div>
  );
}

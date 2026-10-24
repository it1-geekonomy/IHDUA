"use client";

import { useState, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";
import { DONATION_COUNTRIES, type DonationCountry } from "@/domains/home/constants/donationCountries";
import { CountryFlag } from "@/domains/home/components/donation/CountryFlag";
import { useClickOutside } from "@/shared/hooks/useClickOutside";
import { cn } from "@/lib/utils";

interface PhoneInputFieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  defaultCountryCode?: string;
  placeholder?: string;
}

export function PhoneInputField({
  label,
  required,
  value,
  onChange,
  error,
  defaultCountryCode = "IN",
  placeholder,
}: PhoneInputFieldProps) {
  const [selectedCountry, setSelectedCountry] = useState<DonationCountry>(
    DONATION_COUNTRIES.find((c) => c.code === defaultCountryCode) || DONATION_COUNTRIES[0]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  const filteredCountries = DONATION_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search)
  );

  return (
    <div className="w-full font-figtree">
      <label className="text-[13px] font-medium text-[#111827] mb-1.5 h-5 flex items-center leading-none">
        <span>{label}</span>
        {required && <span className="text-[#9739A8] ml-0.5">*</span>}
      </label>

      <div
        ref={containerRef}
        className={cn(
          "relative flex items-center h-11 bg-[#F8F9FA] border rounded-md transition-colors",
          error
            ? "border-red-500 ring-1 ring-red-500"
            : "border-[#E5E7EB] focus-within:border-[#9739A8] focus-within:ring-1 focus-within:ring-[#9739A8]"
        )}
      >
        <button
          type="button"
          aria-label="Select Country Code"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-1.5 pl-3 pr-2 py-2.5 hover:bg-gray-100/70 rounded-l-md transition-colors cursor-pointer shrink-0"
        >
          <CountryFlag countryCode={selectedCountry.code} className="h-3.5 w-5 rounded-[2px]" />
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-gray-500 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent px-2.5 py-2.5 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] outline-none"
        />

        {isOpen && (
          <div className="absolute left-0 top-full mt-1.5 w-64 bg-white border border-[#E5E7EB] rounded-md shadow-xl z-50 max-h-56 overflow-hidden flex flex-col animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-2 border-b border-gray-100 flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search countries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs outline-none bg-transparent"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto py-1 flex-1">
              {filteredCountries.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    setSelectedCountry(c);
                    setIsOpen(false);
                    setSearch("");
                    if (!value.startsWith(c.dial)) {
                      onChange(c.dial + " ");
                    }
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors hover:bg-gray-50 cursor-pointer",
                    selectedCountry.code === c.code
                      ? "bg-[#FAF5FC] text-[#9739A8] font-bold"
                      : "text-[#111827]"
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <CountryFlag countryCode={c.code} className="h-3.5 w-5 rounded-[2px] shrink-0" />
                    <span className="truncate">{c.name}</span>
                  </div>
                  <span className="text-gray-400 text-[11px] shrink-0">{c.dial}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

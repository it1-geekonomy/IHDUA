"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { DONATION_COUNTRIES } from "@/domains/home/constants/donationCountries";
import { CountryFlag } from "./CountryFlag";
import { DONATION_COPY } from "@/domains/home/constants/donation";

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  compact?: boolean;
}

export function CountrySelect({
  value,
  onChange,
  disabled,
  compact,
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = DONATION_COUNTRIES.find((c) => c.code === value) || DONATION_COUNTRIES[0];

  const filtered = DONATION_COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-sm border border-[#D9D3C9] bg-[#FAF8F4] ${
          compact ? "px-2 py-3.5" : "px-4 py-3.5"
        } font-figtree text-[15px] font-semibold text-[#00191B] outline-none hover:border-[#9739A8]/50 focus:border-[#9739A8] focus:ring-1 focus:ring-[#9739A8] disabled:cursor-not-allowed disabled:opacity-70 transition-colors`}
      >
        <div className={`flex items-center gap-2 truncate ${compact ? "justify-center" : ""}`}>
          <CountryFlag countryCode={selected.code} className="h-4 w-6 shrink-0 rounded-[2px]" />
          {!compact && <span className="truncate">{selected.name} ({selected.dial})</span>}
          {compact && <span className="truncate">{selected.dial}</span>}
        </div>
        <ChevronDown
          className={`${compact ? "ml-1" : "ml-2"} h-4 w-4 shrink-0 text-[#8A847A] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className={`absolute z-10 mt-1 rounded-sm border border-[#D9D3C9] bg-white shadow-lg ${compact ? 'w-64 -left-2' : 'w-full'}`}>
          <div className="flex items-center gap-2 border-b border-[#EAE6DF] p-2">
            <Search className="h-4 w-4 text-[#8A847A]" />
            <input
              type="text"
              className="w-full bg-transparent p-1 font-figtree text-[14px] text-[#00191B] outline-none placeholder:text-[#8A847A]"
              placeholder="Search countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="p-3 text-center font-figtree text-[14px] text-[#8A847A]">
                No countries found.
              </div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onChange(c.code);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left font-figtree text-[15px] transition-colors hover:bg-[#FAF8F4] ${
                    value === c.code ? "bg-[#FAF8F4] font-bold text-[#9739A8]" : "text-[#00191B]"
                  }`}
                >
                  <CountryFlag countryCode={c.code} className="h-4 w-6 shrink-0 rounded-[2px]" />
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="shrink-0 text-[13px] text-[#8A847A]">{c.dial}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

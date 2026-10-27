"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { DONATION_COUNTRIES } from "@/domains/home/constants/donationCountries";
import { CountryFlag } from "./CountryFlag";

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
  compact = false,
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selected =
    DONATION_COUNTRIES.find((c) => c.code === value) || DONATION_COUNTRIES[0];

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
        className={`flex w-full items-center justify-between rounded-sm sm:rounded-md border bg-[#EDE8E0] ${
          compact
            ? "px-3 py-1.5 sm:py-2 text-[12.5px] sm:text-[13px]"
            : "px-3.5 sm:px-4 py-2.5 sm:py-3.5 text-[14px] sm:text-[15px]"
        } font-figtree font-medium text-[#1E1E1E] outline-none transition-colors cursor-pointer ${
          isOpen
            ? "border-[#9739A8] ring-1 ring-[#9739A8]"
            : "border-[#D6CFC4] hover:border-[#9739A8]/40"
        } disabled:cursor-not-allowed disabled:opacity-70`}
      >
        <div className="flex items-center gap-2 truncate">
          <CountryFlag
            countryCode={selected.code}
            className="h-4 w-6 shrink-0 rounded-[2px]"
          />
          <span className="truncate">{selected.name}</span>
          <span className="shrink-0 text-[11.5px] sm:text-[12.5px] text-[#7A746B]">
            ({selected.dial})
          </span>
        </div>
        <ChevronDown
          className={`ml-2 h-4 w-4 shrink-0 text-[#8A847A] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-30 mt-1 w-full rounded-sm sm:rounded-md border border-[#D6CFC4] bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-[#EAE6DF] p-2">
            <Search className="h-4 w-4 text-[#8A847A]" />
            <input
              type="text"
              className="w-full bg-transparent p-1 font-figtree text-[13px] sm:text-[14px] text-[#00191B] outline-none placeholder:text-[#8A847A]"
              placeholder="Search countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="p-3 text-center font-figtree text-[13px] sm:text-[14px] text-[#8A847A]">
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
                  className={`flex w-full items-center gap-3 px-3.5 py-2 text-left font-figtree text-[13px] sm:text-[14px] transition-colors hover:bg-[#FAF8F4] cursor-pointer ${
                    value === c.code
                      ? "bg-[#FAF8F4] font-bold text-[#9739A8]"
                      : "text-[#00191B]"
                  }`}
                >
                  <CountryFlag
                    countryCode={c.code}
                    className="h-4 w-6 shrink-0 rounded-[2px]"
                  />
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="shrink-0 text-[12px] text-[#8A847A]">
                    {c.dial}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

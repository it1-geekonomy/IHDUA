"use client";

import { DONATION_COPY } from "@/shared/constants/donation";
import type { DonationOrigin } from "../../constants/donationCountries";

type Props = {
  value: DonationOrigin;
  onChange: (origin: DonationOrigin) => void;
};

const OPTIONS: Array<{
  origin: DonationOrigin;
  label: string;
}> = [
  { origin: "IN", label: DONATION_COPY.originIndia },
  { origin: "OUT", label: DONATION_COPY.originOutside },
];

export function DonationOriginSelect({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[#4a4a4a]">
        {DONATION_COPY.chooseCountry}
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {OPTIONS.map((opt) => {
          const selected = value === opt.origin;
          return (
            <button
              key={opt.origin}
              type="button"
              onClick={() => onChange(opt.origin)}
              aria-pressed={selected}
              className={[
                "w-full rounded-sm sm:rounded-md border px-3.5 py-3 text-center font-figtree transition-all cursor-pointer",
                selected
                  ? "border-[#9739A8] bg-[#FAF5FC] shadow-sm ring-1 ring-[#9739A8]"
                  : "border-[#D6CFC4] bg-[#EDE8E0] hover:border-[#9739A8]/40",
              ].join(" ")}
            >
              <span className="block text-sm font-semibold text-[#1E1E1E]">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

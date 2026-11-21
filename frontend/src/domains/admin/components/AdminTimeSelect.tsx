"use client";

import { useMemo } from "react";
import { AdminSelect } from "@/domains/admin/components/AdminSelect";
import { cn } from "@/lib/utils";

type Period = "AM" | "PM";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/** Parse HH:mm(:ss) → { hour12, minute, period }. Empty → defaults. */
function parseTime(value: string): {
  hour12: string;
  minute: string;
  period: Period;
  set: boolean;
} {
  if (!value) {
    return { hour12: "10", minute: "00", period: "AM", set: false };
  }
  const [hStr, mStr] = value.slice(0, 5).split(":");
  const h24 = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h24) || Number.isNaN(m)) {
    return { hour12: "10", minute: "00", period: "AM", set: false };
  }
  const period: Period = h24 >= 12 ? "PM" : "AM";
  const hour12 = h24 % 12 === 0 ? 12 : h24 % 12;
  // Snap minutes to nearest 5 for the minute select
  const snapped = Math.round(m / 5) * 5;
  const minute = snapped === 60 ? 55 : snapped;
  return {
    hour12: String(hour12),
    minute: pad2(minute),
    period,
    set: true,
  };
}

function toHHmm(hour12: string, minute: string, period: Period): string {
  let h = Number(hour12);
  if (period === "AM") {
    if (h === 12) h = 0;
  } else if (h !== 12) {
    h += 12;
  }
  return `${pad2(h)}:${minute}`;
}

const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const h = i + 1;
  return { value: String(h), label: String(h) };
});

const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const m = i * 5;
  const v = pad2(m);
  return { value: v, label: v };
});

export interface AdminTimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

/**
 * Compact hour / minute / AM–PM picker (no giant scroll list).
 * Value is stored as HH:mm (24h) for the API, or "" when cleared.
 */
export function AdminTimeSelect({
  value,
  onChange,
  className,
  disabled = false,
}: AdminTimeSelectProps) {
  const parsed = useMemo(() => parseTime(value), [value]);

  const commit = (hour12: string, minute: string, period: Period) => {
    onChange(toHHmm(hour12, minute, period));
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <AdminSelect
          value={parsed.hour12}
          onChange={(h) => commit(h, parsed.minute, parsed.period)}
          options={HOUR_OPTIONS}
          size="md"
          disabled={disabled}
          direction="up"
          className="min-w-[4.5rem]"
          dropdownClassName="min-w-[4.5rem]"
        />
        <span className="text-sm font-semibold text-[#5F6C6D]" aria-hidden>
          :
        </span>
        <AdminSelect
          value={parsed.minute}
          onChange={(m) => commit(parsed.hour12, m, parsed.period)}
          options={MINUTE_OPTIONS}
          size="md"
          disabled={disabled}
          direction="up"
          className="min-w-[4.5rem]"
          dropdownClassName="min-w-[4.5rem]"
        />
        <div className="inline-flex overflow-hidden rounded-lg border border-[#D9D3C9] bg-white">
          {(["AM", "PM"] as const).map((p) => {
            const active = parsed.set && parsed.period === p;
            return (
              <button
                key={p}
                type="button"
                disabled={disabled}
                onClick={() => commit(parsed.hour12, parsed.minute, p)}
                className={cn(
                  "h-10 min-w-[3rem] px-3 text-xs font-semibold transition-colors",
                  active
                    ? "bg-[#9739A8] text-white"
                    : "bg-white text-[#0F1C1D] hover:bg-[#FAF8F4]",
                  disabled && "cursor-not-allowed opacity-50",
                )}
              >
                {p}
              </button>
            );
          })}
        </div>
        {parsed.set && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange("")}
            className="text-[11px] font-semibold text-[#9739A8] hover:underline disabled:opacity-50"
          >
            Clear
          </button>
        )}
      </div>
      {!parsed.set && (
        <p className="text-[10px] text-[#8A847A]">
          No time set — pick hour, minutes, or AM/PM to set one.
        </p>
      )}
    </div>
  );
}

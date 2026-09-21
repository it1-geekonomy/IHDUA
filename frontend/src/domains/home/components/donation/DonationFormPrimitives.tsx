import type { HTMLAttributes } from "react";
import { DONATION_COPY } from "@/domains/home/constants/donation";
import { cn } from "@/lib/utils";

const FIELD =
  "w-full rounded-sm border border-[#D9D3C9] bg-[#FAF8F4] px-4 py-3.5 font-figtree text-[15px] text-[#00191B] outline-none placeholder:text-[#8A847A] focus:border-[#9739A8] disabled:cursor-not-allowed disabled:opacity-60";

type DonationTextFieldProps = {
  type?: "text" | "tel" | "email";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
  disabled?: boolean;
};

export function DonationTextField({
  type = "text",
  placeholder,
  value,
  onChange,
  autoComplete,
  inputMode,
  className,
  disabled,
}: DonationTextFieldProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(FIELD, className)}
      autoComplete={autoComplete}
      inputMode={inputMode}
      disabled={disabled}
    />
  );
}

type DonationSelectFieldProps = {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
};

export function DonationSelectField({
  value,
  onChange,
  options,
  ariaLabel,
  className,
  disabled,
}: DonationSelectFieldProps) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={cn(FIELD, "appearance-none pr-8", className)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function DonationTrustNote() {
  return (
    <p className="text-center font-figtree text-[12px] text-[#8A847A]">
      {DONATION_COPY.trustLine}
    </p>
  );
}

export function AmountConfirmHint({ message }: { message: string }) {
  return (
    <p className="font-figtree text-[12px] font-normal leading-snug text-[#5F6C6D]">
      {message}
    </p>
  );
}

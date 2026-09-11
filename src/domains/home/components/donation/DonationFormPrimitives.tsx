import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const FIELD =
  "w-full rounded-sm border border-[#D9D3C9] bg-[#FAF8F4] px-4 py-3.5 font-figtree text-[15px] text-[#00191B] outline-none placeholder:text-[#8A847A] focus:border-[#9739A8]";

type DonationTextFieldProps = {
  type?: "text" | "tel" | "email";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
};

export function DonationTextField({
  type = "text",
  placeholder,
  value,
  onChange,
  autoComplete,
  inputMode,
  className,
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
    />
  );
}

export function DonationTrustNote() {
  return (
    <p className="text-center font-figtree text-[12px] text-[#8A847A]">
      🔒 Secure Payment • Trusted by Thousands
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

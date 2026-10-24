"use client";

import { type ButtonHTMLAttributes } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isSubmitting?: boolean;
}

export function SubmitButton({
  label,
  isSubmitting = false,
  className,
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting || disabled}
      className={cn(
        "w-full bg-[#FFD638] hover:bg-[#FACC15] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed text-[#111827] font-semibold py-3.5 px-6 rounded-md shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 font-figtree",
        className
      )}
      {...props}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-[#111827]" />
          <span className="text-[15px]">Submitting...</span>
        </>
      ) : (
        <>
          <span className="text-[15px]">{label}</span>
          <Send className="w-4 h-4 fill-current rotate-45 ml-1" />
        </>
      )}
    </button>
  );
}

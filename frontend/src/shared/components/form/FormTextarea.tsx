"use client";

import { type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  error?: string;
}

export function FormTextarea({
  label,
  required,
  error,
  rows = 3,
  className,
  ...props
}: FormTextareaProps) {
  return (
    <div className="w-full font-figtree">
      <label className="block text-[13px] font-medium text-[#111827] mb-1.5">
        {label}
        {required && <span className="text-[#9739A8] ml-0.5">*</span>}
      </label>
      <textarea
        rows={rows}
        className={cn(
          "w-full bg-[#F8F9FA] border rounded-md px-3.5 py-2.5 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-colors resize-none",
          error
            ? "border-red-500 ring-1 ring-red-500 focus:border-red-500"
            : "border-[#E5E7EB] focus:border-[#9739A8] focus:ring-1 focus:ring-[#9739A8]",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

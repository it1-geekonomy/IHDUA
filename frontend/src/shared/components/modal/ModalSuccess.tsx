"use client";

import { type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";

interface ModalSuccessProps {
  title: string;
  message: ReactNode;
  onClose: () => void;
  actionText?: string;
}

export function ModalSuccess({
  title,
  message,
  onClose,
  actionText = "Done",
}: ModalSuccessProps) {
  return (
    <div className="py-8 text-center flex flex-col items-center font-figtree">
      <div className="w-16 h-16 rounded-full bg-[#FAF5FC] flex items-center justify-center text-[#9739A8] mb-4">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <h3 className="font-lora text-2xl text-[#111827] font-semibold mb-2">
        {title}
      </h3>
      <div className="text-sm text-[#4B5563] max-w-md mb-6 leading-relaxed">
        {message}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="bg-[#FFD638] hover:bg-[#FACC15] active:scale-[0.99] text-[#111827] font-bold py-3 px-8 rounded-md shadow-sm transition-all cursor-pointer text-sm"
      >
        {actionText}
      </button>
    </div>
  );
}

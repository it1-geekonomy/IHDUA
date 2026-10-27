"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import type { DonationReceipt } from "./useDonationForm";

interface DonationReceiptModalProps {
  receipt: DonationReceipt;
  onClose: () => void;
}

export function DonationReceiptModal({
  receipt,
  onClose,
}: DonationReceiptModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(receipt.receiptNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore clipboard error */
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="donation-receipt-title"
    >
      <div className="relative w-full max-w-[410px] rounded-xl bg-[#343434] text-white p-7 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
        {/* Close (X) icon */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Golden Hand-holding-Heart Icon */}
        <div className="flex justify-center mb-3">
          <svg
            viewBox="0 0 576 512"
            className="w-10 h-10 text-[#F5C244] fill-current"
            aria-hidden="true"
          >
            <path d="M384 32c-35.3 0-67.4 17.5-87.2 45.4C277 49.5 244.9 32 209.6 32c-56.5 0-102.4 45.9-102.4 102.4 0 50.1 27.6 96.6 71.8 120.9l75.4 41.5c14.6 8 32.5 8 47.1 0l75.4-41.5c44.2-24.3 71.8-70.8 71.8-120.9C448.8 77.9 402.9 32 384 32zM0 320c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32v128c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V320zm192 32h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16h-32v-64zm0-32v-32c0-17.7 14.3-32 32-32h85.3c21.8 0 42.1 11 53.9 29.3l49.8 77.2c7.2 11.2 11 24.2 11 37.5v8c0 23.9-17.6 44.1-41.2 47.5l-128 18.3c-20.9 3-41.9-5-56-21.4L192 419.6V320z" />
          </svg>
        </div>

        {/* Title: Thank You (Italic Serif) */}
        <h2
          id="donation-receipt-title"
          className="font-lora italic text-[26px] sm:text-[28px] font-normal text-white tracking-normal mb-2.5"
        >
          Thank You
        </h2>

        {/* Body Text */}
        <p className="font-lora text-[14.5px] sm:text-[15px] text-[#D8D8D8] font-normal leading-relaxed">
          Your donation of {receipt.currencySymbol}
          {Number(receipt.amount).toLocaleString()} {receipt.currency} was received.
        </p>

        {/* Receipt Line */}
        <p
          onClick={handleCopy}
          title="Click to copy receipt number"
          className="font-lora text-[14px] sm:text-[14.5px] text-[#BEBEBE] font-normal mt-1.5 mb-6 select-all cursor-pointer hover:text-white transition-colors flex items-center justify-center gap-1.5"
        >
          <span>Receipt: {receipt.receiptNumber}</span>
          {copied && (
            <span className="inline-flex items-center text-xs text-[#F5C244] font-medium ml-1">
              <Check className="w-3.5 h-3.5 mr-0.5" /> Copied
            </span>
          )}
        </p>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 sm:py-3 rounded-lg bg-[#F5C244] hover:bg-[#E5B338] active:scale-[0.99] text-[#1A1A1A] font-semibold text-[15px] transition-all cursor-pointer shadow-md"
        >
          Close
        </button>
      </div>
    </div>
  );
}

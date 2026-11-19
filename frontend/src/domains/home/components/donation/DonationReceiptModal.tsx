"use client";

import { useState } from "react";
import { X, Check, Heart } from "lucide-react";
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
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="donation-receipt-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[410px] rounded-xl bg-white text-center p-7 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1.5 text-[#8A847A] hover:bg-[#FAF8F4] hover:text-[#00191B] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FAF5FC] border border-[#9739A8]/20">
          <Heart className="h-6 w-6 fill-[#9739A8] text-[#9739A8]" aria-hidden="true" />
        </div>

        <p className="text-[11px] font-bold tracking-[0.15em] text-[#9739A8] uppercase font-figtree">
          Donation received
        </p>

        <h2
          id="donation-receipt-title"
          className="mt-1.5 font-lora text-[26px] sm:text-[28px] font-normal text-[#00191B] leading-tight"
        >
          Thank You
        </h2>

        <p className="mt-2.5 font-figtree text-[14px] sm:text-[15px] text-[#5F6C6D] leading-relaxed">
          {receipt.recurringEvery ? (
            <>
              Your donation of {receipt.currencySymbol}
              {Number(receipt.amount).toLocaleString()} {receipt.recurringEvery} is
              set up. You&apos;ll get a receipt by email after every charge.
            </>
          ) : (
            <>
              Your donation of {receipt.currencySymbol}
              {Number(receipt.amount).toLocaleString()} {receipt.currency} was
              received.
            </>
          )}
        </p>

        <button
          type="button"
          onClick={handleCopy}
          title="Click to copy receipt number"
          className="mt-3 mb-6 inline-flex items-center justify-center gap-1.5 rounded-md border border-[#E8E2EC] bg-[#FAF8F4] px-3 py-1.5 font-figtree text-[13px] text-[#5F6C6D] hover:border-[#9739A8]/35 hover:text-[#9739A8] transition-colors cursor-pointer select-all"
        >
          <span>Receipt: {receipt.receiptNumber}</span>
          {copied && (
            <span className="inline-flex items-center text-xs font-semibold text-[#9739A8]">
              <Check className="w-3.5 h-3.5 mr-0.5" /> Copied
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-md bg-[#FFD638] hover:bg-[#FACC15] active:scale-[0.99] py-3 font-figtree font-semibold text-[15px] text-[#1E1E1E] shadow-sm transition-all cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}

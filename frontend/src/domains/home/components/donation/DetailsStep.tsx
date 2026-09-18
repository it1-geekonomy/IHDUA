"use client";

import { useEffect, useRef } from "react";
import { Pencil } from "lucide-react";
import { DONATION_COPY } from "@/domains/home/constants/donation";
import { isCroreOrAbove } from "@/domains/home/lib/donation";
import {
  AmountConfirmHint,
  DonationTextField,
  DonationTrustNote,
} from "./DonationFormPrimitives";
import type { DonationFormState } from "./useDonationForm";

type DetailsStepProps = Pick<
  DonationFormState,
  | "chosenAmount"
  | "customDigits"
  | "usingCustom"
  | "editingAmount"
  | "fullName"
  | "mobile"
  | "email"
  | "setFullName"
  | "setMobile"
  | "setEmail"
  | "setCustomFromInput"
  | "startEditAmount"
  | "commitAmountEdit"
  | "cancelAmountEdit"
>;

export function DetailsStep({
  chosenAmount,
  customDigits,
  usingCustom,
  editingAmount,
  fullName,
  mobile,
  email,
  setFullName,
  setMobile,
  setEmail,
  setCustomFromInput,
  startEditAmount,
  commitAmountEdit,
  cancelAmountEdit,
}: DetailsStepProps) {
  const amountEditRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingAmount) amountEditRef.current?.focus();
  }, [editingAmount]);

  return (
    <div className="mt-6 flex flex-col gap-3">
      <div className="flex flex-col gap-2 rounded-sm border border-[#D9D3C9] bg-[#FAF8F4] px-4 py-3.5">
        <div className="flex items-start justify-between gap-3">
          <span className="shrink-0 pt-0.5 font-figtree text-[15px] text-[#5F6C6D]">
            {DONATION_COPY.chosenAmount}
          </span>
          <span className="flex min-w-0 flex-1 flex-col items-end gap-1.5 font-figtree text-[15px] font-bold text-[#00191B]">
            {editingAmount ? (
              <span className="flex w-full max-w-[12rem] items-center justify-end border-b border-[#9739A8]">
                <span>₹</span>
                <input
                  ref={amountEditRef}
                  type="text"
                  inputMode="numeric"
                  value={customDigits}
                  onChange={(e) => setCustomFromInput(e.target.value)}
                  onBlur={commitAmountEdit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      commitAmountEdit();
                    }
                    if (e.key === "Escape") {
                      e.preventDefault();
                      cancelAmountEdit();
                    }
                  }}
                  className="min-w-0 flex-1 bg-transparent text-right font-figtree text-[15px] font-bold text-[#00191B] outline-none"
                  aria-label="Edit chosen amount"
                />
              </span>
            ) : (
              <span className="max-w-full break-all text-right" title={chosenAmount}>
                {chosenAmount}
              </span>
            )}
            <button
              type="button"
              onClick={startEditAmount}
              className="inline-flex shrink-0 items-center gap-1 font-semibold text-[#9739A8] hover:opacity-80"
            >
              {DONATION_COPY.edit}
              <Pencil className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </span>
        </div>

        {usingCustom && isCroreOrAbove(customDigits) && (
          <AmountConfirmHint message={DONATION_COPY.confirmBeforePay} />
        )}
      </div>

      <DonationTextField
        placeholder={DONATION_COPY.fullName}
        value={fullName}
        onChange={setFullName}
        autoComplete="name"
      />
      <DonationTextField
        type="tel"
        inputMode="tel"
        placeholder={DONATION_COPY.mobile}
        value={mobile}
        onChange={(value) => setMobile(value.replace(/[^\d+\s-]/g, ""))}
        autoComplete="tel"
      />
      <DonationTextField
        type="email"
        placeholder={DONATION_COPY.email}
        value={email}
        onChange={setEmail}
        autoComplete="email"
      />

      <button
        type="button"
        className="mt-1 flex w-full flex-col items-center justify-center gap-0.5 rounded-sm bg-[#FFD638] px-4 py-3.5 font-figtree font-bold text-[#1C1C1C] transition-opacity hover:opacity-90"
      >
        <span className="text-[16px]">{DONATION_COPY.paySecurely}</span>
        <span className="max-w-full break-all text-center text-[14px] leading-snug">
          {chosenAmount}
        </span>
      </button>

      <DonationTrustNote />
    </div>
  );
}

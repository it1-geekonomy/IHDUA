"use client";

import Typography from "@/lib/Typography";
import {
  CTA_PRESET_AMOUNTS,
  DONATION_COPY,
} from "@/domains/home/constants/donation";
import { isCroreOrAbove } from "@/domains/home/lib/donation";
import {
  AmountConfirmHint,
  DonationTrustNote,
} from "./DonationFormPrimitives";
import type { DonationFormState } from "./useDonationForm";

type AmountStepProps = Pick<
  DonationFormState,
  | "selectedAmount"
  | "customDigits"
  | "usingCustom"
  | "pickPreset"
  | "setCustomFromInput"
  | "setUsingCustom"
  | "goToDetails"
>;

export function AmountStep({
  selectedAmount,
  customDigits,
  usingCustom,
  pickPreset,
  setCustomFromInput,
  setUsingCustom,
  goToDetails,
}: AmountStepProps) {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <Typography
        variant="caption"
        className="font-bold font-figtree tracking-normal text-[#6B6660] !normal-case"
      >
        {DONATION_COPY.chooseAmount}
      </Typography>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {CTA_PRESET_AMOUNTS.map((amount) => {
          const active = !usingCustom && selectedAmount === amount;
          return (
            <button
              key={amount}
              type="button"
              onClick={() => pickPreset(amount)}
              className={`rounded-sm border px-2 py-2.5 font-figtree text-[14px] font-semibold transition-colors ${
                active
                  ? "border-[#9739A8] bg-[#9739A8] text-white"
                  : "border-[#D4CEC5] bg-white text-[#00191B] hover:border-[#9739A8]/50"
              }`}
            >
              {amount}
            </button>
          );
        })}
      </div>

      <div
        className={`flex items-center rounded-sm border bg-[#FAF8F4] px-4 py-3.5 ${
          usingCustom ? "border-[#9739A8]" : "border-[#D9D3C9]"
        }`}
      >
        <span className="font-figtree text-[15px] text-[#8A847A]">₹</span>
        <input
          type="text"
          inputMode="numeric"
          placeholder={DONATION_COPY.otherAmountPlaceholder}
          value={usingCustom ? customDigits : ""}
          onChange={(e) => setCustomFromInput(e.target.value)}
          onFocus={() => setUsingCustom(true)}
          className="ml-1 w-full bg-transparent font-figtree text-[15px] text-[#00191B] outline-none placeholder:text-[#8A847A]"
        />
      </div>

      {usingCustom && isCroreOrAbove(customDigits) && (
        <div className="-mt-2">
          <AmountConfirmHint message={DONATION_COPY.confirmBeforeContinue} />
        </div>
      )}

      <button
        type="button"
        onClick={goToDetails}
        className="w-full rounded-sm bg-[#FFD638] py-3.5 font-figtree text-[16px] font-bold text-[#1C1C1C] transition-opacity hover:opacity-90"
      >
        {DONATION_COPY.donateNow}
      </button>

      <DonationTrustNote />
    </div>
  );
}

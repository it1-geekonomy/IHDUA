"use client";

import Typography from "@/lib/Typography";
import { DONATION_COPY } from "@/domains/home/constants/donation";
import {
  AmountConfirmHint,
  DonationTrustNote,
} from "./DonationFormPrimitives";
import { CountrySelect } from "./CountrySelect";
import type { DonationFormState } from "./useDonationForm";

type AmountStepProps = Pick<
  DonationFormState,
  | "countryCode"
  | "setCountryCode"
  | "currency"
  | "currencySymbol"
  | "presets"
  | "selectedDigits"
  | "customDigits"
  | "usingCustom"
  | "showLargeAmountHint"
  | "pickPreset"
  | "setCustomFromInput"
  | "setUsingCustom"
  | "goToDetails"
>;

export function AmountStep({
  countryCode,
  setCountryCode,
  currency,
  currencySymbol,
  presets,
  selectedDigits,
  customDigits,
  usingCustom,
  showLargeAmountHint,
  pickPreset,
  setCustomFromInput,
  setUsingCustom,
  goToDetails,
}: AmountStepProps) {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <div>
        <Typography
          variant="caption"
          className="font-bold font-figtree tracking-normal text-[#6B6660] !normal-case"
        >
          {DONATION_COPY.country}
        </Typography>
        <div className="mt-2">
          <CountrySelect value={countryCode} onChange={setCountryCode} />
        </div>
        <p className="mt-1.5 font-figtree text-[11px] text-[#8A847A]">
          {DONATION_COPY.internationalNote}
        </p>
      </div>

      <Typography
        variant="caption"
        className="font-bold font-figtree tracking-normal text-[#6B6660] !normal-case"
      >
        {DONATION_COPY.chooseAmount}
      </Typography>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {presets.map((preset) => {
          const active = !usingCustom && selectedDigits === preset.digits;
          return (
            <button
              key={preset.digits}
              type="button"
              onClick={() => pickPreset(preset.digits)}
              className={`rounded-sm border px-2 py-2.5 font-figtree text-[14px] font-semibold transition-colors ${
                active
                  ? "border-[#9739A8] bg-[#9739A8] text-white"
                  : "border-[#D4CEC5] bg-white text-[#00191B] hover:border-[#9739A8]/50"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <div
        className={`flex items-center rounded-sm border bg-[#FAF8F4] px-4 py-3.5 ${
          usingCustom ? "border-[#9739A8]" : "border-[#D9D3C9]"
        }`}
      >
        <span className="shrink-0 font-figtree text-[15px] text-[#8A847A]">
          {currencySymbol}
        </span>
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

      {showLargeAmountHint ? (
        <div className="-mt-2">
          <AmountConfirmHint message={DONATION_COPY.confirmBeforeContinue} />
        </div>
      ) : null}

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

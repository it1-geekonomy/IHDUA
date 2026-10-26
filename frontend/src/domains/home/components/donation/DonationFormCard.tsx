"use client";

import Typography from "@/lib/Typography";
import { DONATION_COPY } from "@/shared/constants/donation";
import { AmountStep } from "./AmountStep";
import { DetailsStep } from "./DetailsStep";
import { useDonationForm } from "./useDonationForm";

export function DonationFormCard() {
  const form = useDonationForm();

  return (
    <div className="w-full max-w-[480px] sm:max-w-[520px] lg:max-w-[530px] shrink-0 self-center rounded-md sm:rounded-lg bg-[#F7F4EE] p-5 sm:p-7 md:p-8 shadow-2xl">
      {form.step === 1 && (

        <>
          <Typography
            variant="h3"
            className="text-center font-lora font-normal leading-snug text-[#00191B] text-[26px] sm:text-[30px]"
          >
            {DONATION_COPY.cardTitle}
          </Typography>
          <Typography
            variant="body-sm"
            className="mx-auto mt-2 max-w-sm text-center leading-relaxed text-[#5F6C6D] font-figtree text-[13px] sm:text-[14px]"
          >
            {DONATION_COPY.cardBody}
          </Typography>
        </>
      )}

      {form.step === 1 ? (
        <AmountStep
          currencySymbol={form.currencySymbol}
          presets={form.presets}
          selectedDigits={form.selectedDigits}
          customDigits={form.customDigits}
          usingCustom={form.usingCustom}
          showLargeAmountHint={form.showLargeAmountHint}
          pickPreset={form.pickPreset}
          setCustomFromInput={form.setCustomFromInput}
          setUsingCustom={form.setUsingCustom}
          cause={form.cause}
          setCause={form.setCause}
          causes={form.causes}
          goToDetails={form.goToDetails}
        />
      ) : (
        <DetailsStep {...form} />
      )}
    </div>
  );
}
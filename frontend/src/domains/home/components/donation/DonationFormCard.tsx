"use client";

import Typography from "@/lib/Typography";
import { DONATION_COPY } from "@/domains/home/constants/donation";
import { AmountStep } from "./AmountStep";
import { DetailsStep } from "./DetailsStep";
import { useDonationForm } from "./useDonationForm";

export function DonationFormCard() {
  const form = useDonationForm();

  return (
    <div className="w-full max-w-md shrink-0 self-center rounded-sm bg-[#F7F4EE] p-6 shadow-xl sm:p-7 lg:self-auto xl:max-w-[420px]">
      <Typography
        variant="h3"
        className="text-center font-lora font-normal leading-snug text-[#00191B]"
      >
        {DONATION_COPY.cardTitle}
      </Typography>
      <Typography
        variant="body-sm"
        className="mx-auto mt-2 max-w-sm text-center leading-relaxed text-[#5F6C6D] font-figtree"
      >
        {DONATION_COPY.cardBody}
      </Typography>

      {form.step === 1 ? (
        <AmountStep
          selectedAmount={form.selectedAmount}
          customDigits={form.customDigits}
          usingCustom={form.usingCustom}
          pickPreset={form.pickPreset}
          setCustomFromInput={form.setCustomFromInput}
          setUsingCustom={form.setUsingCustom}
          goToDetails={form.goToDetails}
        />
      ) : (
        <DetailsStep
          chosenAmount={form.chosenAmount}
          customDigits={form.customDigits}
          usingCustom={form.usingCustom}
          editingAmount={form.editingAmount}
          fullName={form.fullName}
          mobile={form.mobile}
          email={form.email}
          setFullName={form.setFullName}
          setMobile={form.setMobile}
          setEmail={form.setEmail}
          setCustomFromInput={form.setCustomFromInput}
          startEditAmount={form.startEditAmount}
          commitAmountEdit={form.commitAmountEdit}
          cancelAmountEdit={form.cancelAmountEdit}
        />
      )}
    </div>
  );
}

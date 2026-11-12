"use client";

import { Pencil, Loader2, Info, AlertCircle, CheckCircle2, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import { DONATION_COPY } from "@/shared/constants/donation";
import {
  FormInput,
  FormTextarea,
  PhoneInputField,
} from "@/shared/components/form";
import type { DonationFormState } from "./useDonationForm";

type DetailsStepProps = Pick<
  DonationFormState,
  | "chosenAmount"
  | "customDigits"
  | "usingCustom"
  | "editingAmount"
  | "currencySymbol"
  | "countryCode"
  | "phoneCountryCode"
  | "phoneCountryDial"
  | "isIndia"
  | "fullName"
  | "mobile"
  | "email"
  | "taxId"
  | "address"
  | "city"
  | "message"
  | "termsAccepted"
  | "isPaying"
  | "statusMessage"
  | "statusTone"
  | "showLargeAmountHint"
  | "cause"
  | "recurring"
  | "frequency"
  | "frequencies"
  | "setFrequency"
  | "recurringAvailable"
  | "setPhoneCountryCode"
  | "setFullName"
  | "setMobile"
  | "setEmail"
  | "setTaxId"
  | "setAddress"
  | "setCity"
  | "setMessage"
  | "setTermsAccepted"
  | "setCustomFromInput"
  | "goBackToAmount"
  | "startEditAmount"
  | "commitAmountEdit"
  | "cancelAmountEdit"
  | "paySecurely"
>;

export function DetailsStep({
  chosenAmount,
  cause,
  recurring,
  frequency,
  frequencies,
  setFrequency,
  recurringAvailable,
  isIndia,
  phoneCountryCode,
  fullName,
  mobile,
  email,
  taxId,
  address,
  city,
  message,
  termsAccepted,
  isPaying,
  statusMessage,
  statusTone,
  setPhoneCountryCode,
  setFullName,
  setMobile,
  setEmail,
  setTaxId,
  setAddress,
  setCity,
  setMessage,
  setTermsAccepted,
  goBackToAmount,
  paySecurely,
}: DetailsStepProps) {
  return (
    <div className="w-full font-figtree animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <p className="text-[11px] sm:text-xs font-bold tracking-[0.15em] text-[#9739A8] uppercase font-figtree">
          DONATE
        </p>
        <h2 className="mt-1 font-lora text-[26px] sm:text-[32px] font-normal text-[#111827] leading-tight">
          Your Details
        </h2>
        <p className="mt-1 font-figtree text-[13px] sm:text-[14px] text-[#6B7280]">
          Tell us a little about yourself to continue your donation.
        </p>
      </div>

      {/* Donation Amount Summary Box */}
      <div className="mt-3 rounded-md border border-[#F3EBDD] bg-[#FDFBF7] px-3 py-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-lg font-bold leading-none text-[#111827]">
            {chosenAmount}
          </span>
          {recurring && (
            <span className="text-xs font-medium text-[#5F6C6D]">{recurring.every}</span>
          )}
          {cause && (
            <span className="truncate rounded-full bg-[#9739A8]/10 px-2 py-0.5 text-[11px] font-semibold text-[#9739A8]">
              {cause}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={goBackToAmount}
          disabled={isPaying}
          className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#9739A8] hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50"
        >
          <span>Edit</span>
          <Pencil className="w-3 h-3" />
        </button>
      </div>

      {/* Donation Frequency */}
      <div className="mt-3">
        <span className="block text-[13px] font-semibold text-[#111827]">
          {DONATION_COPY.chooseFrequency}
        </span>
        <div className="mt-1.5 grid grid-cols-4 gap-1.5 sm:gap-2">
          {frequencies.map((item) => {
            const active = frequency === item.id;
            const unavailable = !recurringAvailable && item.id !== "once";
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                disabled={unavailable || isPaying}
                title={unavailable ? DONATION_COPY.recurringIndiaOnly : undefined}
                onClick={() => setFrequency(item.id)}
                className={cn(
                  "rounded-md border py-1.5 px-1 text-center text-[12.5px] sm:text-[13px] font-semibold whitespace-nowrap transition-all disabled:cursor-not-allowed disabled:opacity-40",
                  active
                    ? "border-[#9739A8] bg-[#9739A8] text-white shadow-sm"
                    : "border-[#9739A8]/40 bg-transparent text-[#9739A8] enabled:hover:bg-[#9739A8]/10 cursor-pointer",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        {!recurringAvailable && (
          <p className="mt-1.5 text-[11px] text-[#6B7280]">
            {DONATION_COPY.recurringIndiaOnly}
          </p>
        )}
        {recurring && (
          <div className="mt-2 flex items-start gap-2 rounded-md border border-[#9739A8]/25 bg-[#FAF5FC] px-3 py-2">
            <Repeat className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#9739A8]" />
            <p className="text-[12px] leading-snug text-[#4B5563]">
              <span className="font-semibold text-[#9739A8]">
                {DONATION_COPY.autopayTitle}:
              </span>{" "}
              {DONATION_COPY.autopayNote(recurring.every)}
            </p>
          </div>
        )}
      </div>


      {/* Form Fields */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void paySecurely();
        }}
        className="mt-4 space-y-4 font-figtree"
      >
        {/* Row 1: Full Name & Email Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Full Name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isPaying}
          />
          <FormInput
            label="Email Address"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPaying}
          />
        </div>

        {/* Row 2: Mobile Number & PAN (PAN only for donations from India) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PhoneInputField
            label="Mobile Number"
            required
            value={mobile}
            onChange={setMobile}
            defaultCountryCode={phoneCountryCode}
            onCountryChange={setPhoneCountryCode}
          />
          {isIndia && (
            <div>
              <FormInput
                label="PAN (for 80G Tax Exemption)"
                placeholder="e.g. ABCDE1234F"
                maxLength={10}
                value={taxId}
                onChange={(e) =>
                  setTaxId(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())
                }
                disabled={isPaying}
              />
              <p className="mt-1 text-[11px] leading-snug text-[#6B7280]">
                Optional. Add your PAN to receive an 80G receipt and claim tax deduction.
              </p>
            </div>
          )}
        </div>

        {/* Row 3: Address Line */}
        <FormInput
          label="Address Line"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={isPaying}
        />

        {/* Row 4: City */}
        <FormInput
          label="City"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={isPaying}
        />

        {/* Row 5: Message (Optional) */}
        <FormTextarea
          label="Message (Optional)"
          placeholder="Leave a message or words of support..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isPaying}
          rows={3}
        />

        {/* Terms & Conditions Checkbox */}
        <div className="pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#9739A8] focus:ring-[#9739A8] accent-[#9739A8] cursor-pointer"
            />
            <span className="text-[13px] text-[#4B5563]">
              I have read and agree to the{" "}
              <a
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[#9739A8] font-semibold underline decoration-[#9739A8]/40 hover:text-[#7B2E88]"
              >
                Terms & Conditions
              </a>
            </span>
          </label>
        </div>

        {/* Status / Notice / Error Message */}
        {statusMessage && (
          <div
            className={cn(
              "rounded-lg p-3.5 text-center font-figtree text-[13px] sm:text-[14px] leading-snug transition-all flex items-center justify-center gap-2",
              statusTone === "ok" && "bg-emerald-50 text-emerald-800 border border-emerald-200",
              statusTone === "info" && "bg-[#FAF5FC] text-[#9739A8] border border-[#9739A8]/30 font-medium",
              statusTone === "error" && "bg-red-50 text-red-600 border border-red-200 font-medium"
            )}
            role="status"
          >
            {statusTone === "info" && <Info className="w-4 h-4 shrink-0 text-[#9739A8]" />}
            {statusTone === "error" && <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />}
            {statusTone === "ok" && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />}
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPaying}
          className="w-full bg-[#FFD638] hover:bg-[#FACC15] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed text-[#111827] font-semibold py-3.5 px-6 rounded-md shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
        >
          {isPaying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#111827]" />
              <span className="text-[15px]">Processing Payment...</span>
            </>
          ) : (
            <span className="text-[15px]">
              {recurring ? recurring.button : "Continue to Payment"}
            </span>
          )}
        </button>
      </form>
    </div>
  );
}

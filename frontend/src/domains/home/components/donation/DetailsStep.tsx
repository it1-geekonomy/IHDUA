"use client";

import { Pencil, Loader2, Info, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { INDIAN_STATES } from "@/domains/home/constants/indianStates";
import {
  FormInput,
  FormSelect,
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
  | "stateName"
  | "city"
  | "pincode"
  | "termsAccepted"
  | "isPaying"
  | "statusMessage"
  | "statusTone"
  | "showLargeAmountHint"
  | "setPhoneCountryCode"
  | "setFullName"
  | "setMobile"
  | "setEmail"
  | "setTaxId"
  | "setAddress"
  | "setStateName"
  | "setCity"
  | "setPincode"
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
  fullName,
  mobile,
  email,
  taxId,
  address,
  stateName,
  city,
  pincode,
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
  setStateName,
  setCity,
  setPincode,
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
      <div className="mt-5 rounded-md border border-[#F3EBDD] bg-[#FDFBF7] p-4 flex items-center justify-between">
        <div>
          <span className="block text-xs font-medium text-[#5F6C6D]">
            Donation Amount
          </span>
          <span className="block text-2xl font-bold text-[#111827] mt-0.5">
            {chosenAmount}
          </span>
        </div>
        <button
          type="button"
          onClick={goBackToAmount}
          disabled={isPaying}
          className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-[#9739A8] hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50"
        >
          <span>Edit Donation Amount</span>
          <Pencil className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Form Fields */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void paySecurely();
        }}
        className="mt-5 space-y-4 font-figtree"
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

        {/* Row 2: Mobile Number & PAN (Text Input, NOT dropdown) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PhoneInputField
            label="Mobile Number"
            required
            value={mobile}
            onChange={setMobile}
          />
          <FormInput
            label="PAN"
            value={taxId}
            onChange={(e) =>
              setTaxId(e.target.value.replace(/[^a-zA-Z0-9\s]/g, "").toUpperCase())
            }
            disabled={isPaying}
          />
        </div>

        {/* Row 3: Address Line */}
        <FormInput
          label="Address Line"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={isPaying}
        />

        {/* Row 4: State, City, PIN Code */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
          <FormSelect
            label="State"
            required
            placeholder="Select state"
            value={stateName}
            options={INDIAN_STATES}
            onChange={setStateName}
            direction="up"
            searchable={true}
          />
          <FormInput
            label="City"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={isPaying}
          />
          <FormInput
            label="PIN Code"
            required
            value={pincode}
            onChange={(e) =>
              setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            disabled={isPaying}
          />
        </div>

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
              <span className="text-[#9739A8] font-semibold underline decoration-[#9739A8]/40">
                Terms & Conditions
              </span>
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
            <span className="text-[15px]">Continue to Payment</span>
          )}
        </button>
      </form>
    </div>
  );
}

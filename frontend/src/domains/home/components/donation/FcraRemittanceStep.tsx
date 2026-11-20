"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
// TEMP: restore FCRA UI imports when international remittance goes live
// import { Mail, Phone } from "lucide-react";
import { DONATION_COPY } from "@/shared/constants/donation";
// import {
//   FCRA_BANK_DETAILS,
//   FCRA_CONTACT_EMAIL,
//   FCRA_DONOR_DETAIL_FIELDS,
//   FCRA_HAS_PUBLIC_ACCOUNT,
// } from "@/domains/home/constants/fcraRemittance";

type Props = {
  chosenAmount?: string;
  cause?: string;
  onBack: () => void;
};

/**
 * Outside India path.
 * TEMPORARY: FCRA account details are not live yet — show “in progress” only.
 * Uncomment the FCRA block below when account details are ready for production.
 */
export function FcraRemittanceStep({ onBack }: Props) {
  // --- TEMP: hide full FCRA remittance UI until account details are ready ---
  return (
    <div className="w-full font-figtree animate-in fade-in duration-200">
      <button
        type="button"
        onClick={onBack}
        className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#9739A8] hover:opacity-80 cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </button>

      <p className="text-[11px] sm:text-xs font-bold tracking-[0.15em] text-[#9739A8] uppercase">
        Outside India
      </p>
      <h2 className="mt-1 font-lora text-[24px] sm:text-[30px] font-normal text-[#111827] leading-tight">
        {DONATION_COPY.fcraPendingTitle}
      </h2>
      <p className="mt-3 text-[14px] sm:text-[15px] leading-relaxed text-[#4B5563]">
        {DONATION_COPY.fcraPendingBody}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-[#6B7280]">
        {DONATION_COPY.fcraPendingHint}
      </p>

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-md bg-[#FFD638] px-4 py-3 text-[14px] font-semibold text-[#111827] hover:bg-[#FACC15] transition-colors cursor-pointer"
        >
          Donate from India
        </button>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-md border border-[#9739A8] px-4 py-3 text-[14px] font-semibold text-[#9739A8] hover:bg-[#FAF5FC] transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );

  /* --- LIVE FCRA remittance UI (keep for later; do not delete) ---
  const mailSubject = encodeURIComponent("FCRA / overseas donation — IHDUA");
  const mailBody = encodeURIComponent(
    [
      "Hello IHDUA,",
      "",
      "I would like to make an overseas donation via FCRA remittance.",
      chosenAmount ? `Intended amount: ${chosenAmount}` : null,
      cause ? `Cause / project: ${cause}` : null,
      "",
      "My details:",
      "Name:",
      "Contact No:",
      "Donation Transaction Number:",
      "Donation Amount:",
      "Email:",
      "Complete Postal Address:",
      "",
    ]
      .filter(Boolean)
      .join("\n"),
  );
  const mailtoHref = `mailto:${FCRA_CONTACT_EMAIL}?subject=${mailSubject}&body=${mailBody}`;

  const ACCOUNT_ROWS: Array<{ label: string; value: string }> = [
    { label: "Account name", value: FCRA_BANK_DETAILS.accountName },
    {
      label: "SBI Bank FCRA Account number",
      value: FCRA_BANK_DETAILS.accountNumber,
    },
    { label: "IFSC Code", value: FCRA_BANK_DETAILS.ifsc },
    { label: "Address", value: FCRA_BANK_DETAILS.branchAddress },
    { label: "SWIFT Code of SBI Bank", value: FCRA_BANK_DETAILS.swift },
    { label: "Branch Code", value: FCRA_BANK_DETAILS.branchCode },
    { label: "Sort Code", value: FCRA_BANK_DETAILS.sortCode },
  ];

  return (
    <div className="w-full font-figtree animate-in fade-in duration-200">
      <button
        type="button"
        onClick={onBack}
        className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#9739A8] hover:opacity-80 cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </button>

      <p className="text-[11px] sm:text-xs font-bold tracking-[0.15em] text-[#9739A8] uppercase">
        Outside India
      </p>
      <h2 className="mt-1 font-lora text-[24px] sm:text-[30px] font-normal text-[#111827] leading-tight">
        {DONATION_COPY.fcraTitle}
      </h2>
      <p className="mt-2 text-[13px] sm:text-[14px] leading-relaxed text-[#4B5563]">
        {DONATION_COPY.fcraIntro}
      </p>

      {(chosenAmount || cause) && (
        <div className="mt-3 rounded-md border border-[#F3EBDD] bg-[#FDFBF7] px-3 py-2 text-[13px] text-[#111827]">
          {chosenAmount && (
            <span className="font-bold">{chosenAmount}</span>
          )}
          {chosenAmount && cause ? (
            <span className="text-[#6B7280]"> · </span>
          ) : null}
          {cause && (
            <span className="font-medium text-[#9739A8]">{cause}</span>
          )}
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-[15px] font-semibold text-[#111827]">
          Account details
        </h3>
        <p className="mt-0.5 text-[13px] font-medium text-[#5F6C6D]">
          SBI FCRA Account
        </p>
        <dl className="mt-3 space-y-2.5 rounded-md border border-[#E8E0D8] bg-white px-3.5 py-3.5">
          {ACCOUNT_ROWS.map((row) => (
            <div key={row.label}>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
                {row.label}
              </dt>
              <dd className="mt-0.5 text-[13.5px] font-medium text-[#111827] break-words">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
        {!FCRA_HAS_PUBLIC_ACCOUNT && (
          <p className="mt-2 text-[12px] leading-snug text-[#6B7280]">
            Account number will be published here shortly. Meanwhile, email or
            contact us and we will share the FCRA account details with you.
          </p>
        )}
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-[#4B5563]">
        {DONATION_COPY.fcraForexNote}
      </p>

      <p className="mt-3 text-[13px] leading-relaxed text-[#4B5563]">
        {DONATION_COPY.fcraPolicyNote}
      </p>

      <div className="mt-4 rounded-md border border-[#9739A8]/20 bg-[#FAF5FC] px-3.5 py-3.5">
        <p className="text-[13px] font-semibold text-[#111827]">
          Please send the following to{" "}
          <a
            href={mailtoHref}
            className="text-[#9739A8] underline decoration-[#9739A8]/40 hover:text-[#7B2E88]"
          >
            {FCRA_CONTACT_EMAIL}
          </a>{" "}
          or through our{" "}
          <Link
            href="/contact"
            className="text-[#9739A8] underline decoration-[#9739A8]/40 hover:text-[#7B2E88]"
          >
            Contact Us
          </Link>{" "}
          page:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-[#4B5563]">
          {FCRA_DONOR_DETAIL_FIELDS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <a
          href={mailtoHref}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#FFD638] px-4 py-3 text-[14px] font-semibold text-[#111827] hover:bg-[#FACC15] transition-colors"
        >
          <Mail className="h-4 w-4" />
          Email us
        </a>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-[#9739A8] px-4 py-3 text-[14px] font-semibold text-[#9739A8] hover:bg-[#FAF5FC] transition-colors"
        >
          <Phone className="h-4 w-4" />
          Contact Us
        </Link>
      </div>
    </div>
  );
  --- end LIVE FCRA UI --- */
}

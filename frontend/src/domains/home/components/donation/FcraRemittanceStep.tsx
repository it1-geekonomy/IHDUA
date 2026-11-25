"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Mail } from "lucide-react";
import { DONATION_COPY } from "@/shared/constants/donation";
import { FCRA_CONTACT_EMAIL } from "@/domains/home/constants/fcraRemittance";
// When FCRA bank remittance goes live, restore bank-detail UI from git history
// (or uncomment the previous LIVE FCRA block) and wire FCRA_BANK_DETAILS again.

type Props = {
  chosenAmount?: string;
  cause?: string;
  onBack: () => void;
};

/**
 * Outside India / foreign donations path.
 * Payment gateways cannot automate this — direct donors to Finance by email.
 */
export function FcraRemittanceStep({
  chosenAmount,
  cause,
  onBack,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(FCRA_CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, []);

  const openFinanceEmail = useCallback(() => {
    const subject = "Foreign donation enquiry - IHDUA";
    const body = [
      "Hello IHDUA Finance team,",
      "",
      "I would like to make a donation from outside India. Please share the process and next steps.",
      chosenAmount ? `Intended amount: ${chosenAmount}` : null,
      cause ? `Cause / project: ${cause}` : null,
      "",
      "My details:",
      "Name:",
      "Country:",
      "Email:",
      "Phone:",
      "",
    ]
      .filter(Boolean)
      .join("\n");

    const params = new URLSearchParams({
      view: "cm",
      fs: "1",
      to: FCRA_CONTACT_EMAIL,
      su: subject,
      body,
    });
    // Gmail compose works without a desktop mail client (mailto often does nothing).
    window.open(
      `https://mail.google.com/mail/?${params.toString()}`,
      "_blank",
      "noopener,noreferrer",
    );
  }, [chosenAmount, cause]);

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

      <div className="mt-4 rounded-md border border-[#9739A8]/20 bg-[#FAF5FC] px-3.5 py-3.5">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-[#6B7280]">
          {DONATION_COPY.fcraFinanceLabel}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={openFinanceEmail}
            className="inline-flex min-w-0 items-center gap-2 break-all text-left text-[15px] font-semibold text-[#9739A8] underline decoration-[#9739A8]/35 hover:text-[#7B2E88] cursor-pointer"
          >
            <Mail className="h-4 w-4 shrink-0" />
            {FCRA_CONTACT_EMAIL}
          </button>
          <button
            type="button"
            onClick={() => void copyEmail()}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#9739A8]/30 bg-white px-2.5 py-1.5 text-[12px] font-semibold text-[#9739A8] transition-colors hover:bg-[#FAF5FC] cursor-pointer"
            aria-label={copied ? "Email copied" : "Copy finance email"}
            title={copied ? "Copied!" : "Copy email"}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </button>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-[#4B5563]">
          Write to us at this address and our Finance team will guide you through
          the foreign donation process.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={openFinanceEmail}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#FFD638] px-4 py-3 text-[14px] font-semibold text-[#111827] hover:bg-[#FACC15] transition-colors cursor-pointer"
        >
          <Mail className="h-4 w-4" />
          {DONATION_COPY.fcraEmailCta}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-md border border-[#9739A8] px-4 py-3 text-[14px] font-semibold text-[#9739A8] hover:bg-[#FAF5FC] transition-colors cursor-pointer"
        >
          Donate from India
        </button>
      </div>

      <p className="mt-3 text-center text-[12px] text-[#6B7280]">
        Or reach us via{" "}
        <Link
          href="/contact"
          className="font-semibold text-[#9739A8] underline decoration-[#9739A8]/35 hover:text-[#7B2E88]"
        >
          Contact Us
        </Link>
        .
      </p>
    </div>
  );
}

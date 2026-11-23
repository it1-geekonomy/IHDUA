"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { AdminSelect, type AdminSelectOption } from "@/domains/admin/components/AdminSelect";
import {
  DONATION_COUNTRIES,
  getCountryByCode,
} from "@/domains/home/constants/donationCountries";
import type {
  CreateManualDonationInput,
  OfflinePaymentMode,
} from "@/domains/admin/lib/api";

interface Props {
  isOpen: boolean;
  actionLoading: boolean;
  onClose: () => void;
  onSave: (values: CreateManualDonationInput) => Promise<void> | void;
}

type DonorOrigin = "IN" | "OUT";

const ORIGIN_OPTIONS: AdminSelectOption<DonorOrigin>[] = [
  { value: "IN", label: "India" },
  { value: "OUT", label: "Outside India (foreign)" },
];

const CURRENCY_OPTIONS: AdminSelectOption<string>[] = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "AED", label: "AED" },
  { value: "SGD", label: "SGD" },
  { value: "AUD", label: "AUD" },
  { value: "CAD", label: "CAD" },
  { value: "INR", label: "INR (₹)" },
];

const PAYMENT_MODES: AdminSelectOption<OfflinePaymentMode>[] = [
  { value: "cash", label: "Cash" },
  { value: "cheque", label: "Cheque" },
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "upi", label: "UPI (offline)" },
  { value: "other", label: "Other" },
];

const FOREIGN_COUNTRY_OPTIONS: AdminSelectOption<string>[] = DONATION_COUNTRIES
  .filter((c) => c.code !== "IN")
  .map((c) => ({ value: c.code, label: c.name }));

const emptyForm = () => ({
  origin: "IN" as DonorOrigin,
  countryCode: "",
  fullName: "",
  phone: "",
  email: "",
  amount: "",
  currency: "INR",
  donationCategory: "General Donation",
  pan: "",
  address: "",
  city: "",
  message: "",
  paymentMode: "cash" as OfflinePaymentMode,
  offlineReference: "",
  donatedAt: new Date().toISOString().slice(0, 10),
  sendEmail: false,
});

export function ManualDonationModal({
  isOpen,
  actionLoading,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setForm(emptyForm());
    setError(null);
  }, [isOpen]);

  const isIndia = form.origin === "IN";
  const amountNum = Number(form.amount) || 0;
  const panAddressRequired = isIndia && amountNum >= 2000;
  const selectedCountry = form.countryCode
    ? getCountryByCode(form.countryCode)
    : null;

  const set =
    <K extends keyof typeof form>(key: K) =>
    (value: (typeof form)[K]) =>
      setForm((prev) => ({ ...prev, [key]: value }));

  const setOrigin = (origin: DonorOrigin) => {
    setForm((prev) => ({
      ...prev,
      origin,
      countryCode: origin === "IN" ? "" : prev.countryCode,
      currency:
        origin === "IN"
          ? "INR"
          : prev.currency === "INR"
            ? "USD"
            : prev.currency,
      pan: origin === "IN" ? prev.pan : "",
    }));
  };

  const setCountry = (code: string) => {
    const country = getCountryByCode(code);
    setForm((prev) => ({
      ...prev,
      countryCode: code,
      currency: country.currency === "INR" ? "USD" : country.currency,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = form.fullName.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();
    const amount = form.amount.trim();
    const pan = form.pan.trim().toUpperCase();
    const address = form.address.trim();

    if (!fullName || !phone || !email || !amount) {
      setError("Name, phone, email, and amount are required.");
      return;
    }
    if (!/^[1-9]\d*$/.test(amount)) {
      setError("Amount must be a positive whole number.");
      return;
    }
    if (!isIndia && !form.countryCode) {
      setError("Select the donor's country.");
      return;
    }
    if (isIndia && panAddressRequired) {
      if (!pan || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
        setError("PAN Card No. is required for India donations of ₹2,000 or more.");
        return;
      }
      if (!address) {
        setError("Address is required for India donations of ₹2,000 or more.");
        return;
      }
    }
    if (isIndia && pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
      setError("Enter a valid 10-character PAN (e.g. ABCDE1234F).");
      return;
    }

    const countryName = isIndia
      ? "India"
      : selectedCountry?.name || "Outside India";
    const countryCode = isIndia ? "IN" : form.countryCode;

    setError(null);
    try {
      await onSave({
        fullName,
        phone,
        email,
        amount,
        currency: isIndia ? "INR" : form.currency,
        countryCode,
        countryName,
        donationCategory: form.donationCategory.trim() || "General Donation",
        ...(isIndia && pan ? { pan } : {}),
        ...(address ? { address } : {}),
        ...(form.city.trim() ? { city: form.city.trim() } : {}),
        ...(form.message.trim() ? { message: form.message.trim() } : {}),
        paymentMode: form.paymentMode,
        ...(form.offlineReference.trim()
          ? { offlineReference: form.offlineReference.trim() }
          : {}),
        ...(form.donatedAt ? { donatedAt: form.donatedAt } : {}),
        sendEmail: form.sendEmail,
      });
    } catch {
      // Parent sets the page-level error; keep the modal open for corrections.
    }
  };

  if (!isOpen) return null;

  const fieldCls =
    "h-10 w-full rounded-xl border border-[#D9D3C9] bg-white px-3 text-xs text-[#0F1C1D] placeholder:text-[#8A847A] shadow-2xs focus:border-[#9739A8] focus:outline-none focus:ring-2 focus:ring-[#9739A8]/20";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white shadow-2xl font-figtree">
        <div className="flex items-center justify-between border-b border-[#E5E0D8] px-5 py-4">
          <div>
            <h2 className="font-lora text-lg text-[#0F1C1D]">Add donor</h2>
            <p className="text-xs text-[#5F6C6D]">
              Saves to the ledger with certificate on the record. India: 80G
              when PAN is set. Open the donor later to download PDFs.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            className="rounded-lg p-1.5 hover:bg-neutral-100 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-4 overflow-y-auto px-5 py-4">
            {error && (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5F6C6D]">
                  Donor from *
                </span>
                <AdminSelect
                  value={form.origin}
                  onChange={setOrigin}
                  options={ORIGIN_OPTIONS}
                />
                {!isIndia && (
                  <p className="text-[10px] text-[#8A847A]">
                    Foreign donations get a thank-you certificate only. 80G tax
                    receipt is for India donors with PAN.
                  </p>
                )}
              </div>

              {!isIndia && (
                <div className="space-y-1.5 sm:col-span-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5F6C6D]">
                    Country *
                  </span>
                  <AdminSelect
                    value={form.countryCode || ("" as string)}
                    onChange={setCountry}
                    options={FOREIGN_COUNTRY_OPTIONS}
                    placeholder="Select country"
                    searchable
                    dropdownClassName="w-full max-w-md"
                  />
                </div>
              )}

              <label className="block space-y-1.5 sm:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5F6C6D]">
                  Donor name *
                </span>
                <input
                  className={fieldCls}
                  value={form.fullName}
                  onChange={(e) => set("fullName")(e.target.value)}
                  placeholder="Full name"
                  required
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5F6C6D]">
                  Phone *
                </span>
                <input
                  className={fieldCls}
                  value={form.phone}
                  onChange={(e) => set("phone")(e.target.value)}
                  placeholder={isIndia ? "+9198…" : "+1…"}
                  required
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5F6C6D]">
                  Email *
                </span>
                <input
                  type="email"
                  className={fieldCls}
                  value={form.email}
                  onChange={(e) => set("email")(e.target.value)}
                  placeholder="donor@example.com"
                  required
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5F6C6D]">
                  Amount{isIndia ? " (INR)" : ""} *
                </span>
                <input
                  className={fieldCls}
                  value={form.amount}
                  onChange={(e) => set("amount")(e.target.value.replace(/\D/g, ""))}
                  placeholder={isIndia ? "5000" : "100"}
                  required
                />
              </label>
              {isIndia ? (
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5F6C6D]">
                    Donation date
                  </span>
                  <input
                    type="date"
                    className={fieldCls}
                    value={form.donatedAt}
                    onChange={(e) => set("donatedAt")(e.target.value)}
                  />
                </label>
              ) : (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5F6C6D]">
                    Currency *
                  </span>
                  <AdminSelect
                    value={form.currency}
                    onChange={(v) => set("currency")(v)}
                    options={CURRENCY_OPTIONS}
                  />
                </div>
              )}
              {!isIndia && (
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5F6C6D]">
                    Donation date
                  </span>
                  <input
                    type="date"
                    className={fieldCls}
                    value={form.donatedAt}
                    onChange={(e) => set("donatedAt")(e.target.value)}
                  />
                </label>
              )}
              <label className="block space-y-1.5 sm:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5F6C6D]">
                  Donation for (category)
                </span>
                <input
                  className={fieldCls}
                  value={form.donationCategory}
                  onChange={(e) => set("donationCategory")(e.target.value)}
                  placeholder="School Essentials — Lunch bag or exam fees"
                />
              </label>
              {isIndia && (
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5F6C6D]">
                    PAN Card No.{panAddressRequired ? " *" : " (for 80G)"}
                  </span>
                  <input
                    className={fieldCls}
                    value={form.pan}
                    onChange={(e) => set("pan")(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                  />
                  <span className="block text-[10px] text-[#8A847A]">
                    {panAddressRequired
                      ? "Required for ₹2,000 or more. Enables 80G receipt."
                      : "Certificate always generated. 80G receipt only when PAN is filled."}
                  </span>
                </label>
              )}
              <div className={`space-y-1.5 ${isIndia ? "" : "sm:col-span-1"}`}>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5F6C6D]">
                  Payment mode
                </span>
                <AdminSelect
                  value={form.paymentMode}
                  onChange={(v) => set("paymentMode")(v)}
                  options={PAYMENT_MODES}
                />
              </div>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5F6C6D]">
                  Reference (cheque / UTR)
                </span>
                <input
                  className={fieldCls}
                  value={form.offlineReference}
                  onChange={(e) => set("offlineReference")(e.target.value)}
                  placeholder="Optional"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5F6C6D]">
                  City
                </span>
                <input
                  className={fieldCls}
                  value={form.city}
                  onChange={(e) => set("city")(e.target.value)}
                  placeholder={isIndia ? "Bengaluru" : "City"}
                />
              </label>
              <label className="block space-y-1.5 sm:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5F6C6D]">
                  Address{panAddressRequired ? " *" : ""}
                </span>
                <input
                  className={fieldCls}
                  value={form.address}
                  onChange={(e) => set("address")(e.target.value)}
                  placeholder={panAddressRequired ? "Required" : "Optional"}
                />
              </label>
              <label className="block space-y-1.5 sm:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5F6C6D]">
                  Notes
                </span>
                <textarea
                  className="min-h-[72px] w-full rounded-xl border border-[#D9D3C9] bg-white px-3 py-2 text-xs text-[#0F1C1D] placeholder:text-[#8A847A] shadow-2xs focus:border-[#9739A8] focus:outline-none focus:ring-2 focus:ring-[#9739A8]/20"
                  value={form.message}
                  onChange={(e) => set("message")(e.target.value)}
                  placeholder="Collected at event, wire transfer from overseas…"
                />
              </label>
            </div>

            <label className="flex items-start gap-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F4] px-3 py-3 text-xs text-[#0F1C1D]">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={form.sendEmail}
                onChange={(e) => set("sendEmail")(e.target.checked)}
              />
              <span>
                <span className="font-semibold">Email certificate to donor</span>
                <span className="mt-0.5 block text-[11px] text-[#5F6C6D]">
                  Sends thank-you email with certificate PDF
                  {isIndia && form.pan.trim() ? " and 80G receipt" : ""}
                  {!isIndia ? " (no 80G for foreign donors)" : ""}.
                </span>
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t border-[#E5E0D8] px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={actionLoading}
              className="rounded-lg border border-[#D9D3C9] px-3 py-2 text-xs font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#9739A8] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Creating…
                </>
              ) : (
                "Add donor"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

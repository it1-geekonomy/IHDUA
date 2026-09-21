"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DONATION_COPY } from "@/domains/home/constants/donation";
import {
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  DONATION_CURRENCIES,
  formatPresetLabel,
  getCountryByCode,
  getCurrencyMeta,
  type DonationCurrency,
} from "@/domains/home/constants/donationCountries";
import {
  amountDigitsFromDisplay,
  createDonationOrder,
  DONATE_CHECKOUT_EVENT,
  type DonateCheckoutDetail,
  formatDonationAmount,
  isCroreOrAbove,
  loadRazorpayScript,
  normalizeAmountDigits,
  openRazorpayCheckout,
  toAmountDigits,
  verifyDonationPayment,
} from "@/domains/home/lib/donation";

export type DonationStep = 1 | 2;

function isValidTaxId(value: string) {
  const trimmed = value.trim().toUpperCase();
  if (!trimmed) return true;
  const pan = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  const aadhaar = /^\d{12}$/;
  return pan.test(trimmed) || aadhaar.test(trimmed.replace(/\s/g, ""));
}

function isValidPhone(localNumber: string, countryCode: string) {
  const digits = localNumber.replace(/\D/g, "");
  if (countryCode === "IN") return digits.length === 10;
  if (countryCode === "OTHER") return digits.length >= 6 && digits.length <= 15;
  return digits.length >= 7 && digits.length <= 15;
}

export function useDonationForm() {
  const [step, setStep] = useState<DonationStep>(1);
  const [currency, setCurrencyState] = useState<DonationCurrency>(DEFAULT_CURRENCY);
  const [selectedDigits, setSelectedDigits] = useState(
    () => getCurrencyMeta(DEFAULT_CURRENCY).presets[2],
  );
  const [customDigits, setCustomDigits] = useState("");
  const [usingCustom, setUsingCustom] = useState(false);
  const [editingAmount, setEditingAmount] = useState(false);
  const [countryCode, setCountryCodeState] = useState(DEFAULT_COUNTRY.code);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [taxId, setTaxId] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"ok" | "error" | null>(null);

  const currencyMeta = useMemo(() => getCurrencyMeta(currency), [currency]);
  const country = useMemo(() => getCountryByCode(countryCode), [countryCode]);
  const isIndia = countryCode === "IN";

  const presets = useMemo(
    () =>
      currencyMeta.presets.map((digits) => ({
        digits,
        label: formatPresetLabel(digits, currency),
      })),
    [currency, currencyMeta.presets],
  );

  const chosenAmount = useMemo(() => {
    const digits = usingCustom ? customDigits : selectedDigits;
    return (
      formatDonationAmount(digits, currency, currencyMeta.symbol) ||
      formatPresetLabel(selectedDigits, currency)
    );
  }, [usingCustom, customDigits, selectedDigits, currency, currencyMeta.symbol]);

  const setCurrency = useCallback((next: DonationCurrency) => {
    const meta = getCurrencyMeta(next);
    setCurrencyState(next);
    setSelectedDigits(meta.presets[2] ?? meta.presets[0]);
    setUsingCustom(false);
    setCustomDigits("");
    setEditingAmount(false);
  }, []);

  const setCountryCode = useCallback((code: string) => {
    const next = getCountryByCode(code);
    setCountryCodeState(next.code);
    setCurrency(next.currency);
    if (next.code !== "IN") setTaxId("");
  }, [setCurrency]);

  const applyExternalAmount = useCallback((amount: string) => {
    // External CTAs on the site are INR-based today.
    setCurrencyState("INR");
    setCountryCodeState("IN");
    const digits = normalizeAmountDigits(toAmountDigits(amount));
    if (!digits) return;

    const inrPresets = getCurrencyMeta("INR").presets;
    if (inrPresets.includes(digits)) {
      setSelectedDigits(digits);
      setUsingCustom(false);
      setCustomDigits("");
    } else {
      setUsingCustom(true);
      setCustomDigits(digits);
    }
    setEditingAmount(false);
    setStep(2);
  }, []);

  useEffect(() => {
    const onCheckout = (event: Event) => {
      const detail = (event as CustomEvent<DonateCheckoutDetail>).detail;
      if (!detail?.amount) return;
      applyExternalAmount(detail.amount);
    };

    window.addEventListener(DONATE_CHECKOUT_EVENT, onCheckout);
    return () => window.removeEventListener(DONATE_CHECKOUT_EVENT, onCheckout);
  }, [applyExternalAmount]);

  const pickPreset = (digits: string) => {
    setSelectedDigits(digits);
    setUsingCustom(false);
    setCustomDigits("");
  };

  const setCustomFromInput = (raw: string) => {
    setUsingCustom(true);
    setCustomDigits(toAmountDigits(raw));
  };

  const goToDetails = () => {
    if (usingCustom) {
      const digits = normalizeAmountDigits(toAmountDigits(customDigits));
      if (!digits) return;
      setCustomDigits(digits);
    }
    setEditingAmount(false);
    setStep(2);
  };

  const startEditAmount = () => {
    setUsingCustom(true);
    setCustomDigits(
      normalizeAmountDigits(toAmountDigits(usingCustom ? customDigits : selectedDigits)),
    );
    setEditingAmount(true);
  };

  const commitAmountEdit = () => {
    const digits = normalizeAmountDigits(toAmountDigits(customDigits));
    if (!digits) {
      setUsingCustom(false);
      setCustomDigits("");
    } else {
      setUsingCustom(true);
      setCustomDigits(digits);
    }
    setEditingAmount(false);
  };

  const cancelAmountEdit = () => setEditingAmount(false);

  const paySecurely = async () => {
    setStatusMessage(null);
    setStatusTone(null);

    const name = fullName.trim();
    const localPhone = mobile.trim();
    const mail = email.trim();
    const panOrAadhaar = isIndia
      ? taxId.trim().replace(/\s/g, "").toUpperCase()
      : "";
    const amount = amountDigitsFromDisplay(chosenAmount);
    const dial = country.dial === "+" ? "+" : country.dial;
    const fullPhone = `${dial}${localPhone.replace(/\D/g, "")}`.slice(0, 20);

    if (!name || !localPhone || !mail || !amount) {
      setStatusTone("error");
      setStatusMessage(DONATION_COPY.fillRequired);
      return;
    }

    if (!isValidPhone(localPhone, countryCode)) {
      setStatusTone("error");
      setStatusMessage(DONATION_COPY.invalidPhone);
      return;
    }

    if (isIndia && !isValidTaxId(panOrAadhaar)) {
      setStatusTone("error");
      setStatusMessage(DONATION_COPY.invalidTaxId);
      return;
    }

    setIsPaying(true);
    setStatusMessage(DONATION_COPY.paying);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Unable to load Razorpay checkout");

      const order = await createDonationOrder({
        fullName: name,
        phone: fullPhone,
        email: mail,
        amount,
        currency,
        countryCode,
        countryName: country.name,
        ...(panOrAadhaar ? { pan: panOrAadhaar } : {}),
      });

      openRazorpayCheckout({
        key: order.keyId,
        amount: Number(order.amount),
        currency: order.currency,
        name: "IHDUA",
        description: "Donation",
        order_id: order.orderId,
        prefill: {
          name,
          email: mail,
          contact: fullPhone,
        },
        theme: { color: "#9739A8" },
        handler: async (response) => {
          setStatusMessage(DONATION_COPY.verifying);
          try {
            await verifyDonationPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setStatusTone("ok");
            setStatusMessage(DONATION_COPY.paymentSuccess);
            setFullName("");
            setMobile("");
            setEmail("");
            setTaxId("");
          } catch (error) {
            setStatusTone("error");
            setStatusMessage(
              error instanceof Error
                ? error.message
                : DONATION_COPY.paymentFailed,
            );
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
            setStatusTone("error");
            setStatusMessage(DONATION_COPY.paymentFailed);
          },
        },
      });
    } catch (error) {
      setIsPaying(false);
      setStatusTone("error");
      setStatusMessage(
        error instanceof Error ? error.message : DONATION_COPY.paymentFailed,
      );
    }
  };

  return {
    step,
    currency,
    currencies: DONATION_CURRENCIES,
    currencySymbol: currencyMeta.symbol,
    presets,
    chosenAmount,
    selectedDigits,
    customDigits,
    usingCustom,
    editingAmount,
    countryCode,
    countryDial: country.dial,
    isIndia,
    fullName,
    mobile,
    email,
    taxId,
    isPaying,
    statusMessage,
    statusTone,
    showLargeAmountHint: currency === "INR" && usingCustom && isCroreOrAbove(customDigits),
    setCurrency,
    setCountryCode,
    setFullName,
    setMobile,
    setEmail,
    setTaxId,
    setUsingCustom,
    pickPreset,
    setCustomFromInput,
    goToDetails,
    startEditAmount,
    commitAmountEdit,
    cancelAmountEdit,
    paySecurely,
  };
}

export type DonationFormState = ReturnType<typeof useDonationForm>;

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DONATION_COPY,
  DONATION_CAUSES,
  DEFAULT_DONATION_CAUSE,
  DONATION_FREQUENCY_OPTIONS,
  RECURRING_SCHEDULE,
  type DonationCause,
  type DonationFrequencyOption,
} from "@/shared/constants/donation";
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
  createDonationSubscription,
  DONATE_CHECKOUT_EVENT,
  type DonateCheckoutDetail,
  formatDonationAmount,
  isCroreOrAbove,
  loadRazorpayScript,
  normalizeAmountDigits,
  openRazorpayCheckout,
  toAmountDigits,
  verifyDonationPayment,
  verifyDonationSubscription,
  type RazorpayCheckoutOptions,
  type RazorpaySuccessResponse,
} from "@/domains/home/lib/donation";

export type DonationStep = 1 | 2;

export type DonationReceipt = {
  receiptNumber: string;
  donorName: string;
  amount: string;
  currency: string;
  currencySymbol: string;
  donationCategory: string;
  date: string;
  email: string;
  paymentId?: string;
  /** Set for recurring donations, e.g. "every month". */
  recurringEvery?: string;
};

function isValidTaxId(value: string) {
  const trimmed = value.trim().toUpperCase();
  if (!trimmed) return true;
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(trimmed);
}

function isValidPhone(localNumber: string, countryCode: string) {
  const digits = localNumber.replace(/\D/g, "");
  if (countryCode === "IN") return digits.length === 10;
  if (countryCode === "OTHER") return digits.length >= 6 && digits.length <= 15;
  return digits.length >= 7 && digits.length <= 15;
}

// Flag to control payment gateway availability.
// Set to true once backend payment integration endpoints are deployed.
const IS_PAYMENT_ENABLED = true;

export function useDonationForm() {
  const [step, setStep] = useState<DonationStep>(1);
  const [currency, setCurrencyState] = useState<DonationCurrency>(DEFAULT_CURRENCY);
  const [selectedDigits, setSelectedDigits] = useState(
    () => getCurrencyMeta(DEFAULT_CURRENCY).presets[2],
  );
  const [customDigits, setCustomDigits] = useState("");
  const [usingCustom, setUsingCustom] = useState(false);
  const [cause, setCause] = useState<DonationCause>(DEFAULT_DONATION_CAUSE);
  const [frequency, setFrequencyState] = useState<DonationFrequencyOption>("once");
  const [editingAmount, setEditingAmount] = useState(false);
  const [countryCode, setCountryCodeState] = useState(DEFAULT_COUNTRY.code);
  const [phoneCountryCode, setPhoneCountryCode] = useState(DEFAULT_COUNTRY.code);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [taxId, setTaxId] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<DonationReceipt | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"ok" | "error" | "info" | null>(null);


  const currencyMeta = useMemo(() => getCurrencyMeta(currency), [currency]);
  const country = useMemo(() => getCountryByCode(countryCode), [countryCode]);
  const phoneCountry = useMemo(() => getCountryByCode(phoneCountryCode), [phoneCountryCode]);
  // PAN (80G receipt) applies only to donations made from India
  const isIndia = countryCode === "IN";
  // Razorpay subscriptions (eMandate / UPI Autopay / cards) are INR-only
  const recurringAvailable = isIndia && currency === "INR";
  const effectiveFrequency: DonationFrequencyOption = recurringAvailable
    ? frequency
    : "once";
  const recurring =
    effectiveFrequency === "once" ? null : RECURRING_SCHEDULE[effectiveFrequency];

  const setFrequency = useCallback((next: DonationFrequencyOption) => {
    setFrequencyState(next);
    setStatusMessage(null);
    setStatusTone(null);
  }, []);

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

  const applyCountry = useCallback((code: string) => {
    setCountryCodeState(code);
    setPhoneCountryCode(code);
    if (code !== "IN") setTaxId("");
  }, []);

  const setCountryCode = useCallback((code: string) => {
    const next = getCountryByCode(code);
    applyCountry(next.code);
    setCurrency(next.currency);
  }, [applyCountry, setCurrency]);

  const applyExternalAmount = useCallback((amount: string, extCountryCode?: string) => {
    // External CTAs can optionally specify country, else fallback to India
    const nextCode = extCountryCode || "IN";
    const nextCountry = getCountryByCode(nextCode);
    applyCountry(nextCountry.code);
    setCurrencyState(nextCountry.currency);

    const digits = normalizeAmountDigits(toAmountDigits(amount));
    if (!digits) return;

    const presets = getCurrencyMeta(nextCountry.currency).presets;
    if (presets.includes(digits) || (nextCountry.currency === "INR" && ["999", "5000", "10000", "18000", "25000"].includes(digits))) {
      setSelectedDigits(digits);
      setUsingCustom(false);
      setCustomDigits("");
    } else {
      setUsingCustom(true);
      setCustomDigits(digits);
    }
    setEditingAmount(false);
    setStep(2);
  }, [applyCountry]);

  useEffect(() => {
    const onCheckout = (event: Event) => {
      const detail = (event as CustomEvent<DonateCheckoutDetail>).detail;
      if (!detail?.amount) return;
      applyExternalAmount(detail.amount, detail.countryCode);
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

  const goBackToAmount = () => {
    setStep(1);
    setEditingAmount(false);
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

  const closeReceiptModal = useCallback(() => {
    setSuccessReceipt(null);
    setStep(1);
    setStatusMessage(null);
    setStatusTone(null);
  }, []);

  const paySecurely = async () => {
    setStatusMessage(null);
    setStatusTone(null);

    // Backend payment gateway integration check
    if (!IS_PAYMENT_ENABLED) {
      setStatusTone("info");
      const trimmedName = fullName.trim();
      setStatusMessage(
        trimmedName
          ? `Thank you, ${trimmedName}! Payment gateway integration is currently in progress and will be available soon.`
          : "Payment gateway integration is currently in progress and will be available soon. Thank you for your support!",
      );
      return;
    }

    const name = fullName.trim();
    const localPhone = mobile.trim();
    const mail = email.trim();
    const panOrAadhaar = isIndia
      ? taxId.trim().replace(/\s/g, "").toUpperCase()
      : "";
    const amount = amountDigitsFromDisplay(chosenAmount);
    const dial = phoneCountry.dial === "+" ? "+" : phoneCountry.dial;
    // Picking a country in the phone field pre-fills its dial code into the input
    const dialDigits = dial.replace(/\D/g, "");
    const typedDigits = localPhone.replace(/\D/g, "");
    const nationalDigits =
      localPhone.startsWith("+") && dialDigits && typedDigits.startsWith(dialDigits)
        ? typedDigits.slice(dialDigits.length)
        : typedDigits;
    const fullPhone = `${dial}${nationalDigits}`.slice(0, 20);

    if (!name || !localPhone || !mail || !amount) {
      setStatusTone("error");
      setStatusMessage(DONATION_COPY.fillRequired);
      return;
    }

    if (!city.trim()) {
      setStatusTone("error");
      setStatusMessage("Please enter your city.");
      return;
    }

    if (!termsAccepted) {
      setStatusTone("error");
      setStatusMessage("Please agree to the Terms & Conditions to continue.");
      return;
    }

    if (!isValidPhone(nationalDigits, phoneCountryCode)) {
      setStatusTone("error");
      setStatusMessage(DONATION_COPY.invalidPhone);
      return;
    }

    if (isIndia && panOrAadhaar && !isValidTaxId(panOrAadhaar)) {
      setStatusTone("error");
      setStatusMessage(DONATION_COPY.invalidTaxId);
      return;
    }

    setIsPaying(true);
    setStatusMessage(DONATION_COPY.paying);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Unable to load Razorpay checkout");

      const payload = {
        fullName: name,
        phone: fullPhone,
        email: mail,
        amount,
        currency,
        countryCode,
        countryName: country.name,
        ...(panOrAadhaar ? { pan: panOrAadhaar } : {}),
        ...(address.trim() ? { address: address.trim() } : {}),
        city: city.trim(),
        ...(message.trim() ? { message: message.trim() } : {}),
        donationCategory: cause,
      };

      let checkout: Pick<
        RazorpayCheckoutOptions,
        "key" | "amount" | "currency" | "order_id" | "subscription_id" | "description"
      >;
      if (effectiveFrequency === "once") {
        const order = await createDonationOrder(payload);
        checkout = {
          key: order.keyId,
          amount: Number(order.amount),
          currency: order.currency,
          order_id: order.orderId,
          description: `${cause} - Donation`,
        };
      } else {
        const sub = await createDonationSubscription({
          ...payload,
          frequency: effectiveFrequency,
        });
        checkout = {
          key: sub.keyId,
          subscription_id: sub.subscriptionId,
          description: `${cause} - ${RECURRING_SCHEDULE[effectiveFrequency].label} Donation`,
        };
      }

      const confirmPayment = async (response: RazorpaySuccessResponse) => {
        if (response.razorpay_subscription_id) {
          const verified = await verifyDonationSubscription({
            razorpaySubscriptionId: response.razorpay_subscription_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          return {
            receiptNumber:
              verified.donor?.receiptNumber || DONATION_COPY.recurringReceiptPending,
            amount: verified.donor?.amount || verified.subscription.amount,
            currency: verified.donor?.currency || "INR",
            donationCategory: verified.donor?.donationCategory || cause,
          };
        }
        const verified = await verifyDonationPayment({
          razorpayOrderId: response.razorpay_order_id ?? "",
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });
        return {
          receiptNumber: verified.receiptNumber || `IHDUA-${Date.now()}`,
          amount: verified.amount || amount,
          currency: verified.currency || currency,
          donationCategory: verified.donationCategory || cause,
        };
      };

      openRazorpayCheckout({
        ...checkout,
        name: "IHDUA",
        prefill: {
          name,
          email: mail,
          contact: fullPhone,
        },
        theme: { color: "#9739A8" },
        handler: async (response) => {
          setStatusMessage(DONATION_COPY.verifying);
          try {
            const confirmed = await confirmPayment(response);
            setStatusTone("ok");
            setStatusMessage(
              recurring ? DONATION_COPY.recurringSetUp : DONATION_COPY.paymentSuccess,
            );
            setSuccessReceipt({
              ...confirmed,
              donorName: name,
              currencySymbol: currencyMeta.symbol,
              date: new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              email: mail,
              paymentId: response.razorpay_payment_id,
              recurringEvery: recurring?.every,
            });
            setFullName("");
            setMobile("");
            setEmail("");
            setTaxId("");
            setAddress("");
            setCity("");
            setMessage("");
            setTermsAccepted(false);
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
    cause,
    causes: DONATION_CAUSES,
    frequency: effectiveFrequency,
    frequencies: DONATION_FREQUENCY_OPTIONS,
    setFrequency,
    recurringAvailable,
    recurring,
    editingAmount,
    countryCode,
    phoneCountryCode,
    phoneCountryDial: phoneCountry.dial,
    isIndia,
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
    showLargeAmountHint: currency === "INR" && usingCustom && isCroreOrAbove(customDigits),
    setCurrency,
    setCountryCode,
    setPhoneCountryCode,
    setFullName,
    setMobile,
    setEmail,
    setTaxId,
    setAddress,
    setCity,
    setMessage,
    setTermsAccepted,
    setUsingCustom,
    setCause,
    pickPreset,
    setCustomFromInput,
    goToDetails,
    goBackToAmount,
    startEditAmount,
    commitAmountEdit,
    cancelAmountEdit,
    paySecurely,
    successReceipt,
    setSuccessReceipt,
    closeReceiptModal,
  };
}

export type DonationFormState = ReturnType<typeof useDonationForm>;


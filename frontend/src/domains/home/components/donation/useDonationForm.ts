"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CTA_PRESET_AMOUNTS,
  DONATION_COPY,
  isCtaPresetAmount,
} from "@/domains/home/constants/donation";
import {
  amountDigitsFromDisplay,
  createDonationOrder,
  DONATE_CHECKOUT_EVENT,
  type DonateCheckoutDetail,
  formatINR,
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

export function useDonationForm(defaultPreset: string = CTA_PRESET_AMOUNTS[2]) {
  const [step, setStep] = useState<DonationStep>(1);
  const [selectedAmount, setSelectedAmount] = useState(defaultPreset);
  const [customDigits, setCustomDigits] = useState("");
  const [usingCustom, setUsingCustom] = useState(false);
  const [editingAmount, setEditingAmount] = useState(false);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [taxId, setTaxId] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"ok" | "error" | null>(null);

  const chosenAmount = useMemo(() => {
    if (usingCustom) return formatINR(customDigits) || selectedAmount;
    return selectedAmount;
  }, [usingCustom, customDigits, selectedAmount]);

  const applyExternalAmount = useCallback((amount: string) => {
    const trimmed = amount.trim();
    const digits = toAmountDigits(trimmed);

    if (isCtaPresetAmount(trimmed)) {
      setSelectedAmount(trimmed);
      setUsingCustom(false);
      setCustomDigits("");
    } else if (digits) {
      setUsingCustom(true);
      setCustomDigits(normalizeAmountDigits(digits));
    } else {
      return;
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

  const pickPreset = (amount: string) => {
    setSelectedAmount(amount);
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
    setCustomDigits(toAmountDigits(chosenAmount));
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
    const phone = mobile.trim();
    const mail = email.trim();
    const panOrAadhaar = taxId.trim().replace(/\s/g, "").toUpperCase();
    const amount = amountDigitsFromDisplay(chosenAmount);

    if (!name || !phone || !mail || !amount) {
      setStatusTone("error");
      setStatusMessage(DONATION_COPY.fillRequired);
      return;
    }

    if (!isValidTaxId(panOrAadhaar)) {
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
        phone,
        email: mail,
        amount,
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
          contact: phone,
        },
        theme: { color: "#9739A8" },
        handler: async (response) => {
          setStatusMessage(DONATION_COPY.verifying);
          try {
            await verifyDonationPayment({
              donorId: order.donorId,
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
    chosenAmount,
    selectedAmount,
    customDigits,
    usingCustom,
    editingAmount,
    fullName,
    mobile,
    email,
    taxId,
    isPaying,
    statusMessage,
    statusTone,
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

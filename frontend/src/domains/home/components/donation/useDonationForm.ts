"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CTA_PRESET_AMOUNTS,
  isCtaPresetAmount,
} from "@/domains/home/constants/donation";
import {
  DONATE_CHECKOUT_EVENT,
  type DonateCheckoutDetail,
  formatINR,
  normalizeAmountDigits,
  toAmountDigits,
} from "@/domains/home/lib/donation";

export type DonationStep = 1 | 2;

export function useDonationForm(defaultPreset: string = CTA_PRESET_AMOUNTS[2]) {
  const [step, setStep] = useState<DonationStep>(1);
  const [selectedAmount, setSelectedAmount] = useState(defaultPreset);
  const [customDigits, setCustomDigits] = useState("");
  const [usingCustom, setUsingCustom] = useState(false);
  const [editingAmount, setEditingAmount] = useState(false);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

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
    setFullName,
    setMobile,
    setEmail,
    setUsingCustom,
    pickPreset,
    setCustomFromInput,
    goToDetails,
    startEditAmount,
    commitAmountEdit,
    cancelAmountEdit,
  };
}

export type DonationFormState = ReturnType<typeof useDonationForm>;

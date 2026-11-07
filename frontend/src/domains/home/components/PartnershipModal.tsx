"use client";

import { useState, useCallback, useRef, useEffect, type FormEvent } from "react";
import { PARTNERSHIP_TYPES } from "@/domains/home/constants/partnershipOptions";
import { submitPartnershipInquiry } from "@/domains/home/lib/partnershipInquiries";
import { ModalShell, ModalSuccess } from "@/shared/components/modal";
import {
  FormInput,
  FormTextarea,
  FormSelect,
  PhoneInputField,
  SubmitButton,
} from "@/shared/components/form";

interface PartnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PartnershipFormData {
  yourName: string;
  orgName: string;
  phone: string;
  partnershipType: string;
  proposal: string;
}

const INITIAL_FORM_STATE: PartnershipFormData = {
  yourName: "",
  orgName: "",
  phone: "",
  partnershipType: "",
  proposal: "",
};

export default function PartnershipModal({ isOpen, onClose }: PartnershipModalProps) {
  const [formData, setFormData] = useState<PartnershipFormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Cancels an in-flight request if the modal is closed or unmounted
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => () => abortRef.current?.abort(), []);

  const handleClose = useCallback(() => {
    abortRef.current?.abort();
    onClose();
    setTimeout(() => {
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
      setSubmitError("");
      setIsSubmitted(false);
      setIsSubmitting(false);
    }, 250);
  }, [onClose]);

  const updateField = <K extends keyof PartnershipFormData>(
    field: K,
    value: PartnershipFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (submitError) setSubmitError("");
  };

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!formData.yourName.trim()) errs.yourName = "Name is required";
    if (!formData.orgName.trim()) errs.orgName = "Organisation name is required";
    if (!formData.phone.trim()) {
      errs.phone = "Mobile number is required";
    } else if (!/^(\+?\d[\d\s-]{6,15})$/.test(formData.phone.trim())) {
      errs.phone = "Please enter a valid mobile number";
    }
    if (!formData.partnershipType) {
      errs.partnershipType = "Please select a partnership type";
    }
    return errs;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitError("");
    setIsSubmitting(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await submitPartnershipInquiry(
        {
          yourName: formData.yourName,
          orgName: formData.orgName,
          phone: formData.phone,
          partnershipType: formData.partnershipType,
          proposal: formData.proposal,
        },
        controller.signal,
      );
      setIsSubmitted(true);
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      setSubmitError(
        err instanceof Error && err.message
          ? err.message
          : "Unable to send your enquiry. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={handleClose}
      eyebrow="BUILD INFRASTRUCTURE"
      title="Initiate a Partnership"
      subtitle="Let's explore how we can work together."
    >
      {isSubmitted ? (
        <ModalSuccess
          title="Partnership Enquiry Sent!"
          message={
            <p>
              Thank you, <span className="font-semibold text-[#111827]">{formData.yourName}</span> from{" "}
              <span className="font-semibold text-[#111827]">{formData.orgName}</span>. We have
              received your inquiry for a{" "}
              <span className="font-semibold text-[#9739A8]">{formData.partnershipType}</span>. Our
              strategic partnerships team will get in touch with you shortly.
            </p>
          }
          onClose={handleClose}
        />
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Your Name"
              required
              placeholder="Enter your full name"
              value={formData.yourName}
              onChange={(e) => updateField("yourName", e.target.value)}
              error={errors.yourName}
            />
            <FormInput
              label="Organisation Name"
              required
              placeholder="Enter your organisation name"
              value={formData.orgName}
              onChange={(e) => updateField("orgName", e.target.value)}
              error={errors.orgName}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PhoneInputField
              label="Mobile Number"
              required
              value={formData.phone}
              onChange={(val) => updateField("phone", val)}
              error={errors.phone}
            />
            <FormSelect
              label="Partnership Type"
              required
              placeholder="Select a partnership type"
              value={formData.partnershipType}
              options={PARTNERSHIP_TYPES}
              onChange={(val) => updateField("partnershipType", val)}
              error={errors.partnershipType}
            />
          </div>

          <FormTextarea
            label="Tell Us About Your Proposal"
            placeholder="Share your proposal, goals, or areas of collaboration..."
            rows={4}
            value={formData.proposal}
            onChange={(e) => updateField("proposal", e.target.value)}
          />

          {submitError && (
            <p role="alert" className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </p>
          )}

          <SubmitButton label="Send Partnership Enquiry" isSubmitting={isSubmitting} />
        </form>
      )}
    </ModalShell>
  );
}
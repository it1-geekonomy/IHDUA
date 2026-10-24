"use client";

import { useState, useCallback, type FormEvent } from "react";
import { VOLUNTEER_AREAS_OF_INTEREST } from "@/domains/home/constants/volunteerOptions";
import { ModalShell, ModalSuccess } from "@/shared/components/modal";
import {
  FormInput,
  FormTextarea,
  FormSelect,
  PhoneInputField,
  ResumeDropzone,
  SubmitButton,
} from "@/shared/components/form";

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VolunteerFormData {
  fullName: string;
  email: string;
  phone: string;
  areaOfInterest: string;
  skills: string;
  resumeFile: File | null;
}

const INITIAL_FORM_STATE: VolunteerFormData = {
  fullName: "",
  email: "",
  phone: "",
  areaOfInterest: "",
  skills: "",
  resumeFile: null,
};

export default function VolunteerModal({ isOpen, onClose }: VolunteerModalProps) {
  const [formData, setFormData] = useState<VolunteerFormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
      setIsSubmitted(false);
      setIsSubmitting(false);
    }, 250);
  }, [onClose]);

  const updateField = <K extends keyof VolunteerFormData>(field: K, value: VolunteerFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    if (!formData.email.trim()) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      errs.phone = "Mobile number is required";
    } else if (!/^(\+?\d[\d\s-]{6,15})$/.test(formData.phone.trim())) {
      errs.phone = "Please enter a valid phone number";
    }
    if (!formData.areaOfInterest) {
      errs.areaOfInterest = "Please select an area of interest";
    }
    if (!formData.resumeFile) {
      errs.resumeFile = "Please attach your updated resume";
    }
    return errs;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={handleClose}
      eyebrow="SEND US A MESSAGE"
      title="Apply as a volunteer"
      subtitle="Share your skills and time to support rural communities."
    >
      {isSubmitted ? (
        <ModalSuccess
          title="Application Submitted!"
          message={
            <p>
              Thank you, <span className="font-semibold text-[#111827]">{formData.fullName}</span>. We have
              received your volunteer application for{" "}
              <span className="font-semibold text-[#9739A8]">{formData.areaOfInterest}</span>. Our team
              will review your profile and reach out to you at{" "}
              <span className="font-semibold text-[#111827]">{formData.email}</span> shortly.
            </p>
          }
          onClose={handleClose}
        />
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Full Name"
              required
              placeholder="Your name"
              value={formData.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              error={errors.fullName}
            />
            <FormInput
              label="Email Address"
              required
              type="email"
              placeholder="yourmailaddress@gmail.com"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              error={errors.email}
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
              label="Area of Interest"
              required
              placeholder="Select a subject"
              value={formData.areaOfInterest}
              options={VOLUNTEER_AREAS_OF_INTEREST}
              onChange={(val) => updateField("areaOfInterest", val)}
              error={errors.areaOfInterest}
            />
          </div>

          <FormTextarea
            label="Skills / Experience"
            placeholder="—"
            rows={3}
            value={formData.skills}
            onChange={(e) => updateField("skills", e.target.value)}
          />

          <ResumeDropzone
            label="Updated Resume"
            required
            file={formData.resumeFile}
            onFileChange={(file) => updateField("resumeFile", file)}
            error={errors.resumeFile}
          />

          <SubmitButton label="Submit" isSubmitting={isSubmitting} />
        </form>
      )}
    </ModalShell>
  );
}

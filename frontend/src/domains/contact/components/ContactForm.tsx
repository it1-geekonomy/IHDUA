"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { ChevronDown, Search, Send } from "lucide-react";
import Typography from "@/lib/Typography";
import { DONATION_COUNTRIES, type DonationCountry } from "@/domains/home/constants/donationCountries";
import { CountryFlag } from "@/domains/home/components/donation/CountryFlag";
import { FIELD_CLASS, SUBJECTS } from "../const/contactsection";

// ===== Constants & validation =====
const MESSAGE_MAX = 500;
const ERROR_BORDER = "!border-[#D93025]";

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

type FieldName = "name" | "email" | "phone" | "subject" | "message";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

type FormErrors = Partial<Record<FieldName, string>>;

const EMPTY_VALUES: FormValues = { name: "", email: "", phone: "", subject: "", message: "" };

// Order matters: used to focus the first invalid field
const FIELD_ORDER: FieldName[] = ["name", "email", "phone", "subject", "message"];
const FIELD_IDS: Record<FieldName, string> = {
  name: "name",
  email: "email",
  phone: "mobile",
  subject: "subject",
  message: "message",
};

function validateField(field: FieldName, values: FormValues, country: DonationCountry): string {
  const value = values[field].trim();

  switch (field) {
    case "name":
      return value ? "" : "Please enter your full name.";

    case "email":
      if (!value) return "Please enter your email address.";
      if (!EMAIL_RE.test(value)) return "Enter a valid email address, e.g. name@example.com.";
      return "";

    case "phone":
      if (!value) return "Please enter your mobile number.";
      if (country.code === "IN") {
        if (!/^[6-9]\d{9}$/.test(value)) {
          return "Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.";
        }
      } else if (value.length < 6 || value.length > 15) {
        return "Enter a valid mobile number (6 to 15 digits).";
      }
      return "";

    case "subject":
      return value ? "" : "Please select a subject.";

    case "message":
      return value ? "" : "Please enter your message.";

    default:
      return "";
  }
}

// Replace with your real API call
async function sendMessage(payload: Record<string, string>): Promise<void> {
  console.log(payload);
  await new Promise((resolve) => setTimeout(resolve, 800));
}

// ===== Helpers =====
// Closes a dropdown when the user clicks outside the returned ref's element
function useClickOutside<T extends HTMLElement>(setOpen: (open: boolean) => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setOpen]);
  return ref;
}

function Field({
  id,
  label,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block cursor-pointer">
        <Typography as="span" variant="body-sm" className="font-figtree font-medium text-[#00191B]">
          {label}
        </Typography>
      </label>
      {children}
      {(error || hint) && (
        <div className="mt-1.5 flex items-start justify-between gap-3">
          {error ? (
            <p id={`${id}-error`} role="alert">
              <Typography as="span" variant="body-sm" className="font-figtree text-[#D93025]">
                {error}
              </Typography>
            </p>
          ) : (
            <span />
          )}
          {hint}
        </div>
      )}
    </div>
  );
}

// ===== Phone =====
interface PhoneFieldProps {
  country: DonationCountry;
  onCountryChange: (country: DonationCountry) => void;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
}

function PhoneField({ country, onCountryChange, value, onChange, onBlur, error }: PhoneFieldProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useClickOutside<HTMLDivElement>(setOpen);

  const query = search.toLowerCase();
  const countries = DONATION_COUNTRIES.filter(
    (c) => c.name.toLowerCase().includes(query) || c.dial.includes(search)
  );

  // Digits only (also handles paste)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value.replace(/\D/g, ""));
  };

  return (
    <Field id="mobile" label="Mobile Number*" error={error}>
      <div
        ref={ref}
        className={`relative flex items-center border bg-[#FDFBFD] px-4 py-3 font-figtree text-sm text-[#00191B] focus-within:border-[#9739A8] ${
          error ? "border-[#D93025]" : "border-[#E5DDF3]"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex shrink-0 cursor-pointer items-center gap-1.5 focus:outline-none"
          aria-label={`Select country code, currently ${country.name} ${country.dial}`}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <CountryFlag countryCode={country.code} className="h-3.5 w-5 rounded-[1px] object-cover" />
          <ChevronDown
            className={`size-3.5 text-[#5F6C6D] transition-transform ${open ? "rotate-180" : ""}`}
          />
          <span className="font-figtree text-sm text-[#00191B]">{country.dial}</span>
        </button>

        <input
          id="mobile"
          name="mobile"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={country.code === "IN" ? 10 : 15}
          placeholder="1234567890"
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={error ? "mobile-error" : undefined}
          className="min-w-0 flex-1 bg-transparent pl-3 text-sm text-[#00191B] placeholder:text-[#8A9596] focus:outline-none"
        />

        {open && (
          <div className="absolute left-0 top-full z-30 mt-1 max-h-60 w-full overflow-hidden rounded-sm border border-[#D9D3C9] bg-white shadow-lg">
            <div className="flex items-center gap-2 border-b border-[#EAE6DF] bg-[#FAF8F4] p-2">
              <Search className="size-3.5 text-[#8A847A]" />
              <input
                type="text"
                placeholder="Search country"
                aria-label="Search country"
                className="w-full bg-transparent p-1 font-figtree text-xs text-[#00191B] outline-none placeholder:text-[#8A847A]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto py-1">
              {countries.length === 0 && (
                <div className="p-3 text-center font-figtree text-xs text-[#8A847A]">
                  No countries found.
                </div>
              )}
              {countries.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onCountryChange(c);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left font-figtree text-xs transition-colors hover:bg-[#FAF8F4] ${
                    country.code === c.code ? "bg-[#FAF8F4] font-semibold text-[#9739A8]" : "text-[#00191B]"
                  }`}
                >
                  <CountryFlag countryCode={c.code} className="h-3 w-4.5 shrink-0 rounded-[1px] object-cover" />
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="shrink-0 text-[#8A847A]">{c.dial}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Field>
  );
}

// ===== Subject =====
interface SubjectFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

function SubjectField({ value, onChange, error }: SubjectFieldProps) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(setOpen);

  return (
    <Field id="subject" label="Subject*" error={error}>
      <div ref={ref} className="relative">
        <button
          id="subject"
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`${FIELD_CLASS} ${error ? ERROR_BORDER : ""} flex cursor-pointer items-center justify-between pr-10 text-left`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={!!error}
          aria-describedby={error ? "subject-error" : undefined}
        >
          {/* Colour is set on the span so the placeholder matches the other inputs' placeholders */}
          <span className={`truncate ${value ? "text-[#00191B]" : "text-[#8A9596]"}`}>
            {value || "Select a subject"}
          </span>
        </button>
        <ChevronDown
          className={`pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#5F6C6D] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />

        {open && (
          <div
            role="listbox"
            className="absolute left-0 top-full z-30 mt-1 max-h-60 w-full overflow-y-auto rounded-sm border border-[#E5DDF3] bg-white py-1 shadow-lg"
          >
            {SUBJECTS.map((s) => (
              <button
                key={s}
                type="button"
                role="option"
                aria-selected={value === s}
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center px-4 py-2.5 text-left font-figtree text-sm transition-colors hover:bg-[#FAF8F4] hover:text-[#9739A8] ${
                  value === s ? "bg-[#FAF8F4] font-semibold text-[#9739A8]" : "text-[#00191B]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </Field>
  );
}

// ===== Form =====
export default function ContactForm() {
  const defaultCountry = (): DonationCountry =>
    DONATION_COUNTRIES.find((c) => c.code === "IN") || DONATION_COUNTRIES[0];

  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [country, setCountry] = useState<DonationCountry>(defaultCountry);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const setError = (field: FieldName, message: string) =>
    setErrors((prev) => ({ ...prev, [field]: message || undefined }));

  // Update a value; if the field already shows an error, re-check it live.
  // Also hides the success/error message once the user starts typing again.
  const handleChange = (field: FieldName, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (status === "success" || status === "error") setStatus("idle");
    if (errors[field]) setError(field, validateField(field, next, country));
  };

  const handleBlur = (field: FieldName) => {
    setError(field, validateField(field, values, country));
  };

  const handleCountryChange = (next: DonationCountry) => {
    const maxDigits = next.code === "IN" ? 10 : 15;
    const phone = values.phone.slice(0, maxDigits);
    setCountry(next);
    setValues((prev) => ({ ...prev, phone }));
    if (phone) setError("phone", validateField("phone", { ...values, phone }, next));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    const nextErrors: FormErrors = {};
    FIELD_ORDER.forEach((field) => {
      const message = validateField(field, values, country);
      if (message) nextErrors[field] = message;
    });
    setErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      document.getElementById(FIELD_IDS[firstInvalid])?.focus();
      return;
    }

    setStatus("submitting");
    try {
      await sendMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        countryCode: country.code,
        dialCode: country.dial,
        mobile: values.phone,
        subject: values.subject,
        message: values.message.trim(),
      });
      setValues(EMPTY_VALUES);
      setCountry(defaultCountry());
      setErrors({});
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-6 bg-[#F5F0FF] p-4 sm:p-6"
    >
      <div>
        <Typography variant="caption" className="font-bold font-figtree uppercase text-[#9739A8]">
          Send us a message
        </Typography>
        <Typography variant="h3" as="h3" className="mt-2 font-lora font-normal text-[#00191B]">
          Get in Touch
        </Typography>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2">
        <Field id="name" label="Full Name*" error={errors.name}>
          <input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`${FIELD_CLASS} ${errors.name ? ERROR_BORDER : ""} placeholder:text-[#8A9596]`}
          />
        </Field>

        <Field id="email" label="Email Address*" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="abc@gmail.com"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`${FIELD_CLASS} ${errors.email ? ERROR_BORDER : ""} placeholder:text-[#8A9596]`}
          />
        </Field>

        <PhoneField
          country={country}
          onCountryChange={handleCountryChange}
          value={values.phone}
          onChange={(v) => handleChange("phone", v)}
          onBlur={() => handleBlur("phone")}
          error={errors.phone}
        />

        <SubjectField
          value={values.subject}
          onChange={(v) => {
            handleChange("subject", v);
            setError("subject", "");
          }}
          error={errors.subject}
        />
      </div>

      <Field
        id="message"
        label="Your Message*"
        error={errors.message}
        className="flex flex-1 flex-col"
        hint={
          <Typography
            as="span"
            variant="caption"
            className="ml-auto shrink-0 font-figtree text-[#5F6C6D]"
          >
            {values.message.length}/{MESSAGE_MAX}
          </Typography>
        }
      >
        <textarea
          id="message"
          name="message"
          maxLength={MESSAGE_MAX}
          placeholder="How can we help you?"
          value={values.message}
          onChange={(e) => handleChange("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${FIELD_CLASS} ${errors.message ? ERROR_BORDER : ""} min-h-35 flex-1 resize-none placeholder:text-[#8A9596]`}
        />
      </Field>

      {status === "error" && (
        <div role="alert" className="border border-[#D93025] bg-[#FDECEA] px-4 py-3">
          <Typography variant="body-sm" className="font-figtree text-[#D93025]">
            Something went wrong while sending your message. Please try again in a moment.
          </Typography>
        </div>
      )}

      {/* Below 1024px: wider and centered. From lg: full width */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex w-full max-w-xs cursor-pointer items-center justify-center gap-2 self-center bg-[#FFD638] px-8 py-3.5 transition-colors hover:bg-[#F5C400] disabled:cursor-not-allowed disabled:opacity-70 sm:max-w-sm lg:max-w-none lg:self-stretch lg:py-4"
      >
        <Typography variant="body-sm" className="font-figtree font-medium text-black">
          {status === "submitting" ? "Sending..." : "Send Message"}
        </Typography>
        <Send className="size-4 text-black" />
      </button>

      {/* Success message: only below the Send Message button */}
      {status === "success" && (
        <p role="status" aria-live="polite" className="-mt-2 text-center">
          <Typography as="span" variant="body-sm" className="font-figtree text-[#1E8E3E]">
            Message sent successfully. Our team will get back to you shortly.
          </Typography>
        </p>
      )}
    </form>
  );
}
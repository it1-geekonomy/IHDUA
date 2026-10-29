"use client";

import { useState, type FormEvent } from "react";
import Typography from "@/lib/Typography";
import { cn } from "@/lib/utils";
import { subscribeNewsletter } from "@/domains/admin/lib/api";
import {
  NEWSLETTER_DEFAULTS,
  NEWSLETTER_GLOW_ID,
  WAVE,
  WAVE_PATHS,
  type NewsletterStatus,
} from "@/shared/constants/newsletter";

export interface NewsletterSectionProps {
  label?: string;
  heading?: readonly string[];
  placeholder?: string;
  buttonLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  onSubscribe?: (email: string) => void | Promise<void>;
  className?: string;
}

export default function NewsletterSection({
  label = NEWSLETTER_DEFAULTS.label,
  heading = NEWSLETTER_DEFAULTS.heading,
  placeholder = NEWSLETTER_DEFAULTS.placeholder,
  buttonLabel = NEWSLETTER_DEFAULTS.buttonLabel,
  successMessage = NEWSLETTER_DEFAULTS.successMessage,
  errorMessage = NEWSLETTER_DEFAULTS.errorMessage,
  onSubscribe,
  className,
}: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<NewsletterStatus>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading" || !email.trim()) return;

    setStatus("loading");
    try {
      if (onSubscribe) {
        await onSubscribe(email.trim());
      } else {
        await subscribeNewsletter(email.trim());
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      aria-label={label}
      className={cn(
        "w-full bg-[#FFFFFF]",
        "px-[clamp(1rem,-1.0769rem_+_9.2308vw,10rem)] py-8 sm:py-10 lg:py-14",
        className,
      )}
    >
      <div className="relative isolate overflow-hidden bg-[#9739A8] px-5 pt-6 pb-6 sm:px-8 sm:py-12 lg:px-10 lg:py-14 xl:px-16">
        <svg
          aria-hidden
          viewBox={`0 0 ${WAVE.width} ${WAVE.height}`}
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        >
          <defs>
            <radialGradient id={NEWSLETTER_GLOW_ID} cx="42%" cy="50%" r="35%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${NEWSLETTER_GLOW_ID})`} />
          <g fill="none" stroke="#FFFFFF" strokeOpacity="0.16" strokeWidth="1">
            {WAVE_PATHS.map((d, index) => (
              <path key={index} d={d} vectorEffect="non-scaling-stroke" />
            ))}
          </g>
        </svg>

        <div className="relative flex flex-col gap-6 md:gap-8 lg:flex-row lg:items-center lg:gap-10">
          <div className="flex flex-col items-center gap-2 text-center sm:gap-3 md:items-start md:text-left lg:shrink-0">
            <Typography
              variant="caption"
              className="m-0 font-figtree font-bold uppercase tracking-[0.08em] text-[#FFD638]"
            >
              {label}
            </Typography>

            <Typography
              variant="body-xl"
              className="m-0 font-figtree font-medium leading-snug text-white"
            >
              {heading.map((line) => (
                <span
                  key={line}
                  className="max-sm:block sm:inline sm:whitespace-nowrap lg:block"
                >
                  {line}{" "}
                </span>
              ))}
            </Typography>
          </div>

          <div className="w-full lg:ml-auto lg:max-w-[34rem] lg:flex-1 xl:max-w-[40rem] 2xl:max-w-[46rem]">
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex w-full max-w-[20rem] flex-col gap-2.5 sm:max-w-[34rem] sm:flex-row sm:items-stretch sm:gap-3 md:mx-0 lg:max-w-none"
            >
              <Typography
                variant="body-lg"
                className="m-0 w-full min-w-0 font-figtree font-normal max-sm:!text-sm sm:flex-1"
              >
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  aria-label={placeholder}
                  placeholder={placeholder}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (status !== "idle" && status !== "loading") setStatus("idle");
                  }}
                  className="block h-10 w-full min-w-0 rounded-sm border-0 bg-[#AE63BC] px-3 text-white outline-none transition-shadow [font:inherit] placeholder:text-white/70 focus-visible:ring-2 focus-visible:ring-[#FFD638] sm:h-12 sm:px-4 lg:h-[3.25rem]"
                />
              </Typography>

              <Typography
                variant="body-lg"
                className="m-0 self-center font-figtree font-medium max-sm:!text-sm sm:flex-none sm:self-auto"
              >
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-[#FFD638] px-4 text-[#00191B] transition-[filter,transform] [font:inherit] hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:h-12 sm:gap-3 sm:px-6 lg:h-[3.25rem]"
                >
                  {buttonLabel}
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  >
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                </button>
              </Typography>
            </form>

            {(status === "success" || status === "error") && (
              <Typography
                variant="caption"
                className={cn(
                  "m-0 mt-2 text-center font-figtree font-medium md:text-left",
                  status === "success" ? "text-white" : "text-[#FFD638]",
                )}
              >
                <span role="status" aria-live="polite">
                  {status === "success" ? successMessage : errorMessage}
                </span>
              </Typography>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
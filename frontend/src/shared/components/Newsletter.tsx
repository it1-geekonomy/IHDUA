"use client";

import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";
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
  subscribedLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  onSubscribe?: (email: string) => void | Promise<void>;
  className?: string;
}

const RESET_MS = 5000; // success state returns to idle after this

/* ---------- Keyframes (injected via <style>, no globals.css needed) ---------- */
const NEWSLETTER_KEYFRAMES = `
@keyframes nl-rise {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes nl-label {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes nl-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(2px); }
}
@keyframes nl-float {
  0%, 100% { transform: translate(0, 0); }
  50%      { transform: translate(2px, -2px); }
}
@keyframes nl-takeoff {
  0%   { transform: translate(0, 0); opacity: 1; }
  45%  { transform: translate(18px, -18px); opacity: 0; }
  46%  { transform: translate(-18px, 18px); opacity: 0; }
  100% { transform: translate(0, 0); opacity: 1; }
}
@keyframes nl-shine {
  0%   { transform: translateX(-160%) skewX(-20deg); }
  30%  { transform: translateX(420%) skewX(-20deg); }
  100% { transform: translateX(420%) skewX(-20deg); }
}
@keyframes nl-wipe {
  from { clip-path: circle(0% at 88% 50%); }
  to   { clip-path: circle(150% at 88% 50%); }
}
@keyframes nl-pop {
  0%   { transform: scale(0.5) rotate(-25deg); opacity: 0; }
  70%  { transform: scale(1.12) rotate(4deg); opacity: 1; }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}
@keyframes nl-draw { to { stroke-dashoffset: 0; } }
@keyframes nl-ring {
  0%   { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.25, 1.8); opacity: 0; }
}
@keyframes nl-progress {
  0%   { transform: scaleX(0); }
  70%  { transform: scaleX(0.85); }
  100% { transform: scaleX(0.95); }
}
@keyframes nl-drift {
  0%, 100% { transform: translateX(0); }
  50%      { transform: translateX(-2%); }
}
@keyframes nl-wave-glow {
  0%   { stroke-opacity: 0.16; }
  35%  { stroke-opacity: 0.55; }
  100% { stroke-opacity: 0.16; }
}
@media (prefers-reduced-motion: reduce) {
  .nl-root *, .nl-root *::before, .nl-root *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    animation-delay: 0s !important;
  }
}
`;

export default function NewsletterSection({
  label = NEWSLETTER_DEFAULTS.label,
  heading = NEWSLETTER_DEFAULTS.heading,
  placeholder = NEWSLETTER_DEFAULTS.placeholder,
  buttonLabel = NEWSLETTER_DEFAULTS.buttonLabel,
  subscribedLabel = "Subscribed",
  successMessage = NEWSLETTER_DEFAULTS.successMessage,
  errorMessage = NEWSLETTER_DEFAULTS.errorMessage,
  onSubscribe,
  className,
}: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<NewsletterStatus>("idle");
  const bannerRef = useRef<HTMLDivElement>(null);

  const isIdle = status === "idle";
  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  // Return to idle automatically after success
  useEffect(() => {
    if (!isSuccess) return;
    const t = setTimeout(() => setStatus("idle"), RESET_MS);
    return () => clearTimeout(t);
  }, [isSuccess]);

  // Cursor spotlight (writes CSS vars directly, so no re-renders)
  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = bannerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

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
        "nl-root w-full bg-[#FFFFFF]",
        "px-[clamp(1rem,-1.0769rem_+_9.2308vw,10rem)] py-8 sm:py-10 lg:py-14",
        className,
      )}
    >
      <style>{NEWSLETTER_KEYFRAMES}</style>

      <div
        ref={bannerRef}
        onPointerMove={handlePointerMove}
        className="group/banner relative isolate overflow-hidden bg-[#9739A8] px-5 pt-6 pb-6 sm:px-8 sm:py-12 lg:px-10 lg:py-14 xl:px-16"
      >
        {/* Background waves: slow drift, brighten once on success */}
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
          <g className="animate-[nl-drift_14s_ease-in-out_infinite]">
            <g
              key={isSuccess ? "glow" : "calm"}
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity="0.16"
              strokeWidth="1"
              className={cn(isSuccess && "animate-[nl-wave-glow_1.8s_ease-out]")}
            >
              {WAVE_PATHS.map((d, index) => (
                <path key={index} d={d} vectorEffect="non-scaling-stroke" />
              ))}
            </g>
          </g>
        </svg>

        {/* Cursor spotlight (desktop hover only) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-[5] opacity-0 transition-opacity duration-500 group-hover/banner:opacity-100"
          style={{
            background:
              "radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.14), transparent 65%)",
          }}
        />

        <div className="relative flex flex-col gap-6 md:gap-8 lg:flex-row lg:items-center lg:gap-10">
          {/* Left: label + heading, static (fades up once on mount) */}
          <div className="flex animate-[nl-rise_0.6s_ease-out_both] flex-col items-center gap-2 text-center sm:gap-3 md:items-start md:text-left lg:shrink-0">
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

          {/* Right: form + message */}
          <div className="w-full animate-[nl-rise_0.7s_0.15s_cubic-bezier(0.22,1,0.36,1)_both] lg:ml-auto lg:max-w-[34rem] lg:flex-1 xl:max-w-[40rem] 2xl:max-w-[46rem]">
            <form
              onSubmit={handleSubmit}
              className={cn(
                "mx-auto flex w-full max-w-[20rem] flex-col gap-2.5 sm:max-w-[34rem] sm:flex-row sm:items-stretch sm:gap-3 md:mx-0 lg:max-w-none",
                isError && "animate-[nl-shake_0.45s_ease-in-out]",
              )}
            >
              {/* Input with animated focus underline (only <span> inside <p>) */}
              <Typography
                variant="body-lg"
                className="m-0 w-full min-w-0 font-figtree font-normal max-sm:!text-sm sm:flex-1"
              >
                <span className="relative block overflow-hidden rounded-sm">
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
                    className={cn(
                      "peer block h-10 w-full min-w-0 rounded-sm border-0 bg-[#AE63BC] px-3 text-white outline-none transition-[background-color,box-shadow] duration-300 [font:inherit] placeholder:text-white/70 placeholder:transition-all placeholder:duration-300 focus:bg-[#B877C5] focus:placeholder:translate-x-1 focus:placeholder:opacity-50 sm:h-12 sm:px-4 lg:h-[3.25rem]",
                      isError && "shadow-[inset_0_0_0_2px_#FFD638]",
                    )}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-[#FFD638] transition-transform duration-500 ease-out peer-focus:scale-x-100"
                  />
                </span>
              </Typography>

              {/* Button (relative wrapper keeps the rings anchored to the button) */}
              <Typography
                variant="body-lg"
                className="m-0 self-center font-figtree font-medium max-sm:!text-sm sm:flex-none sm:self-auto"
              >
                <span className="relative inline-flex">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-sm bg-[#FFD638] px-4 text-[#00191B] transition-[filter,transform] duration-300 [font:inherit] hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-[0.97] disabled:cursor-not-allowed sm:h-12 sm:gap-3 sm:px-6 lg:h-[3.25rem]"
                  >
                    {/* Success: white fill wipes out from the icon */}
                    {isSuccess && (
                      <span
                        aria-hidden
                        className="absolute inset-0 bg-white"
                        style={{ animation: "nl-wipe 0.6s cubic-bezier(0.22,1,0.36,1) forwards" }}
                      />
                    )}

                    {/* Idle: periodic light sweep */}
                    {isIdle && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-[nl-shine_5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent motion-reduce:hidden"
                      />
                    )}

                    {/* Loading: progress bar crawling along the bottom */}
                    {isLoading && (
                      <span
                        aria-hidden
                        className="absolute bottom-0 left-0 h-[3px] w-full origin-left animate-[nl-progress_2.5s_ease-out_forwards] bg-[#00191B]/60"
                      />
                    )}

                    {/* Label: "Subscribed" after success, otherwise buttonLabel */}
                    <span
                      key={isSuccess ? "subscribed" : "default"}
                      className="relative z-10 animate-[nl-label_0.35s_ease-out_both]"
                    >
                      {isSuccess ? subscribedLabel : buttonLabel}
                    </span>

                    {/* Icon */}
                    <span className="relative z-10 flex h-4 w-4 items-center justify-center sm:h-[1.125rem] sm:w-[1.125rem]">
                      {isSuccess ? (
                        <svg
                          aria-hidden
                          viewBox="0 0 24 24"
                          className="h-full w-full animate-[nl-pop_0.5s_0.15s_ease-out_both] text-[#9739A8]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            strokeDasharray="63"
                            strokeDashoffset="63"
                            style={{ animation: "nl-draw 0.55s 0.2s ease-out forwards" }}
                          />
                          <path
                            d="M7.5 12.5l3 3 6-6.5"
                            strokeDasharray="18"
                            strokeDashoffset="18"
                            style={{ animation: "nl-draw 0.35s 0.6s ease-out forwards" }}
                          />
                        </svg>
                      ) : (
                        <svg
                          aria-hidden
                          viewBox="0 0 24 24"
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-300 sm:h-4 sm:w-4",
                            isLoading
                              ? "animate-[nl-takeoff_0.9s_ease-in-out_infinite]"
                              : "animate-[nl-float_3s_ease-in-out_infinite] group-hover:-translate-y-0.5 group-hover:translate-x-1",
                          )}
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        >
                          <polygon points="3 11 22 2 13 21 11 13 3 11" />
                        </svg>
                      )}
                    </span>
                  </button>

                  {/* Success: two expanding rings, anchored to the wrapper */}
                  {isSuccess && (
                    <>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-sm border-2 border-white/80 motion-reduce:hidden"
                        style={{ animation: "nl-ring 0.9s ease-out forwards" }}
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-sm border-2 border-[#FFD638]/80 opacity-0 motion-reduce:hidden"
                        style={{ animation: "nl-ring 0.9s 0.18s ease-out both" }}
                      />
                    </>
                  )}
                </span>
              </Typography>
            </form>

            {/* Status message: same width as the form, centered below 768px */}
            {(isSuccess || isError) && (
              <div className="mx-auto mt-3 w-full max-w-[20rem] sm:max-w-[34rem] md:mx-0 md:mt-2 lg:max-w-none">
                <Typography
                  variant="caption"
                  className={cn(
                    "m-0 animate-[nl-rise_0.4s_0.2s_ease-out_both] font-figtree font-medium",
                    isSuccess ? "text-white" : "text-[#FFD638]",
                  )}
                >
                  <span
                    role="status"
                    aria-live="polite"
                    className="block text-center md:text-left"
                  >
                    {isSuccess ? successMessage : errorMessage}
                  </span>
                </Typography>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
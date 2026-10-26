"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { IMPACT_ITEMS } from "@/domains/home/constants/overlayform";
import { useDonationForm } from "@/domains/home/components/donation/useDonationForm";
import { DetailsStep } from "@/domains/home/components/donation/DetailsStep";
import { AmountStep } from "@/domains/home/components/donation/AmountStep";
import Typography from "@/lib/Typography";
import {
  OverlayformAnimations,
  IntroCurtains,
  useOverlayformAnimation,
} from "./Overlayformanimation";

// ===== Body scroll lock =====
function useBodyScrollLock() {
  const lockedScrollY = useRef(0);

  useEffect(() => {
    const scrollY = window.scrollY;
    lockedScrollY.current = scrollY;
    const { body } = document;
    const original = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      Object.assign(body.style, original);
      window.scrollTo(0, lockedScrollY.current);
    };
  }, []);
}

interface OverlayAmountProps {
  form: ReturnType<typeof useDonationForm>;
  rise: string;
  delay: (ms: number) => CSSProperties;
}

function OverlayAmountSection({ form, rise, delay }: OverlayAmountProps) {
  return (
    <>
      <div
        style={delay(700)}
        className={`${rise} flex shrink-0 flex-col gap-1 text-center lg:pr-4 lg:text-left`}
      >
        <Typography
          id="overlayform-title"
          variant="h4"
          className="font-regular font-lora leading-[1.2] text-[#00191B] text-[18px] sm:text-[20px]"
        >
          Strengthening Rural Lives, Building Better Futures
        </Typography>

        <Typography
          variant="body-sm"
          className="font-regular font-figtree leading-tight text-[#5F6C6D] text-[11.5px] sm:text-[12px]"
        >
          Your support helps us create sustainable opportunities and empower rural communities to thrive.
        </Typography>
      </div>

      {/* Streamlined compact impact pillars */}
      <div className="grid shrink-0 grid-cols-4 gap-1 py-1">
        {IMPACT_ITEMS.map((item, idx) => (
          <div
            key={item.title}
            style={delay(780 + idx * 60)}
            className={`${rise} flex min-w-0 flex-col items-center gap-1 text-center`}
          >
            <img
              src={item.icon}
              alt=""
              className="h-5 w-5 sm:h-5.5 sm:w-5.5 object-contain"
            />
            <span className="font-manrope text-[10px] sm:text-[11px] font-bold text-[#00191B] leading-[1.2] text-center">
              {item.title.split(" ").length === 2 ? (
                <>
                  <span className="block">{item.title.split(" ")[0]}</span>
                  <span className="block">{item.title.split(" ")[1]}</span>
                </>
              ) : (
                <span className="block">{item.title}</span>
              )}
            </span>
          </div>
        ))}
      </div>

      <div style={delay(900)} className={`${rise} flex shrink-0 flex-col`}>
        <AmountStep
          currencySymbol={form.currencySymbol}
          presets={form.presets}
          selectedDigits={form.selectedDigits}
          customDigits={form.customDigits}
          usingCustom={form.usingCustom}
          showLargeAmountHint={form.showLargeAmountHint}
          pickPreset={form.pickPreset}
          setCustomFromInput={form.setCustomFromInput}
          setUsingCustom={form.setUsingCustom}
          cause={form.cause}
          setCause={form.setCause}
          causes={form.causes}
          goToDetails={form.goToDetails}
          compact={true}
        />
      </div>
    </>
  );
}

// ===== Overlay shell =====
interface OverlayformProps {
  onClose: () => void;
}

export default function Overlayform({ onClose }: OverlayformProps) {
  const form = useDonationForm();
  const { intro, exiting, rise, delay, beginClose } = useOverlayformAnimation(onClose);
  useBodyScrollLock();

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden overscroll-none bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-out motion-reduce:transition-none ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="overlayform-title"
    >
      <OverlayformAnimations />

      {form.step === 2 ? (
        <div
          className="relative w-full max-w-[620px] bg-white rounded-xl shadow-2xl p-6 sm:p-9 my-auto overflow-y-auto max-h-[calc(100dvh-2rem)] animate-in fade-in zoom-in-95 duration-200"
          style={exiting ? { opacity: 0, transform: "scale(0.98)" } : undefined}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={beginClose}
            className="absolute right-5 top-5 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
          <DetailsStep {...form} />
        </div>
      ) : (
        <div
          className={`
            overlayform-card-in
            relative flex w-[min(380px,calc(100vw-2rem))] shrink-0 flex-col
            rounded-xl bg-white shadow-2xl overflow-hidden
            transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none
            lg:h-auto lg:w-[min(840px,calc(100vw-4rem))] lg:flex-row lg:overflow-hidden lg:rounded-none
            xl:w-[min(900px,calc(100vw-5rem))]
            2xl:w-[min(960px,calc(100vw-6rem))]
          `}
          style={exiting ? { opacity: 0, transform: "scale(0.98)" } : undefined}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={beginClose}
            className="absolute right-2 top-2 z-20 flex h-6 w-6 items-center justify-center rounded bg-[#FFD638] text-black transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" stroke="currentColor" strokeWidth={2.5}>
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>

          {intro && <IntroCurtains />}

          {/* Image */}
          <div className="relative h-32 min-h-24 w-full shrink-0 overflow-hidden lg:h-auto lg:min-h-0 lg:w-[38%] lg:shrink-0 lg:self-stretch xl:w-[40%] 2xl:w-[42%]">
            <div className="overlayform-img-in absolute inset-0">
              <Image
                src="/overlayform/mobileimg1.png"
                alt="Family supported by IHDUA"
                fill
                className="object-cover object-center lg:hidden"
                priority
                sizes="380px"
              />
              <Image
                src="/overlayform/formimg.png"
                alt="Family supported by IHDUA"
                fill
                className="hidden object-cover object-center lg:block"
                priority
                sizes="(min-width: 1536px) 42vw, 40vw"
              />
            </div>
          </div>

          {/* Form: completely non-scrollable and compact */}
          <div
            className="
              flex w-full flex-col justify-between bg-[#F6F2EC] px-4 py-3.5 sm:px-5 sm:py-4 overflow-hidden
              lg:w-[62%] lg:px-6 lg:py-4.5
              xl:w-[60%] xl:px-7 xl:py-5
              2xl:w-[58%] 2xl:px-8 2xl:py-5
            "
          >
            <OverlayAmountSection form={form} rise={rise} delay={delay} />
          </div>
        </div>
      )}
    </div>
  );
}

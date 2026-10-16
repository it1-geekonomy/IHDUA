"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { IMPACT_ITEMS } from "@/domains/home/constants/overlayform";
import { CountrySelect } from "@/domains/home/components/donation/CountrySelect";
import { formatPresetLabel } from "@/domains/home/constants/donationCountries";
import { useDonationForm } from "@/domains/home/components/donation/useDonationForm";
import { DetailsStep } from "@/domains/home/components/donation/DetailsStep";
import Typography, { figmaTypeScale } from "@/lib/Typography";
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

// ===== Step 1: amount picker =====
const INR_DEFAULT = "3000";
const INR_AMOUNTS = [INR_DEFAULT, "5000", "10000", "18000", "25000"];

// Pills: below lg they fill a 3-column row (₹3,000 | ₹5,000 | More); lg+ they sit in a 6-column row.
const PILL_BASE = `w-full shrink-0 whitespace-nowrap rounded-md border px-2 py-2 text-center transition-colors lg:min-w-0 lg:px-1 2xl:px-2 2xl:py-2.5 ${figmaTypeScale[15]}`;
const PILL_UNSELECTED = "border-[#D4CEC5] bg-[#FFFAF2] text-[#9739A8] hover:bg-[#F3E7F6]";
const PILL_SELECTED = "border-[#9739A8] bg-[#9739A8] text-white";

interface AmountStepProps {
  form: ReturnType<typeof useDonationForm>;
  rise: string;
  delay: (ms: number) => CSSProperties;
}

function AmountStep({ form, rise, delay }: AmountStepProps) {
  const amounts =
    form.currency === "INR" ? INR_AMOUNTS : form.presets.map((p) => p.digits);

  const currentPresets = amounts.map((digits) => ({
    digits,
    formatted: formatPresetLabel(digits, form.currency),
  }));

  return (
    <>
      <div
        style={delay(700)}
        className={`${rise} flex shrink-0 flex-col gap-1.5 text-center lg:gap-2 lg:pr-6 lg:text-left`}
      >
        <Typography
          id="overlayform-title"
          variant="h4"
          className="font-regular font-lora leading-[1.2] text-[#00191B]"
        >
          Strengthening Rural Lives, Building Better Futures
        </Typography>

        <Typography
          variant="body-sm"
          className="font-regular font-figtree leading-snug text-[#5F6C6D]"
        >
          Your support helps us create sustainable opportunities and empower rural communities to thrive.
        </Typography>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-x-3 gap-y-2.5 lg:grid-cols-4 lg:gap-y-3 xl:gap-x-4">
        {IMPACT_ITEMS.map((item, idx) => (
          <div
            key={item.title}
            style={delay(800 + idx * 90)}
            className={`${rise} flex min-w-0 flex-col items-center gap-1 text-center`}
          >
            <img
              src={item.icon}
              alt=""
              className="h-6 w-6 object-contain lg:h-8 lg:w-8 xl:h-9 xl:w-9 2xl:h-10 2xl:w-10"
            />
            <div className="min-w-0">
              <Typography
                variant="overline"
                className="block font-bold font-manrope leading-snug text-[#00191B] normal-case tracking-normal"
              >
                {item.title}
              </Typography>
              <Typography
                variant="overline"
                className="mt-0.5 block font-normal font-manrope leading-snug text-[#5F6C6D] normal-case tracking-normal"
              >
                {item.description}
              </Typography>
            </div>
          </div>
        ))}
      </div>

      <div style={delay(1100)} className={`${rise} flex shrink-0 flex-col gap-2`}>
        {/* Country select is lg+ only (not part of the mobile design) */}
        <Typography
          variant="body-sm"
          className="hidden font-bold font-manrope tracking-normal text-[#6B6660] lg:block"
        >
          Choose your country
        </Typography>
        <div className="hidden w-full lg:block">
          <CountrySelect value={form.countryCode} onChange={form.setCountryCode} />
        </div>

        <Typography
          variant="caption"
          className="text-center font-bold font-manrope tracking-normal text-[#6B6660] lg:text-left"
        >
          Choose an amount
        </Typography>

        <div className="grid grid-cols-3 gap-2 lg:grid-cols-6">
          {currentPresets.map(({ digits, formatted }, i) => {
            const isSelected = !form.usingCustom && form.selectedDigits === digits;
            return (
              <button
                key={digits}
                type="button"
                onClick={() => form.pickPreset(digits)}
                className={`${PILL_BASE} ${isSelected ? PILL_SELECTED : PILL_UNSELECTED} ${
                  i >= 2 ? "hidden lg:block" : ""
                }`}
              >
                <Typography variant="caption" className={isSelected ? "font-extrabold" : "font-bold"}>
                  {formatted}
                </Typography>
              </button>
            );
          })}

          {form.usingCustom ? (
            <span
              className={`${PILL_BASE} ${PILL_SELECTED} flex items-center justify-center font-extrabold lg:justify-start`}
            >
              {form.currencySymbol}
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoFocus
                value={form.customDigits}
                onChange={(e) => form.setCustomFromInput(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="0"
                className={`ml-1 w-full min-w-0 bg-transparent font-extrabold text-white outline-none placeholder:text-white/70 ${figmaTypeScale[16]}`}
              />
            </span>
          ) : (
            <button
              type="button"
              onClick={() => form.setUsingCustom(true)}
              className={`${PILL_BASE} ${PILL_UNSELECTED}`}
            >
              <Typography variant="caption" className="font-bold font-manrope normal-case tracking-normal">
                More
              </Typography>
            </button>
          )}
        </div>
      </div>

      <div style={delay(1250)} className={`${rise} flex shrink-0 flex-col items-center gap-1.5 lg:mt-2`}>
        <button
          type="button"
          onClick={() => form.goToDetails()}
          className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#FDC61D] px-4 py-2.5 font-bold font-manrope text-[#1C1C1C] 2xl:py-3 ${figmaTypeScale[18]}`}
        >
          Donate Now
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2.2}>
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

       <Typography
  variant="overline"
  className={`${figmaTypeScale[12]} font-regular font-manrope text-[#B0A99F] normal-case tracking-normal`}
>
  🔒 Secure Payment | Powered by Razorpay
</Typography>
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

  useEffect(() => {
    if (form.currency === "INR" && form.selectedDigits !== INR_DEFAULT && !form.usingCustom) {
      form.pickPreset(INR_DEFAULT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      {/*
        Below lg the card is a column capped at the viewport height:
        the image is the only block allowed to shrink (h-40 down to min-h-28),
        the form keeps its natural height, so the form is always fully visible.
        lg+ switches to a side-by-side layout.
      */}
      <div
        className={`
          overlayform-card-in
          relative flex w-[min(380px,calc(100vw-2rem))] max-h-[calc(100dvh-1.5rem)] shrink-0 flex-col
          rounded-xl bg-white shadow-2xl
          ${form.step === 1 ? "overflow-hidden" : "overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"}
          transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none
          lg:h-auto lg:max-h-[calc(100dvh-2rem)] lg:w-[min(860px,calc(100vw-4rem))] lg:flex-row lg:overflow-hidden lg:rounded-none
          xl:w-[min(940px,calc(100vw-5rem))]
          2xl:max-h-[calc(100dvh-3rem)] 2xl:w-[min(1080px,calc(100vw-6rem))]
        `}
        style={exiting ? { opacity: 0, transform: "scale(0.98)" } : undefined}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={beginClose}
          className="absolute right-2 top-2 z-20 flex h-6 w-6 items-center justify-center rounded bg-[#FFD638] text-black transition-transform hover:scale-105 active:scale-95"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" stroke="currentColor" strokeWidth={2.5}>
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>

        {intro && <IntroCurtains />}

        {/* Image */}
        <div className="relative h-40 min-h-28 w-full shrink overflow-hidden lg:h-auto lg:min-h-[360px] lg:w-[38%] lg:shrink-0 lg:self-stretch xl:w-[40%] 2xl:w-[42%]">
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

        {/* Form */}
        <div
          className="
            flex w-full shrink-0 flex-col gap-2.5 bg-[#F6F2EC] px-5 py-3
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            lg:w-[62%] lg:gap-4 lg:overflow-y-auto lg:px-6 lg:py-5
            xl:w-[60%] xl:px-7 xl:py-6
            2xl:w-[58%] 2xl:gap-5 2xl:px-9 2xl:py-7
          "
        >
          {form.step === 1 ? (
            <AmountStep form={form} rise={rise} delay={delay} />
          ) : (
            <div className="w-full flex-1 pt-2 lg:overflow-y-auto lg:pt-0">
              <DetailsStep
                chosenAmount={form.chosenAmount}
                customDigits={form.customDigits}
                usingCustom={form.usingCustom}
                editingAmount={form.editingAmount}
                currencySymbol={form.currencySymbol}
                countryCode={form.countryCode}
                phoneCountryCode={form.phoneCountryCode}
                phoneCountryDial={form.phoneCountryDial}
                isIndia={form.isIndia}
                fullName={form.fullName}
                mobile={form.mobile}
                email={form.email}
                taxId={form.taxId}
                isPaying={form.isPaying}
                statusMessage={form.statusMessage}
                statusTone={form.statusTone}
                showLargeAmountHint={form.showLargeAmountHint}
                setPhoneCountryCode={form.setPhoneCountryCode}
                setFullName={form.setFullName}
                setMobile={form.setMobile}
                setEmail={form.setEmail}
                setTaxId={form.setTaxId}
                setCustomFromInput={form.setCustomFromInput}
                goBackToAmount={form.goBackToAmount}
                startEditAmount={form.startEditAmount}
                commitAmountEdit={form.commitAmountEdit}
                cancelAmountEdit={form.cancelAmountEdit}
                paySecurely={form.paySecurely}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
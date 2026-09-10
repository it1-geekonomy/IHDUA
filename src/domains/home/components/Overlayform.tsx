"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DONATION_AMOUNTS, IMPACT_ITEMS } from "@/domains/home/constants/overlayform";
import Typography, { figmaTypeScale } from "@/lib/Typography";

interface OverlayformProps {
  onClose: () => void;
}

export default function Overlayform({ onClose }: OverlayformProps) {
  const [selectedAmount, setSelectedAmount] = useState("₹999");
  const [showCustom, setShowCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState("");

  const handlePickAmount = (amount: string) => {
    setSelectedAmount(amount);
    setShowCustom(false);
  };

  useEffect(() => {
    const scrollY = window.scrollY;
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
      window.scrollTo(0, scrollY);
    };
  }, []);

  const pillBase = `rounded-md border transition-colors ${figmaTypeScale[15]} shrink-0 px-3 py-2.5 text-center lg:px-4 lg:py-3`;
  const pillUnselected = "bg-[#FFFAF2] border-[#D4CEC5] text-[#9739A8] hover:bg-[#F3E7F6]";
  const pillSelected = "bg-[#9739A8] border-[#9739A8] text-white";

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden overscroll-none bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="overlayform-title"
    >
      {/*
        <lg: full-screen stack
        lg–xl: content-height, roomy form column (no collapse)
        2xl (1920): Figma tall panel replica
      */}
      <div
        className="
          relative flex h-dvh w-full flex-col overflow-hidden bg-white shadow-2xl
          lg:absolute lg:left-1/2 lg:top-1/2 lg:h-auto lg:max-h-[calc(100dvh-4rem)]
          lg:w-[min(1200px,calc(100vw-4rem))] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:flex-row
          xl:w-[min(1280px,calc(100vw-4rem))] xl:max-h-[calc(100dvh-4rem)]
          2xl:h-[min(880px,calc(100dvh-6rem))] 2xl:max-h-[calc(100dvh-6rem)]
          2xl:w-[min(1600px,calc(100vw-6rem))]
        "
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-md bg-[#FFD638] text-black transition-transform hover:scale-105 active:scale-95 sm:h-9 sm:w-9 2xl:right-4 2xl:top-4"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2.5}>
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>

        {/* Image — 50/50 only at 2xl Figma size */}
        <div className="relative min-h-[26dvh] w-full flex-1 lg:w-[40%] lg:flex-none lg:self-stretch xl:w-[42%] 2xl:w-1/2">
          <Image
            src="/overlayform/formmobile.jpg"
            alt="Family supported by IHDUA"
            fill
            className="object-cover object-top lg:hidden"
            priority
            sizes="100vw"
          />
          <Image
            src="/overlayform/overlayformimg.png"
            alt="Family supported by IHDUA"
            fill
            className="hidden object-cover object-center lg:block"
            priority
            sizes="(min-width: 1536px) 50vw, 42vw"
          />
        </div>

        {/*
          Form
          lg/xl: even gaps, content height — nothing crushed
          2xl: Figma fill with justify-between
        */}
        <div
          className="
            flex w-full shrink-0 flex-col bg-[#F6F2EC] px-4 py-3 sm:px-6 sm:py-4
            lg:w-[60%] lg:gap-5 lg:overflow-hidden lg:px-9 lg:py-8
            xl:w-[58%] xl:gap-6 xl:px-10 xl:py-9
            2xl:h-full 2xl:w-1/2 2xl:justify-between 2xl:gap-0 2xl:px-16 2xl:py-14
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          "
        >
          <div className="flex flex-col gap-2 lg:gap-3 xl:gap-3 2xl:gap-4">
            <Typography
              id="overlayform-title"
              variant="h2"
              className="font-regular font-lora leading-[1.2] text-[#00191B] !text-[1.125rem] sm:!text-[1.5rem] lg:!text-[36px] xl:!text-[38px] 2xl:!text-[45px]"
            >
              Strengthening Rural Lives, Building Better Futures
            </Typography>

            <Typography
              variant="body-lg"
              className="font-regular font-figtree leading-snug text-[#5F6C6D] !text-[0.6875rem] sm:!text-[0.875rem] lg:!text-[16px] xl:!text-[17px] 2xl:!text-[18px] lg:max-w-xl"
            >
              Your support helps us create sustainable opportunities and empower rural communities to thrive.
            </Typography>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-3 sm:mt-3 lg:mt-0 lg:grid-cols-4 lg:gap-x-5 xl:gap-x-6">
            {IMPACT_ITEMS.map((item) => (
              <div
                key={item.title}
                className="flex min-w-0 flex-col items-center gap-1.5 text-center lg:gap-2"
              >
                <img
                  src={item.icon}
                  alt=""
                  className="h-7 w-7 object-contain sm:h-8 sm:w-8 lg:h-11 lg:w-11 xl:h-12 xl:w-12 2xl:h-14 2xl:w-14"
                />
                <div className="min-w-0">
                  <Typography
                    variant="overline"
                    className="block font-bold font-manrope leading-snug text-[#00191B] normal-case tracking-normal !text-[9px] sm:!text-[11px] lg:!text-[12px] xl:!text-[13px] 2xl:!text-[14px]"
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="overline"
                    className="mt-0.5 block font-normal font-manrope leading-snug text-[#5F6C6D] normal-case tracking-normal !text-[8px] sm:!text-[10px] lg:!text-[11px] xl:!text-[12px] 2xl:!text-[13px]"
                  >
                    {item.description}
                  </Typography>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2.5 flex flex-col gap-2 sm:mt-3 lg:mt-0 lg:gap-3">
            <Typography
              variant="caption"
              className="font-bold font-manrope tracking-normal text-[#6B6660] !text-[10px] lg:!text-[14px] xl:!text-[15px]"
            >
              Choose an amount
            </Typography>

            <div className="flex flex-wrap justify-start gap-2 lg:gap-2 xl:gap-2.5 2xl:gap-3">
              {DONATION_AMOUNTS.map((amount) => {
                const isSelected = !showCustom && selectedAmount === amount;
                return (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handlePickAmount(amount)}
                    className={`${pillBase} ${isSelected ? pillSelected : pillUnselected}`}
                  >
                    <Typography
                      variant="caption"
                      className={isSelected ? "font-extrabold" : "font-bold"}
                    >
                      {amount}
                    </Typography>
                  </button>
                );
              })}

              {showCustom ? (
                <span className={`${pillBase} ${pillSelected} flex items-center font-extrabold`}>
                  ₹
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoFocus
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="0"
                    className={`ml-1 w-14 bg-transparent outline-none placeholder:text-white/70 sm:w-16 ${figmaTypeScale[16]} font-extrabold text-white`}
                  />
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowCustom(true);
                    setSelectedAmount("");
                  }}
                  className={`${pillBase} ${pillUnselected}`}
                >
                  <Typography
                    variant="caption"
                    className="font-bold font-manrope normal-case tracking-normal"
                  >
                    More
                  </Typography>
                </button>
              )}
            </div>
          </div>

          <div className="mt-2 flex flex-col items-center gap-2 sm:mt-3 lg:mt-0 lg:gap-2 2xl:gap-3">
            <button
              type="button"
              className={`mx-auto flex w-[250px] items-center justify-center gap-2 rounded-md bg-[#FDC61D] px-4 py-2.5 font-bold font-manrope text-[#1C1C1C] transition-transform hover:scale-[1.01] active:scale-[0.99] sm:w-[300px] lg:w-full lg:py-3.5 2xl:py-4 ${figmaTypeScale[18]}`}
            >
              Donate Now
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2.2}>
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <Typography
              variant="overline"
              className="font-regular font-manrope text-[#B0A99F] normal-case tracking-normal !text-[9px] sm:!text-[inherit]"
            >
              🔒 Secure Payment | Powered by Razorpay
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

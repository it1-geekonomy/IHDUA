"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DONATION_AMOUNTS, IMPACT_ITEMS } from "@/domains/home/constants/overlayform";
import Typography, { figmaTypeScale } from "@/lib/Typography";

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" stroke="currentColor" strokeWidth={1.8}>
    <rect x="5" y="10.5" width="14" height="9" rx="1.8" />
    <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" strokeLinecap="round" />
    <circle cx="12" cy="15" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

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

  // Block scrolling on the page underneath while the form is open,
  // preserving scroll position so the page doesn't jump on close
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

  // ₹ amounts — 15.4px @ 1920
  const pillBase = `rounded-md px-4 py-3 ${figmaTypeScale[15]} border transition-colors`;
  const pillUnselected = "bg-[#FFFAF2] border-[#D4CEC5] text-[#9739A8] hover:bg-[#F3E7F6]";
  const pillSelected = "bg-[#9739A8] border-[#9739A8] text-white";

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto lg:overflow-hidden overscroll-contain bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="overlayform-title"
    >
      <div className="relative mx-auto my-4 w-[calc(100%-3rem)] max-w-[1500px] overflow-hidden bg-white shadow-2xl sm:my-6 sm:w-[calc(100%-4rem)] lg:absolute lg:inset-10 lg:my-0 lg:mx-auto lg:w-auto lg:max-w-[1500px] xl:inset-12">
        {/* Close button */}
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-md bg-[#FFD638] text-black transition-transform hover:scale-105 active:scale-95 sm:h-9 sm:w-9"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2.5}>
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex h-full w-full flex-col lg:flex-row">
          {/* Left image */}
          <div className="relative h-80 w-full shrink-0 sm:h-100 md:h-[30rem] lg:h-full lg:w-[45%]">
            <Image
              src="/overlayform/formmobile.jpg"
              alt="Family supported by IHDUA"
              fill
              className="object-cover object-top block lg:hidden"
              priority
            />
            <Image
              src="/overlayform/overlayformimg.png"
              alt="Family supported by IHDUA"
              fill
              className="object-cover object-top hidden lg:block"
              priority
            />
          </div>

          {/* Right content */}
          <div className="flex w-full flex-col justify-start overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-6 sm:px-8 lg:h-full lg:w-[55%] lg:px-8 bg-[#F6F2EC] pt-8 lg:pt-4 2xl:pt-20 pb-8 lg:pb-0">
            {/* 45.62px @ 1920 */}
            <Typography
              id="overlayform-title"
              variant="h2"
              className="font-regular font-lora leading-tight text-[#00191B] pb-4 lg:pb-6 xl:max-w-2xl"
            >
              Strengthening Rural Lives, Building Better Futures
            </Typography>
            {/* 18px @ 1920 */}
            <Typography
              variant="body-lg"
              className="text-[#5F6C6D] font-regular font-figtree pb-10 lg:pb-4 xl:pb-14 lg:max-w-lg"
            >
              Your support helps us create sustainable opportunities and empower rural communities to thrive.
            </Typography>

            {/* Impact items */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 pb-8 md:grid-cols-4 lg:grid-cols-2 2xl:grid-cols-4">
              {IMPACT_ITEMS.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <img src={item.icon} alt="" className="h-11 w-11 object-contain" />
                  <div>
                    <Typography
                      variant="overline"
                      className="block font-bold font-manrope leading-snug text-[#00191B] normal-case tracking-normal"
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="overline"
                      className="mt-0.5 block normal-case tracking-normal font-normal leading-snug text-[#5F6C6D] font-manrope"
                    >
                      {item.description}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>

            {/* Choose an amount — 14.43px @ 1920 */}
            <Typography
              variant="caption"
              className="tracking-normal font-bold font-manrope text-[#6B6660] pb-3 pt-4 xl:pt-6 2xl:pt-12"
            >
              Choose an amount
            </Typography>
            <div className="grid grid-cols-2 min-[450px]:grid-cols-3 items-center gap-3 pb-8 sm:flex sm:flex-wrap lg:pb-10 xl:pb-18">
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
                    className={`ml-1 w-16 bg-transparent ${figmaTypeScale[16]} font-extrabold text-white placeholder:text-white/70 outline-none`}
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
                  <Typography variant="caption" className="font-bold font-manrope normal-case tracking-normal">
                    More
                  </Typography>
                </button>
              )}
            </div>

            {/* Donate Now — 15px @ 1920 */}
            <button
              type="button"
              className={`mb-3 mx-auto flex w-[250px] sm:w-[300px] items-center justify-center gap-2 rounded-md bg-[#FDC61D] px-4 py-4 sm:py-3 lg:mx-0 lg:w-full lg:px-6 lg:py-3.5 ${figmaTypeScale[18]} font-bold font-manrope text-[#1C1C1C] transition-transform hover:scale-[1.01] active:scale-[0.99]`}
            >
              Donate Now
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2.2}>
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Secure note */}
            <div className="hidden sm:flex items-center justify-center gap-1.5">
              <Typography variant="overline" className="font-regular font-manrope text-[#B0A99F] normal-case tracking-normal">
                🔒 Secure Payment | Powered by Razorpay
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
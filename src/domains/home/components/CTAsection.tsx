"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import Typography from "@/lib/Typography";
import {
  DONATE_CHECKOUT_EVENT,
  type DonateCheckoutDetail,
  smoothScrollToId,
} from "@/domains/home/lib/donationCheckout";

const CTA_AMOUNTS = ["₹500", "₹1500", "₹2500", "₹5000"] as const;

function formatAmountDisplay(raw: string) {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return "";
  return `₹${Number(digits).toLocaleString("en-IN")}`;
}

function fieldClassName() {
  return "w-full rounded-sm border border-[#D9D3C9] bg-[#FAF8F4] px-4 py-3.5 font-figtree text-[15px] text-[#00191B] outline-none placeholder:text-[#8A847A] focus:border-[#9739A8]";
}

export default function CTASection() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedAmount, setSelectedAmount] = useState<string>("₹2500");
  const [customAmount, setCustomAmount] = useState("");
  const [usingCustom, setUsingCustom] = useState(false);
  const [editingAmount, setEditingAmount] = useState(false);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const amountEditRef = useRef<HTMLInputElement>(null);

  const chosenAmount = useMemo(() => {
    if (usingCustom) {
      const formatted = formatAmountDisplay(customAmount);
      return formatted || selectedAmount;
    }
    return selectedAmount;
  }, [usingCustom, customAmount, selectedAmount]);

  useEffect(() => {
    const onCheckout = (event: Event) => {
      const detail = (event as CustomEvent<DonateCheckoutDetail>).detail;
      if (!detail?.amount) return;
      const amount = detail.amount;
      if ((CTA_AMOUNTS as readonly string[]).includes(amount)) {
        setSelectedAmount(amount);
        setUsingCustom(false);
        setCustomAmount("");
      } else {
        setUsingCustom(true);
        setCustomAmount(amount.replace(/[^\d]/g, ""));
      }
      setEditingAmount(false);
      setStep(2);
    };

    window.addEventListener(DONATE_CHECKOUT_EVENT, onCheckout);
    return () => window.removeEventListener(DONATE_CHECKOUT_EVENT, onCheckout);
  }, []);

  useEffect(() => {
    if (editingAmount) amountEditRef.current?.focus();
  }, [editingAmount]);

  const goToDetails = () => {
    if (usingCustom && !customAmount.replace(/[^\d]/g, "")) return;
    setEditingAmount(false);
    setStep(2);
  };

  const pickPreset = (amount: string) => {
    setSelectedAmount(amount);
    setUsingCustom(false);
    setCustomAmount("");
  };

  const startEditAmount = () => {
    setUsingCustom(true);
    setCustomAmount(chosenAmount.replace(/[^\d]/g, ""));
    setEditingAmount(true);
  };

  const commitAmountEdit = () => {
    const digits = customAmount.replace(/[^\d]/g, "");
    if (!digits) {
      setUsingCustom(false);
      setCustomAmount("");
    } else {
      setUsingCustom(true);
      setCustomAmount(digits);
    }
    setEditingAmount(false);
  };

  return (
    <section id="cta-donate" className="relative w-full overflow-hidden">
      <div className="relative min-h-[560px] w-full lg:min-h-[640px]">
        <Image
          src="/CTAsection/ctabgimg.jpg"
          alt="Rural community"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col gap-10 px-6 py-12 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-10 lg:py-16 2xl:px-40">
          {/* Left copy */}
          <div className="flex w-full max-w-xl flex-col text-left lg:max-w-lg xl:max-w-xl">
            <Typography
              variant="h1"
              className="font-lora font-normal leading-tight text-white lg:!text-[48px] xl:!text-[52px]"
            >
              Help Create Opportunities For Stronger Communities
            </Typography>

            <Typography
              variant="body-lg"
              className="mt-4 max-w-md leading-relaxed text-white/90 font-figtree font-normal sm:mt-5"
            >
              Every contribution helps create opportunities for rural communities
              through education, healthcare, sustainable livelihoods, and community
              development.
            </Typography>

            <a
              href="#focus-areas"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollToId("focus-areas");
              }}
              className="mt-8 inline-flex w-fit items-center justify-center self-center bg-[#FFD638] px-6 py-3 transition-opacity hover:opacity-90 lg:self-start"
            >
              <Typography variant="body-sm" className="font-bold font-figtree text-[#00191B]">
                Explore Our Work
              </Typography>
            </a>
          </div>

          {/* Donation card */}
          <div className="w-full max-w-md shrink-0 self-center rounded-sm bg-[#F7F4EE] p-6 shadow-xl sm:p-7 lg:self-auto xl:max-w-[420px]">
            <Typography
              variant="h3"
              className="text-center font-lora font-normal leading-snug text-[#00191B]"
            >
              Make a Difference Today
            </Typography>
            <Typography
              variant="body-sm"
              className="mx-auto mt-2 max-w-sm text-center leading-relaxed text-[#5F6C6D] font-figtree"
            >
              Your support helps create opportunities through education, healthcare,
              sustainable livelihoods and stronger communities.
            </Typography>

            {step === 1 ? (
              <div className="mt-6 flex flex-col gap-4">
                <Typography
                  variant="caption"
                  className="font-bold font-figtree tracking-normal text-[#6B6660] !normal-case"
                >
                  Choose an amount
                </Typography>

                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {CTA_AMOUNTS.map((amount) => {
                    const active = !usingCustom && selectedAmount === amount;
                    return (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => pickPreset(amount)}
                        className={`rounded-sm border px-2 py-2.5 font-figtree text-[14px] font-semibold transition-colors ${
                          active
                            ? "border-[#9739A8] bg-[#9739A8] text-white"
                            : "border-[#D4CEC5] bg-white text-[#00191B] hover:border-[#9739A8]/50"
                        }`}
                      >
                        {amount}
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="₹ Other amount"
                  value={usingCustom ? (customAmount ? `₹${customAmount}` : "") : ""}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/[^\d]/g, "");
                    setUsingCustom(true);
                    setCustomAmount(digits);
                  }}
                  onFocus={() => setUsingCustom(true)}
                  className={fieldClassName()}
                />

                <button
                  type="button"
                  onClick={goToDetails}
                  className="w-full rounded-sm bg-[#FFD638] py-3.5 font-figtree text-[16px] font-bold text-[#1C1C1C] transition-opacity hover:opacity-90"
                >
                  Donate Now
                </button>

                <p className="text-center font-figtree text-[12px] text-[#8A847A]">
                  🔒 Secure Payment • Trusted by Thousands
                </p>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3 rounded-sm border border-[#D9D3C9] bg-[#FAF8F4] px-4 py-3.5">
                  <span className="shrink-0 font-figtree text-[15px] text-[#5F6C6D]">
                    Chosen Amount
                  </span>
                  <span className="flex min-w-0 items-center justify-end gap-2 font-figtree text-[15px] font-bold text-[#00191B]">
                    {editingAmount ? (
                      <input
                        ref={amountEditRef}
                        type="text"
                        inputMode="numeric"
                        value={customAmount ? `₹${customAmount}` : "₹"}
                        onChange={(e) => {
                          setUsingCustom(true);
                          setCustomAmount(e.target.value.replace(/[^\d]/g, ""));
                        }}
                        onBlur={commitAmountEdit}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            commitAmountEdit();
                          }
                          if (e.key === "Escape") {
                            e.preventDefault();
                            setEditingAmount(false);
                          }
                        }}
                        className="w-28 border-b border-[#9739A8] bg-transparent text-right font-figtree text-[15px] font-bold text-[#00191B] outline-none"
                        aria-label="Edit chosen amount"
                      />
                    ) : (
                      chosenAmount
                    )}
                    <button
                      type="button"
                      onClick={startEditAmount}
                      className="inline-flex shrink-0 items-center gap-1 font-semibold text-[#9739A8] hover:opacity-80"
                    >
                      EDIT
                      <Pencil className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </button>
                  </span>
                </div>

                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={fieldClassName()}
                  autoComplete="name"
                />
                <input
                  type="tel"
                  inputMode="tel"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/[^\d+\s-]/g, ""))}
                  className={fieldClassName()}
                  autoComplete="tel"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldClassName()}
                  autoComplete="email"
                />

                <button
                  type="button"
                  className="mt-1 w-full rounded-sm bg-[#FFD638] py-3.5 font-figtree text-[16px] font-bold text-[#1C1C1C] transition-opacity hover:opacity-90"
                >
                  Pay Securely {chosenAmount}
                </button>

                <p className="text-center font-figtree text-[12px] text-[#8A847A]">
                  🔒 Secure Payment • Trusted by Thousands
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

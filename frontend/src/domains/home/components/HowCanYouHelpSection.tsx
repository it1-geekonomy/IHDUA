"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { HELP_ITEMS } from "@/domains/home/constants/howcanwehelp";
import Typography from "@/lib/Typography";

/** Slower, readable unroll — not a snap */
const easeRoll = [0.45, 0.05, 0.25, 1] as const;
const ROLL_DURATION = 1.55;

export default function HowCanYouHelpSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="w-full bg-white">
      <div className="w-full px-6 pt-6 lg:py-30 lg:px-10 2xl:px-40">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <Typography variant="display-xl" className="font-lora font-normal text-[#00191B]">
            How can you help?
          </Typography>
          <Typography
            variant="body-lg"
            className="w-full lg:max-w-xl xl:max-w-3xl leading-relaxed text-[#5F6C6D] md:text-left font-normal font-figtree"
          >
            Together, we can create stronger communities and lasting
            opportunities. Your support helps IHDUA strengthen rural
            communities through education, sustainable livelihoods,
            healthcare, and community-led development.
          </Typography>
        </div>

        {/* Plays once when this block enters the viewport */}
        <motion.div
          className="mt-10 grid grid-cols-1 justify-items-center gap-6 sm:justify-items-stretch sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-4 xl:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35, margin: "0px 0px -8% 0px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.22,
                delayChildren: reduceMotion ? 0 : 0.12,
              },
            },
          }}
        >
          {HELP_ITEMS.map((item) => (
            <motion.div
              key={item.title}
              className="flex w-[280px] flex-col sm:w-full"
              variants={{
                hidden: { opacity: reduceMotion ? 0 : 1 },
                visible: {
                  opacity: 1,
                  transition: { duration: reduceMotion ? 0.2 : 0 },
                },
              }}
            >
              {/* Rod the paper hangs from */}
              <span className="h-[3px] w-full shrink-0 bg-[#9739A8]" />

              {/* Paper / curtain unrolls top → bottom */}
              <motion.div
                className="relative flex h-full flex-col overflow-hidden bg-[#FAF9F5] px-5 py-6 sm:px-6 sm:py-8"
                variants={{
                  hidden: reduceMotion
                    ? { opacity: 0 }
                    : { clipPath: "inset(0 0 100% 0)" },
                  visible: reduceMotion
                    ? { opacity: 1, transition: { duration: 0.25 } }
                    : {
                        clipPath: "inset(0 0 0% 0)",
                        transition: { duration: ROLL_DURATION, ease: easeRoll },
                      },
                }}
                style={{ willChange: reduceMotion ? undefined : "clip-path" }}
              >
                {!reduceMotion && (
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14 origin-top bg-linear-to-b from-black/12 to-transparent"
                    variants={{
                      hidden: { opacity: 0.55 },
                      visible: {
                        opacity: 0,
                        transition: {
                          duration: ROLL_DURATION,
                          ease: easeRoll,
                          delay: 0.15,
                        },
                      },
                    }}
                  />
                )}

                <div className="flex h-14 w-14 items-center justify-center bg-[#FFD638] sm:h-16 sm:w-16">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={28}
                    height={28}
                    className="h-7 w-7 object-contain sm:h-8 sm:w-8"
                  />
                </div>

                <Typography variant="h4" className="mt-6 font-lora font-normal text-[#00191B]">
                  {item.title}
                </Typography>
                <Typography variant="body-sm" className="mt-2 leading-relaxed text-[#5F6C6D] font-normal font-figtree">
                  {item.description}
                </Typography>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

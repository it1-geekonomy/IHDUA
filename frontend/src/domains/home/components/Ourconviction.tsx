"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Typography from "@/lib/Typography";
const IMAGE_SRC = "/ourconviction/conviction.png";

interface FeatureProps {
  title: string;
  description: string;
}

function Feature({ title, description }: FeatureProps) {
  return (
    <div>
      <Typography variant="body-xl" className="font-bold text-[#00191B] font-figtree">
        {title}
      </Typography>
      <Typography variant="body-lg" className="mt-2 leading-relaxed text-[#5F6C6D] font-figtree font-normal">
        {description}
      </Typography>
    </div>
  );
}

const LG_BREAKPOINT = "(min-width: 1024px)"; // Tailwind's `lg`

export default function OurConviction() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [lgImageHeight, setLgImageHeight] = useState<number | null>(null);

  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;

    const mql = window.matchMedia(LG_BREAKPOINT);

    const syncHeight = () => {
      setLgImageHeight(mql.matches ? contentEl.offsetHeight : null);
    };

    syncHeight();

    const resizeObserver = new ResizeObserver(syncHeight);
    resizeObserver.observe(contentEl);
    mql.addEventListener("change", syncHeight);

    return () => {
      resizeObserver.disconnect();
      mql.removeEventListener("change", syncHeight);
    };
  }, []);

  return (
    <section className="w-full bg-white">
      <div className="w-full px-6 pt-6 pb-6 lg:py-24 lg:px-10 2xl:px-40">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div className="order-2 flex justify-center lg:order-1 lg:block">
            <img
              src={IMAGE_SRC}
              alt="Artisan shaping clay on a pottery wheel"
              style={lgImageHeight !== null ? { height: lgImageHeight } : undefined}
              className="h-80 w-full max-w-xs object-cover object-bottom sm:h-[26rem] md:h-[20rem] sm:max-w-xl md:max-w-xl lg:h-[480px] lg:w-full lg:max-w-none"
            />
          </div>

          {/* Content: order-1 (first) when stacked, order-2 (right) at lg+ */}
          <div ref={contentRef} className="order-1 lg:order-2">
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
              <Typography variant="caption" className="font-bold font-figtree text-[#9739A8]">
                OUR CONVICTION
              </Typography>
              <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
            </div>

            <Typography
              variant="display-xl"
              className="mt-5 max-w-xl leading-tight text-[#00191B] font-normal font-lora"
            >
              Development begins with opportunity.
            </Typography>

            <Typography variant="body-lg" className="mt-5 leading-relaxed text-[#5F6C6D] font-normal font-figtree">
              True change isn&apos;t handed down; it&apos;s grown from the
              roots. We partner with rural families in Karnataka to provide
              the tools, training, and community structure needed to foster
              permanent independence.
            </Typography>

            <div className="mt-8 lg:mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Feature
                title="Community-Led"
                description="Decisions are made by self-help groups and rural village assemblies, ensuring native ownership."
              />
              <Feature
                title="Sustainable Growth"
                description="From organic farming techniques to female entrepreneurship, we focus on self-renewing lifecycles."
              />
            </div>

            <Link
              href="/"
              className="mt-9 lg:mt-14 mx-auto flex w-fit items-center gap-2 rounded bg-[#FFD638] px-6 py-3 transition-opacity lg:mx-0 "
            >
              <Typography variant="body-lg" className="font-semibold font-figtree tracking-wide text-[#1E1E1E]">
                READ OUR FOUNDING STORY
              </Typography>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
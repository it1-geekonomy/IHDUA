"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
const IMAGE_SRC = "/ourconviction/conviction.png";

interface FeatureProps {
  title: string;
  description: string;
}

function Feature({ title, description }: FeatureProps) {
  return (
    <div>
      <h3 className="text-base font-semibold text-[#00191B]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#5F6C6D]">
        {description}
      </p>
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
      <div className="w-full px-6 pt-6 lg:py-24 lg:px-10 2xl:px-40">
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
              <span className="text-xs font-semibold tracking-wider text-[#9739A8]">
                OUR CONVICTION
              </span>
              <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
            </div>

            <h2 className="mt-5 font-serif text-3xl leading-tight text-[#00191B] sm:text-5xl lg:text-[2.75rem] max-w-xl">
              Development begins with opportunity.
            </h2>

            <p className="mt-5 text-base leading-relaxed text-[#5F6C6D]">
              True change isn&apos;t handed down; it&apos;s grown from the
              roots. We partner with rural families in Karnataka to provide
              the tools, training, and community structure needed to foster
              permanent independence.
            </p>

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
  href="/about"
  className="mt-9 lg:mt-14 mx-auto flex w-fit items-center gap-2 rounded bg-[#FFD638] px-6 py-3 text-lg font-bold tracking-wide text-[#1E1E1E] transition-opacity lg:mx-0"
>
  READ OUR FOUNDING STORY
  <span aria-hidden="true">→</span>
</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";

export interface CountUpProps {
  value: string | number;
  duration?: number; // duration in ms, default 1200ms
  className?: string;
}

interface ParsedStat {
  prefix: string;
  target: number;
  suffix: string;
  hasCommas: boolean;
  decimalPlaces: number;
  isValid: boolean;
}

function parseValue(raw: string | number): ParsedStat {
  const str = String(raw).trim();
  // Match prefix, number (with optional commas and decimals), and suffix
  const match = str.match(/^([^\d.]*)(\d+(?:,\d+)*(?:\.\d+)?)(.*)$/);

  if (!match) {
    return {
      prefix: "",
      target: 0,
      suffix: str,
      hasCommas: false,
      decimalPlaces: 0,
      isValid: false,
    };
  }

  const prefix = match[1];
  const numStr = match[2];
  const suffix = match[3];

  const hasCommas = numStr.includes(",");
  const cleanNum = numStr.replace(/,/g, "");
  const target = parseFloat(cleanNum);

  const decimalPart = cleanNum.split(".")[1];
  const decimalPlaces = decimalPart ? decimalPart.length : 0;

  return {
    prefix,
    target: isNaN(target) ? 0 : target,
    suffix,
    hasCommas,
    decimalPlaces,
    isValid: !isNaN(target),
  };
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function CountUp({
  value,
  duration = 1200,
  className = "",
}: CountUpProps) {
  const parsed = parseValue(value);
  const [current, setCurrent] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!parsed.isValid) return;

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();

          const startTime = performance.now();
          const target = parsed.target;

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);
            const eased = easeOutCubic(progress);

            setCurrent(target * eased);

            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              setCurrent(target);
            }
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated, parsed.isValid, parsed.target, duration]);

  if (!parsed.isValid) {
    return (
      <span translate="no" className={`notranslate ${className}`}>
        {value}
      </span>
    );
  }

  // Format the animated number
  let formattedNumber: string;
  if (!hasAnimated) {
    formattedNumber = "0";
  } else if (parsed.decimalPlaces > 0) {
    formattedNumber = current.toFixed(parsed.decimalPlaces);
  } else {
    const rounded = Math.round(current);
    formattedNumber = parsed.hasCommas
      ? rounded.toLocaleString("en-US")
      : String(rounded);
  }

  return (
    <span
      ref={elementRef}
      translate="no"
      className={`notranslate inline-block tabular-nums ${className}`}
    >
      {parsed.prefix}
      {formattedNumber}
      {parsed.suffix}
    </span>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Typography from "@/lib/Typography";

const VIDEO_SRC = "https://pub-bbab4b37d630465e8c49b68c7d045302.r2.dev/website/1792847607069-jik7l-trailer-journey-of-ihdua.mp4";

interface FeatureProps {
  title: string;
  description: string;
}

function Feature({ title, description }: FeatureProps) {
  return (
    <div className="px-6 text-center sm:px-0 xl:text-left">
      <Typography variant="body-xl" className="font-bold text-[#00191B] font-figtree">
        {title}
      </Typography>
      <Typography variant="body-lg" className="mt-2 leading-relaxed text-[#5F6C6D] font-figtree font-normal">
        {description}
      </Typography>
    </div>
  );
}

export default function OurConviction() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const inViewRef = useRef(false);

  // Section enters view: play + unmute. Section leaves: mute + pause.
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const playWithSound = async () => {
      video.muted = false;
      try {
        await video.play();
        setIsMuted(false);
      } catch {
        // Browser blocked sound (no user click/tap/key yet): fall back to muted
        video.muted = true;
        setIsMuted(true);
        video.play().catch(() => {});
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          playWithSound();
        } else {
          video.muted = true;
          setIsMuted(true);
          video.pause();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(section);

    // Scroll alone isn't a user gesture, so if sound was blocked,
    // unmute on the first real interaction while the section is in view.
    const onFirstGesture = (e: Event) => {
      // Let the mute button handle its own clicks
      if ((e.target as HTMLElement | null)?.closest("[data-mute-btn]")) return;
      if (inViewRef.current && video.muted) {
        video.muted = false;
        setIsMuted(false);
        video.play().catch(() => {});
      }
    };
    const events = ["pointerdown", "keydown", "touchend"] as const;
    events.forEach((e) => window.addEventListener(e, onFirstGesture, { once: true }));

    return () => {
      observer.disconnect();
      events.forEach((e) => window.removeEventListener(e, onFirstGesture));
    };
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    setIsMuted(next);
    if (video.paused) video.play().catch(() => {});
  };

  return (
    <section ref={sectionRef} className="w-full bg-white">
      <div className="w-full px-6 py-10 lg:px-10 xl:py-20 2xl:px-40">
        {/*
          Below xl: single centered column (text -> video -> features -> button).
          xl and up: two columns, video on the left, all content on the right.
        */}
        <div className="grid grid-cols-1 xl:grid-cols-2 xl:gap-x-16">
          {/* Label + heading + description */}
          <div className="xl:col-start-2 xl:row-start-1">
            <div className="flex items-center justify-center gap-3 xl:justify-start">
              <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
              <Typography variant="caption" className="font-bold font-figtree text-[#9739A8]">
                OUR CONVICTION
              </Typography>
              <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
            </div>

            <Typography
              variant="display-xl"
              className="mt-5 w-full text-center leading-tight text-[#00191B] font-normal font-lora xl:max-w-xl xl:text-left"
            >
              Development begins with opportunity.
            </Typography>

            <Typography
              variant="body-lg"
              className="mt-5 w-full text-center leading-relaxed text-[#5F6C6D] font-normal font-figtree xl:text-left"
            >
              True change isn&apos;t handed down; it&apos;s grown from the
              roots. We partner with rural families in Karnataka to provide
              the tools, training, and community structure needed to foster
              permanent independence.
            </Typography>
          </div>

          {/* Video: full natural ratio, no crop */}
          <div className="relative mx-auto mt-3 w-full max-w-sm sm:max-w-lg lg:max-w-2xl xl:col-start-1 xl:row-span-3 xl:row-start-1 xl:mx-0 xl:mt-0 xl:max-w-none xl:self-center">
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              className="block h-auto w-full"
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Artisan shaping clay on a pottery wheel"
            />

            <button
              type="button"
              data-mute-btn
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              aria-pressed={!isMuted}
              className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#00191B]/70 text-white backdrop-blur transition-colors hover:bg-[#00191B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD638]"
            >
              {isMuted ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>
          </div>

          {/* Features */}
          <div className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-10 xl:col-start-2 xl:row-start-2 xl:mt-16 xl:gap-6">
            <Feature
              title="Community-Led"
              description="Decisions are made by self-help groups and rural village assemblies, ensuring native ownership."
            />
            <Feature
              title="Sustainable Growth"
              description="From organic farming techniques to female entrepreneurship, we focus on self-renewing lifecycles."
            />
          </div>

          {/* Button */}
          <Link
            href="/"
            className="mt-9 flex w-fit items-center gap-2 justify-self-center rounded bg-[#FFD638] px-6 py-3 transition-opacity lg:mt-14 xl:col-start-2 xl:row-start-3 xl:justify-self-start"
          >
            <Typography variant="body-lg" className="font-semibold font-figtree tracking-wide text-[#1E1E1E]">
              READ OUR FOUNDING STORY
            </Typography>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
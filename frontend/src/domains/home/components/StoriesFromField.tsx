"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import Typography, { figmaTypeScale } from "@/lib/Typography";
import { FIELD_STORIES, type FieldStory } from "@/domains/home/constants/storiesfromfield";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------- Side stories (animate only after a click) ---------- */
const sideCard: Variants = {
  hidden: {},
  show: (i: number) => ({
    transition: { delayChildren: 0.25 + i * 0.12, staggerChildren: 0.08 },
  }),
};

const thumbWipe: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  show: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.7, ease: EASE },
  },
};

const sideLine: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/* ---------- Featured copy (runs on every story change) ---------- */
const copyContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.2, staggerChildren: 0.09, delayChildren: 0.1 },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: EASE } },
};

const copyReveal: Variants = {
  hidden: { opacity: 0, y: 16, clipPath: "inset(0% 0% 100% 0%)" },
  show: {
    opacity: 1,
    y: 0,
    clipPath: "inset(-10% -10% -10% -10%)",
    transition: { duration: 0.55, ease: EASE },
  },
};

export default function StoriesFromField() {
  const [featuredId, setFeaturedId] = useState(FIELD_STORIES[0].id);
  const [hasInteracted, setHasInteracted] = useState(false);

  const featured = useMemo(
    () => FIELD_STORIES.find((s) => s.id === featuredId) ?? FIELD_STORIES[0],
    [featuredId]
  );

  /** Always only 2 side stories */
  const sideStories = useMemo(
    () => FIELD_STORIES.filter((s) => s.id !== featuredId).slice(0, 2),
    [featuredId]
  );

  const selectStory = (story: FieldStory) => {
    if (story.id === featuredId) return;
    setHasInteracted(true);
    setFeaturedId(story.id);
  };

  return (
    <section className="w-full bg-[#FAF9F5]">
      <div className="w-full px-6 pt-6 pb-6 lg:pt-8 lg:pb-8 lg:px-10 xl:py-14 2xl:px-40">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          {/* Label + heading: centered below sm (640px), left-aligned from sm up */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center gap-3 sm:justify-start">
              <span className="h-px w-8 bg-[#9739A8]" />
              <Typography
                className={`font-figtree font-bold text-[#9739A8] ${figmaTypeScale[15]}`}
              >
                Field Updates
              </Typography>
              <span className="h-px w-8 bg-[#9739A8]" />
            </div>
            <Typography
              variant="h2"
              className="mt-3 font-lora font-normal leading-tight"
            >
              Stories From the Field
            </Typography>
          </div>

          <Link
            href="/blogs"
            className={`mx-auto inline-flex w-fit shrink-0 items-center justify-center border border-[#00191B] bg-transparent px-5 py-2.5 ${figmaTypeScale[18]} font-figtree font-semibold transition-opacity hover:opacity-80 sm:mx-0`}
          >
            Browse All Stories
          </Link>
        </div>

        {/*
          < lg: stacked
          lg–xl: flex row — side stories set height, image stretches to match (aligned)
          xl+: original grid stretch behavior
        */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:mt-10 lg:grid-cols-12 lg:items-stretch lg:gap-x-5 lg:gap-y-5 xl:gap-x-8 2xl:gap-x-10">
          {/*
            lg–xl only wrapper: image + sides share one height
            xl:contents → wrapper disappears, original grid resumes
          */}
          <div className="order-1 contents lg:col-span-12 lg:row-start-1 lg:flex lg:items-stretch lg:gap-5 xl:contents">
            {/* Featured image */}
            <div className="lg:w-[58%] lg:shrink-0 xl:w-auto xl:col-span-8 xl:row-start-1">
              <Link
                href={featured.href}
                className="group relative block aspect-2/1 w-full overflow-hidden bg-[#E8E6E0] lg:aspect-auto lg:aspect-video xl:aspect-2/1 lg:h-full xl:h-auto cursor-pointer"
              >
                {/*
                  Keep every story image mounted and crossfade opacity.
                  mode="wait" emptied the frame between exit/enter → white flash.
                  On click: smooth crossfade + the incoming image settles
                  from a slight zoom.
                */}
                {FIELD_STORIES.map((story) => {
                  const active = story.id === featuredId;
                  return (
                    <motion.div
                      key={story.id}
                      className="absolute inset-0"
                      initial={false}
                      animate={{
                        opacity: active ? 1 : 0,
                        scale: active ? 1 : 1.08,
                      }}
                      transition={{
                        opacity: {
                          duration: 0.8,
                          ease: [0.4, 0, 0.2, 1],
                        },
                        scale: { duration: 1.4, ease: EASE },
                      }}
                      style={{
                        zIndex: active ? 1 : 0,
                        pointerEvents: active ? "auto" : "none",
                        willChange: "opacity, transform",
                      }}
                      aria-hidden={!active}
                    >
                      <Image
                        src={story.image}
                        alt={active ? story.title : ""}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        priority={story.id === FIELD_STORIES[0].id}
                      />
                    </motion.div>
                  );
                })}
              </Link>
            </div>

            {/* Side stories */}
            <div className="order-3 mt-6 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:gap-6 lg:order-none lg:mt-0 lg:w-[42%] lg:flex-col lg:justify-between lg:gap-5 xl:col-span-4 xl:row-start-1 xl:w-auto xl:h-full xl:justify-between">
              {sideStories.map((story, i) => (
                <motion.button
                  key={story.id}
                  type="button"
                  onClick={() => selectStory(story)}
                  custom={i}
                  variants={sideCard}
                  initial={hasInteracted ? "hidden" : false}
                  animate="show"
                  className="group flex min-h-0 min-w-0 flex-1 cursor-pointer items-center gap-3 text-left sm:gap-4 md:flex-1 lg:flex-none lg:shrink-0 xl:flex-1"
                >
                  <motion.div
                    variants={thumbWipe}
                    className="relative aspect-square size-[112px] shrink-0 overflow-hidden sm:size-[128px] md:size-[100px] lg:size-[168px] lg:h-[168px] lg:w-[168px] lg:max-w-none xl:h-full xl:w-auto xl:max-w-[46%] xl:size-auto"
                  >
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 128px, 220px"
                    />
                  </motion.div>

                  <div className="min-w-0 flex-1">
                    <motion.p
                      variants={sideLine}
                      className={`block font-figtree font-bold uppercase tracking-wider text-[#9739A8] ${figmaTypeScale[14]}`}
                    >
                      {story.category}
                    </motion.p>
                    <motion.p
                      variants={sideLine}
                      className={`mt-1.5 block font-lora font-normal leading-snug text-[#00191B] transition-colors lg:text-[15px] xl:text-[20px] ${figmaTypeScale[20]}`}
                    >
                      {story.title}
                    </motion.p>
                    <motion.p
                      variants={sideLine}
                      className={`mt-1.5 block font-figtree font-normal text-[#5F6C6D] ${figmaTypeScale[12]}`}
                    >
                      {story.date}
                    </motion.p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Featured copy */}
          <div className="relative order-2 lg:col-span-7 xl:col-span-8 lg:row-start-2">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={featured.id}
                variants={copyContainer}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <motion.div
                  variants={copyReveal}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1"
                >
                  <Typography
                    variant="caption"
                    className="font-figtree font-bold text-[#9739A8]"
                  >
                    {featured.category}
                  </Typography>
                  <Typography
                    variant="overline"
                    className="normal-case tracking-normal font-figtree font-normal text-[#5F6C6D]"
                  >
                    {featured.date}
                  </Typography>
                </motion.div>

                <motion.div variants={copyReveal}>
                  <Link href={featured.href} className="group inline-block">
                    <Typography
                      variant="h3"
                      className="mt-2 max-w-2xl font-lora font-normal leading-snug text-[#00191B] transition-colors group-hover:text-[#9739A8]"
                    >
                      {featured.title}
                    </Typography>
                  </Link>
                </motion.div>

                <motion.div variants={copyReveal}>
                  <Typography
                    variant="body-lg"
                    className="mt-2 max-w-xl font-figtree leading-relaxed text-[#5F6C6D]"
                  >
                    {featured.description}
                  </Typography>
                </motion.div>

                <motion.div variants={copyReveal}>
                  <Link
                    href={featured.href}
                    className={`mx-auto mt-5 flex w-fit items-center gap-2 bg-[#FFD638] px-5 py-3 ${figmaTypeScale[18]} font-figtree font-normal transition-opacity hover:opacity-90 sm:mx-0`}
                  >
                    Read Full Update
                    <span aria-hidden="true">→</span>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
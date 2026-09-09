"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Typography, { figmaTypeScale } from "@/lib/Typography";
import { FIELD_STORIES, type FieldStory } from "@/domains/home/constants/storiesfromfield";

const fadeSlide = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

export default function StoriesFromField() {
  const [featuredId, setFeaturedId] = useState(FIELD_STORIES[0].id);

  const featured = useMemo(
    () => FIELD_STORIES.find((s) => s.id === featuredId) ?? FIELD_STORIES[0],
    [featuredId]
  );

  const sideStories = useMemo(
    () => FIELD_STORIES.filter((s) => s.id !== featuredId),
    [featuredId]
  );

  const selectStory = (story: FieldStory) => {
    if (story.id === featuredId) return;
    setFeaturedId(story.id);
  };

  return (
    <section className="w-full bg-[#FAF9F5]">
      <div className="w-full px-6 py-10 lg:px-10 lg:py-16 2xl:px-40">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#9739A8]" />
              <Typography
                className={`font-manrope font-bold text-[#9739A8] ${figmaTypeScale[15]}`}
              >
                Field Updates
              </Typography>
            </div>
            <Typography
              variant="h2"
              className="mt-3 font-lora font-medium leading-tight text-[#00191B]"
            >
              Stories From the Field
            </Typography>
          </div>

          <Link
            href="/Stories"
            className={`mx-auto inline-flex w-fit shrink-0 items-center justify-center border border-[#00191B] bg-transparent px-5 py-2.5 ${figmaTypeScale[18]} font-lora font-semibold text-[#00191B] transition-opacity hover:opacity-80 sm:mx-0`}
          >
            Browse All Stories
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 xl:mt-10 xl:grid-cols-12 xl:items-start xl:gap-x-8 xl:gap-y-5 2xl:gap-x-10">
          {/* Featured image */}
          <div className="order-1 xl:col-span-8 xl:row-start-1">
            <div className="relative aspect-16/10 w-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={featured.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 100vw, 66vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Featured copy */}
          <div className="order-2 xl:col-span-8 xl:row-start-2">
            <AnimatePresence mode="wait">
              <motion.div key={featured.id} {...fadeSlide}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Typography
                    variant="caption"
                    className="font-manrope font-semibold text-[#9739A8]"
                  >
                    {featured.category}
                  </Typography>
                  <Typography
                    variant="overline"
                    className="normal-case tracking-normal font-manrope font-normal text-[#8A9394]"
                  >
                    {featured.date}
                  </Typography>
                </div>

                <Typography
                  variant="h3"
                  className="mt-2 max-w-2xl font-lora font-medium leading-snug text-[#00191B]"
                >
                  {featured.title}
                </Typography>

                <Typography
                  variant="body-lg"
                  className="mt-2 max-w-xl font-figtree leading-relaxed text-[#5F6C6D]"
                >
                  {featured.description}
                </Typography>

                <Link
                  href={featured.href}
                  className={`mx-auto mt-5 flex w-fit items-center gap-2 bg-[#FFD638] px-5 py-3 ${figmaTypeScale[15]} font-manrope font-bold text-[#1E1E1E] transition-opacity hover:opacity-90 sm:mx-0`}
                >
                  Read Full Update
                  <span aria-hidden="true">→</span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Side stories */}
          <div className="order-3 flex flex-col gap-5 md:flex-row md:gap-6 xl:col-span-4 xl:row-start-1 xl:flex-col xl:gap-6 2xl:h-full 2xl:justify-between">
            {sideStories.map((story, index) => (
              <button
                key={story.id}
                type="button"
                onClick={() => selectStory(story)}
                className={`group flex min-w-0 cursor-pointer items-center gap-3 text-left sm:gap-4 md:flex-1 xl:flex-none ${
                  index >= 2 ? "hidden xl:flex" : ""
                }`}
              >
                <div className="relative size-[112px] shrink-0 overflow-hidden sm:size-[128px] md:size-[100px] lg:size-[120px] xl:size-[140px] 2xl:size-[160px]">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="160px"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`font-manrope font-semibold uppercase tracking-wider text-[#9739A8] ${figmaTypeScale[14]}`}
                  >
                    {story.category}
                  </p>
                  <p
                    className={`mt-1.5 font-lora font-medium leading-snug text-[#00191B] transition-colors group-hover:text-[#9739A8] ${figmaTypeScale[20]}`}
                  >
                    {story.title}
                  </p>
                  <p
                    className={`mt-1.5 font-manrope font-normal text-[#8A9394] ${figmaTypeScale[12]}`}
                  >
                    {story.date}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

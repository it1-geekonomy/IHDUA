export const WHO_WE_ARE_LABEL = "Who we are";

export const WHO_WE_ARE_HEADING = {
  line1: "A people-led organisation for a",
  line2: "more equitable tomorrow.",
} as const;

export const WHO_WE_ARE_PARAGRAPHS = [
  {
    id: "mission",
    text: "The International Humanitarian Development & Upliftment Association (IHDUA) is a not-for-profit organisation working with rural and underserved communities to improve quality of life through education, healthcare, livelihood support and sustainable development initiatives. We work closely with communities to understand their needs and develop practical programmes that respond to local challenges and opportunities.",
  },
  {
    id: "approach",
    text: "Our approach focuses on community participation, local ownership and long-term impact. Through education, skill development, women's empowerment, sustainable livelihoods and community development, IHDUA creates opportunities for people to build stronger and more self-reliant futures. We also encourage individuals and organisations to contribute through partnerships, volunteering and donations.",
  },
] as const;

export const WHO_WE_ARE_IMAGE = {
  src: "/aboutus/whoweare.png",
  alt: "IHDUA team members with community women examining handcrafted textiles",
  sizes:
    "(min-width: 1280px) 36vw, (min-width: 1024px) 40vw, (min-width: 768px) 448px, 384px",
} as const;

export const WHO_WE_ARE_COLORS = {
  accentBg: "bg-[#9739A8]",
  accentText: "text-[#9739A8]",
  heading: "text-[#00191B]",
  body: "text-[#5F6C6D]",
} as const;

export const WHO_WE_ARE_SIZES = {
  gridGapX: "gap-x-[clamp(2rem,1rem_+_2vw,2.5rem)]",
  headerMarginBottom: "mb-[clamp(1.5rem,1rem_+_1vw,2rem)]",
  headerGap: "gap-[clamp(0.75rem,0.5rem_+_0.6vw,1rem)]",
  labelGap: "gap-[clamp(0.5rem,0.4rem_+_0.4vw,0.75rem)]",
  imageMarginBottom: "mb-[clamp(0.75rem,0.5rem_+_0.6vw,1rem)]",
  descriptionGap: "gap-[clamp(1rem,0.8rem_+_0.5vw,1.25rem)]",

  labelLine: "w-[clamp(1.5rem,1rem_+_1vw,2rem)]",
  imageMaxWidth: "max-w-[clamp(20rem,45vw,28rem)]",

  labelText: "text-[clamp(0.75rem,0.7rem_+_0.2vw,0.875rem)]",
  headingText: "text-[clamp(1.5rem,1.1rem_+_1.2vw,2.25rem)]",
  bodyText: "text-[clamp(1rem,0.95rem_+_0.25vw,1.125rem)]",
} as const;
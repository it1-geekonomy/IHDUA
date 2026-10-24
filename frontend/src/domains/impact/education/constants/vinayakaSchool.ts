export interface SchoolHighlight {
  icon: string;
  iconAlt?: string;
  heading: string;
  description: string;
}

export interface SchoolStatItem {
  icon: string;
  value: string;
  label: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export const VINAYAKA_HERO = {
  heading: "Education",
  description:
    "Creating opportunities to learn, grow and build brighter futures for rural children and communities.",
  image: "/Rural Education/Frame 648 (4).png",
  imageMobile: "/Rural Education/mobile Frame 751.png",
  imageAlt: "Children in rural classroom",
} as const;

export const VINAYAKA_GALLERY_HERO = {
  heading: "Education",
  description:
    "Creating opportunities to learn, grow and build brighter futures for rural children and communities.",
  image: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/Frame 752.png",
  imageMobile: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/mobile Frame 754.png",
  imageAlt: "Children in rural classroom",
} as const;

export const VINAYAKA_HEADER = {
  eyebrow: "EDUCATION",
  title: "Vinayaka Jnana Vidyashale, Mysuru",
  description:
    "Creating opportunities for rural children through accessible, quality education.",
  websiteUrl: "https://ihdua.org",
  buttonText: "Visit School Website",
  highlights: [
    {
      icon: "/icons/mission.png",
      iconAlt: "School Mission",
      heading: "Mission",
      description:
        "Provide excellent primary school instruction for rural students.",
    },
    {
      icon: "/icons/benifit.png",
      iconAlt: "School Alumni",
      heading: "3,000+",
      description:
        "Students have completed 10th grade since the school was founded in 1994.",
    },
  ] as const,
};

export const VINAYAKA_STORIES = [
  {
    id: "community-need",
    title: "Education That Grew From a Community Need",
    paragraphs: [
      "The Vinayaka Jnana Vidya Shale, commonly known in English as the Mullur School, is a rural private school serving students from kindergarten through 10th grade. The school was established to respond to an educational need identified within the local community.",
      "The school was established in 1994 following a request from the local community during an IHDUA cancer screening programme in Mullur. Today, the school continues to provide educational instruction to more than 400 children each year, serving students from the surrounding rural community.",
    ],
    image: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/Rectangle 51 (1).png",
    imageAlt: "Students attending class at Vinayaka Jnana Vidyashale",
    imagePosition: "right" as const,
  },
  {
    id: "screening-to-classrooms",
    title: "From Cancer Screening to Classrooms",
    paragraphs: [
      "In 1994, while IHDUA was conducting a cancer screening programme in the village of Mullur, the field team was preparing to establish a clinic to address local healthcare needs.",
      "The community made a different request: instead of using those resources for a clinic, could they be used to create a school for local children?",
      "At the time, children from Mullur and nearby villages had to travel long distances to attend government schools. The community identified access to quality education as an important local need.",
    ],
    image: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/Rectangle 52 (1).png",
    imageAlt: "Digital classroom session at Mullur School",
    imagePosition: "left" as const,
    ctaText: "View All Photos",
  },
] as const;

export const VINAYAKA_COMMUNITY_STORY = {
  title: "Building Foundations for the Future",
  paragraphs: [
    "Education creates opportunities for children to develop knowledge, discover their abilities, and prepare for the future. Vinayaka Jnana Vidyashale supports rural students through school-based learning.",
  ],
  image: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/Rectangle 55 (2).png",
  imageAlt: "Vinayaka Jnana Vidyashale community learning",
  featureCard: {
    icon: "/Rural Education/raphael_books (1).png",
    title: "Learning for Every Child",
    description:
      "A school environment that encourages curiosity, builds essential knowledge, and helps children progress in their education.",
  },
} as const;

export const VINAYAKA_STATS: readonly SchoolStatItem[] = [
  {
    icon: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/fi_14600942.png",
    value: "3,000+",
    label: "Students completed 10th grade",
  },
  {
    icon: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/fi_158234.png",
    value: "32+",
    label: "Years of Education",
  },
  {
    icon: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/fi_4733397.png",
    value: "400+",
    label: "Children served each year",
  },
  {
    icon: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/fi_12885332.png",
    value: "20+",
    label: "Classrooms and learning spaces",
  },
] as const;

export const VINAYAKA_GALLERY: readonly GalleryPhoto[] = [
  { id: "1", src: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/Gallery/Rectangle 68.png", alt: "Vinayaka Jnana Vidyashale students activity 1" },
  { id: "2", src: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/Gallery/Rectangle 68 (1).png", alt: "Vinayaka Jnana Vidyashale students activity 2" },
  { id: "3", src: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/Gallery/Rectangle 68 (2).png", alt: "Vinayaka Jnana Vidyashale students activity 3" },
  { id: "4", src: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/Gallery/Rectangle 68 (3).png", alt: "Vinayaka Jnana Vidyashale students activity 4" },
  { id: "5", src: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/Gallery/Rectangle 69.png", alt: "Vinayaka Jnana Vidyashale classroom session 1" },
  { id: "6", src: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/Gallery/Rectangle 69 (1).png", alt: "Vinayaka Jnana Vidyashale classroom session 2" },
  { id: "7", src: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/Gallery/Rectangle 69 (2).png", alt: "Vinayaka Jnana Vidyashale classroom session 3" },
  { id: "8", src: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/Gallery/Rectangle 69 (3).png", alt: "Vinayaka Jnana Vidyashale classroom session 4" },
  { id: "9", src: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/Gallery/Rectangle 70.png", alt: "Vinayaka Jnana Vidyashale school grounds 1" },
  { id: "10", src: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/Gallery/Rectangle 70 (1).png", alt: "Vinayaka Jnana Vidyashale school grounds 2" },
  { id: "11", src: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/Gallery/Rectangle 70 (2).png", alt: "Vinayaka Jnana Vidyashale school grounds 3" },
  { id: "12", src: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/Gallery/Rectangle 70 (3).png", alt: "Vinayaka Jnana Vidyashale school grounds 4" },
  { id: "13", src: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/Gallery/Rectangle 71.png", alt: "Vinayaka Jnana Vidyashale learning activity 1" },
  { id: "14", src: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/Gallery/Rectangle 71 (1).png", alt: "Vinayaka Jnana Vidyashale learning activity 2" },
  { id: "15", src: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/Gallery/Rectangle 71 (2).png", alt: "Vinayaka Jnana Vidyashale learning activity 3" },
  { id: "16", src: "/Rural Education/Vinayaka Jnana Vidyashale, Mysuru/Gallery/Rectangle 71 (3).png", alt: "Vinayaka Jnana Vidyashale learning activity 4" },
] as const;

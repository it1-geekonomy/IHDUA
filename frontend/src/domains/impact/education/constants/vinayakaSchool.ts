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
  image: "/aboutbanner.png",
  imageMobile: "/aboutmobileimg.png",
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
    image: "/missionsection/learning.png",
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
    image: "/missionsection/knowledge.png",
    imageAlt: "Digital classroom session at Mullur School",
    imagePosition: "left" as const,
    ctaText: "View All Photos",
  },
] as const;

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
  { id: "1", src: "/missionsection/learning.png", alt: "School building view" },
  { id: "2", src: "/missionsection/knowledge.png", alt: "Children doing craftwork" },
  { id: "3", src: "/missionsection/support.png", alt: "Student painting in art class" },
  { id: "4", src: "/missionsection/strength.png", alt: "Smart classroom instruction" },
  { id: "5", src: "/missionsection/missionimg.png", alt: "Students in school library" },
  { id: "6", src: "/missionsection/missionimg2.png", alt: "Student writing assignment" },
  { id: "7", src: "/missionsection/missionimg3.png", alt: "Computer and projector class" },
  { id: "8", src: "/missionsection/missionimg4.png", alt: "Outdoor clay modeling activity" },
  { id: "9", src: "/development/rural1.png", alt: "Craft activity in playground" },
  { id: "10", src: "/development/rural2.png", alt: "Student study session" },
  { id: "11", src: "/development/rural4.png", alt: "Community inauguration event" },
  { id: "12", src: "/development/rural5.png", alt: "Guest presentation at school" },
  { id: "13", src: "/home/lasting1.png", alt: "Teachers meeting assembly" },
  { id: "14", src: "/home/lasting2.png", alt: "Student prefects on stage" },
  { id: "15", src: "/home/lasting3.png", alt: "School council discussion" },
  { id: "16", src: "/home/story1.png", alt: "Students gathering in hallway" },
] as const;

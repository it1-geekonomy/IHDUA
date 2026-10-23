import type { ImageCardItem } from "@/shared/components/Imagecardsection";

export const EDUCATION_HUB_HERO = {
  heading: "",
  description: "",
  image: "/Rural Education/Frame 648.png",
  imageMobile: "/Rural Education/Frame 648.png",
  imageAlt: "Children studying in a rural classroom - Education",
} as const;

export const EDUCATION_SCHOOL_ITEMS: ImageCardItem[] = [
  {
    title: "Vinayaka Jnana Vidyashale, Mysuru",
    image: "/Rural Education/Rectangle 44.png",
    imageAlt: "Vinayaka Jnana Vidyashale, Mysuru school students",
    href: "/vinayakagnana-vidyashale-mysore",
    theme: "purple",
  },
  {
    title: "Adarsha Academy",
    image: "/Rural Education/Rectangle 44 (1).png",
    imageAlt: "Adarsha Academy school grounds",
    href: "/adarsha-academy-krs",
    theme: "amber",
  },
];

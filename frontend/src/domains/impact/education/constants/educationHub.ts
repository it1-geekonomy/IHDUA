import type { ImageCardItem } from "@/shared/components/Imagecardsection";

export const EDUCATION_HUB_HERO = {
  heading: "Education",
  description:
    "Creating opportunities to learn, grow and build brighter futures for rural children and communities.",
  image: "/Rural Education/Frame 648 (4).png",
  imageMobile: "/Rural Education/mobile Frame 751.png",
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

export const EDUCATION_TRANSFORMS_BANNER = {
  heading: "Education Transforms Communities",
  mainImage: "/Rural Education/image 50.png",
  mainImageAlt: "Rural School Illustration",
  items: [
    {
      icon: "/Rural Education/fi_864685.png",
      iconBg: "#F1E7F4",
      title: "Learn Today",
    },
    {
      icon: "/Rural Education/fi_16924039.png",
      iconBg: "#FEF3DD",
      title: "Grow Together",
    },
    {
      icon: "/Rural Education/fi_1490749.png",
      iconBg: "#F1E7F4",
      title: "Brighter Tomorrow",
    },
  ],
} as const;


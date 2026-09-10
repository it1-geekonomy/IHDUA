export type NavLink = {
  label: string;
  href: string;
  children?: NavLink[];
};

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/Whyidhua" },
  {
    label: "Our Impact",
    href: "/Impact",
    children: [
      { label: "Health", href: "/Impact#health" },
      {
        label: "Education",
        href: "/Impact#education",
        children: [
          { label: "Education & Learning", href: "/Impact#education-learning" },
          { label: "Community Schools", href: "/Impact#community-schools" },
        ],
      },
      {
        label: "Sustainability & Livelihood",
        href: "/Impact#livelihood",
      },
      { label: "Skills & Employment", href: "/Impact#skills" },
    ],
  },
  { label: "Farms & Diary", href: "/OurWork" },
  { label: "Blog", href: "/Stories" },
  { label: "Get Involved", href: "/GetInvolved" },
];

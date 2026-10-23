export type NavLink = {
  label: string;
  href?: string;
  children?: NavLink[];
};

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/About" },
  {
    label: "Our Impact",
    children: [
      {
        label: "Education",
        href: "/education",
        children: [
          { label: "VinayakAgnana Vidyashale Mysore", href: "/vinayakagnana-vidyashale-mysore" },
          { label: "Adarsha Academy KRS", href: "/adarsha-academy-krs" },
        ],
      },
      {
        label: "Women Empowernment",
        children: [
          { label: "Self Help Group & Fedartion", href: "/Self-Help-Group-Fedartion" },
          { label: "Micro-credit Initiatives", href: "/Micro-credit-Initiatives" },
        ],
      },
      {
        label: "Skills & Employment",
        children: [
          { label: "Women", href: "/Women" },
          { label: "Youth", href: "/Youth" },
          { label: "Farmers", href: "/Farmers" },
          { label: "Stitching Unit", href: "/Stitching-Unit" },
        ],
      },
      {
        label: "Model Village",
        href: "/Model-Village",
        children: [
          { label: "Rejuvenation of villages", href: "/Rejuvenation-of-villages" },
          { label: "Increase the green cover", href: "/Increase-the-green-cover" },
        ],
      },
      {
        label: "Health",
        href: "/Health",
        children: [
          { label: "Health Awareness", href: "/Health-Awareness" },
          { label: "Health Camps", href: "/Health-Camps" },
        ],
      },
    ],
  },
  { label: "Farms & Dairy", href: "/Farms-And-Dairy" },
  { label: "Blogs", href: "/Blogs" },
];

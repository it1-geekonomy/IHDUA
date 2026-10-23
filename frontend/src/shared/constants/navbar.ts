export type NavLink = {
  label: string;
  href?: string;
  children?: NavLink[];
};

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
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
        label: "Women Empowerment",
        href: "/women-empowerment",
        children: [
          { label: "Self Help Group & Federation", href: "/self-help-group-federation" },
          { label: "Micro-Finance Initiatives", href: "/micro-finance-initiatives" },
        ],
      },
      {
        label: "Skills & Employment",
         href: "/Skills-and-Employment",
        children: [
          { label: "Women", href: "/women" },
          { label: "Youth", href: "/youth" },
          { label: "Farmers", href: "/farmers" },
          { label: "Stitching Unit", href: "/Stitching-Unit" },
        ],
      },
      {
        label: "Model Village",
        href: "/model-village",
        children: [
          { label: "Rejuvenation of villages", href: "/rejuvenation-of-villages" },
          { label: "Increase the green cover", href: "/increase-the-green-cover" },
        ],
      },
      {
        label: "Health",
        href: "/health",
        children: [
          { label: "Health Awareness", href: "/health-awareness" },
          { label: "Health Camps", href: "/health-camps" },
        ],
      },
    ],
  },
  { label: "Farms & Dairy", href: "/farms-and-dairy" },
  { label: "Blogs", href: "/blogs" },
];

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
    children: [],
  },
  { label: "Blogs & Stories", href: "/blogs" },
];

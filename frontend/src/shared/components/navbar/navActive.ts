import type { NavLink } from "@/shared/constants/navbar";

export function isNavLinkActive(pathname: string, link: NavLink): boolean {
  const [path, hash] = link.href.split("#");

  if (hash) {
    if (typeof window === "undefined") return false;
    return pathname === path && window.location.hash === `#${hash}`;
  }

  if (pathname === link.href) return true;
  if (link.href !== "/" && pathname.startsWith(`${link.href}/`)) return true;
  return link.children?.some((child) => isNavLinkActive(pathname, child)) ?? false;
}

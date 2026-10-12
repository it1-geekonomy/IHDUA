"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import type { NavLink } from "@/shared/constants/navbar";
import { cn } from "@/lib/utils";
import { isNavLinkActive } from "./navActive";
import { NavChevron } from "./NavChevron";
import { MENU_ACCENT, MENU_HOVER, NAV_ACTIVE, NAV_IDLE } from "./navStyles";

type MobileNavItemProps = {
  link: NavLink;
  pathname: string;
  onNavigate: (e: MouseEvent<HTMLAnchorElement>, href: string) => void;
};

export function MobileNavItem({ link, pathname, onNavigate }: MobileNavItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [nestedExpanded, setNestedExpanded] = useState<string | null>(null);
  const active = isNavLinkActive(pathname, link);
  const hasChildren = Boolean(link.children?.length);

  if (!hasChildren) {
    return (
      <li className="border-b border-white/10">
        <Link
          href={link.href}
          onClick={(e) => onNavigate(e, link.href)}
          className={cn(
            "flex min-h-12 items-center px-1 py-3.5 font-manrope text-[17px] font-medium tracking-wide transition-colors",
            active ? NAV_ACTIVE : NAV_IDLE,
          )}
        >
          {link.label}
        </Link>
      </li>
    );
  }

  return (
    <li className="border-b border-white/10">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => {
          setExpanded((prev) => !prev);
          if (expanded) setNestedExpanded(null);
        }}
        className={cn(
          "flex min-h-12 w-full items-center justify-between gap-3 px-1 py-3.5 text-left font-manrope text-[17px] font-medium tracking-wide transition-colors",
          active ? NAV_ACTIVE : NAV_IDLE,
        )}
      >
        <span>{link.label}</span>
        <NavChevron open={expanded} className={active ? NAV_ACTIVE : "text-white/80"} />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <ul className="mb-3 space-y-0.5 border-l-2 border-[#FFD638]/40 pl-3">
            {link.children?.map((child) => {
              const childActive = isNavLinkActive(pathname, child);
              const hasNested = Boolean(child.children?.length);

              if (!hasNested) {
                return (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      onClick={(e) => onNavigate(e, child.href)}
                      className={cn(
                        "flex min-h-11 items-center rounded-sm px-3 py-2.5 font-manrope text-[15px] transition-colors",
                        MENU_HOVER,
                        childActive ? NAV_ACTIVE : "text-white/90",
                      )}
                    >
                      {child.label}
                    </Link>
                  </li>
                );
              }

              const nestedOpen = nestedExpanded === child.label;

              return (
                <li key={child.href}>
                  <button
                    type="button"
                    aria-expanded={nestedOpen}
                    onClick={() =>
                      setNestedExpanded((prev) =>
                        prev === child.label ? null : child.label,
                      )
                    }
                    className={cn(
                      "flex min-h-11 w-full items-center justify-between gap-2 rounded-sm px-3 py-2.5 text-left font-manrope text-[15px] transition-colors",
                      MENU_HOVER,
                      nestedOpen && MENU_ACCENT,
                      childActive ? NAV_ACTIVE : "text-white/90",
                    )}
                  >
                    <span>{child.label}</span>
                    <NavChevron open={nestedOpen} className="h-3.5 w-3.5" />
                  </button>

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-200 ease-out",
                      nestedOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <ul className="mb-1 ml-2 space-y-0.5 border-l border-white/15 pl-2">
                        {child.children?.map((nested) => {
                          const nestedActive = isNavLinkActive(pathname, nested);
                          return (
                            <li key={nested.href}>
                              <Link
                                href={nested.href}
                                onClick={(e) => onNavigate(e, nested.href)}
                                className={cn(
                                  "flex min-h-10 items-center rounded-sm px-3 py-2 font-manrope text-[14px] transition-colors",
                                  MENU_HOVER,
                                  nestedActive ? NAV_ACTIVE : "text-white/80",
                                )}
                              >
                                {nested.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </li>
  );
}

"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/shared/constants/navbar";
import Typography from "@/lib/Typography";
import { cn } from "@/lib/utils";
import { DesktopDropdown } from "./DesktopDropdown";
import { isNavLinkActive } from "./navActive";
import { NAV_ACTIVE, NAV_IDLE } from "./navStyles";

type DesktopNavProps = {
  pathname: string;
  onHomeClick: (e: MouseEvent<HTMLAnchorElement>) => void;
};

export function DesktopNav({ pathname, onHomeClick }: DesktopNavProps) {
  return (
    <ul className="hidden items-center gap-8 xl:flex xl:gap-10">
      {NAV_LINKS.map((link) => {
        if (link.children?.length) {
          return <DesktopDropdown key={link.href} link={link} pathname={pathname} />;
        }

        const isActive = isNavLinkActive(pathname, link);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={link.href === "/" ? onHomeClick : undefined}
              className="font-medium"
            >
              <Typography
                variant="body-lg"
                className={cn("font-manrope font-medium", isActive ? NAV_ACTIVE : NAV_IDLE)}
              >
                {link.label}
              </Typography>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/shared/constants/navbar";
import { cn } from "@/lib/utils";
import { MobileNavItem } from "./MobileNavItem";

type MobileNavProps = {
  open: boolean;
  pathname: string;
  onNavigate: (e: MouseEvent<HTMLAnchorElement>, href: string) => void;
};

export function MobileNav({ open, pathname, onNavigate }: MobileNavProps) {
  return (
    <div
      className={cn(
        "border-t border-white/10 xl:hidden",
        "grid transition-[grid-template-rows] duration-300 ease-out",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
    >
      <div className="overflow-hidden">
        <div className="max-h-[min(78vh,640px)] overflow-y-auto overscroll-contain bg-[#9739A8] px-5 pb-6 pt-2 sm:px-6">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <MobileNavItem
                key={link.href}
                link={link}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            ))}
          </ul>

          <Link
            href="/Contact"
            onClick={(e) => onNavigate(e, "/Contact")}
            className="mt-5 flex w-full items-center justify-center bg-white px-6 py-3.5 font-manrope text-[16px] font-semibold text-[#9739A8] transition-opacity hover:opacity-95 sm:hidden"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

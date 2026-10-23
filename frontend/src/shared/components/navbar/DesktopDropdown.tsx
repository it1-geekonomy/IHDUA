"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { NavLink } from "@/shared/constants/navbar";
import Typography from "@/lib/Typography";
import { cn } from "@/lib/utils";
import { isNavLinkActive } from "./navActive";
import { NavChevron } from "./NavChevron";
import { MENU_ACCENT, MENU_BG, MENU_HOVER, NAV_ACTIVE, NAV_IDLE } from "./navStyles";

type DesktopDropdownProps = {
  link: NavLink;
  pathname: string;
};

export function DesktopDropdown({ link, pathname }: DesktopDropdownProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [nestedOpen, setNestedOpen] = useState<string | null>(null);
  const rootRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();
  const active = isNavLinkActive(pathname, link);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setNestedOpen(null);
    }, 120);
  };

  useEffect(() => () => clearCloseTimer(), []);

  useEffect(() => {
    setOpen(false);
    setNestedOpen(null);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setNestedOpen(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setNestedOpen(null);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <li
      ref={rootRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => {
          clearCloseTimer();
          setOpen((prev) => !prev);
          if (open) setNestedOpen(null);
        }}
        className="inline-flex items-center gap-1.5"
      >
        <Typography
          variant="body-lg"
          className={cn("font-manrope font-medium", active ? NAV_ACTIVE : NAV_IDLE)}
        >
          {link.label}
        </Typography>
        <NavChevron open={open} className={active ? NAV_ACTIVE : NAV_IDLE} />
      </button>

      <div
        id={menuId}
        role="menu"
        className={cn(
          "absolute left-0 top-full z-50 min-w-60 pt-2",
          open ? "visible" : "invisible pointer-events-none",
        )}
      >
        <ul className={cn(MENU_BG, "rounded-sm py-1.5 shadow-xl ring-1 ring-white/10")}>
          {link.children?.map((child) => {
            const childActive = isNavLinkActive(pathname, child);
            const hasNested = Boolean(child.children?.length);
            const showNested = nestedOpen === child.label;

            if (!hasNested) {
              if (!child.href) return null;
              return (
                <li key={`${child.label}-${child.href}`} role="none">
                  <Link
                    role="menuitem"
                    href={child.href}
                    className={cn(
                      "block px-4 py-2.5 font-manrope text-[15px] text-white transition-colors",
                      MENU_HOVER,
                      childActive && NAV_ACTIVE,
                    )}
                  >
                    {child.label}
                  </Link>
                </li>
              );
            }

            return (
              <li
                key={`${child.label}-${child.href ?? ""}`}
                role="none"
                onMouseEnter={() => setNestedOpen(child.label)}
              >
                <div
                  className={cn(
                    "flex w-full items-center justify-between font-manrope text-[15px] text-white transition-colors",
                    MENU_HOVER,
                    (showNested || childActive) && MENU_ACCENT,
                    childActive && NAV_ACTIVE,
                  )}
                >
                  <Link
                    role="menuitem"
                    href={child.href ?? "/Education"}
                    className="flex-1 px-4 py-2.5 hover:text-[#FFD638] transition-colors"
                  >
                    {child.label}
                  </Link>
                  <button
                    type="button"
                    aria-expanded={showNested}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNestedOpen((prev) => (prev === child.label ? null : child.label));
                    }}
                    className="px-3 py-2.5 hover:text-[#FFD638] transition-colors"
                    aria-label={`Toggle ${child.label} submenu`}
                  >
                    <NavChevron open={showNested} />
                  </button>
                </div>

                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-200 ease-out",
                    showNested ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <ul className={cn(MENU_ACCENT, "border-t border-white/5 py-1")}>
                      {child.children?.map((nested) => {
                        if (!nested.href) return null;
                        const nestedActive = isNavLinkActive(pathname, nested);
                        return (
                          <li key={`${nested.label}-${nested.href}`} role="none">
                            <Link
                              role="menuitem"
                              href={nested.href}
                              className={cn(
                                "block px-6 py-2 font-manrope text-[14px] text-white/90 transition-colors",
                                MENU_HOVER,
                                nestedActive && NAV_ACTIVE,
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
    </li>
  );
}

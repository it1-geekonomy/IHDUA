"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_LINKS, type NavLink } from "@/shared/constants/navbar";
import Typography from "@/lib/Typography";
import { cn } from "@/lib/utils";

const MENU_BG = "bg-[#1A0F1C]";
const MENU_ACCENT = "bg-[#9739A8]/19";
const MENU_HOVER = "hover:bg-[#9739A8]/19";

function Chevron({ open, className }: { open?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn(
        "h-4 w-4 shrink-0 transition-transform duration-200",
        open && "rotate-180",
        className
      )}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function isLinkActive(pathname: string, link: NavLink): boolean {
  const [path, hash] = link.href.split("#");

  if (hash) {
    if (typeof window === "undefined") return false;
    return pathname === path && window.location.hash === `#${hash}`;
  }

  if (pathname === link.href) return true;
  if (link.href !== "/" && pathname.startsWith(`${link.href}/`)) return true;
  return link.children?.some((child) => isLinkActive(pathname, child)) ?? false;
}

function DesktopDropdown({ link, pathname }: { link: NavLink; pathname: string }) {
  const [open, setOpen] = useState(false);
  const [nestedOpen, setNestedOpen] = useState<string | null>(null);
  const rootRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();
  const active = isLinkActive(pathname, link);

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
          className={cn(
            "font-manrope font-medium",
            active ? "text-[#FFD638]" : "text-white"
          )}
        >
          {link.label}
        </Typography>
        <Chevron open={open} className={active ? "text-[#FFD638]" : "text-white"} />
      </button>

      <div
        id={menuId}
        role="menu"
        className={cn(
          "absolute left-0 top-full z-50 min-w-60 pt-2",
          open ? "visible" : "invisible pointer-events-none"
        )}
      >
        <ul className={cn(MENU_BG, "rounded-sm py-1.5 shadow-xl ring-1 ring-white/10")}>
          {link.children?.map((child) => {
            const childActive = isLinkActive(pathname, child);
            const hasNested = Boolean(child.children?.length);
            const showNested = nestedOpen === child.label;

            if (!hasNested) {
              return (
                <li key={child.href} role="none">
                  <Link
                    role="menuitem"
                    href={child.href}
                    onClick={() => {
                      setOpen(false);
                      setNestedOpen(null);
                    }}
                    className={cn(
                      "block px-4 py-2.5 font-manrope text-[15px] text-white transition-colors",
                      MENU_HOVER,
                      childActive && "text-[#FFD638]"
                    )}
                  >
                    {child.label}
                  </Link>
                </li>
              );
            }

            return (
              <li key={child.href} role="none">
                <button
                  type="button"
                  role="menuitem"
                  aria-expanded={showNested}
                  onClick={() =>
                    setNestedOpen((prev) =>
                      prev === child.label ? null : child.label
                    )
                  }
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left font-manrope text-[15px] text-white transition-colors",
                    MENU_HOVER,
                    (showNested || childActive) && MENU_ACCENT,
                    childActive && "text-[#FFD638]"
                  )}
                >
                  <span>{child.label}</span>
                  <Chevron open={showNested} />
                </button>

                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-200 ease-out",
                    showNested ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <ul className={cn(MENU_ACCENT, "border-t border-white/5 py-1")}>
                      {child.children?.map((nested) => {
                        const nestedActive = isLinkActive(pathname, nested);
                        return (
                          <li key={nested.href} role="none">
                            <Link
                              role="menuitem"
                              href={nested.href}
                              onClick={() => {
                                setOpen(false);
                                setNestedOpen(null);
                              }}
                              className={cn(
                                "block px-6 py-2 font-manrope text-[14px] text-white/90 transition-colors",
                                MENU_HOVER,
                                nestedActive && "text-[#FFD638]"
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

function MobileNavItem({
  link,
  pathname,
  onNavigate,
}: {
  link: NavLink;
  pathname: string;
  onNavigate: (e: MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [nestedExpanded, setNestedExpanded] = useState<string | null>(null);
  const active = isLinkActive(pathname, link);
  const hasChildren = Boolean(link.children?.length);

  if (!hasChildren) {
    return (
      <li className="border-b border-white/10">
        <Link
          href={link.href}
          onClick={(e) => onNavigate(e, link.href)}
          className={cn(
            "flex min-h-12 items-center px-1 py-3.5 font-manrope text-[17px] font-medium tracking-wide transition-colors",
            active ? "text-[#FFD638]" : "text-white"
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
          active ? "text-[#FFD638]" : "text-white"
        )}
      >
        <span>{link.label}</span>
        <Chevron open={expanded} className={active ? "text-[#FFD638]" : "text-white/80"} />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <ul className="mb-3 space-y-0.5 border-l-2 border-[#FFD638]/40 pl-3">
            {link.children?.map((child) => {
              const childActive = isLinkActive(pathname, child);
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
                        childActive ? "text-[#FFD638]" : "text-white/90"
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
                        prev === child.label ? null : child.label
                      )
                    }
                    className={cn(
                      "flex min-h-11 w-full items-center justify-between gap-2 rounded-sm px-3 py-2.5 text-left font-manrope text-[15px] transition-colors",
                      MENU_HOVER,
                      nestedOpen && MENU_ACCENT,
                      childActive ? "text-[#FFD638]" : "text-white/90"
                    )}
                  >
                    <span>{child.label}</span>
                    <Chevron open={nestedOpen} className="h-3.5 w-3.5" />
                  </button>

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-200 ease-out",
                      nestedOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    )}
                  >
                    <div className="overflow-hidden">
                      <ul className="mb-1 ml-2 space-y-0.5 border-l border-white/15 pl-2">
                        {child.children?.map((nested) => {
                          const nestedActive = isLinkActive(pathname, nested);
                          return (
                            <li key={nested.href}>
                              <Link
                                href={nested.href}
                                onClick={(e) => onNavigate(e, nested.href)}
                                className={cn(
                                  "flex min-h-10 items-center rounded-sm px-3 py-2 font-manrope text-[14px] transition-colors",
                                  MENU_HOVER,
                                  nestedActive ? "text-[#FFD638]" : "text-white/80"
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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
    setHidden(false);
  }, [pathname]);

  useEffect(() => {
    const getScrollY = () =>
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    lastScrollY.current = getScrollY();
    let ticking = false;

    const update = () => {
      const y = getScrollY();
      const delta = y - lastScrollY.current;

      if (isOpen || y <= 24) {
        setHidden(false);
      } else if (delta > 4) {
        setHidden(true);
      } else if (delta < -4) {
        setHidden(false);
      }

      lastScrollY.current = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, true);
    };
  }, [isOpen]);

  const handleMobileLinkClick = (
    e: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setIsOpen(false);
    setTimeout(() => {
      router.push(href);
    }, 280);
  };

  return (
    <>
      <div
        className="h-[72px] shrink-0 sm:h-[76px] md:h-[80px] lg:h-[88px]"
        aria-hidden
      />

      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/45 transition-opacity duration-300 xl:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden
      />

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full bg-[#9739A8] will-change-transform transition-transform duration-300 ease-out",
          hidden && !isOpen ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <nav className="relative z-50 flex items-center justify-between px-5 py-4 sm:px-6 2xl:px-40">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/idhualogo1.png"
              alt="IHDUA logo"
              width={140}
              height={140}
              priority
              className="h-10 w-auto object-contain sm:h-11 md:h-12 lg:h-14"
            />
          </Link>

          <ul className="hidden items-center gap-8 xl:flex xl:gap-10">
            {NAV_LINKS.map((link) => {
              if (link.children?.length) {
                return (
                  <DesktopDropdown
                    key={link.href}
                    link={link}
                    pathname={pathname}
                  />
                );
              }

              const isActive = isLinkActive(pathname, link);
              return (
                <li key={link.href}>
                  <Link href={link.href} className="font-medium">
                    <Typography
                      variant="body-lg"
                      className={cn(
                        "font-manrope font-medium",
                        isActive ? "text-[#FFD638]" : "text-white"
                      )}
                    >
                      {link.label}
                    </Typography>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/Contact"
              className="hidden items-center justify-center bg-white px-6 py-2.5 text-[#9739A8] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] sm:inline-flex"
            >
              <Typography variant="body-lg" className="font-semibold font-manrope">
                Contact Us
              </Typography>
            </Link>

            <button
              type="button"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((prev) => !prev)}
              className="relative flex h-11 w-11 items-center justify-center rounded-sm xl:hidden"
            >
              <span className="sr-only">{isOpen ? "Close" : "Menu"}</span>
              <span className="relative block h-4 w-5">
                <span
                  className={cn(
                    "absolute left-0 block h-0.5 w-5 bg-white transition-all duration-300",
                    isOpen ? "top-1.5 rotate-45" : "top-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-1.5 block h-0.5 w-5 bg-white transition-all duration-300",
                    isOpen ? "opacity-0" : "opacity-100"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-0.5 w-5 bg-white transition-all duration-300",
                    isOpen ? "top-1.5 -rotate-45" : "top-3"
                  )}
                />
              </span>
            </button>
          </div>
        </nav>

        {/* Mobile panel */}
        <div
          className={cn(
            "border-t border-white/10 xl:hidden",
            "grid transition-[grid-template-rows] duration-300 ease-out",
            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
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
                    onNavigate={handleMobileLinkClick}
                  />
                ))}
              </ul>

              <Link
                href="/Contact"
                onClick={(e) => handleMobileLinkClick(e, "/Contact")}
                className="mt-5 flex w-full items-center justify-center bg-white px-6 py-3.5 font-manrope text-[16px] font-semibold text-[#9739A8] transition-opacity hover:opacity-95 sm:hidden"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

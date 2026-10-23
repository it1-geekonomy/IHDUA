"use client";

import { useEffect,useRef,useState,
  type MouseEvent,
  type RefObject,
} from "react";
import Link from "next/link";
import { NAV_LINKS, type NavLink } from "@/shared/constants/navbar";
import { cn } from "@/lib/utils";
import Typography from "@/lib/Typography";

export const YELLOW = "text-[#FFD638]";
export const EASE = "[transition-timing-function:cubic-bezier(.22,1,.36,1)]";
export const CONTACT_HREF = "/Contact";

export function isNavLinkActive(pathname: string, link: NavLink): boolean {
  if (!link.href) {
    return link.children?.some((child) => isNavLinkActive(pathname, child)) ?? false;
  }

  const [path, hash] = link.href.split("#");
  if (hash) {
    if (typeof window === "undefined") return false;
    return pathname === path && window.location.hash === `#${hash}`;
  }
  if (pathname === link.href) return true;
  if (link.href !== "/" && pathname.startsWith(`${link.href}/`)) return true;
  return link.children?.some((c) => isNavLinkActive(pathname, c)) ?? false;
}

const readScrollY = () =>
  window.scrollY ||
  document.documentElement.scrollTop ||
  document.body.scrollTop ||
  0;

export function useNavbarScroll(
  menuOpen: boolean,
  barRef: RefObject<HTMLSpanElement | null>,
) {
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    last.current = readScrollY();
    let ticking = false;

    const update = () => {
      const y = readScrollY();
      const delta = y - last.current;

      if (menuOpen || y <= 24) setHidden(false);
      else if (delta > 4) setHidden(true);
      else if (delta < -4) setHidden(false);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      }

      last.current = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen, barRef]);

  return { hidden, setHidden };
}

export function NavStyles() {
  return (
    <style>{`
      @keyframes nav-pop { from { opacity: 0; transform: translateY(14px) scale(.97) } to { opacity: 1; transform: none } }
      @keyframes nav-slide { from { opacity: 0; transform: translateX(-22px) } to { opacity: 1; transform: none } }
    `}</style>
  );
}

export function Chevron({
  open,
  className,
}: {
  open?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn(
        "h-4 w-4 shrink-0 transition-transform duration-300",
        open && "rotate-180",
        className,
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

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn("h-4 w-4 shrink-0", className)}
    >
      <path
        d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MenuToggle({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const bar =
    "absolute right-0 block h-0.5 rounded-full bg-white transition-all duration-500 " +
    EASE;
  return (
    <button
      type="button"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      onClick={onToggle}
      className="relative flex h-11 w-11 items-center justify-center lg:hidden"
    >
      <span className="relative block h-4 w-6">
        <span
          className={cn(
            bar,
            open ? "top-[7px] w-6 rotate-45 bg-[#FFD638]" : "top-0 w-6",
          )}
        />
        <span className={cn(bar, "top-[7px]", open ? "w-0 opacity-0" : "w-4")} />
        <span
          className={cn(
            bar,
            open ? "top-[7px] w-6 -rotate-45 bg-[#FFD638]" : "top-[14px] w-5",
          )}
        />
      </span>
    </button>
  );
}

function MobileItem({
  link,
  index,
  open,
  pathname,
  onNavigate,
}: {
  link: NavLink;
  index: number;
  open: boolean;
  pathname: string;
  onNavigate: (e: MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [nested, setNested] = useState<string | null>(null);
  const active = isNavLinkActive(pathname, link);
  const hasKids = Boolean(link.children?.length);
  useEffect(() => {
    if (open) {
      const activeChild = link.children?.find(
        (c) => c.children?.length && isNavLinkActive(pathname, c),
      );
      setExpanded(active && hasKids);
      setNested(activeChild?.label ?? null);
      return;
    }
    const t = setTimeout(() => {
      setExpanded(false);
      setNested(null);
    }, 500);
    return () => clearTimeout(t);
  }, [open, pathname, active, hasKids, link.children]);

  const wrap = cn(
    "border-b border-white/10 transition-all duration-500 last:border-b-0",
    EASE,
    open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
  );
  const delay = { transitionDelay: open ? `${140 + index * 45}ms` : "0ms" };
  const row =
    "group flex min-h-[52px] w-full items-center gap-3 py-3.5 text-left";

  const toggleTop = () => {
    setExpanded((p) => !p);
    if (expanded) setNested(null);
  };

  if (!hasKids) {
    if (!link.href) return null;
    return (
      <li className={wrap} style={delay}>
        <Link
          href={link.href}
          onClick={(e) => onNavigate(e, link.href!)}
          className={row}
        >
          <Typography
            variant="body-lg"
            className={cn(
              "font-manrope font-medium transition-colors duration-300",
              active ? YELLOW : "text-white group-active:text-[#FFD638]",
            )}
          >
            {link.label}
          </Typography>
        </Link>
      </li>
    );
  }

  const topColor = active || expanded ? YELLOW : "text-white";

  return (
    <li className={wrap} style={delay}>
      {link.href ? (
        // top-level parent WITH its own page: label navigates, chevron toggles
        <div className={cn("flex min-h-[52px] w-full items-center justify-between", topColor)}>
          <Link
            href={link.href}
            onClick={(e) => onNavigate(e, link.href!)}
            className="flex min-h-[52px] flex-1 items-center py-3.5"
          >
            <Typography
              variant="body-lg"
              className={cn(
                "font-manrope font-medium transition-colors duration-300",
                topColor,
              )}
            >
              {link.label}
            </Typography>
          </Link>
          <button
            type="button"
            aria-label={`Toggle ${link.label}`}
            aria-expanded={expanded}
            onClick={toggleTop}
            className="flex h-11 w-11 items-center justify-center"
          >
            <Chevron open={expanded} className="h-[18px] w-[18px] text-current opacity-70" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={toggleTop}
          className={cn(row, "justify-between", topColor)}
        >
          <Typography
            variant="body-lg"
            className={cn(
              "font-manrope font-medium transition-colors duration-300",
              topColor,
            )}
          >
            {link.label}
          </Typography>
          <Chevron open={expanded} className="h-[18px] w-[18px] text-current opacity-70" />
        </button>
      )}

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-500",
          EASE,
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <ul className="mb-4 ml-0.5 border-l border-white/20 pl-4">
            {link.children?.map((child, ci) => {
              const kids = child.children ?? [];
              const childActive = isNavLinkActive(pathname, child);
              const isOpen = nested === child.label;
              const sub = {
                transitionDelay: expanded ? `${ci * 40}ms` : "0ms",
              };
              const subCls = cn(
                "transition-all duration-500",
                EASE,
                expanded ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
              );

              if (!kids.length) {
                if (!child.href) return null;
                return (
                  <li key={`${child.label}-${child.href}`} style={sub} className={subCls}>
                    <Link
                      href={child.href}
                      onClick={(e) => onNavigate(e, child.href!)}
                      className="group flex min-h-11 items-center"
                    >
                      <Typography
                        variant="body-lg"
                        className={cn(
                          "font-manrope font-normal transition-colors duration-300",
                          childActive ? YELLOW : "text-white/75 group-active:text-[#FFD638]",
                        )}
                      >
                        {child.label}
                      </Typography>
                    </Link>
                  </li>
                );
              }

              const toggleNested = () =>
                setNested((p) => (p === child.label ? null : child.label));
              const childColor = childActive || isOpen ? YELLOW : "text-white/75";

              return (
                <li key={`${child.label}-${child.href ?? ""}`} style={sub} className={subCls}>
                  {/* split row: label (link if it has href) + chevron toggle */}
                  <div
                    className={cn(
                      "flex min-h-11 w-full items-center justify-between transition-colors duration-300",
                      childColor,
                    )}
                  >
                    {child.href ? (
                      <Link
                        href={child.href}
                        onClick={(e) => onNavigate(e, child.href!)}
                        className="flex min-h-11 flex-1 items-center"
                      >
                        <Typography
                          variant="body-lg"
                          className={cn(
                            "font-manrope font-normal transition-colors duration-300",
                            childColor,
                          )}
                        >
                          {child.label}
                        </Typography>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={toggleNested}
                        className="flex min-h-11 flex-1 items-center text-left"
                      >
                        <Typography
                          variant="body-lg"
                          className={cn(
                            "font-manrope font-normal transition-colors duration-300",
                            childColor,
                          )}
                        >
                          {child.label}
                        </Typography>
                      </button>
                    )}

                    <button
                      type="button"
                      aria-label={`Toggle ${child.label}`}
                      aria-expanded={isOpen}
                      onClick={toggleNested}
                      className="flex h-11 w-11 items-center justify-center"
                    >
                      <Chevron open={isOpen} className="h-4 w-4 opacity-70" />
                    </button>
                  </div>

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-500",
                      EASE,
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <ul className="mb-2 ml-1 border-l border-white/15 pl-4">
                        {kids.map((n) => {
                          if (!n.href) return null;
                          const lit = isNavLinkActive(pathname, n);
                          return (
                            <li key={`${n.label}-${n.href}`}>
                              <Link
                                href={n.href}
                                onClick={(e) => onNavigate(e, n.href!)}
                                className="group flex min-h-10 items-center"
                              >
                                <Typography
                                  variant="body-lg"
                                  className={cn(
                                    "font-manrope font-normal transition-colors duration-300",
                                    lit ? YELLOW : "text-white/65 group-active:text-[#FFD638]",
                                  )}
                                >
                                  {n.label}
                                </Typography>
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
export function MobileBackdrop({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      aria-hidden
      onClick={onClose}
      className={cn(
        "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-500 lg:hidden",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    />
  );
}
export function MobileMenu({
  open,
  pathname,
  onNavigate,
}: {
  open: boolean;
  pathname: string;
  onNavigate: (e: MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  return (
    <div
      aria-hidden={!open}
      className={cn(
        "absolute inset-x-0 top-full px-3 pt-2 transition-[visibility] duration-500 sm:px-5 lg:hidden",
        open ? "visible" : "invisible pointer-events-none",
      )}
    >
      <div
        className={cn(
          "grid origin-top transition-[grid-template-rows,opacity,transform] duration-500",
          EASE,
          open
            ? "translate-y-0 scale-100 grid-rows-[1fr] opacity-100"
            : "-translate-y-3 scale-[.97] grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden rounded-2xl bg-[#1A0F1C]/85 shadow-[0_30px_70px_-20px_rgba(0,0,0,.75)] ring-1 ring-white/10 backdrop-blur-2xl">
          <div className="max-h-[calc(100dvh-110px)] overflow-y-auto overscroll-contain px-5 py-2 sm:px-7">
            <ul className="flex flex-col">
              {NAV_LINKS.map((link, i) => (
                <MobileItem
                  key={`${link.label}-${link.href ?? ""}`}
                  link={link}
                  index={i}
                  open={open}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
              ))}
            </ul>

            <Link
              href={CONTACT_HREF}
              onClick={(e) => onNavigate(e, CONTACT_HREF)}
              style={{
                transitionDelay: open ? `${160 + NAV_LINKS.length * 45}ms` : "0ms",
              }}
              className={cn(
                "my-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#FFD638] px-6 py-3.5 text-[#1A0F1C] transition-all duration-500 sm:hidden",
                EASE,
                open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
              )}
            >
              <Typography variant="body-lg" className="font-manrope font-bold text-[#1A0F1C]">
                Contact Us
              </Typography>
              <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
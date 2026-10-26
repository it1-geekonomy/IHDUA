"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Link from "next/link";
import { NAV_LINKS, type NavLink } from "@/shared/constants/navbar";
import { cn } from "@/lib/utils";
import Typography from "@/lib/Typography";
import { YELLOW, EASE, Chevron, Arrow, isNavLinkActive } from "./navbar";
import { markClientNav } from "@/shared/lib/navState";

/* ────────────────────────────  desktop  ─────────────────────────── */

function DesktopDropdown({
  link,
  pathname,
}: {
  link: NavLink;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState<string | null>(null);
  const rootRef = useRef<HTMLLIElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchRef = useRef(false);
  const menuId = useId();
  const active = isNavLinkActive(pathname, link);

  const kids = link.children ?? [];
  const nestedMode = kids.some((c) => c.children?.length);

  // the parent group that contains the page the user is currently on
  const activeParent = kids.find(
    (c) => c.children?.length && isNavLinkActive(pathname, c),
  );

  // priority: hovered/focused → active page's parent → first parent
  const focused =
    kids.find((c) => c.label === focus && c.children?.length) ??
    activeParent ??
    kids.find((c) => c.children?.length);

  // every time the menu opens, forget the old hover and start from the active page
  useEffect(() => {
    if (open) setFocus(null);
  }, [open]);

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  const openMenu = () => {
    clear();
    setOpen(true);
  };
  const close = () => {
    clear();
    markClientNav();
    setOpen(false);
  };
  const scheduleClose = () => {
    clear();
    timer.current = setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => clear, []);

  /**
   * While the menu is open, close it when:
   *  - the user clicks/taps outside
   *  - Escape is pressed
   *  - the page (or any scroll container) scrolls — scrolling does not move the
   *    pointer, so onMouseLeave never fires and the menu would otherwise stay open
   *  - the mouse wheel is used (covers pages that are too short to scroll)
   * Scrolling inside the menu itself is ignored.
   */
  useEffect(() => {
    if (!open) return;

    const down = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);

    const onScroll = (e: Event) => {
      const t = e.target as Node | null;
      if (t && t !== document && rootRef.current?.contains(t)) return;
      clear();
      setOpen(false);
    };

    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    // scroll events don't bubble, so capture is needed to catch inner containers
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("wheel", onScroll, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("wheel", onScroll);
    };
  }, [open]);

  /**
   * Trigger click:
   *  - touch: 1st tap opens the menu, 2nd tap follows the link
   *  - mouse/keyboard: hover already opened the menu, so a click goes to the page
   *  - no href: it only toggles the menu
   */
  const handleTriggerClick = (e: MouseEvent<HTMLElement>) => {
    if (touchRef.current) {
      if (!open) {
        e.preventDefault();
        openMenu();
        return;
      }
      if (link.href) {
        close(); // <Link> navigates
        return;
      }
      e.preventDefault();
      close();
      return;
    }
    if (link.href) {
      close(); // <Link> navigates
      return;
    }
    setOpen((p) => !p);
  };

  const triggerCls =
    "group inline-flex items-center gap-1 whitespace-nowrap px-2.5 py-2 xl:gap-1.5 xl:px-4";

  const triggerInner = (
    <>
      <Typography
        variant="body-lg"
        className={cn(
          "font-manrope font-medium transition-colors duration-300",
          active || open ? YELLOW : "text-white group-hover:text-[#FFD638]",
        )}
      >
        {link.label}
      </Typography>
      <Chevron
        open={open}
        className={cn(
          "transition-colors duration-300",
          active || open ? YELLOW : "text-white/80 group-hover:text-[#FFD638]",
        )}
      />
    </>
  );

  const triggerProps = {
    "aria-expanded": open,
    "aria-haspopup": "menu" as const,
    "aria-controls": menuId,
    onPointerDown: (e: ReactPointerEvent<HTMLElement>) => {
      touchRef.current = e.pointerType === "touch";
    },
    onClick: handleTriggerClick,
    className: triggerCls,
  };

  // animation only exists while open → it replays on every open
  const slideIn = (i: number) => ({
    className: open
      ? "animate-[nav-slide_.55s_cubic-bezier(.22,1,.36,1)_both]"
      : "opacity-0",
    style: { animationDelay: `${120 + i * 70}ms` },
  });
  const popIn = (i: number, base = 120) => ({
    className: open
      ? "animate-[nav-pop_.55s_cubic-bezier(.22,1,.36,1)_both]"
      : "opacity-0",
    style: { animationDelay: `${base + i * 70}ms` },
  });

  return (
    <li
      ref={rootRef}
      className="flex h-full items-center"
      onPointerEnter={(e) => {
        touchRef.current = e.pointerType === "touch";
      }}
      onMouseEnter={() => {
        if (!touchRef.current) openMenu();
      }}
      onMouseLeave={scheduleClose}
    >
      {link.href ? (
        <Link href={link.href} {...triggerProps}>
          {triggerInner}
        </Link>
      ) : (
        <button type="button" {...triggerProps}>
          {triggerInner}
        </button>
      )}

      {/* mega panel — anchored to the nav, centred on screen */}
      <div
        id={menuId}
        role="menu"
        className={cn(
          "absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 transition-[visibility] duration-300",
          nestedMode ? "w-[min(900px,94vw)]" : "w-[min(640px,94vw)]",
          open ? "visible" : "invisible pointer-events-none",
        )}
      >
        <div
          className={cn(
            "relative origin-top overflow-hidden rounded-3xl bg-[#1A0F1C]/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,.7)] ring-1 ring-white/10 backdrop-blur-2xl transition-all duration-500",
            EASE,
            open
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-4 scale-95 opacity-0",
          )}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#9739A8] via-[#FFD638] to-[#9739A8]" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#9739A8]/30 blur-3xl" />

          {nestedMode ? (
            <div className="relative grid grid-cols-[320px_1fr]">
              {/* left: parents */}
              <ul className="space-y-1 p-4">
                {kids.map((child, i) => {
                  const on = focused?.label === child.label;
                  const a = slideIn(i);
                  const lit = on || isNavLinkActive(pathname, child);

                  const rowCls = cn(
                    "group flex w-full items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-3.5 text-left transition-colors duration-300",
                    on ? "bg-white/10" : "hover:bg-white/5",
                    lit ? YELLOW : "text-white hover:text-[#FFD638]",
                  );

                  const rowInner = (
                    <>
                      <span className="text-xs font-bold tabular-nums text-[#FFD638]/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Typography
                        variant="body-lg"
                        className={cn(
                          "flex-1 font-manrope font-semibold transition-colors duration-300",
                          lit ? YELLOW : "text-white group-hover:text-[#FFD638]",
                        )}
                      >
                        {child.label}
                      </Typography>
                      <Arrow
                        className={cn(
                          "transition-all duration-300",
                          on ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </>
                  );

                  const preview = () => {
                    if (child.children?.length) setFocus(child.label);
                  };

                  return (
                    <li
                      key={`${child.label}-${child.href ?? ""}`}
                      role="none"
                      style={a.style}
                      className={a.className}
                    >
                      {child.href ? (
                        <Link
                          role="menuitem"
                          href={child.href}
                          onMouseEnter={preview}
                          onFocus={preview}
                          onClick={(e) => {
                            // touch: first tap previews the right pane, second tap navigates
                            if (
                              touchRef.current &&
                              child.children?.length &&
                              focused?.label !== child.label
                            ) {
                              e.preventDefault();
                              setFocus(child.label);
                              return;
                            }
                            close();
                          }}
                          className={rowCls}
                        >
                          {rowInner}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          role="menuitem"
                          aria-expanded={on}
                          onClick={() => setFocus(child.label)}
                          onMouseEnter={preview}
                          onFocus={preview}
                          className={rowCls}
                        >
                          {rowInner}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* right: nested pane — remounts on focus change so it replays */}
              <div className="border-l border-white/10 bg-gradient-to-br from-[#9739A8]/25 to-transparent p-6">
                {focused && (
                  <div key={focused.label}>
                    <div
                      className={cn("mb-4", popIn(0, 60).className)}
                      style={popIn(0, 60).style}
                    >
                      <p className="font-manrope text-xs font-semibold uppercase tracking-[.2em] text-[#FFD638]">
                        Explore
                      </p>
                      {focused.href ? (
                        <Link
                          href={focused.href}
                          onClick={close}
                          className="group inline-flex items-center gap-2 font-manrope text-2xl font-bold text-white transition-colors hover:text-[#FFD638]"
                        >
                          {focused.label}
                          <Arrow className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      ) : (
                        <h3 className="font-manrope text-2xl font-bold text-white">
                          {focused.label}
                        </h3>
                      )}
                    </div>

                    {/* auto-rows-fr → every row is the same height; li + Link are h-full so the card fills its cell */}
                    <ul className="grid grid-cols-2 auto-rows-fr gap-2.5">
                      {focused.children?.map((n, i) => {
                        if (!n.href) return null;
                        const a = popIn(i, 140);
                        const lit = isNavLinkActive(pathname, n);
                        return (
                          <li
                            key={`${n.label}-${n.href}`}
                            role="none"
                            style={a.style}
                            className={cn("h-full", a.className)}
                          >
                            <Link
                              role="menuitem"
                              href={n.href}
                              onClick={close}
                              className={cn(
                                "group flex h-full items-center justify-between gap-2 rounded-xl bg-white/5 px-4 py-3.5 ring-1 ring-white/5 transition-colors duration-300 hover:bg-white/10 hover:text-[#FFD638] hover:ring-[#FFD638]/40",
                                lit ? YELLOW : "text-white/90",
                              )}
                            >
                              <Typography
                                variant="body-lg"
                                className={cn(
                                  "font-manrope font-medium transition-colors duration-300",
                                  lit ? YELLOW : "text-white/90 group-hover:text-[#FFD638]",
                                )}
                              >
                                {n.label}
                              </Typography>
                              <Arrow className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="relative p-5">
              <p
                className={cn(
                  "mb-3 px-2 font-manrope text-xs font-semibold uppercase tracking-[.2em] text-[#FFD638]",
                  popIn(0, 60).className,
                )}
                style={popIn(0, 60).style}
              >
                {link.label}
              </p>
              <ul className="grid grid-cols-2 auto-rows-fr gap-3">
                {kids.map((child, i) => {
                  const a = popIn(i, 120);
                  const lit = isNavLinkActive(pathname, child);
                  return (
                    <li
                      key={`${child.label}-${child.href ?? ""}`}
                      role="none"
                      style={a.style}
                      className={cn("h-full", a.className)}
                    >
                      {child.href && (
                        <Link
                          role="menuitem"
                          href={child.href}
                          onClick={close}
                          className={cn(
                            "group flex h-full items-center gap-4 whitespace-nowrap rounded-2xl bg-white/5 p-4 ring-1 ring-white/5 transition-colors duration-300 hover:bg-white/10 hover:text-[#FFD638] hover:ring-[#FFD638]/40",
                            lit ? YELLOW : "text-white",
                          )}
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#9739A8]/40 text-sm font-bold text-[#FFD638]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="flex-1">
                            <Typography
                              variant="body-lg"
                              className={cn(
                                "font-manrope font-semibold transition-colors duration-300",
                                lit ? YELLOW : "text-white group-hover:text-[#FFD638]",
                              )}
                            >
                              {child.label}
                            </Typography>
                          </span>
                          <Arrow className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

/** visible from 1024px up */
export function DesktopNav({
  pathname,
  onHomeClick,
}: {
  pathname: string;
  onHomeClick: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <ul className="mx-auto hidden h-full items-center lg:flex">
      {NAV_LINKS.map((link) => {
        if (link.children?.length) {
          return <DesktopDropdown key={link.label} link={link} pathname={pathname} />;
        }
        if (!link.href) return null;
        const active = isNavLinkActive(pathname, link);
        return (
          <li key={link.href} className="flex h-full items-center">
            <Link
              href={link.href}
              onClick={link.href === "/" ? onHomeClick : markClientNav}
              className="group whitespace-nowrap px-2.5 py-2 xl:px-4"
            >
              <Typography
                variant="body-lg"
                className={cn(
                  "font-manrope font-medium transition-colors duration-300",
                  active ? YELLOW : "text-white group-hover:text-[#FFD638]",
                )}
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
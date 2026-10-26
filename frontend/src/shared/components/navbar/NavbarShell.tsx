"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Typography from "@/lib/Typography";
import { isHomePath } from "@/shared/lib/path";
import { smoothScrollToTop } from "@/shared/lib/smoothScroll";
import {
  CONTACT_HREF,
  MenuToggle,
  MobileBackdrop,
  MobileMenu,
  NavStyles,
  useNavbarScroll,
} from "./navbar";
import { DesktopNav } from "./NavbarDesktop";

const EASE = "ease-[cubic-bezier(.22,1,.36,1)]";

export default function NavbarShell() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const barRef = useRef<HTMLSpanElement>(null);
  const { hidden, setHidden } = useNavbarScroll(isOpen, barRef);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
    setHidden(false);
  }, [pathname, setHidden]);

  // close the mobile menu if the screen grows to 1024px+ (desktop nav takes over)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setIsOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const handleMobileLinkClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("suppress_overlay", "true");
    }

    if (href === "/" && isHomePath(pathname)) {
      e.preventDefault();
      setHidden(false);
      void smoothScrollToTop();
    }
  };

  const handleHomeClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("suppress_overlay", "true");
    }
    if (!isHomePath(pathname)) return;
    e.preventDefault();
    setIsOpen(false);
    setHidden(false);
    void smoothScrollToTop();
  };

  return (
    <>
      <NavStyles />

      {/* spacer = nav height with matching navbar purple bg */}
      <div className="h-[68px] shrink-0 bg-[#9739A8] lg:h-[80px]" aria-hidden />

      {/* backdrop must live outside <header> (header's transform would trap `fixed`) */}
      <MobileBackdrop open={isOpen} onClose={() => setIsOpen(false)} />

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 will-change-transform transition-transform duration-500",
          EASE,
          hidden && !isOpen ? "-translate-y-full" : "translate-y-0",
        )}
      >
        {/* always a full-width bar */}
        <div className="relative w-full bg-[#9739A8]">
          {/* scroll progress (clipped to the shell's radius) */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
            <span
              ref={barRef}
              className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-[#FFD638]"
            />
          </div>

          <nav className="relative z-10 flex h-[68px] items-center justify-between px-5 sm:px-6 lg:h-[80px] lg:px-6 xl:px-10 2xl:px-24">
            <Link
              href="/"
              onClick={handleHomeClick}
              className="flex shrink-0 items-center gap-3"
            >
              <Image
                src="/idhualogo1.png"
                alt="IHDUA logo"
                width={140}
                height={140}
                priority
                className="h-10 w-auto object-contain sm:h-11 md:h-12 xl:h-14"
              />
            </Link>

            <DesktopNav pathname={pathname} onHomeClick={handleHomeClick} />

            <div className="flex shrink-0 items-center gap-1 sm:gap-3">
              <Link
                href={CONTACT_HREF}
                className="relative hidden items-center gap-2 overflow-hidden rounded-full bg-white px-6 py-2.5 text-[#9739A8] shadow-lg shadow-black/10 sm:inline-flex lg:px-4 lg:py-2 xl:px-6 xl:py-2.5"
              >
                <Typography
                  variant="body-lg"
                  className="relative z-10 font-manrope font-semibold text-[#9739A8]"
                >
                  Contact Us
                </Typography>
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden
                  className="relative z-10 h-4 w-4"
                >
                  <path
                    d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <MenuToggle open={isOpen} onToggle={() => setIsOpen((p) => !p)} />
            </div>
          </nav>
        </div>

        {/* mobile dropdown card hangs under the bar (inside header so it moves with it) */}
        <MobileMenu open={isOpen} pathname={pathname} onNavigate={handleMobileLinkClick} />
      </header>
    </>
  );
}
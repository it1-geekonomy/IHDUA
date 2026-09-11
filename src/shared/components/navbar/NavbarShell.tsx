"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Typography from "@/lib/Typography";
import { cn } from "@/lib/utils";
import { isHomePath } from "@/shared/lib/path";
import { smoothScrollToTop } from "@/shared/lib/smoothScroll";
import { DesktopNav } from "./DesktopNav";
import { MenuToggle } from "./MenuToggle";
import { MobileNav } from "./MobileNav";
import { useNavbarScrollHide } from "./useNavbarScrollHide";

export default function NavbarShell() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { hidden, setHidden } = useNavbarScrollHide(isOpen);

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

  const handleMobileLinkClick = (
    e: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setIsOpen(false);

    if (href === "/" && isHomePath(pathname)) {
      setHidden(false);
      window.setTimeout(() => {
        void smoothScrollToTop();
      }, 280);
      return;
    }

    setTimeout(() => {
      router.push(href);
    }, 280);
  };

  const handleHomeClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isHomePath(pathname)) return;
    e.preventDefault();
    setIsOpen(false);
    setHidden(false);
    void smoothScrollToTop();
  };

  return (
    <>
      <div
        className="h-[72px] shrink-0 sm:h-[76px] md:h-[80px] lg:h-[88px]"
        aria-hidden
      />

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/45 transition-opacity duration-300 xl:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden
      />

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full bg-[#9739A8] will-change-transform transition-transform duration-300 ease-out",
          hidden && !isOpen ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <nav className="relative z-50 flex items-center justify-between px-5 py-4 sm:px-6 2xl:px-40">
          <Link href="/" onClick={handleHomeClick} className="flex items-center gap-3">
            <Image
              src="/idhualogo1.png"
              alt="IHDUA logo"
              width={140}
              height={140}
              priority
              className="h-10 w-auto object-contain sm:h-11 md:h-12 lg:h-14"
            />
          </Link>

          <DesktopNav pathname={pathname} onHomeClick={handleHomeClick} />

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/Contact"
              className="hidden items-center justify-center bg-white px-6 py-2.5 text-[#9739A8] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] sm:inline-flex"
            >
              <Typography variant="body-lg" className="font-semibold font-manrope">
                Contact Us
              </Typography>
            </Link>

            <MenuToggle open={isOpen} onToggle={() => setIsOpen((prev) => !prev)} />
          </div>
        </nav>

        <MobileNav
          open={isOpen}
          pathname={pathname}
          onNavigate={handleMobileLinkClick}
        />
      </header>
    </>
  );
}

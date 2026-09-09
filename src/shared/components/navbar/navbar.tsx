"use client";

import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_LINKS } from "@/shared/constants/navbar";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Block page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close the menu first, then navigate once the close animation has finished
  // so the menu doesn't snap shut mid-transition as the page changes underneath it.
  const handleMobileLinkClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    setTimeout(() => {
      router.push(href);
    }, 350);
  };

  return (
    <header className="w-full bg-[#9739A8] relative z-50">
      <nav className="flex items-center justify-between px-6 py-4 2xl:px-40">
        {/* Logo + brand */}
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

        {/* Desktop links */}
        <ul className="hidden xl:flex items-center gap-8 xl:gap-10">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-xl text-white ${
                    isActive ? "font-bold" : "font-normal"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side: contact button + hamburger, grouped together */}
        <div className="flex items-center gap-4">
          <Link
            href="/Contact"
            className="hidden sm:inline-flex items-center justify-center bg-white px-6 py-2.5 text-[18px] font-bold text-[#9739A8] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
          >
            Contact Us
          </Link>

          {/* Hamburger button - shrinks on small screens */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            className="relative z-50 flex h-7 w-7 flex-col items-center justify-center gap-[4px] sm:h-9 sm:w-9 sm:gap-[6px] xl:hidden"
          >
            <span
              className={`block h-[2px] w-5 bg-white transition-all duration-300 ease-in-out sm:w-7 ${
                isOpen ? "translate-y-[6px] rotate-45 sm:translate-y-[8px]" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-5 bg-white transition-all duration-300 ease-in-out sm:w-7 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-[2px] w-5 bg-white transition-all duration-300 ease-in-out sm:w-7 ${
                isOpen ? "-translate-y-[6px] -rotate-45 sm:-translate-y-[8px]" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <div
        className={`xl:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col items-center gap-1 px-6 pb-6 pt-2">
          {NAV_LINKS.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <li
                key={link.href}
                className={`transition-all duration-300 ease-out ${
                  isOpen
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-2 opacity-0"
                }`}
                style={{ transitionDelay: isOpen ? `${index * 60}ms` : "0ms" }}
              >
                <Link
                  href={link.href}
                  onClick={(e) => handleMobileLinkClick(e, link.href)}
                  className={`block py-3 text-center text-xl text-white ${
                    isActive ? "font-bold" : "font-medium"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li
            className={`mt-2 transition-all duration-300 ease-out sm:hidden ${
              isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            }`}
            style={{
              transitionDelay: isOpen ? `${NAV_LINKS.length * 60}ms` : "0ms",
            }}
          >
            <Link
              href="/Contact"
              onClick={(e) => handleMobileLinkClick(e, "/Contact")}
              className="inline-flex w-40 items-center justify-center bg-white px-6 py-3 text-base font-semibold text-[#9739A8]"
            >
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FOOTER_GET_INVOLVED,
  FOOTER_HEADQUARTERS,
  FOOTER_SOCIAL_LINKS,
  FOOTER_WHAT_WE_DO,
} from "@/shared/constants/footer";
import Typography from "@/lib/Typography";
import { isHomePath } from "@/shared/lib/path";
import { smoothScrollToId, smoothScrollToTop } from "@/shared/lib/smoothScroll";
import { scrollToDonateSection } from "@/domains/home/lib/donation";

const CONTAINER = "max-w-[1200px] 2xl:max-w-[1600px] mx-auto px-6";

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="body-md"
      className="font-figtree font-bold text-[#FFD638] whitespace-nowrap"
    >
      {children}
    </Typography>
  );
}

export function FooterMain() {
  const pathname = usePathname();
  const router = useRouter();

  const markInternalNav = () => {
    sessionStorage.setItem("suppress_overlay", "true");
    sessionStorage.setItem("ihdua_nav_time", Date.now().toString());
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    markInternalNav();
    if (isHomePath(pathname)) {
      e.preventDefault();
      void smoothScrollToTop();
    }
  };

  const handleDonateClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    markInternalNav();
    if (isHomePath(pathname)) {
      void scrollToDonateSection();
    } else {
      sessionStorage.setItem("scroll_to_donate", "true");
      router.push("/");
    }
  };

  const handleOurImpactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    markInternalNav();
    const navOffset = typeof window !== "undefined" && window.innerWidth >= 1024 ? 80 : 64;
    if (isHomePath(pathname)) {
      void smoothScrollToId("our-impact", navOffset);
    } else {
      sessionStorage.setItem("scroll_to_our_impact", "true");
      router.push("/");
    }
  };

  const handleGetInvolvedClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    markInternalNav();
    if (isHomePath(pathname)) {
      void smoothScrollToId("get-involved", 80);
    } else {
      sessionStorage.setItem("scroll_to_get_involved", "true");
      router.push("/");
    }
  };


  return (
    <div className={`${CONTAINER} pb-2 lg:py-8`}>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-[minmax(320px,1fr)_auto] lg:items-start lg:gap-x-12 lg:gap-y-0">
        <div className="col-span-2 space-y-2 sm:col-span-3 lg:col-span-1 lg:max-w-md lg:shrink-0">
          <div className="flex justify-center lg:justify-start">
            <Link
              href="/"
              onClick={handleHomeClick}
              aria-label="IHDUA Home"
            >
              <img
                src="/idhualogo1.png"
                alt="IHDUA logo"
                className="h-20 w-40 object-contain transition-opacity hover:opacity-90"
              />
            </Link>
          </div>
          <Typography
            variant="body-md"
            className="mx-auto text-center text-white font-manrope font-regular lg:mx-0 lg:text-left"
          >
            IHDUA (International Human Development and Upliftment Academy) is a
            registered social impact enterprise supporting village-led
            self-determination in Karnataka since 1990.
          </Typography>
          <div className="flex justify-center space-x-4 lg:justify-start">
            {FOOTER_SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={social.name}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition-opacity hover:opacity-90"
              >
                <img
                  src={social.icon}
                  alt={`${social.name} icon`}
                  className="h-5 w-5 object-contain"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Below 640px: 2 columns that hug their content and sit centered.
            640px and up: 3 columns. lg and up: a row. */}
        <div className="col-span-2 grid grid-cols-[auto_auto] justify-center gap-x-12 gap-y-10 sm:col-span-3 sm:grid-cols-3 sm:justify-normal sm:gap-x-8 lg:col-span-1 lg:flex lg:flex-row lg:items-start lg:gap-x-8 xl:gap-x-16 2xl:gap-x-24">
          <div className="col-span-1">
            <FooterHeading>WHAT WE DO</FooterHeading>
            <ul className="mt-3 space-y-3 text-nowrap lg:mt-8">
              {FOOTER_WHAT_WE_DO.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      markInternalNav();
                      if (item.label === "Our Impact") {
                        handleOurImpactClick(e);
                      } else if (item.href === "/" && isHomePath(pathname)) {
                        e.preventDefault();
                        void smoothScrollToTop();
                      }
                    }}
                    className="text-white transition-colors hover:text-[#FFD638]"
                  >
                    <Typography
                      variant="body-md"
                      className="font-regular font-manrope"
                    >
                      {item.label}
                    </Typography>
                  </Link>
                </li>
              ))}

            </ul>
          </div>

          <div className="col-span-1">
            <FooterHeading>GET INVOLVED</FooterHeading>
            <ul className="mt-3 space-y-3 lg:mt-8">
              {FOOTER_GET_INVOLVED.map((item) => (
                <li key={item.label}>
                  <Link
                    href="/"
                    onClick={item.label === "Donate" ? handleDonateClick : handleGetInvolvedClick}
                    className="text-white transition-colors hover:text-[#FFD638]"
                  >
                    <Typography
                      variant="body-md"
                      className="font-regular font-manrope"
                    >
                      {item.label}
                    </Typography>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <FooterHeading>HEADQUARTERS</FooterHeading>
            <div className="mt-3 space-y-3 lg:mt-8">
              <Typography
                variant="body-md"
                className="max-w-[220px] xl:max-w-[260px] text-white font-regular font-manrope"
              >
                {FOOTER_HEADQUARTERS.address}
              </Typography>
              <a
                href={FOOTER_HEADQUARTERS.emailLink}
                translate="no"
                className="notranslate block text-white transition-colors hover:text-[#FFD638]"
              >
                <Typography
                  variant="body-md"
                  className="font-regular font-manrope"
                >
                  {FOOTER_HEADQUARTERS.email}
                </Typography>
              </a>
              <a
                href={FOOTER_HEADQUARTERS.phoneLink}
                className="block text-white transition-colors hover:text-[#FFD638]"
              >
                <Typography
                  variant="body-md"
                  className="font-regular font-manrope"
                >
                  {FOOTER_HEADQUARTERS.phone}
                </Typography>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
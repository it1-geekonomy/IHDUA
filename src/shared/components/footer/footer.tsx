"use client";

import Link from "next/link";
import {
  FOOTER_WHAT_WE_DO,
  FOOTER_GET_INVOLVED,
  FOOTER_HEADQUARTERS,
  FOOTER_SOCIAL_LINKS,
} from "@/shared/constants/footer";
import { useSimpleLanguage } from "@/context/SimpleLanguageContext";
import { LANGUAGES } from "@/utils/languageHelper";
import MovementMarquee from "@/domains/home/components/Movementmarquee";
import Typography from "@/lib/Typography";

const CONTAINER = "max-w-[1200px] 2xl:max-w-[1600px] mx-auto px-6";

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="body-lg" className="font-figtree font-bold text-[#FFD638]">
      {children}
    </Typography>
  );
}

function Logo() {
  return (
    <div className="flex justify-center lg:justify-start">
      <img src="/idhualogo1.png" alt="IHDUA logo" className="h-20 w-40 object-contain" />
    </div>
  );
}

export default function Footer() {
  const { language, setLanguage, isChanging } = useSimpleLanguage();

  return (
    <footer className="bg-[#9739A8] text-white">
      <MovementMarquee/>
      <div className={`${CONTAINER} lg:py-8`}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[minmax(320px,1fr)_auto] gap-x-6 md:gap-x-8 gap-y-10 lg:gap-y-0 lg:gap-x-12 lg:items-start">
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-2 lg:max-w-md lg:shrink-0">
            <Logo />
            <Typography variant="body-lg" className="text-white text-center lg:text-left mx-auto lg:mx-0 font-manrope font-regular">
              IHDUA (International Human Development and Upliftment Academy)
              is a registered social impact enterprise supporting village-led
              self-determination in Karnataka since 1990.
            </Typography>
            <div className="flex space-x-4 justify-center lg:justify-start">
              {FOOTER_SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <img src={social.icon} alt={`${social.name} icon`} className="w-5 h-5 object-contain" />
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-2 md:col-span-3 lg:col-span-1 grid grid-cols-2 md:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-10 lg:flex lg:flex-row lg:items-start lg:gap-x-16 xl:gap-x-20 2xl:gap-x-24">
            <div className="col-span-1">
              <FooterHeading>WHAT WE DO</FooterHeading>
              <ul className="mt-8 space-y-3 text-nowrap">
                {FOOTER_WHAT_WE_DO.map((label) => (
                  <li key={label}>
                    <Link href="/" className="text-white hover:text-[#FFD638] transition-colors">
                      <Typography variant="body-lg" className="font-regular font-manrope">
                        {label}
                      </Typography>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-1">
              <FooterHeading>GET INVOLVED</FooterHeading>
              <ul className="mt-8 space-y-3">
                {FOOTER_GET_INVOLVED.map((label) => (
                  <li key={label}>
                    <Link href="/" className="text-white hover:text-[#FFD638] transition-colors">
                      <Typography variant="body-lg" className="font-regular font-manrope">
                        {label}
                      </Typography>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <FooterHeading>HEADQUARTERS</FooterHeading>
              <div className="mt-8 space-y-3">
                <Typography variant="body-lg" className="text-white font-regular font-manrope max-w-[260px]">
                  {FOOTER_HEADQUARTERS.address}
                </Typography>
                <a href={FOOTER_HEADQUARTERS.emailLink}
  translate="no"
  className="notranslate block text-white hover:text-[#FFD638] transition-colors"
>
  <Typography variant="body-lg" className="font-regular font-manrope">
    {FOOTER_HEADQUARTERS.email}
  </Typography>
</a>
                <a href={FOOTER_HEADQUARTERS.phoneLink} className="block text-white hover:text-[#FFD638] transition-colors">
                  <Typography variant="body-lg" className="font-regular font-manrope">
                    {FOOTER_HEADQUARTERS.phone}
                  </Typography>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FFD638] py-2">
        <div className={CONTAINER}>
          <div className="flex flex-col lg:flex-row justify-between items-center gap-1 lg:gap-0">
            <Typography variant="body-sm" className="text-[#00191B] font-regular font-figtree">
              © {new Date().getFullYear()} IHDUA. All rights reserved.
            </Typography>

            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
              <Link href="/" className="text-[#00191B] hover:underline">
                <Typography variant="body-sm" className="font-regular font-figtree">
                  Privacy Policy
                </Typography>
              </Link>
              <Link href="/" className="text-[#00191B] hover:underline">
                <Typography variant="body-sm" className="font-regular font-figtree">
                  Terms of Service
                </Typography>
              </Link>

              <div
                className={`flex items-center gap-1 rounded-full bg-black px-1 py-1 transition-opacity ${
                  isChanging ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => setLanguage(LANGUAGES.ENGLISH)}
                  disabled={isChanging}
                  className="px-3 py-1 transition-colors"
                >
                  <Typography
                    variant="body-sm"
                    className={`font-figtree ${
                      language === LANGUAGES.ENGLISH ? "text-white font-bold" : "text-[#A9C1C2] font-normal"
                    }`}
                  >
                    English
                  </Typography>
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage(LANGUAGES.KANNADA)}
                  disabled={isChanging}
                  className="px-3 py-1 transition-colors"
                >
                  <Typography
                    variant="body-sm"
                    className={`font-figtree ${
                      language === LANGUAGES.KANNADA ? "text-white font-bold" : "text-[#A9C1C2] font-normal"
                    }`}
                  >
                    ಕನ್ನಡ
                  </Typography>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
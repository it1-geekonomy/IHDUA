import Link from "next/link";
import {
  FOOTER_GET_INVOLVED,
  FOOTER_HEADQUARTERS,
  FOOTER_SOCIAL_LINKS,
  FOOTER_WHAT_WE_DO,
} from "@/shared/constants/footer";
import Typography from "@/lib/Typography";

const CONTAINER = "max-w-[1200px] 2xl:max-w-[1600px] mx-auto px-6";

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="body-lg" className="font-figtree font-bold text-[#FFD638]">
      {children}
    </Typography>
  );
}

export function FooterMain() {
  return (
    <div className={`${CONTAINER} lg:py-8`}>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 md:gap-x-8 lg:grid-cols-[minmax(320px,1fr)_auto] lg:items-start lg:gap-x-12 lg:gap-y-0">
        <div className="col-span-2 space-y-2 md:col-span-3 lg:col-span-1 lg:max-w-md lg:shrink-0">
          <div className="flex justify-center lg:justify-start">
            <img
              src="/idhualogo1.png"
              alt="IHDUA logo"
              className="h-20 w-40 object-contain"
            />
          </div>
          <Typography
            variant="body-lg"
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

        <div className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-10 md:col-span-3 md:grid-cols-3 md:gap-x-8 lg:col-span-1 lg:flex lg:flex-row lg:items-start lg:gap-x-16 xl:gap-x-20 2xl:gap-x-24">
          <div className="col-span-1">
            <FooterHeading>WHAT WE DO</FooterHeading>
            <ul className="mt-8 space-y-3 text-nowrap">
              {FOOTER_WHAT_WE_DO.map((label) => (
                <li key={label}>
                  <Link href="/" className="text-white transition-colors hover:text-[#FFD638]">
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
                  <Link href="/" className="text-white transition-colors hover:text-[#FFD638]">
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
              <Typography
                variant="body-lg"
                className="max-w-[260px] text-white font-regular font-manrope"
              >
                {FOOTER_HEADQUARTERS.address}
              </Typography>
              <a
                href={FOOTER_HEADQUARTERS.emailLink}
                translate="no"
                className="notranslate block text-white transition-colors hover:text-[#FFD638]"
              >
                <Typography variant="body-lg" className="font-regular font-manrope">
                  {FOOTER_HEADQUARTERS.email}
                </Typography>
              </a>
              <a
                href={FOOTER_HEADQUARTERS.phoneLink}
                className="block text-white transition-colors hover:text-[#FFD638]"
              >
                <Typography variant="body-lg" className="font-regular font-manrope">
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

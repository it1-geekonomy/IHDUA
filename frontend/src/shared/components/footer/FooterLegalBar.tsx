import Link from "next/link";
import Typography from "@/lib/Typography";
import { LanguageToggle } from "./LanguageToggle";

const CONTAINER = "max-w-[1200px] 2xl:max-w-[1600px] mx-auto px-6";

export function FooterLegalBar() {
  return (
    <div className="bg-[#FFD638] py-2">
      <div className={CONTAINER}>
        <div className="flex w-full flex-col gap-1.5 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
          <Typography
            variant="body-sm"
            className="order-3 self-center text-center text-[#00191B] font-regular font-figtree lg:order-1 lg:self-auto lg:text-left"
          >
            © {new Date().getFullYear()} IHDUA. All rights reserved.
          </Typography>

          <a
            href="https://thegeekonomy.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="order-2 self-center text-center text-[#00191B] transition-opacity hover:opacity-80 lg:order-2 lg:self-auto"
          >
            <Typography variant="body-sm" className="font-regular font-figtree">
              Designed &amp; Developed By Geekonomy
            </Typography>
          </a>

          <div className="order-1 flex w-full items-center justify-between gap-3 lg:order-3 lg:w-auto lg:justify-end lg:gap-4">
            <div className="flex items-center gap-4">
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
            </div>
            <LanguageToggle />
          </div>
        </div>
      </div>
    </div>
  );
}

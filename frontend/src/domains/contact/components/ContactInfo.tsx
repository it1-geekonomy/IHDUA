import Image from "next/image";
import Typography from "@/lib/Typography";
import { CONTACT_ITEMS } from "../const/contactsection";

// Divider between offices (Figma): #9739A8 at 0% opacity -> #692875 solid in the middle -> #9739A8 at 30% opacity
const DIVIDER_GRADIENT =
  "linear-gradient(90deg, rgba(151, 57, 168, 0) 0%, #692875 50%, rgba(151, 57, 168, 0.3) 100%)";

// ===== Contact links (mailto / tel) =====
const EMAIL_LINK_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_LINK_RE = /^\+?[\d\s()-]+$/;

function getContactHref(text: string): string | null {
  const value = text.trim();
  if (EMAIL_LINK_RE.test(value)) return `mailto:${value}`;
  if (PHONE_LINK_RE.test(value) && value.replace(/\D/g, "").length >= 7) {
    return `tel:${value.replace(/[^\d+]/g, "")}`;
  }
  return null;
}

// ===== Left side: heading, description and contact details =====
export default function ContactInfo() {
  return (
    <div className="flex flex-col gap-6 xl:pr-20">
      {/* Label + heading + description: tighter gaps below 1024px */}
      <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
        {/* Label: centered below 640px */}
        <div className="flex items-center justify-center gap-3 sm:justify-start">
          <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
          <Typography variant="caption" className="font-bold font-figtree uppercase text-[#9739A8]">
            Contact Us
          </Typography>
          <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
        </div>

        <Typography
          variant="h3"
          as="h2"
          className="w-full text-center font-lora font-normal text-[#00191B] sm:text-left"
        >
          We’d Love to Hear From You
        </Typography>

        <Typography
          variant="body-lg"
          className="text-center font-figtree font-normal leading-relaxed text-[#5F6C6D] sm:text-left"
        >
          IHDUA works to support rural communities through education, healthcare, women’s
          empowerment, skill development, and sustainable livelihoods. Contact us to learn more
          about our work or discuss opportunities to connect with our team.
        </Typography>
      </div>

      <ul className="flex flex-col gap-6">
        {CONTACT_ITEMS.map((item, i) => {
          // Divider goes under an office when the next entry has no title (i.e. is another office)
          const next = CONTACT_ITEMS[i + 1];
          const showDivider = !!next && !next.title;

          return (
            <li key={i} className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#EDE3FA]">
                <Image src={item.iconSrc} alt={item.alt} width={22} height={22} className="size-5.5 object-contain" />
              </span>

              {/* Column is as wide as its longest line, so the divider matches the description width */}
              <div className="flex min-w-0 flex-col gap-1">
                {item.title && (
                  <Typography as="h3" variant="body-lg" className="font-semibold text-[#9739A8]">
                    {item.title}
                  </Typography>
                )}
                {item.lines.map((line) => {
                  const href = getContactHref(line.text);
                  return (
                    <div key={line.text} className="flex items-center gap-2">
                      {href ? (
                        <a
                          href={href}
                          className="group transition-colors hover:underline focus-visible:underline focus-visible:outline-none"
                        >
                          <Typography
                            as="span"
                            variant="body-sm"
                            className="font-figtree font-normal text-[#5F6C6D] transition-colors group-hover:text-[#9739A8] group-focus-visible:text-[#9739A8]"
                          >
                            {line.text}
                          </Typography>
                        </a>
                      ) : (
                        <Typography variant="body-sm" className="font-figtree font-normal text-[#5F6C6D]">
                          {line.text}
                        </Typography>
                      )}
                      {line.flagSrc && (
                        <Image
                          src={line.flagSrc}
                          alt={line.flagAlt ?? ""}
                          width={20}
                          height={14}
                          className="h-3.5 w-5 object-contain"
                        />
                      )}
                    </div>
                  );
                })}

                {showDivider && (
                  <div
                    aria-hidden="true"
                    className="mt-5 h-px self-stretch"
                    style={{ backgroundImage: DIVIDER_GRADIENT }}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
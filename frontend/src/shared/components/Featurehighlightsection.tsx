import type { ReactNode } from "react";
import Typography from "@/lib/Typography";
import { cn } from "@/lib/utils";
import { COLORS,CARD_GRADIENT,} from "@/shared/constants/featuredhighlight";
export interface FeatureItem {
  icon: ReactNode | string;
  iconAlt?: string;
  heading: string;
  description?: string;
}

export interface FeatureButton {
  label: string;
  href?: string;
  external?: boolean;
}

export interface FeatureHighlightSectionProps {
  label?: string;
  heading: ReactNode;
  description?: string;
  button?: FeatureButton;
  items: FeatureItem[];
  className?: string;
}

interface IconBadgeProps {
  icon: ReactNode | string;
  alt?: string;
}

const ArrowUpRight = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-[clamp(0.875rem,0.8rem+0.3vw,1.25rem)] w-[clamp(0.875rem,0.8rem+0.3vw,1.25rem)] shrink-0"
  >
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

const IconBadge = ({ icon, alt = "" }: IconBadgeProps) => (
  <span
    className="inline-flex shrink-0 items-center justify-center rounded-full border bg-white p-[clamp(0.1875rem,0.3vw,0.375rem)]"
    style={{ borderColor: `${COLORS.iconBorder}80` }} // 80 hex = 50% alpha
  >
    <span className="flex h-[clamp(2.5rem,1.4rem+3.4vw,3.75rem)] w-[clamp(2.5rem,1.4rem+3.4vw,3.75rem)] items-center justify-center overflow-hidden rounded-full lg:h-[clamp(3rem,2rem+2.5vw,3.75rem)] lg:w-[clamp(3rem,2rem+2.5vw,3.75rem)]">
      {typeof icon === "string" ? (
        <img src={icon} alt={alt} className="h-full w-full object-contain" />
      ) : (
        icon
      )}
    </span>
  </span>
);
const FeatureHighlightSection = ({
  label,
  heading,
  description,
  button,
  items,
  className,
}: FeatureHighlightSectionProps) => {
  return (
    <section className={cn("w-full bg-[#FFFFFF] py-8 sm:py-10 lg:py-14", className)}>
      <div className="w-full max-w-[90rem] 2xl:max-w-[97.5rem] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12 xl:gap-16">
        <div className="flex w-full flex-col items-center gap-[clamp(0.625rem,0.4rem+0.8vw,1rem)] text-center sm:items-start sm:text-left lg:w-[42%] lg:shrink-0 xl:w-[38%]">
          {label && (
            <div
              className="flex items-center gap-2"
              style={{ color: COLORS.primary }}
            >
              <span
                aria-hidden="true"
                className="h-px w-[clamp(1.25rem,1rem+1vw,1.75rem)] bg-current"
              />
              <Typography
                variant="caption"
                className="m-0 font-figtree font-bold uppercase tracking-[0.08em]"
              >
                {label}
              </Typography>
              <span
                aria-hidden="true"
                className="h-px w-[clamp(1.25rem,1rem+1vw,1.75rem)] bg-current"
              />
            </div>
          )}
          <Typography
            variant="h2"
            className="font-lora"
            style={{ color: COLORS.heading }}
          >
            {heading}
          </Typography>

          {description && (
            <Typography
              variant="body-lg"
              className="font-figtree font-normal text-left leading-relaxed"
              style={{ color: COLORS.body }}
            >
              {description}
            </Typography>
          )}

          {button?.label && (
            <a
              href={button.href ?? "#"}
              target={button.external ? "_blank" : undefined}
              rel={button.external ? "noopener noreferrer" : undefined}
              className="mt-[clamp(0.25rem,0.5vw,0.75rem)] inline-flex items-center gap-2 px-[clamp(0.875rem,0.6rem+1vw,1.25rem)] py-[clamp(0.5rem,0.4rem+0.4vw,0.75rem)] transition-[filter] duration-200 hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ backgroundColor: COLORS.button, color: COLORS.heading }}
            >
              <Typography
                variant="body-lg"
                className="m-0 font-figtree font-normal"
              >
                {button.label}
              </Typography>
              <ArrowUpRight />
            </a>
          )}
        </div>

        <div
          className="w-full px-[clamp(1rem,0.5rem+2vw,3rem)] py-[clamp(1.25rem,0.8rem+2vw,2.75rem)] lg:min-w-0 lg:flex-1"
          style={{ backgroundImage: CARD_GRADIENT }}
        >
          <ul className="grid grid-cols-1 gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-[clamp(1.25rem,2.5vw,2rem)] sm:grid-cols-2">
            {items.map(
              ({ icon, iconAlt, heading: itemHeading, description: itemDesc }, i) => (
                <li
                  key={`${itemHeading}-${i}`}
                  className="flex items-start gap-[clamp(0.75rem,0.5rem+1vw,1.25rem)]"
                >
                  <IconBadge icon={icon} alt={iconAlt} />
                  <div className="flex min-w-0 flex-col gap-1">
                    <Typography
                      variant="h4"
                      className="m-0 font-figtree font-medium"
                      style={{ color: COLORS.primary }}
                    >
                      {itemHeading}
                    </Typography>
                    {itemDesc && (
                      <Typography
                        variant="body-sm"
                        className="m-0 font-figtree font-normal"
                        style={{ color: COLORS.body }}
                      >
                        {itemDesc}
                      </Typography>
                    )}
                  </div>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </section>
  );
};
export default FeatureHighlightSection;
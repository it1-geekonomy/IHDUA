import { Award, BookOpen, Landmark, UsersRound } from "lucide-react";
import Typography from "@/lib/Typography";

export interface FeatureItem {
  title: string;
  description: string;
  icon: "savings" | "learning" | "groups" | "credit";
}

const ICONS = {
  savings: Landmark,
  learning: BookOpen,
  groups: UsersRound,
  credit: Award,
};

interface InitiativeStrongerTogetherProps {
  label?: string;
  title?: string;
  paragraphs?: readonly string[];
  items?: readonly FeatureItem[];
}

const DEFAULT_ITEMS: FeatureItem[] = [
  {
    title: "Regular Savings",
    description: "Small contributions create opportunities.",
    icon: "savings",
  },
  {
    title: "Training & Guidance",
    description: "Learn financial management and responsibility.",
    icon: "learning",
  },
  {
    title: "Peer Support",
    description: "Grow together through shared knowledge.",
    icon: "groups",
  },
  {
    title: "Access to Credit",
    description: "Affordable loans for real needs.",
    icon: "credit",
  },
];

export default function InitiativeStrongerTogether({
  label = "HOW WE SUPPORT",
  title = "Stronger Together",
  paragraphs = [
    "At the heart of this initiative are self-help groups. Members regularly contribute a small amount to a common fund, building financial security and mutual support.",
    "This simple practice helps build financial discipline, strengthens mutual support and creates a resource women can access when needed.",
  ],
  items = DEFAULT_ITEMS,
}: InitiativeStrongerTogetherProps) {
  return (
    <section className="w-full bg-[#FAF5FB] py-10 lg:py-14">
      <div className="w-full px-4 sm:px-10 lg:px-20 2xl:px-40">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          {/* Left Column: Heading & Text */}
          <div className="flex flex-col gap-4 lg:max-w-[50%]">
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
              <Typography
                variant="caption"
                className="font-figtree font-bold uppercase tracking-wider text-[#9739A8]"
              >
                {label}
              </Typography>
            </div>

            <Typography variant="h2" className="font-lora text-[#00191B]">
              {title}
            </Typography>

            <div className="flex flex-col gap-3">
              {paragraphs.map((p, idx) => (
                <Typography
                  key={idx}
                  variant="body-lg"
                  className="font-figtree font-normal leading-relaxed text-[#5F6C6D]"
                >
                  {p}
                </Typography>
              ))}
            </div>
          </div>

          {/* Right Column: 2x2 Feature Grid */}
          <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2">
            {items.map((item, idx) => {
              const Icon = ICONS[item.icon] || Landmark;
              return (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#9739A8] text-white shadow-xs">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Typography
                      variant="body-lg"
                      className="font-figtree font-bold text-[#00191B]"
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body-sm"
                      className="font-figtree font-normal text-[#5F6C6D] leading-snug"
                    >
                      {item.description}
                    </Typography>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

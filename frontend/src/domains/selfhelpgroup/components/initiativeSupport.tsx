import { Award, BookOpen, Landmark, UsersRound } from "lucide-react";
import Typography from "@/lib/Typography";
import { cn } from "@/lib/utils";

export interface SupportItem {
  title: string;
  description: string;
  icon: "groups" | "savings" | "learning" | "leadership";
  tone: "plum" | "gold";
}

interface InitiativeSupportProps {
  label?: string;
  title: string;
  description: string;
  items: readonly SupportItem[];
}

const ICONS = {
  groups: UsersRound,
  savings: Landmark,
  learning: BookOpen,
  leadership: Award,
};

export default function InitiativeSupport({
  label = "HOW WE SUPPORT WOMEN",
  title,
  description,
  items,
}: InitiativeSupportProps) {
  return (
    <section className="w-full">
      {/* Label with decorative line */}
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="h-px w-6 bg-[#9739A8]" />
        <Typography
          variant="caption"
          className="font-figtree font-bold uppercase tracking-wider text-[#9739A8]"
        >
          {label}
        </Typography>
      </div>

      {/* Heading & description */}
      <Typography variant="h2" className="mt-4 font-lora text-[#00191B]">
        {title}
      </Typography>
      <Typography
        variant="body-lg"
        className="mt-3 max-w-4xl font-figtree font-normal leading-relaxed text-[#5F6C6D]"
      >
        {description}
      </Typography>

      {/* 4 Cards Grid */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {items.map((item) => {
          const Icon = ICONS[item.icon] || UsersRound;
          const isGold = item.tone === "gold";

          return (
            <div
              key={item.title}
              className={cn(
                "flex flex-col justify-between p-6 transition-transform hover:-translate-y-1 duration-200",
                isGold ? "bg-[#FFF6E5]" : "bg-[#F8F0F8]",
              )}
            >
              <div>
                {/* Circular badge */}
                <div
                  className={cn(
                    "mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-xs",
                    isGold ? "text-[#E6AC20]" : "text-[#9739A8]",
                  )}
                >
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </div>

                <Typography
                  variant="body-lg"
                  className="font-figtree font-bold text-[#00191B]"
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body-sm"
                  className="mt-2 font-figtree font-normal leading-relaxed text-[#5F6C6D]"
                >
                  {item.description}
                </Typography>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

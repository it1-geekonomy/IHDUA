import { cn } from "@/lib/utils";
import { LASTING_CHANGE } from "@/domains/home/constants/lastingchange";

const CHART_POINTS = [
  { x: 52, y: 68, year: "2024" },
  { x: 160, y: 40, year: "2025" },
  { x: 268, y: 12, year: "2026" },
] as const;

const CHART_BASELINE = 84;
const CHART_DOTTED = "1.5 3.5";

type PurpleStatsCardProps = {
  className?: string;
  compact?: boolean;
};

export function PurpleStatsCard({
  className,
  compact = false,
}: PurpleStatsCardProps) {
  return (
    <div
      className={cn(
        "flex aspect-square w-full min-w-0 flex-col justify-between overflow-hidden bg-[#B46CC2] text-white",
        compact ? "p-4" : "p-5 xl:p-6",
        className
      )}
    >
      <div>
        <p
          className={cn(
            "font-figtree font-bold leading-none tracking-tight",
            compact ? "text-[34px]" : "text-[40px] xl:text-[52px]"
          )}
        >
          {LASTING_CHANGE.purpleCard.stat}
        </p>
        <p
          className={cn(
            "mt-1.5 font-figtree font-medium leading-snug",
            compact ? "text-[14px]" : "text-[16px] xl:text-[20px]"
          )}
        >
          {LASTING_CHANGE.purpleCard.label}
        </p>
      </div>

      <div className="w-full">
        <p
          className={cn(
            "mb-1 font-figtree font-normal text-white/90",
            compact ? "text-[11px]" : "text-[12px] xl:text-[14px]"
          )}
        >
          {LASTING_CHANGE.purpleCard.note}
        </p>

        <svg
          viewBox="0 0 320 108"
          className="h-auto w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <line
            x1="12"
            y1={CHART_BASELINE}
            x2="308"
            y2={CHART_BASELINE}
            stroke="#FFFFFF"
            strokeWidth="1.25"
            strokeDasharray={CHART_DOTTED}
            strokeLinecap="round"
          />
          {CHART_POINTS.map((point) => (
            <line
              key={`guide-${point.year}`}
              x1={point.x}
              y1={point.y}
              x2={point.x}
              y2={CHART_BASELINE}
              stroke="#FFFFFF"
              strokeWidth="1.25"
              strokeDasharray={CHART_DOTTED}
              strokeLinecap="round"
            />
          ))}
          <path
            d="M 12 78
               C 28 76, 38 72, 52 68
               C 92 56, 120 48, 160 40
               C 210 28, 236 18, 268 12"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {CHART_POINTS.map((point) => (
            <circle
              key={`dot-${point.year}`}
              cx={point.x}
              cy={point.y}
              r="5"
              fill="#FFFFFF"
            />
          ))}
          {CHART_POINTS.map((point) => (
            <text
              key={`year-${point.year}`}
              x={point.x}
              y={CHART_BASELINE + 18}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="12"
              fontFamily="var(--font-manrope), Manrope, sans-serif"
            >
              {point.year}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

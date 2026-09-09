import Image from "next/image";
import Link from "next/link";
import Typography, { figmaTypeScale } from "@/lib/Typography";
import { LASTING_CHANGE } from "@/domains/home/constants/lastingchange";

function ImageCard({
  image,
  label,
  className = "",
}: {
  image: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`relative aspect-square w-full overflow-hidden ${className}`}>
      <Image
        src={image}
        alt={label}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 25vw"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-white/[0.005] px-3 py-3 backdrop-blur-[15px] sm:py-3.5">
        <p
          className={`text-center font-manrope font-semibold text-white ${figmaTypeScale[18]}`}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

function YellowImpactCard() {
  return (
    <div className="relative aspect-square w-full overflow-hidden bg-[#FFD638] p-5 xl:p-7">
      <Typography
        variant="h4"
        className="relative z-10 font-lora font-semibold leading-snug text-[#00191B]"
      >
        {LASTING_CHANGE.yellowCard.title}
      </Typography>
      <Typography
        variant="body-lg"
        className="relative z-10 mt-3 max-w-[15rem] font-figtree leading-relaxed text-[#00191B]/90"
      >
        {LASTING_CHANGE.yellowCard.description}
      </Typography>
      <Image
        src={LASTING_CHANGE.yellowCard.seal}
        alt=""
        width={140}
        height={140}
        className="pointer-events-none absolute bottom-0 right-0 size-[120px] object-contain xl:size-[140px]"
      />
    </div>
  );
}

function PurpleStatsCard({ className = "" }: { className?: string }) {
  const points = [
    { x: 52, y: 68, year: "2024" },
    { x: 160, y: 40, year: "2025" },
    { x: 268, y: 12, year: "2026" },
  ] as const;
  const baseline = 84;
  const dotted = "1.5 3.5";

  return (
    <div
      className={`flex aspect-square w-full flex-col justify-between bg-[#B46CC2] p-5 text-white xl:p-6 ${className}`}
    >
      <div>
        <p className="font-manrope text-[40px] font-bold leading-none tracking-tight xl:text-[52px]">
          {LASTING_CHANGE.purpleCard.stat}
        </p>
        <p className="mt-1.5 font-manrope text-[16px] font-medium leading-snug xl:text-[20px]">
          {LASTING_CHANGE.purpleCard.label}
        </p>
      </div>

      <div className="w-full">
        <p className="mb-1 font-figtree text-[12px] font-normal text-white/90 xl:text-[14px]">
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
            y1={baseline}
            x2="308"
            y2={baseline}
            stroke="#FFFFFF"
            strokeWidth="1.25"
            strokeDasharray={dotted}
            strokeLinecap="round"
          />
          {points.map((p) => (
            <line
              key={`guide-${p.year}`}
              x1={p.x}
              y1={p.y}
              x2={p.x}
              y2={baseline}
              stroke="#FFFFFF"
              strokeWidth="1.25"
              strokeDasharray={dotted}
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
          {points.map((p) => (
            <circle key={`dot-${p.year}`} cx={p.x} cy={p.y} r="5" fill="#FFFFFF" />
          ))}
          {points.map((p) => (
            <text
              key={`year-${p.year}`}
              x={p.x}
              y={baseline + 18}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="12"
              fontFamily="var(--font-manrope), Manrope, sans-serif"
            >
              {p.year}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

export default function LastingChangeSection() {
  const [community, livelihoods, education] = LASTING_CHANGE.imageCards;

  return (
    <section className="w-full bg-white">
      <div className="w-full px-6 py-10 lg:px-10 lg:py-16 2xl:px-40">
        {/* Mobile / tablet stack */}
        <div className="flex flex-col gap-5 lg:hidden">
          <ImageCard image={community.image} label={community.label} />
          <YellowImpactCard />

          <div>
            <Typography
              variant="h2"
              className="font-lora font-medium leading-tight text-[#00191B]"
            >
              {LASTING_CHANGE.headline}
            </Typography>
            <Typography
              variant="body-lg"
              className="mt-4 font-figtree leading-relaxed text-[#5F6C6D]"
            >
              {LASTING_CHANGE.body}
            </Typography>
          </div>

          <ImageCard image={livelihoods.image} label={livelihoods.label} />
          <ImageCard image={education.image} label={education.label} />
          <PurpleStatsCard />

          <div>
            <Typography
              variant="body-lg"
              className="font-figtree leading-relaxed text-[#5F6C6D]"
            >
              {LASTING_CHANGE.ctaText}
            </Typography>
            <Link
              href={LASTING_CHANGE.ctaHref}
              className={`mt-5 inline-flex items-center gap-2 bg-[#FFD638] px-5 py-3 ${figmaTypeScale[15]} font-manrope font-bold text-[#1E1E1E] transition-opacity hover:opacity-90`}
            >
              Get Involved
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

  
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-4 xl:gap-5 2xl:gap-6">
          <ImageCard image={community.image} label={community.label} />
          <YellowImpactCard />

          <div className="col-span-2 flex flex-col justify-center items-end px-2 xl:px-4">
            <Typography
              className={`max-w-[34rem] font-lora font-normal leading-tight! ${figmaTypeScale[50]} `}
            >
              {LASTING_CHANGE.headline}
            </Typography>
            <Typography
              variant="body-lg"
              className="mt-4 max-w-[34rem] font-figtree leading-relaxed text-[#5F6C6D] xl:mt-5"
            >
              {LASTING_CHANGE.body}
            </Typography>
          </div>

          <div className="flex flex-col justify-center gap-6 xl:gap-8">
            <Typography
              variant="body-lg"
              className="font-figtree leading-relaxed text-[#5F6C6D]"
            >
              {LASTING_CHANGE.ctaText}
            </Typography>
            <Link
              href={LASTING_CHANGE.ctaHref}
              className={`inline-flex w-fit items-center gap-2 rounded-sm bg-[#FFD638] px-5 py-3 ${figmaTypeScale[15]} font-manrope font-bold text-[#1E1E1E] transition-opacity hover:opacity-90`}
            >
              Get Involved
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <ImageCard image={livelihoods.image} label={livelihoods.label} />
          <ImageCard image={education.image} label={education.label} />
          <PurpleStatsCard />
        </div>
      </div>
    </section>
  );
}

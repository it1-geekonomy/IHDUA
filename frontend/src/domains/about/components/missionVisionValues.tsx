import Image from "next/image"; // use <img> if you're not on Next.js
import Typography from "@/lib/Typography";
import { MISSION_VISION_VALUES } from "@/domains/about/constants/missionvisionvalues";

export default function MissionVisionValues() {
  return (
    <section className="w-full px-6 pb-6 lg:px-10 lg:pb-8 xl:pb-16 2xl:px-40">
      {/* 1 col → 2 + 1 centered (pyramid) → 3 cols */}
      <div className="flex flex-wrap justify-center gap-4 lg:gap-3">
        {MISSION_VISION_VALUES.map((item) => (
          // Border layer: 1px gradient border
          <article
            key={item.title}
            className="flex w-full p-px sm:w-[calc(50%-8px)] sm:max-w-[calc(50%-8px)] lg:w-[calc(33.333%-8px)] lg:max-w-none bg-gradient-to-br from-[#F7CAFF]/40 to-[#FDF0FF]/40"
          >
            {/* Fill layer: card background gradient */}
            <div
              className="
                flex-1 bg-gradient-to-br from-[#FBF9FC] to-[#FCF4FF]
                py-[clamp(20px,2.4vw,28px)]
                pl-[clamp(16px,2.6vw,36px)]
                pr-[clamp(16px,2vw,32px)]
                2xl:pr-[86px]
              "
            >
              {/* Icon circle: scales smoothly, smaller on lg, larger on xl+ */}
              <div className="flex h-[clamp(48px,5vw,72px)] w-[clamp(48px,5vw,72px)] items-center justify-center rounded-full bg-[#F5E8FA]">
                <Image
                  src={item.icon}
                  alt=""
                  width={32}
                  height={32}
                  className="h-[clamp(20px,2.2vw,32px)] w-[clamp(20px,2.2vw,32px)]"
                />
              </div>

              <Typography
                variant="body-xl"
                className="mt-[clamp(12px,1.5vw,20px)] font-lora text-[length:clamp(18px,1.7vw,24px)] text-[#00191B]"
              >
                {item.title}
              </Typography>

              <div className="mt-[clamp(8px,1vw,12px)]">
                {item.desc.map((line) => (
                  <Typography
                    key={line}
                    variant="body-lg"
                    className="font-figtree text-[length:clamp(13px,1.4vw,18px)] leading-[1.6] text-[#5F6C6D]"
                  >
                    {line}
                  </Typography>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
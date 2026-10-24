import Image from "next/image"; // use <img> if you're not on Next.js
import Typography from "@/lib/Typography";
import {
  LEADERS,
  LEADERSHIP_HEADING,
  LEADERSHIP_LABEL,
  LEADERSHIP_QUOTE,
} from "@/domains/about/constants/meetourleadership";

export default function MeetOurLeadership() {
  return (
    <section className="w-full px-6 pb-6 lg:px-10 lg:pb-8 xl:pb-14 2xl:px-40">
      {/* Label + heading */}
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-[clamp(8px,1vw,12px)]">
          <span className="h-px w-[clamp(20px,2.4vw,32px)] bg-[#9739A8]" />
          <Typography
            variant="caption"
            className="font-figtree font-bold uppercase text-[#9739A8]"
          >
            {LEADERSHIP_LABEL}
          </Typography>
          <span className="h-px w-[clamp(20px,2.4vw,32px)] bg-[#9739A8]" />
        </div>

        <Typography
          variant="h2"
          className="mt-[clamp(8px,1vw,12px)] font-lora font-light text-[#00191B]"
        >
          {LEADERSHIP_HEADING}
        </Typography>
      </div>

      {/* Leader cards */}
      <div className="mx-auto mt-[clamp(24px,4vw,64px)] grid w-full max-w-[calc(341px*2+96px)] grid-cols-2 justify-items-center gap-[clamp(16px,6vw,96px)]">
        {LEADERS.map((leader) => (
          <article key={leader.name} className="w-full max-w-[341px]">
            {/* Photo with gradient: #FFFFFF 0% → #A14DB1 100% */}
            <div className="relative aspect-[341/317] w-full overflow-hidden bg-gradient-to-b from-[#FFFFFF] from-0% to-[#A14DB1] to-100%">
              <Image
                src={leader.image}
                alt={leader.name}
                fill
                sizes="(min-width: 1024px) 341px, 45vw"
                className="object-cover object-top"
              />
            </div>

            {/* Name + designation card (gap above separates it from the photo) */}
            <div className="mt-[clamp(6px,0.8vw,10px)] bg-[#FDF4FF] px-[clamp(8px,1.2vw,16px)] py-[clamp(8px,1.2vw,16px)]">
              <Typography
                variant="body-lg"
                className="font-figtree font-bold text-[length:clamp(13px,1.4vw,18px)] leading-[1.4] text-[#684170]"
              >
                {leader.name}
              </Typography>
              <Typography
                variant="body-lg"
                className="font-figtree font-normal text-[length:clamp(11px,1.1vw,14px)] leading-[1.5] text-[#88698E]/[0.79]"
              >
                {leader.designation}
              </Typography>
            </div>
          </article>
        ))}
      </div>

      {/* Quote */}
      <div className="relative mx-auto mt-[clamp(32px,4vw,56px)] max-w-[calc(341px*2+96px)]">
        {/* Opening quote mark: moved further left (was -translate-x-1/2) */}
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 -translate-x-full -translate-y-[40%] font-lora text-[length:clamp(40px,5vw,64px)] font-bold leading-none text-[#684170]/30"
        >
          &ldquo;
        </span>

        {/* pt creates the space between the quote mark and the first line of text */}
        <Typography
          variant="body-lg"
          className="pt-[clamp(8px,1.2vw,16px)] text-center font-figtree font-normal text-[length:clamp(12px,1.2vw,15px)] leading-[1.7] text-[#5F6C6D]"
        >
          {LEADERSHIP_QUOTE}
        </Typography>
      </div>
    </section>
  );
}
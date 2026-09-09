import Image from "next/image";
import Typography from "@/lib/Typography";

export default function CTASection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[42vh] min-h-[420px] sm:h-[50vh] sm:min-h-[480px] lg:h-[60vh] lg:min-h-[560px] w-full">
        <Image
          src="/CTAsection/ctabgimg.jpg"
          alt="Rural community"
          fill
          priority
          className="object-cover"
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center sm:px-10">
          <Typography
            variant="h1"
            className="w-full lg:max-w-3xl font-lora font-normal leading-tight text-white"
          >
            Help Create Opportunities For Stronger Communities
          </Typography>

          <Typography
            variant="body-lg"
            className="mt-4 max-w-lg leading-relaxed text-white/90 sm:mt-6 sm:max-w-xl font-figtree font-normal"
          >
            Support IHDUA&apos;s work across education, empowerment,
            sustainable livelihoods and community development.
          </Typography>

          <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10 sm:flex-row sm:gap-6">
            <button className="w-48 bg-[#FFD638] px-6 py-3 sm:w-auto cursor-pointer">
              <Typography variant="body-sm" className="font-bold font-figtree text-[#00191B]">
                Donate Now
              </Typography>
            </button>
            <button className="w-48 border border-white px-6 py-3 sm:w-auto cursor-pointer">
              <Typography variant="body-sm" className="font-semibold font-figtree text-white">
                Explore Our Work
              </Typography>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
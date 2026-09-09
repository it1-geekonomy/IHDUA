import Image from "next/image";

export default function CTASection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[420px] w-full sm:h-[480px] lg:h-[560px]">
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
          <h2 className="max-w-3xl font-serif text-3xl leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Help Create Opportunities For Stronger Communities
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 sm:mt-6 sm:max-w-2xl sm:text-base lg:text-lg">
            Support IHDUA&apos;s work across education, empowerment,
            sustainable livelihoods and community development.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10 sm:flex-row sm:gap-6">
            <button className="w-48 bg-[#FFD638] px-6 py-3 text-sm font-semibold text-[#00191B] sm:w-auto">
              Donate Now
            </button>
            <button className="w-48 border border-white px-6 py-3 text-sm font-semibold text-white sm:w-auto">
              Explore Our Work
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
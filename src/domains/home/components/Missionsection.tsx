import { PILLARS } from "@/domains/home/constants/missionsection";
export default function MissionSection() {
  return (
    <section className="w-full bg-white">
      <div className="w-full px-6 pt-6 lg:py-6 lg:pb-26 lg:px-10 2xl:px-40">
        {/* Top row: eyebrow + heading on the left, description on the right */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#9739A8]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#9739A8]">
                Mission
              </span>
            </div>

            <h2 className="mt-4 font-serif text-3xl text-[#00191B] sm:text-4xl lg:text-5xl">
              The Mission of IHDUA
            </h2>
          </div>

          <p className="w-full lg:max-w-md xl:max-w-3xl text-sm leading-relaxed text-[#5F6C6D] sm:text-base lg:text-left">
            Building stronger communities through sustainable development.
            IHDUA works with rural communities to create better access to
            education, healthcare, sustainable livelihoods, and opportunities
            for long-term growth.
          </p>
        </div>

        {/* Two parts: pillar cards on the left, image on the right, matched heights */}
        <div className="mt-8 grid grid-cols-1 items-stretch gap-6 sm:mt-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-3 sm:gap-4">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.number}
                className="flex flex-1 items-center gap-4 border-l-4 border-[#9739A8] bg-[#FAF9F5] px-4 py-4 transition-colors duration-200 hover:bg-[#FFD638] sm:gap-6 sm:px-6 sm:py-5"
              >
                <span className="font-serif text-3xl leading-none text-[#6D3F76]/[0.37] sm:text-4xl lg:text-5xl">
                  {pillar.number}
                </span>

                <div>
                  <h3 className="font-serif text-base text-[#383217] sm:text-lg lg:text-xl">
                    {pillar.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#716B52]/[0.58] sm:text-sm">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-64 sm:h-80 md:h-[26rem] lg:h-auto">
            <img
              src="/missionsection/missionimg.png"
              alt="IHDUA team engaging with a rural community"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
import { IMPACT_STEPS } from "@/domains/home/constants/RippleEffectSection";
export default function RippleEffectSection() {
  return (
    <section className="w-full bg-[#FAF9F5]">
      <div className="w-full px-6 pt-6 lg:py-20 lg:px-10 2xl:px-40">
        {/* Eyebrow + heading */}
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-[#9739A8]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#9739A8]">
            Real People, Real Change
          </span>
        </div>

        <h2 className="mt-4 font-serif text-3xl text-[#00191B] sm:text-4xl lg:text-5xl">
          The Ripple Effect of a Single Opportunity
        </h2>

        {/* Two parts: image on the left, story on the right, matched heights */}
        <div className="mt-8 grid grid-cols-1 items-stretch gap-8 sm:mt-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative h-64 overflow-hidden sm:h-80 md:h-[26rem] lg:h-auto rounded-md">
            <img
              src="/rippleeffect/shanthamma.png"
              alt="Shanthamma standing in her farm field"
              className="h-full w-full object-cover lg:absolute lg:inset-0"
            />
          </div>

          <div className="flex flex-col">
            <h3 className="font-serif text-2xl leading-snug text-[#00191B] sm:text-3xl lg:text-4xl w-full lg:max-w-xl">
              How <span className="text-[#C09A00]">Shanthamma</span> Secured
              Her Family's Future
            </h3>

            <div className="mt-6 flex flex-col sm:mt-8">
              {IMPACT_STEPS.map((step, index) => (
                <div key={step.label}>
                  <div className="grid grid-cols-1 gap-1.5 py-4 sm:grid-cols-[130px_1fr] sm:gap-10 sm:py-5">
                    <span className="text-md font-bold uppercase tracking-wide text-[#9739A8]">
                      {step.label}
                    </span>
                    <p className="text-sm leading-relaxed text-[#5F6C6D] sm:text-lg">
                      {step.description}
                    </p>
                  </div>
                  {index !== IMPACT_STEPS.length - 1 && (
                    <span className="block h-px w-full bg-[#E3ECEC]" />
                  )}
                </div>
              ))}
            </div>

            <button className="mt-6 w-fit bg-[#FFD638] px-6 py-3 text-xs font-bold uppercase tracking-wide text-[#1E1E1E] transition-opacity duration-200 hover:opacity-90 sm:mt-16 sm:text-lg">
              Read More Inspiring Field Stories →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
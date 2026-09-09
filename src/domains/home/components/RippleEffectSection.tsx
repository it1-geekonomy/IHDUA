import { IMPACT_STEPS } from "@/domains/home/constants/RippleEffectSection";
import Typography from "@/lib/Typography";

export default function RippleEffectSection() {
  return (
    <section className="w-full bg-[#FAF9F5]">
      <div className="w-full px-6 pt-6 pb-6 lg:py-20 lg:px-10 2xl:px-40">
        {/* Eyebrow + heading */}
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-[#9739A8]" />
          <Typography variant="caption" className="font-bold font-figtree text-[#9739A8]">
            Real People, Real Change
          </Typography>
        </div>

        <Typography variant="display-xl" className="mt-4 font-lora font-normal text-[#00191B]">
          The Ripple Effect of a Single Opportunity
        </Typography>

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
            <Typography
              variant="h3"
              className="leading-snug font-lora font-normal text-[#00191B] w-full lg:max-w-xl"
            >
              How <span className="text-[#C09A00] font-lora font-medium">Shanthamma</span> Secured
              Her Family's Future
            </Typography>

            <div className="mt-6 flex flex-col sm:mt-8">
              {IMPACT_STEPS.map((step, index) => (
                <div key={step.label}>
                  <div className="grid grid-cols-1 gap-1.5 py-4 sm:grid-cols-[130px_1fr] sm:gap-10 sm:py-5">
                    <Typography
                      variant="body-sm"
                      className="font-bold font-figtree uppercase tracking-wide text-[#9739A8]"
                    >
                      {step.label}
                    </Typography>
                    <Typography variant="body-lg" className="leading-relaxed text-[#5F6C6D] font-figtree font-normal">
                      {step.description}
                    </Typography>
                  </div>
                  {index !== IMPACT_STEPS.length - 1 && (
                    <span className="block h-px w-full bg-[#E3ECEC]" />
                  )}
                </div>
              ))}
            </div>

            <button className="mx-auto flex mt-6 w-fit bg-[#FFD638] px-6 py-3 cursor-pointer sm:mt-16 lg:mx-0">
              <Typography variant="body-sm" className="font-semibold font-figtree uppercase tracking-wide text-[#1E1E1E]">
                Read More Inspiring Field Stories →
              </Typography>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
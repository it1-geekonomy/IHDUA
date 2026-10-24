import Typography from "@/lib/Typography";

const HEALTH_LABEL = "WHY HEALTH AWARENESS MATTERS";
const HEALTH_HEADING = "Knowledge That Supports Well-being";
const HEALTH_DESC = [
  "IHDUA conducted health education sessions covering nutrition, anaemia, personal hygiene, menstruation, sanitation, communicable diseases and family planning. Training also addressed the role of village health workers and community health awareness.",
  "These programmes used local community networks to share practical health information with rural women and families.",
];

const HealthAwarenessSection = () => {
  return (
    <section className="w-full">
      <div className="w-full px-6 pt-6 lg:px-10 lg:pt-8 xl:pt-8 2xl:px-40">
        <div className="flex w-full flex-col gap-4 lg:gap-6">
          {/* Label + Heading */}
          <div className="flex w-full flex-col items-center gap-3 text-center sm:items-start sm:text-left">
            {/* Label with decorative lines */}
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
              <Typography
                variant="caption"
                className="font-bold font-figtree uppercase text-[#9739A8]"
              >
                {HEALTH_LABEL}
              </Typography>
              <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
            </div>

            <Typography
              variant="h3"
              className="w-full font-lora text-[#00191B]"
            >
              {HEALTH_HEADING}
            </Typography>
          </div>

          {/* Description paragraphs */}
          <div className="flex w-full flex-col gap-3 lg:gap-4">
            {HEALTH_DESC.map((para, index) => (
              <Typography
                key={index}
                variant="body-lg"
                className="w-full font-figtree font-normal text-[#5F6C6D]"
              >
                {para}
              </Typography>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthAwarenessSection;
import { ArrowUpRight } from "lucide-react";
import Typography from "@/lib/Typography";
import {
  VISIT_OFFICE_DEFAULTS,
  getDirectionsUrl,
  getMapEmbedUrl,
} from "../const/visitoffice";

export interface VisitOfficeProps {
  label?: string;
  heading?: string;
  description?: string;
  buttonText?: string;
  address?: string; // used for the map and the Get Direction link
  className?: string;
}

const VisitOffice = ({
  label = VISIT_OFFICE_DEFAULTS.label,
  heading = VISIT_OFFICE_DEFAULTS.heading,
  description = VISIT_OFFICE_DEFAULTS.description,
  buttonText = VISIT_OFFICE_DEFAULTS.buttonText,
  address = VISIT_OFFICE_DEFAULTS.address,
  className = "",
}: VisitOfficeProps) => {
  return (
    <section className={`w-full bg-[#FFFAF0] px-6 py-8 lg:px-10 lg:py-12 2xl:px-40 ${className}`}>
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left: text */}
        <div className="flex flex-col items-start gap-4 lg:gap-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
            <Typography variant="caption" className="font-bold font-figtree uppercase text-[#9739A8]">
              {label}
            </Typography>
            <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
          </div>

          <Typography variant="h3" as="h2" className="w-full font-lora font-normal text-[#00191B]">
            {heading}
          </Typography>

          <Typography
            variant="body-lg"
            className="w-full font-figtree font-normal leading-relaxed text-[#5F6C6D]"
          >
            {description}
          </Typography>

          <a
            href={getDirectionsUrl(address)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#FFD535] px-6 py-3 transition-colors hover:bg-[#F5C400]"
          >
            <Typography variant="body-sm" className="m-0 font-figtree font-medium text-black">
              {buttonText}
            </Typography>
            <ArrowUpRight className="size-4 text-black" />
          </a>
        </div>

        {/* Right: map */}
        <div className="aspect-video w-full overflow-hidden">
          <iframe
            title={`Map showing ${address}`}
            src={getMapEmbedUrl(address)}
            className="size-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
};

export default VisitOffice;
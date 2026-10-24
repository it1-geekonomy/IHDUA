import type { Metadata } from "next";
import HeroBanner from "@/shared/components/Herobanner";
import ImageCardsSection, {
  type ImageCardItem,
} from "@/shared/components/Imagecardsection";
import CommunityHealthBanner from "@/shared/components/CommunityHealthBanner";
import Typography from "@/lib/Typography";

export const metadata: Metadata = {
  title: "Women Empowerment | IHDUA",
  description:
    "IHDUA supports rural women through Self-Help Groups, microfinance and vocational training so they can build skills, confidence and economic independence.",
};

const WOMEN_ITEMS: ImageCardItem[] = [
  {
    image: "/womenempowerment/self-help.png",
    imageAlt: "Women participating in a Self-Help Group meeting",
    title: "Self-Help Group & Federation",
    href: "/self-help-group-federation",
    theme: "amber",
  },
  {
    image: "/womenempowerment/microfinance.png",
    imageAlt: "Women at an IHDUA microfinance meeting",
    title: "Microfinance Initiative",
    href: "/micro-finance-initiatives",
    theme: "purple",
  },
];

export default function WomenEmpowermentPage() {
  return (
    <>
      <HeroBanner
        heading="Women Empowerment"
        description="Self-Help Groups, microfinance and vocational training that help rural women build skills, confidence and economic independence."
        image="/womenempowerment/banner-desktop.png"
        imageMobile="/womenempowerment/banner-mobile.png"
        imageAlt="Women from rural communities supported by IHDUA"
      />
      <ImageCardsSection
        label="WOMEN EMPOWERMENT"
        heading={["Supporting Women to", "Lead and Grow"]}
        description="We create opportunities for women to strengthen their skills, participate in economic activities and enhance their decision-making power. Through initiatives such as microfinance and vocational training, IHDUA supports women in becoming equal stakeholders in their households and communities."
        items={WOMEN_ITEMS}
        className="pb-6 sm:pb-8 lg:pb-0"
      />
      <section className="w-full bg-white">
        <div className="w-full px-6 pt-8 pb-2 sm:pt-10 sm:pb-3 lg:px-10 lg:pt-14 lg:pb-4 2xl:px-40">
          <div className="flex w-full flex-col items-center text-center lg:items-start lg:text-left gap-2.5 sm:gap-3.5">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-[#9739A8]">
              <span aria-hidden="true" className="h-px w-6 bg-current" />
              <Typography
                variant="caption"
                className="m-0 font-figtree font-bold uppercase tracking-[0.08em]"
              >
                HOW WE SUPPORT WOMEN
              </Typography>
              <span aria-hidden="true" className="h-px w-6 bg-current" />
            </div>
            <Typography
              variant="h3"
              className="font-lora leading-[1.2] text-[#00191B]"
            >
              Creating Pathways to Greater Independence
            </Typography>
            <Typography
              variant="body-lg"
              className="max-w-4xl font-figtree font-normal leading-relaxed text-[#5F6C6D] text-center lg:text-left"
            >
              IHDUA’s women’s empowerment work combines Self-Help Groups,
              microfinance initiatives and vocational training to create
              opportunities for women to build skills, participate in economic
              activities and take a more active role in their households and
              communities.
            </Typography>
          </div>
        </div>
      </section>
      <CommunityHealthBanner
        heading="Women Empowerment"
        mainImage="/womenempowerment/empowerment-banner.png"
        mainImageAlt="Women empowerment initiatives and collaborative learning"
        items={[
          {
            icon: "/Health/h1.png",
            iconBg: "#F1E7F4",
            title: "Build Confidence",
          },
          {
            icon: "/Health/h2.png",
            iconBg: "#FFEDCF",
            title: "Create Opportunities",
          },
          {
            icon: "/Health/h3.png",
            iconBg: "#F1E7F4",
            title: "Develop Skills",
          },
        ]}
      />
    </>
  );
}


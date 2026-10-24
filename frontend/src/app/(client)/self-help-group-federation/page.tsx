import type { Metadata } from "next";
import Image from "next/image";
import HeroBanner from "@/shared/components/Herobanner";
import FeatureHighlightSection from "@/shared/components/Featurehighlightsection ";
import InitiativeContent from "@/shared/components/InitiativeContent";
import ImpactStats, {
  type ImpactStatItem,
} from "@/shared/components/ImpactStats";
import SkillsTogether from "@/shared/components/SkillsTogether";
import WomenOpportunities from "@/shared/components/WomenOpportunities";
import NewsletterSection from "@/shared/components/Newsletter";
import Typography from "@/lib/Typography";

export const metadata: Metadata = {
  title: "Self-Help Group & Federation | IHDUA",
  description:
    "IHDUA supports rural women through Self-Help Groups and federations that build savings, leadership and collective decision-making.",
};

const CARD_STYLES = [
  { background: "bg-[#F6EEF7]", icon: "bg-[#7D4387]" },
  { background: "bg-[#FFF5E5]", icon: "bg-[#C89A3A]" },
  { background: "bg-[#F6EEF7]", icon: "bg-[#7D4387]" },
  { background: "bg-[#FFF5E5]", icon: "bg-[#C89A3A]" },
] as const;

const SHG_STEPS = [
  {
    icon: "/statsection/groupicon.png",
    title: "Group Formation",
    description:
      "10–20 women from the same village come together to form a group.",
  },
  {
    icon: "/statsection/homeicon.png",
    title: "Regular Savings",
    description: "Members contribute to a shared fund and build a savings habit.",
  },
  {
    icon: "/statsection/trainedicon.png",
    title: "Financial Learning",
    description:
      "Members gain practical skills in recordkeeping and financial management.",
  },
  {
    icon: "/statsection/locationicon.png",
    title: "Leadership & Participation",
    description:
      "Members take part in decisions and community activities.",
  },
] as const;

const IMPACT_STATS: ImpactStatItem[] = [
  {
    icon: "/statsection/groupicon.png",
    iconBg: "#F1E7F4",
    value: "7,578+",
    label: "SHG Members",
  },
  {
    icon: "/statsection/homeicon.png",
    iconBg: "#FFEDCF",
    value: "697+",
    label: "Self-Help Groups",
  },
  {
    icon: "/statsection/locationicon.png",
    iconBg: "#F1E7F4",
    value: "18",
    label: "Federations Reported",
  },
  {
    icon: "/statsection/trainedicon.png",
    iconBg: "#FFEDCF",
    value: "43",
    label: "Farmer SHGs",
  },
];

export default function SelfHelpGroupFederationPage() {
  return (
    <>
      <HeroBanner
        heading="Self Help Group & Federation"
        description="Village Self-Help Groups and federations where women save together, share decisions and grow as community leaders."
        image="/selfhelpgroup/banner-desktop.png"
        imageMobile="/selfhelpgroup/banner-mobile.png"
        imageAlt="Self-Help Group members at an IHDUA community meeting"
      />

      <FeatureHighlightSection
        label="WOMEN EMPOWERMENT"
        heading="Self Help Group & Federation"
        description="IHDUA supports rural communities through Self-Help Groups that encourage collective savings, shared decision-making and women’s leadership."
        items={[
          {
            icon: "/icons/mission.png",
            iconAlt: "Mission icon",
            heading: "Mission",
            description: "Empowering rural women through savings, skills and leadership.",
          },
          {
            icon: "/icons/benifit.png",
            iconAlt: "Beneficiaries icon",
            heading: "Beneficiaries",
            description:
              "Building financial confidence, collaboration and stronger communities.",
          },
        ]}
      />

      <div className="px-6 py-10 sm:px-10 sm:py-14 lg:py-20 2xl:px-40">
        <InitiativeContent
          imageAspectClass="aspect-[582/415]"
          title="The Power of Collective Action"
          hasAccentBar={true}
          paragraphs={[
            "Self-Help Groups (SHGs) bring together 10–20 women from the same village to build financial skills, shared responsibility and leadership. With IHDUA’s guidance, members contribute to shared savings, maintain group records and participate in collective decision-making.",
            "Through regular meetings and shared learning, members build confidence, strengthen their financial awareness and support one another in addressing common challenges. Federations bring SHG representatives together once a month to discuss community concerns, exchange experiences and identify possible solutions. These collective efforts encourage shared responsibility, stronger local networks and greater participation in community decision-making.",
          ]}
          image="/selfhelpgroup/collective.png"
          imageAlt="Self-Help Group members participating in a learning session"
        />
      </div>

      <section className="w-full bg-white">
        <div className="w-full px-6 pt-2 pb-10 sm:px-10 sm:pb-14 lg:px-10 lg:pb-16 2xl:px-40">
          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col items-center text-center sm:items-start sm:text-left gap-3">
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
                <Typography
                  variant="caption"
                  className="font-figtree font-bold uppercase tracking-wider text-[#9739A8]"
                >
                  HOW SELF-HELP GROUPS WORK
                </Typography>
                <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
              </div>

              <Typography
                variant="h3"
                as="h2"
                className="w-full font-lora font-normal text-[#00191B]"
              >
                Small Steps. Shared Progress.
              </Typography>

              <Typography
                variant="body-lg"
                className="w-full font-figtree font-normal text-[#5F6C6D] text-center sm:text-left"
              >
                IHDUA facilitates the formation of SHGs and provides guidance on group rules, meeting processes and recordkeeping. Two selected members receive additional training to maintain group records and coordinate with bank officials.
              </Typography>
            </div>

            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SHG_STEPS.map((step, index) => {
                const styles = CARD_STYLES[index % CARD_STYLES.length];
                return (
                  <div
                    key={step.title}
                    className={`flex min-w-0 flex-col items-start gap-3 p-4 sm:p-5 ${styles.background}`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${styles.icon}`}
                    >
                      <Image
                        src={step.icon}
                        alt=""
                        width={24}
                        height={24}
                        className="h-5 w-5 object-contain brightness-0 invert"
                      />
                    </div>
                    <div className="flex min-w-0 flex-col gap-1">
                      <Typography
                        variant="body-sm"
                        as="h3"
                        className="font-lora font-normal text-[#00191B]"
                      >
                        {step.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        className="font-figtree font-normal normal-case text-[#5F6C6D]"
                      >
                        {step.description}
                      </Typography>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="pb-10 lg:pb-16">
        <WomenOpportunities
          heading="Creating Financial Independence for Rural Women"
          topDescription="IHDUA’s Self-Help Groups help rural women save together, keep group records and take part in collective decisions. Regular meetings build financial confidence, while federations bring group representatives together to discuss village concerns and share solutions."
          images={[
            {
              src: "/selfhelpgroup/financial-independence-1.jpg",
              alt: "Self-Help Group members reviewing records together",
            },
            {
              src: "/selfhelpgroup/financial-independence-2.jpg",
              alt: "IHDUA community meeting with Self-Help Group members",
            },
          ]}
          bottomDescription="Regular savings and group lending help members meet health, education and livelihood needs, while strengthening their voice in household and community decisions."
        />
      </div>

      <div className="py-10 lg:py-16 [&_img]:brightness-0 [&_img]:invert">
        <SkillsTogether
          label="SELF-HELP GROUPS & FEDERATIONS"
          heading="Stronger Communities, Together"
          descriptions={[
            "IHDUA supports village-based Self-Help Groups where members come together to build knowledge, share responsibilities and work towards common goals. Through group participation and leadership development, women can strengthen their role in community life.",
            "Federations connect SHG representatives, creating a space to discuss local challenges, exchange ideas and identify solutions together.",
          ]}
          items={[
            {
              icon: "/statsection/groupicon.png",
              title: "Community Leadership",
              description: "Encouraging women to lead group decisions.",
            },
            {
              icon: "/statsection/homeicon.png",
              title: "Shared Responsibility",
              description: "Working together towards common goals.",
            },
            {
              icon: "/statsection/locationicon.png",
              title: "Collective Voice",
              description: "Sharing concerns and finding solutions.",
            },
            {
              icon: "/statsection/trainedicon.png",
              title: "Stronger Networks",
              description: "Building connections through shared experiences.",
            },
          ]}
        />
      </div>

      <ImpactStats
        heading="The Impact We Make"
        description={[
          "IHDUA’s Women Leadership Project has supported the formation of 697 Self-Help Groups (SHGs), bringing together 7,578 members. These groups encourage collective savings, financial awareness and shared responsibility among community members.",
          "The programme also reports 18 federations, where SHG representatives meet monthly to discuss common challenges and work towards solutions. Through these collective efforts, IHDUA promotes women’s leadership, stronger community connections and greater participation in decision-making.",
        ]}
        bannerHeading="Creating Lasting Change"
        stats={IMPACT_STATS}
      />

      <NewsletterSection />
    </>
  );
}


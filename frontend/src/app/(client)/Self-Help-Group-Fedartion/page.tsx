import InitiativeBanner from "@/shared/components/InitiativeBanner";
import InitiativeOverview from "@/domains/selfhelpgroup/components/initiativeOverview";
import InitiativeContent from "@/domains/selfhelpgroup/components/initiativeContent";
import InitiativeSupport from "@/domains/selfhelpgroup/components/initiativeSupport";
import InitiativeImpact from "@/domains/selfhelpgroup/components/initiativeImpact";
import NewsletterSection from "@/shared/components/Newsletter";

const SUPPORT_ITEMS = [
  {
    title: "Group Formation",
    description: "10–20 women form the same village group and meet regularly to save.",
    icon: "groups" as const,
    tone: "plum" as const,
  },
  {
    title: "Regular Savings",
    description: "Members contribute to a shared fund that can be accessed for emergency needs.",
    icon: "savings" as const,
    tone: "gold" as const,
  },
  {
    title: "Financial Learning",
    description: "Members learn basic recordkeeping, account management and group governance.",
    icon: "learning" as const,
    tone: "plum" as const,
  },
  {
    title: "Leadership & Participation",
    description: "Members take turns in leadership roles, representing their group in village meetings.",
    icon: "leadership" as const,
    tone: "gold" as const,
  },
];

const IMPACT_STATS = [
  {
    icon: "/statsection/groupicon.png",
    iconBg: "#F1E7F4",
    value: "7,578+",
    label: "SHG members",
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
    label: "Federations reported",
  },
  {
    icon: "/statsection/trainedicon.png",
    iconBg: "#FFEDCF",
    value: "43",
    label: "Farmer SHGs",
  },
];

export default function SelfHelpGroupFedartionPage() {
  return (
    <>
      {/* 1. Hero Banner */}
      <InitiativeBanner
        title="Self Help Group & Federation"
        description="Creating opportunities to learn, grow and build brighter futures for rural women and communities."
        image="/selfhelpgroup/banner-desktop.png"
        mobileImage="/selfhelpgroup/banner-mobile.png"
        imageAlt="Self Help Group & Federation - IHDUA"
      />

      {/* 2. Overview Section */}
      <InitiativeOverview
        title="Self Help Group & Federation"
        description="IHDUA supports rural communities through self-help groups that encourage collective savings, shared decision-making and women’s leadership."
        mission="Empowering rural women through savings, skills and leadership."
        beneficiaries="Building financial confidence, collaboration and stronger communities."
      />

      {/* 3, 4, 5. Main Content Wrapper */}
      <div className="flex flex-col gap-12 px-6 py-10 sm:gap-16 sm:px-10 sm:py-14 lg:gap-20 lg:py-20 2xl:px-40">
        {/* Content 1: The Power of Collective Action (with gold accent line) */}
        <InitiativeContent
          title="The Power of Collective Action"
          hasAccentBar={true}
          paragraphs={[
            "Self-Help Groups bring together 10–20 women from the same village to build financial skills, shared responsibility and leadership. With IHDUA’s guidance, members contribute to shared savings, maintain group records and participate in collective decision-making.",
            "Through regular meetings and shared learning, members build confidence, strengthen their financial awareness and support one another in addressing common challenges. These gatherings encourage peer learning, collective problem-solving and stronger connections between groups.",
          ]}
          image="/selfhelpgroup/collective.png"
          imageAlt="Self-Help Group members in a learning session"
        />

        {/* 4. Support Cards: Small Steps. Shared Progress. */}
        <InitiativeSupport
          title="Small Steps. Shared Progress."
          description="IHDUA facilitates the formation of SHGs and provides guidance on group rules, meeting processes, recordkeeping and collective decision-making, helping groups build confidence and financial independence over time."
          items={SUPPORT_ITEMS}
        />

        {/* Content 2: Bringing Groups Together */}
        <InitiativeContent
          title="Bringing Groups Together"
          paragraphs={[
            "Federations connect Self-Help Group representatives from multiple villages, creating a platform to discuss common challenges, share experiences and work towards practical solutions.",
            "Through monthly meetings, representatives discuss community concerns and explore ways to address them collectively. These gatherings encourage peer learning, collective problem-solving and stronger connections between groups.",
            "By working together, SHG representatives can identify shared needs and support community-led development initiatives.",
          ]}
          image="/selfhelpgroup/federation.png"
          imageAlt="Self-Help Group federation members gathering"
        />
      </div>

      {/* 6. Impact Stats: The Impact We Make */}
      <InitiativeImpact
        heading="The Impact We Make"
        description={[
          "IHDUA’s Women Leadership Project has supported the formation of Self-Help Groups, bringing women together to build savings, financial awareness and shared responsibility across community members.",
          "Through regular group meetings, savings routines and training programs, members strengthen their financial confidence and support community-led initiatives that contribute to long-term social and economic progress in their villages.",
        ]}
        bannerHeading="Creating Lasting Change"
        stats={IMPACT_STATS}
      />

      {/* 7. Newsletter Section */}
      <NewsletterSection />
    </>
  );
}

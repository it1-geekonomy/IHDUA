import InitiativeBanner from "@/shared/components/InitiativeBanner";
import InitiativeOverview from "@/domains/microfinanceinitiatives/components/initiativeOverview";
import InitiativeContent from "@/domains/microfinanceinitiatives/components/initiativeContent";
import InitiativeTwoImageSection from "@/domains/microfinanceinitiatives/components/initiativeTwoImageSection";
import InitiativeStrongerTogether from "@/domains/microfinanceinitiatives/components/initiativeStrongerTogether";
import InitiativeImpact from "@/domains/microfinanceinitiatives/components/initiativeImpact";
import NewsletterSection from "@/shared/components/Newsletter";

const IMPACT_STATS = [
  {
    icon: "/statsection/groupicon.png",
    iconBg: "#F1E7F4",
    value: "5,000+",
    label: "People trained",
  },
  {
    icon: "/statsection/homeicon.png",
    iconBg: "#FFEDCF",
    value: "600+",
    label: "Self-Help Groups",
  },
  {
    icon: "/statsection/locationicon.png",
    iconBg: "#F1E7F4",
    value: "₹4.36 Cr",
    label: "SHG savings",
  },
  {
    icon: "/statsection/trainedicon.png",
    iconBg: "#FFEDCF",
    value: "₹10 Cr+",
    label: "Loans historically issued",
  },
];

export default function MicroFinanceInitiativesPage() {
  return (
    <>
      {/* 1. Hero Banner */}
      <InitiativeBanner
        title="Micro-Finance Initiative"
        description="Creating opportunities to learn, grow and build brighter futures for rural women and communities."
        image="/microfinanceinitiatives/banner-desktop.png"
        mobileImage="/microfinanceinitiatives/banner-mobile.png"
        imageAlt="Micro-Finance Initiative - IHDUA"
      />

      {/* 2. Overview Section */}
      <InitiativeOverview
        title="Micro-Finance Initiative"
        description="IHDUA supports community-based savings and access to financial learning so rural women can make informed decisions."
        mission="Supporting community-driven investment activities on behalf of rural women."
        beneficiaries="More than 5,000 women have benefited from our programmes."
      />

      {/* 3 & 4. Content Sections Wrapper */}
      <div className="flex flex-col gap-12 px-6 py-10 sm:gap-16 sm:px-10 sm:py-14 lg:gap-20 lg:py-20 2xl:px-40">
        {/* Section 1: Why Microfinance Matters (with gold accent line) */}
        <InitiativeContent
          title="Why Microfinance Matters"
          hasAccentBar={true}
          paragraphs={[
            "IHDUA’s Micro-Finance Initiative makes it possible for rural women to become informed financial decision-makers who have access to loans at competitive rates. With guidance from the field team and local volunteers, members participate in training that introduces the group’s objectives, responsibilities and operating procedures.",
            "Self-Help Groups provide a community-based platform where women can save together, access financial support and participate in income-generating activities.",
          ]}
          image="/microfinanceinitiatives/why-microfinance-matters.png"
          imageAlt="Rural women attending a microfinance session"
        />

        {/* Section 2: Creating Financial Independence for Rural Women (Two Images Side by Side) */}
        <InitiativeTwoImageSection
          title="Creating Financial Independence for Rural Women"
          topParagraphs={[
            "The initiative enables rural women to become informed financial decision-makers who have access to loans at competitive rates. Members participate in income-generating activities and strengthen their role in household and community decision-making.",
          ]}
          images={[
            {
              src: "/microfinanceinitiatives/financial-independence-1.png",
              alt: "Self-help group members meeting on verandah",
            },
            {
              src: "/microfinanceinitiatives/financial-independence-2.png",
              alt: "Self-help group members gathered outside the bank branch",
            },
          ]}
          bottomParagraphs={[
            "With guidance from the field team and local volunteers, members participate in training that introduces the group’s objectives, responsibilities and operating procedures. Self-Help Groups provide a community-based platform where women can save together, access financial support and participate in income-generating activities.",
          ]}
        />
      </div>

      {/* 5. Stronger Together Banner Band */}
      <InitiativeStrongerTogether />

      {/* 6 & 7. Capital Access & Self Help Groups Wrapper */}
      <div className="flex flex-col gap-12 px-6 py-10 sm:gap-16 sm:px-10 sm:py-14 lg:gap-20 lg:py-20 2xl:px-40">
        {/* Section 3: Ramping Up Access to Capital (Image Left, Text Right) */}
        <InitiativeContent
          label="STEP BY STEP"
          title="Ramping Up Access to Capital"
          reverse={true}
          paragraphs={[
            "The programme also focuses on building strong financial practices within Self-Help Groups. Members are trained in savings, rotation of funds, leadership participation and recordkeeping, helping groups manage their collective resources responsibly.",
            "Access to credit enables members to invest in small businesses, livestock or home improvements, strengthening their economic resilience and ability to support their families.",
          ]}
          image="/microfinanceinitiatives/ramping-up-capital.png"
          imageAlt="Financial literacy and credit training session with HDFC banner"
        />

        {/* Section 4: Self-Help Groups & Ramping Up Access to Capital (Two Images Side by Side) */}
        <InitiativeTwoImageSection
          subsections={[
            {
              subtitle: "Self-Help Groups",
              paragraphs: [
                "At the heart of this initiative are Self-Help Groups (SHGs), typically formed with 10–20 women from the same village who meet regularly to save, build financial discipline and support one another.",
                "Our records show that 600+ self-help groups have been formed across villages in Gundlupet taluk, Karnataka. These groups provide a shared platform where members learn basic recordkeeping, rotation of funds and collective decision-making.",
              ],
            },
            {
              subtitle: "Ramping Up Access to Capital",
              paragraphs: [
                "The project also connects groups to formal banking institutions, facilitating access to loans for income-generating activities, livestock rearing and small businesses. Members receive training on loan processes, repayment schedules and financial responsibility.",
                "Historical records indicate that the initiative has supported 5,000+ members through microfinance and skill-building programmes, resulting in cumulative savings of over ₹4.36 Crores and facilitating loans exceeding ₹10 Crores.",
                "Through regular meetings and shared learning, members build confidence, strengthen their financial awareness and support one another in addressing common challenges. These gatherings encourage peer learning, collective problem-solving and stronger connections between groups.",
              ],
            },
          ]}
          images={[
            {
              src: "/microfinanceinitiatives/self-help-groups.png",
              alt: "Self-help group members sitting outdoors in discussion",
            },
            {
              src: "/microfinanceinitiatives/field-household-visit.png",
              alt: "Field workers interviewing women during household visit",
            },
          ]}
        />
      </div>

      {/* 8. Impact Stats */}
      <InitiativeImpact
        heading="The Impact We Make"
        description="The programme’s records show that Self-Help Groups across villages in Karnataka have helped women strengthen their savings habits, access credit and participate actively in local decision-making."
        bannerHeading="Creating Lasting Change"
        stats={IMPACT_STATS}
      />

      {/* 9. Newsletter Section */}
      <NewsletterSection />
    </>
  );
}

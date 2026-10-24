import OpportunitiesSection from "@/shared/components/OpportunitiesSection";

const OpportunitiesSectionData = () => {
  return (
    <OpportunitiesSection
      heading="Creating Opportunities for Brighter Futures"
      descriptions={[
        "IHDUA works with women through community groups, access to financial resources and practical training programmes to help them build skills, participate in income-earning and strengthen their role in families and communities.",
        "Through Self-Help Groups, women build financial awareness, leadership and collective decision-making skills. Microfinance initiatives support access to financial resources, while vocational training develops practical skills in tailoring, Aari work and computer education. Together, these programmes support women's participation in income-generating activities and livelihood development.",
      ]}
      image="/skills%20and%20employement/women.png"
      imageAlt="Woman addressing a group of women at a community training session"
      button={{ label: "View All Photos", href: "/women/gallery" }}
    />
  );
};

export default OpportunitiesSectionData;
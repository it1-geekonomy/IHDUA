import WomenOpportunities from "@/shared/components/WomenOpportunities";

const WomenOpportunitiesSection = () => {
  return (
    <WomenOpportunities
      heading="Creating Opportunities for Women"
      topDescription="IHDUA supports women through Self-Help Groups, microfinance initiatives and vocational training. These programmes encourage financial awareness, collective decision-making and participation in income-generating activities."
      images={[
        {
          src: "/skills%20and%20employement/womenhelp1.png",
          alt: "Women receiving a certificate at a community programme",
        },
        {
          src: "/skills%20and%20employement/womenhelp2.png",
          alt: "Women attending a training session in a hall",
        },
      ]}
      bottomDescription="The organisation's vocational training includes tailoring, Aari work, computer courses and other skill-based programmes. Through these initiatives, women can develop practical skills and strengthen their livelihood opportunities."
    />
  );
};

export default WomenOpportunitiesSection;
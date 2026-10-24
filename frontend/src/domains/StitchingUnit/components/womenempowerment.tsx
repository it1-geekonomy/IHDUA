import FeatureHighlightSection from "@/shared/components/Featurehighlightsection ";

const MissionSection = () => {
  return (
    <FeatureHighlightSection
      label="Women Empowerment"
      heading="Vocational Training"
      description="A practical skills programme designed to provide vocational training opportunities for rural women."
      
      items={[
        {
          icon: "/icons/mission.png",
          iconAlt: "Mission",
          heading: "Mission",
          description: "Provide practical vocational training to rural women.",
        },
        {
          icon: "/icons/benifit.png",
          iconAlt: "Students",
          heading: "Beneficiaries",
          description: "More than 250 women have benefited from our programmes since 2005.",
        },
      ]}
    />
  );
};
export default MissionSection;

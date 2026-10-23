import FeatureHighlightSection from "@/shared/components/Featurehighlightsection ";

const MissionSection = () => {
  return (
    <FeatureHighlightSection
      label="WOMEN EMPOWERMENT"
      heading="Supporting Women to Lead and Grow"
      description="IHDUA empowers women through self-help groups, microfinance and vocational training to strengthen skills and livelihoods."
      
      items={[
        {
          icon: "/icons/mission.png",
          iconAlt: "Mission",
          heading: "Focus Areas",
          description: "Supporting women through self-help groups, microfinance and vocational training.",
        },
        {
          icon: "/icons/benifit.png",
          iconAlt: "Students",
          heading: "Programme Reach",
          description: "7,578 SHG members reported under IHDUA’s Women Leadership Project.",
        },
      ]}
    />
  );
};
export default MissionSection;

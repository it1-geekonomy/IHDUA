import FeatureHighlightSection from "@/shared/components/Featurehighlightsection ";

const MissionSection = () => {
  return (
    <FeatureHighlightSection
      label="VILLAGE DEVELOPMENT"
      heading="Building Better Rural Communities"
      description="IHDUA supports rural farmers through agricultural initiatives, practical training and sustainable farming practices that strengthen rural livelihoods."
      
      items={[
        {
          icon: "/icons/mission.png",
          iconAlt: "Mission",
          heading: "Focus Areas",
          description: "Agriculture, livestock care, sanitation and village infrastructure improvements.",
        },
        {
          icon: "/icons/benifit.png",
          iconAlt: "Students",
          heading: "Programme Reach",
          description: "Village initiatives include soil health training, veterinary support and solar street-light installation.",
        },
      ]}
    />
  );
};
export default MissionSection;

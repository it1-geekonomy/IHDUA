import FeatureHighlightSection from "@/shared/components/Featurehighlightsection ";

const MissionSection = () => {
  return (
    <FeatureHighlightSection
      label="HEALTH AWARENESS"
      heading="Promoting Healthier Communities"
      description="IHDUA supports rural farmers through agricultural initiatives, practical training and sustainable farming practices that strengthen rural livelihoods."
      
      items={[
        {
          icon: "/icons/mission.png",
          iconAlt: "Mission",
          heading: "Focus Areas",
          description: "Nutrition, hygiene, sanitation and reproductive health awareness.",
        },
        {
          icon: "/icons/benifit.png",
          iconAlt: "Students",
          heading: "Programme Reach",
          description: "Historical programmes included health education for women, schoolchildren and Anganwadi workers.",
        },
      ]}
    />
  );
};
export default MissionSection;

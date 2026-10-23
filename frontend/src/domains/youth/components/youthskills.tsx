import FeatureHighlightSection from "@/shared/components/Featurehighlightsection ";

const MissionSection = () => {
  return (
    <FeatureHighlightSection
      label="YOUTH EMPOWERMENT"
      heading="Youth Skills & Opportunities"
      description="IHDUA supports rural youth through skill development and vocational training to build practical skills and future opportunities."
      
      items={[
        {
          icon: "/icons/mission.png",
          iconAlt: "Mission",
          heading: "Focus Areas",
          description: "Skill development, digital literacy and vocational training to enhance employability and future opportunities for rural youth.",
        },
        {
          icon: "/icons/benifit.png",
          iconAlt: "Students",
          heading: "Programme Reach",
          description: "Youth equipped with practical skills through computer training, GDA training and other vocational courses.",
        },
      ]}
    />
  );
};
export default MissionSection;

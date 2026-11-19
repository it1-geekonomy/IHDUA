import CommunityHealthBanner from "@/shared/components/CommunityHealthBanner";

const SkillSection = () => {
  return (
    <CommunityHealthBanner
      heading="Skills & Employment"
      mainImage="/Skillsandemployment/skill2.png"
      mainImageAlt="Working in the Stitching Unit"
      items={[
        {
          icon: "/Skillsandemployment/h1.png",
          iconBg: "#F1E7F4",
          title: "Learn Skills",
        },
        {
          icon: "/Skillsandemployment/h2.png",
          iconBg: "#FFEDCF",
          title: "Gain Experience",
        },
        {
          icon: "/Skillsandemployment/h3.png",
          iconBg: "#F1E7F4",
          title: "Find Employment",
        },
      ]}
    />
  );
};

export default SkillSection;
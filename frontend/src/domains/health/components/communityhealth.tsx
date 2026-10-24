import CommunityHealthBanner from "@/shared/components/CommunityHealthBanner";

const CommunityHealthSection = () => {
  return (
    <CommunityHealthBanner
      heading="Community Health"
      mainImage="/Health/healthgradientimg.png"
      mainImageAlt="Doctor speaking with a mother and her children"
      items={[
        {
          icon: "/Health/h1.png",
          iconBg: "#F1E7F4",
          title: "Build Awareness",
        },
        {
          icon: "/Health/h2.png",
          iconBg: "#FFEDCF",
          title: "Promote Hygiene",
        },
        {
          icon: "/Health/h3.png",
          iconBg: "#F1E7F4",
          title: "Support Well-being",
        },
      ]}
    />
  );
};

export default CommunityHealthSection;
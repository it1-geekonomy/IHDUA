import CommunityHealthBanner from "@/shared/components/CommunityHealthBanner";

const CommunityHealthSection = () => {
  return (
    <CommunityHealthBanner
      heading="Model Village"
      mainImage="/modelvillage/MVgradientimg.png"
      mainImageAlt="Doctor speaking with a mother and her children"
      items={[
        {
          icon: "/Health/h1.png",
          iconBg: "#F1E7F4",
          title: "Build Resilience",
        },
        {
          icon: "/Health/h2.png",
          iconBg: "#FFEDCF",
          title: "Improve Infrastructure",
        },
        {
          icon: "/Health/h3.png",
          iconBg: "#F1E7F4",
          title: "Promote Sustainability",
        },
      ]}
    />
  );
};

export default CommunityHealthSection;
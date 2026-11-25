import CommunityHealthBanner from "@/shared/components/CommunityHealthBanner";

const CommunityHealthSection = () => {
  return (
    <CommunityHealthBanner
      heading="Community Health"
      mainImage="https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/1795414507393-4zzve-image-70.webp"
      mainImageAlt="Doctor speaking with a mother and her children"
      items={[
        {
          icon: "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/1795414356723-pvg4m-fi_18610337.svg",
          iconBg: "#F1E7F4",
          title: "Build Awareness",
        },
        {
          icon:  "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/1795414382663-i1e1i-fi_15189475.svg",
          iconBg: "#FFEDCF",
          title: "Promote Hygiene",
        },
        {
          icon: "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/1795414407607-v1t1p-fi_12699612.svg",
          iconBg: "#F1E7F4",
          title: "Support Well-being",
        },
      ]}
    />
  );
};

export default CommunityHealthSection;
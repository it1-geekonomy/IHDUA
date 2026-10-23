import HeroBanner from "@/shared/components/Herobanner";

export default function BannerSection() {
  return (
    <HeroBanner
      heading="Health Awareness"
      description="Working alongside rural communities to create opportunities, strengthen livelihoods, and build brighter futures."
      image="/aboutus/aboutbanner1.png"
      imageMobile="/aboutmobileimg.png"
      imageAlt="Smiling children from a rural community"
    />
  );
}
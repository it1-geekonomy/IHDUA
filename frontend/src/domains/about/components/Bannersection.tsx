import HeroBanner from "@/shared/components/Herobanner";

export default function BannerSection() {
  return (
    <HeroBanner
      heading="About Us"
      description="Working alongside rural communities to create opportunities, strengthen livelihoods, and build brighter futures."
      image="/aboutbanner.png"
      imageMobile="/aboutmobileimg.png"
      imageAlt="Smiling children from a rural community"
    />
  );
}
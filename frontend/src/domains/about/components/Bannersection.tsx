import HeroBanner from "@/shared/components/Herobanner";

export default function BannerSection() {
  return (
    <HeroBanner
      heading="About Us"
      description="Working alongside rural communities to create opportunities, strengthen livelihoods, and build brighter futures."
      image="/aboutus/aboutbanner1.png"
      imageMobile="/aboutus/aboutusmobilebg.png"
      imageAlt="Smiling children from a rural community"
    />
  );
}
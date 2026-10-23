import HeroBanner from "@/shared/components/Herobanner";

export default function BannerSection() {
  return (
    <HeroBanner
      heading="Health Camps"
      description="Working alongside rural communities to create opportunities, strengthen livelihoods, and build brighter futures."
      image="/Healthcamps/healthcampsbanner.png"
      imageMobile="/Healthcamps/healthcampmobilebg.png"
      imageAlt="Smiling children from a rural community"
    />
  );
}
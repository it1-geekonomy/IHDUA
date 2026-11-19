import HeroBanner from "@/shared/components/Herobanner";

export default function BannerSection() {
  return (
    <HeroBanner
      heading="Health"
      description="Promoting healthier rural communities through health awareness, preventive care and access to essential healthcare services."
      image="/Health/healthbanner.png"
      imageMobile="/Health/healthmobilebanner.png"
      imageAlt="Smiling children from a rural community"
    />
  );
}
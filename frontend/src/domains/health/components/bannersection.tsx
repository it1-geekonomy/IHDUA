import HeroBanner from "@/shared/components/Herobanner";

export default function BannerSection() {
  return (
    <HeroBanner
      heading="Health"
      description="Supporting rural communities through health awareness, medical camps and initiatives that promote healthier lives."
      image="/Health/healthbanner.png"
      imageMobile="/Health/healthmobilebanner.png"
      imageAlt="Smiling children from a rural community"
    />
  );
}
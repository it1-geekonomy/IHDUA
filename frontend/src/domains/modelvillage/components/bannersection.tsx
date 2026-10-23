import HeroBanner from "@/shared/components/Herobanner";

export default function BannerSection() {
  return (
    <HeroBanner
      heading="Model Village"
      description="Supporting holistic village development through sustainable agriculture, eco-friendly activities and community initiatives."
      image="/modelvillage/modelvillagebanner.png"
      imageMobile="/modelvillage/modelvillagemobilebg.png"
      imageAlt="Smiling children from a rural community"
    />
  );
}
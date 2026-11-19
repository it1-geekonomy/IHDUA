import HeroBanner from "@/shared/components/Herobanner";

export default function BannerSection() {
  return (
    <HeroBanner
      heading="Model Village"
      description="Improving rural infrastructure, livelihoods and essential services through community-led development."
      image="/modelvillage/modelvillagebanner.png"
      imageMobile="/modelvillage/modelvillagemobilebg.png"
      imageAlt="Smiling children from a rural community"
    />
  );
}
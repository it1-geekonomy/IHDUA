import HeroBanner from "@/shared/components/Herobanner";

export default function BannerSection() {
  return (
    <HeroBanner
      heading="Model Village"
      description="Supporting holistic village development through sustainable agriculture, eco-friendly activities and community initiatives."
      image="/aboutus/aboutbanner1.png"
      imageMobile="/aboutmobileimg.png"
      imageAlt="Smiling children from a rural community"
    />
  );
}
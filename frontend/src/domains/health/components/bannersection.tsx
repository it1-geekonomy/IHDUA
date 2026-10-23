import HeroBanner from "@/shared/components/Herobanner";

export default function BannerSection() {
  return (
    <HeroBanner
      heading="Health"
      description="Supporting rural communities through health awareness, medical camps and initiatives that promote healthier lives."
      image="/aboutus/aboutbanner1.png"
      imageMobile="/aboutmobileimg.png"
      imageAlt="Smiling children from a rural community"
    />
  );
}
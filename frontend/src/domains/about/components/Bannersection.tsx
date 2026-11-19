import HeroBanner from "@/shared/components/Herobanner";

export default function BannerSection() {
  return (
    <HeroBanner
      heading="About Us"
      description="Discover IHDUA’s journey, mission and commitment to empowering rural communities through inclusive and sustainable development."
      image="/aboutus/aboutbanner1.png"
      imageMobile="/aboutus/aboutusmobilebg.png"
      imageAlt="Smiling children from a rural community"
    />
  );
}
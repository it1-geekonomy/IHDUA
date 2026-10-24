import HeroBanner from "@/shared/components/Herobanner";

export default function BannerSection() {
  return (
    <HeroBanner
      heading="Farmers"
      description="Supporting rural farmers through sustainable agricultural practices, soil health improvement and livestock support to strengthen farming communities."
      image="/farmers/farmersbanner.png"
      imageMobile="/farmers/farmersmobilebanner.png"
      imageAlt="Smiling children from a rural community"
    />
  );
}
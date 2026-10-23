import HeroBanner from "@/shared/components/Herobanner";

export default function BannerSection() {
  return (
    <HeroBanner
      heading="Increase the green cover"
      description="Encouraging greener rural communities through fruit sapling distribution, sustainable agriculture and eco-friendly village initiatives."
      image="/modelvillage/greencoverbanner.png"
      imageMobile="/modelvillage/greencovermobile.png"
      imageAlt="Smiling children from a rural community"
    />
  );
}
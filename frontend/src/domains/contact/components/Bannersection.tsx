import HeroBanner from "@/shared/components/Herobanner";

export default function BannerSection() {
  return (
    <HeroBanner
      heading="Let’s Connect"
      description="We’re here to listen, collaborate and support stronger rural communities."
      image="/contact/contactbanner.png"
      imageMobile="/contact/mobilebanner.png"
      imageAlt="Smiling children from a rural community"
    />
  );
}
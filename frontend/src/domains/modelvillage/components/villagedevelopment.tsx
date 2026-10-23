import ImageCardsSection, {
  type ImageCardItem,
} from "@/shared/components/Imagecardsection"; // adjust to where you saved the file

const EDUCATION_ITEMS: ImageCardItem[] = [
  {
    image: "/modelvillage/villageD1.png",
    imageAlt: "Rejuvenation of villages",
    title: "Rejuvenation of villages",
  },
  {
    image: "/modelvillage/villageD2.png",
    imageAlt: "Increase the green cover",
    title: "Increase the green cover",
  },
];

export default function EducationSection() {
  return (
    <ImageCardsSection
      label="VILLAGE DEVELOPMENT"
       heading={["Building Stronger", "Rural Communities"]}
      description="IHDUA’s Model Village project focuses on Chikkahundi village in Gundlupet taluk. It aims to support holistic village development through sustainable agriculture, organic farming and eco-friendly activities."
      items={EDUCATION_ITEMS}
    />
  );
}
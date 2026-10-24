import ImageCardsSection, {
  type ImageCardItem,
} from "@/shared/components/Imagecardsection";

const EDUCATION_ITEMS: ImageCardItem[] = [
  {
    image: "/Skillsandemployment/Women.png",
    imageAlt: "Women",
    title: "Women",
    href: "/women",
  },
  {
    image: "/Skillsandemployment/Youth.png",
    imageAlt: "Youth",
    title: "Youth",
    href: "/youth",
  },
  {
    image: "/Skillsandemployment/Women.png",
    imageAlt: "Farmers",
    title: "Farmers",
    href: "/farmers",
  },
  {
    image: "/Skillsandemployment/StitchingUnit.png",
    imageAlt: "Stitching Unit",
    title: "Stitching Unit",
    href: "/stitching-unit",
  },
];

export default function GrowingSustainably() {
  return (
    <ImageCardsSection
      label="ORGANIC FARMING"
       heading={["Growing Sustainably.", "Farming for the Future"]}
      description="IHDUA promotes organic farming practices that support sustainable agriculture, healthier soil and environmentally responsible cultivation.
Through organic farming initiatives and training, the programme encourages practical approaches to sustainable cultivation and better farming practices."
      items={EDUCATION_ITEMS}
    />
  );
}
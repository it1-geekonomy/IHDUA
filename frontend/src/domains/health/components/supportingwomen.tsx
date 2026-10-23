import ImageCardsSection, {
  type ImageCardItem,
} from "@/shared/components/Imagecardsection"; // adjust to where you saved the file

const EDUCATION_ITEMS: ImageCardItem[] = [
  {
    image: "/Health/support1.png",
    imageAlt: "Health Awareness",
    title: "Health Awareness",
    href: "/health-awareness",
  },
  {
    image: "/Health/support1.png",
    imageAlt: "Health Camps",
    title: "Health Camps",
    href: "/health-camps",
  },
];

export default function EducationSection() {
  return (
    <ImageCardsSection
      label="Women Empowerment"
       heading={["Supporting Women to", "Lead and Grow"]}
      description="We create opportunities for women to strengthen their skills, participate in economic activities and enhance their decision-making power. Through initiatives such as microfinance and vocational training, IHDUA supports women in becoming equal stakeholders in their households and communities."
      items={EDUCATION_ITEMS}
    />
  );
}
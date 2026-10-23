import ImageCardsSection, {
  type ImageCardItem,
} from "@/shared/components/Imagecardsection";

const WOMEN_ITEMS: ImageCardItem[] = [
  {
    image: "/womenempowerment/self-help.png",
    imageAlt: "Self Help Group & Federation",
    title: "Self Help Group & Federation",
    href: "/Self-Help-Group-Federation",
    theme: "amber",
  },
  {
    image: "/womenempowerment/microfinance.png",
    imageAlt: "Micro-Finance Initiative",
    title: "Micro-Finance Initiative",
    href: "/Micro-Finance-Initiatives",
    theme: "purple",
  },
];

export default function SupportingWomen() {
  return (
    <ImageCardsSection
      label="WOMEN EMPOWERMENT"
      heading={["Supporting Women to", "Lead and Grow"]}
      description="We create opportunities for women to strengthen their skills, participate in economic activities and enhance their decision-making power. Through initiatives such as microfinance and vocational training, IHDUA supports women in becoming equal stakeholders in their households and communities."
      items={WOMEN_ITEMS}
      className="pb-6 sm:pb-8 lg:pb-0"
    />
  );
}

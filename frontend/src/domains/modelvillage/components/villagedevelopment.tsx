import ImageCardsSection, {
  type ImageCardItem,
} from "@/shared/components/Imagecardsection";
import { fetchImpactCategoryCards } from "@/shared/lib/impactApi";

export default async function VillageDevelopmentSection() {
  const apiCards = await fetchImpactCategoryCards("model-village");

  const items: ImageCardItem[] =
    apiCards && apiCards.length > 0
      ? apiCards.map((card, idx) => ({
          title: card.title || card.name,
          image: card.imageUrl || "",
          imageAlt: card.title || card.name,
          href: card.slug.startsWith("/") ? card.slug : `/${card.slug}`,
          theme: (idx % 2 === 0 ? "purple" : "amber") as ImageCardItem["theme"],
        }))
      : [];

  return (
    <ImageCardsSection
      label="VILLAGE DEVELOPMENT"
      heading={["Building Stronger", "Rural Communities"]}
      description="IHDUA’s Model Village project focuses on Chikkahundi village in Gundlupet taluk. It aims to support holistic village development through sustainable agriculture, organic farming and eco-friendly activities."
      items={items}
      categorySlug="model-village"
    />
  );
}

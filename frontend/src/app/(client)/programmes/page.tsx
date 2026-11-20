import type { Metadata } from "next";
import HeroBanner from "@/shared/components/Herobanner";
import NewsletterSection from "@/shared/components/Newsletter";
import ProgrammesGridSection from "@/domains/programmes/components/ProgrammesGridSection";
import { PROGRAMMES_HERO } from "@/domains/programmes/constants/programmesHero";
import { fetchPublishedProgrammes } from "@/domains/programmes/lib/programmes";
import { buildPageMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = buildPageMetadata({ path: "/programmes" });

export const dynamic = "force-dynamic";

export default async function ProgrammesPage() {
  const { data } = await fetchPublishedProgrammes({ page: 1, limit: 100 }).catch(
    () => ({ data: [] }),
  );

  return (
    <main className="w-full">
      <HeroBanner
        heading={PROGRAMMES_HERO.heading}
        description={PROGRAMMES_HERO.description}
        image={PROGRAMMES_HERO.image}
        imageMobile={PROGRAMMES_HERO.imageMobile}
        imageAlt={PROGRAMMES_HERO.imageAlt}
      />

      <ProgrammesGridSection initialItems={data} />

      <NewsletterSection />
    </main>
  );
}

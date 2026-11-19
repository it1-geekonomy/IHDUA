import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildImpactPageMetadata } from "@/shared/lib/seo";
import { fetchImpactInitiativePage } from "@/shared/lib/impactApi";
import { ImpactPageView } from "@/domains/impact/cms/ImpactPageView";
import NewsletterSection from "@/shared/components/Newsletter";

export const dynamic = "force-dynamic";

const SLUG = "stitching-unit";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchImpactInitiativePage(SLUG);
  return buildImpactPageMetadata(SLUG, page);
}

export default async function StitchingUnitPage() {
  const pageData = await fetchImpactInitiativePage(SLUG);

  if (!pageData) {
    notFound();
  }

  return (
    <main className="w-full">
      <ImpactPageView
        data={{
          layoutType: pageData.category.layoutType as any,
          slug: pageData.slug,
          heroTitle: pageData.heroTitle || pageData.name,
          heroDescription: pageData.heroDescription || "",
          heroImage: pageData.heroImageUrl || "",
          heroImageMobile:
            pageData.heroImageMobileUrl || pageData.heroImageUrl || "",
          content: pageData.content || {},
        }}
      />
      <NewsletterSection />
    </main>
  );
}

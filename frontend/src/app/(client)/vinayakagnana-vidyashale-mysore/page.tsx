import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchImpactInitiativePage } from "@/shared/lib/impactApi";
import { ImpactPageView } from "@/domains/impact/cms/ImpactPageView";
import NewsletterSection from "@/shared/components/Newsletter";

export const dynamic = "force-dynamic";

const SLUG = "vinayakagnana-vidyashale-mysore";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchImpactInitiativePage(SLUG);
  if (!page) return {};
  return {
    title: page.metaTitle || `${page.heroTitle || page.name} | IHDUA`,
    description: page.metaDescription || page.heroDescription || undefined,
  };
}

export default async function VinayakAgnanaVidyashalePage() {
  const pageData =
    (await fetchImpactInitiativePage("vinayakagnana-vidyashale-mysore")) ||
    (await fetchImpactInitiativePage("vinayaka-jnana-vidyashale-mysuru"));

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

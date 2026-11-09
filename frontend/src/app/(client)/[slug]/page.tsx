import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchImpactInitiativePage } from "@/shared/lib/impactApi";
import { ImpactPageView } from "@/domains/impact/cms/ImpactPageView";
import NewsletterSection from "@/shared/components/Newsletter";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchImpactInitiativePage(slug);
  if (!page) return {};
  return {
    title: page.metaTitle || `${page.heroTitle || page.name} | IHDUA`,
    description: page.metaDescription || page.heroDescription || undefined,
  };
}

export default async function DynamicImpactInitiativePage({ params }: Props) {
  const { slug } = await params;
  const pageData = await fetchImpactInitiativePage(slug);

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


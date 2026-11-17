import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { resolveImpactInitiative, resolveImpactPageData } from "@/domains/impact/cms/resolveImpactPage";
import { ImpactPageView } from "@/domains/impact/cms/ImpactPageView";
import NewsletterSection from "@/shared/components/Newsletter";

export const dynamic = "force-dynamic";

const SLUG = "adarsha-academy-krs";

export async function generateMetadata(): Promise<Metadata> {
  const page = await resolveImpactInitiative(SLUG);
  if (!page) return {};
  return {
    title: page.metaTitle || `${page.heroTitle || page.name} | IHDUA`,
    description: page.metaDescription || page.heroDescription || undefined,
  };
}

export default async function AdarshaAcademyPage() {
  const data = await resolveImpactPageData(SLUG);
  if (!data) notFound();

  return (
    <main className="w-full">
      <ImpactPageView data={data} />
      <NewsletterSection />
    </main>
  );
}

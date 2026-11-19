import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { resolveImpactInitiative, resolveImpactPageData } from "@/domains/impact/cms/resolveImpactPage";
import { ImpactPageView } from "@/domains/impact/cms/ImpactPageView";
import NewsletterSection from "@/shared/components/Newsletter";
import { buildImpactPageMetadata } from "@/shared/lib/seo";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await resolveImpactInitiative(slug);
  return buildImpactPageMetadata(slug, page);
}

export default async function DynamicImpactInitiativePage({ params }: Props) {
  const { slug } = await params;
  const data = await resolveImpactPageData(slug);
  if (!data) notFound();

  return (
    <main className="w-full">
      <ImpactPageView data={data} />
      <NewsletterSection />
    </main>
  );
}

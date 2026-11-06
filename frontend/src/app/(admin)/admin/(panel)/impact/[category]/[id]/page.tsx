import { notFound } from "next/navigation";
import { ImpactPageEditor } from "@/domains/admin/components/impact/ImpactPageEditor";
import { getCategoryDef } from "@/domains/admin/components/impact/layouts";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const def = getCategoryDef((await params).category);
  return { title: `Edit ${def?.name ?? "Impact"} Page | IHDUA Admin` };
}

export default async function AdminImpactEditPageRoute({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = await params;
  if (!getCategoryDef(category)) notFound();
  return <ImpactPageEditor key={id} categorySlug={category} pageId={id} />;
}

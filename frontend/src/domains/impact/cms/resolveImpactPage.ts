import {
  fetchImpactInitiativePage,
  toImpactPageData,
  type PublicImpactInitiativePage,
} from "@/shared/lib/impactApi";
import {
  hasGalleryPage,
  type ImpactPageData,
} from "@/domains/impact/cms/ImpactPageView";

/** Known slug aliases (old routes / CMS renames). */
const SLUG_ALIASES: Record<string, string[]> = {
  "vinayakagnana-vidyashale-mysore": [
    "vinayakagnana-vidyashale-mysore",
    "vinayaka-jnana-vidyashale-mysuru",
  ],
  "vinayaka-jnana-vidyashale-mysuru": [
    "vinayaka-jnana-vidyashale-mysuru",
    "vinayakagnana-vidyashale-mysore",
  ],
  "adarsha-academy-krs": ["adarsha-academy-krs"],
  women: ["women"],
};

function candidatesFor(slug: string): string[] {
  const listed = SLUG_ALIASES[slug];
  if (listed) return listed;
  return [slug];
}

export async function resolveImpactInitiative(
  slug: string,
): Promise<PublicImpactInitiativePage | null> {
  for (const candidate of candidatesFor(slug)) {
    const page = await fetchImpactInitiativePage(candidate);
    if (page) return page;
  }
  return null;
}

export async function resolveImpactPageData(
  slug: string,
): Promise<ImpactPageData | null> {
  const page = await resolveImpactInitiative(slug);
  return page ? toImpactPageData(page) : null;
}

export async function resolveImpactGalleryPage(slug: string): Promise<{
  page: PublicImpactInitiativePage;
  data: ImpactPageData;
} | null> {
  const page = await resolveImpactInitiative(slug);
  if (!page) return null;
  const data = toImpactPageData(page);
  if (!hasGalleryPage(data)) return null;

  const gallery = data.content.gallery as { images?: unknown } | undefined;
  const images = Array.isArray(gallery?.images)
    ? gallery.images.filter((url) => typeof url === "string" && url.trim() !== "")
    : [];
  if (images.length === 0) return null;

  return { page, data };
}

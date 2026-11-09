import { NAV_LINKS, type NavLink } from "@/shared/constants/navbar";

export interface ImpactNavigationPage {
  name: string;
  slug: string;
  displayOrder: number;
}

export interface ImpactNavigationCategory {
  name: string;
  slug: string;
  layoutType: string;
  displayOrder: number;
  pages: ImpactNavigationPage[];
}

export interface ImpactInitiativeCard {
  title: string;
  imageUrl: string | null;
  slug: string;
  displayOrder: number;
  cardTitle: string | null;
  cardImageUrl: string | null;
  name: string;
  heroImageUrl: string | null;
}

export interface PublicImpactInitiativePage {
  name: string;
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
  heroTitle: string | null;
  heroDescription: string | null;
  heroImageUrl: string | null;
  heroImageMobileUrl: string | null;
  content: Record<string, unknown> | null;
  publishedAt: string | null;
  category: {
    id?: string;
    name: string;
    slug: string;
    layoutType: string;
    displayOrder: number;
  };
}

export interface PublicImpactInitiativeListItem {
  name: string;
  slug: string;
  heroTitle: string | null;
  heroImageUrl: string | null;
  displayOrder: number;
  category: {
    id?: string;
    name: string;
    slug: string;
    layoutType: string;
    displayOrder: number;
  };
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:6061/api";

/**
 * Fetch published categories and their published pages for the "Our Impact" navigation menu.
 * Endpoint: GET /api/impact-categories/navigation
 */
export async function fetchImpactNavigation(): Promise<ImpactNavigationCategory[] | null> {
  try {
    const res = await fetch(`${API_BASE}/impact-categories/navigation`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return Array.isArray(json.data) ? (json.data as ImpactNavigationCategory[]) : null;
  } catch {
    return null;
  }
}

/**
 * Fetch cards for a specific impact category landing page.
 * Endpoint: GET /api/impact-initiatives/cards/:categorySlug
 */
export async function fetchImpactCategoryCards(
  categorySlug: string,
): Promise<ImpactInitiativeCard[] | null> {
  try {
    const res = await fetch(
      `${API_BASE}/impact-initiatives/cards/${encodeURIComponent(categorySlug)}`,
      {
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return Array.isArray(json.data) ? (json.data as ImpactInitiativeCard[]) : null;
  } catch {
    return null;
  }
}

/**
 * Fetch a single published initiative page by unique slug.
 * Endpoint: GET /api/impact-initiatives/slug/:slug
 */
export async function fetchImpactInitiativePage(
  slug: string,
): Promise<PublicImpactInitiativePage | null> {
  try {
    const res = await fetch(
      `${API_BASE}/impact-initiatives/slug/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ? (json.data as PublicImpactInitiativePage) : null;
  } catch {
    return null;
  }
}

/**
 * Fetch all published impact initiatives for public listing.
 * Endpoint: GET /api/impact-initiatives/public
 */
export async function fetchAllPublicInitiatives(): Promise<
  PublicImpactInitiativeListItem[] | null
> {
  try {
    const res = await fetch(`${API_BASE}/impact-initiatives/public`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return Array.isArray(json.data)
      ? (json.data as PublicImpactInitiativeListItem[])
      : null;
  } catch {
    return null;
  }
}

/**
 * Replaces static "Our Impact" navigation links with dynamic categories and pages from the CMS.
 * If no categories exist in the database, the dropdown is empty (no hardcoded fallback).
 */
export function mergeImpactNavigation(
  baseNavLinks: NavLink[],
  apiCategories: ImpactNavigationCategory[] | null,
): NavLink[] {
  return baseNavLinks.map((link) => {
    if (link.label !== "Our Impact") return link;

    if (!apiCategories || apiCategories.length === 0) {
      return {
        ...link,
        children: [],
      };
    }

    const sortedApiCats = [...apiCategories].sort(
      (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
    );

    const dynamicChildren: NavLink[] = sortedApiCats.map((apiCat) => {
      const cleanSlug = apiCat.slug.replace(/^\//, "");
      const catHref = `/${cleanSlug}`;

      let pages: NavLink[] | undefined = undefined;
      if (apiCat.pages && apiCat.pages.length > 0) {
        const sortedPages = [...apiCat.pages].sort(
          (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
        );
        pages = sortedPages.map((p) => ({
          label: p.name,
          href: p.slug.startsWith("/") ? p.slug : `/${p.slug}`,
        }));
      }

      return {
        label: apiCat.name,
        href: catHref,
        children: pages,
      };
    });

    return {
      ...link,
      children: dynamicChildren,
    };
  });
}


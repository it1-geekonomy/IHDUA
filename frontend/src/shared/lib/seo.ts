import type { Metadata } from "next";

export type PageSeo = {
  title: string;
  description: string;
  /** Preferred canonical path (leading slash, no trailing slash except home). */
  canonical: string;
};

/**
 * Site-wide SEO defaults (title, description, canonical).
 * Local route aliases (e.g. /farmers) resolve to the preferred live path.
 */
const PAGE_SEO: Record<string, PageSeo> = {
  "/": {
    title: "IHDUA | Rural Development & Community Empowerment India",
    description:
      "IHDUA drives rural development through women empowerment, education, skill training, healthcare and sustainable initiatives to build stronger communities.",
    canonical: "/",
  },
  "/about": {
    title: "About IHDUA | Our Mission for Rural Community Development",
    description:
      "Learn about IHDUA, our mission, vision and initiatives to empower rural communities through education, women empowerment, skill development and growth.",
    canonical: "/about",
  },
  "/privacy-policy": {
    title: "Privacy Policy | IHDUA – Data Protection & Privacy",
    description:
      "Read IHDUA's privacy policy to understand how we collect, use, protect and manage your personal information when you visit our website.",
    canonical: "/privacy-policy",
  },
  "/terms-and-conditions": {
    title: "Terms & Conditions | IHDUA – Website Usage Guidelines",
    description:
      "Read IHDUA's terms and conditions to understand the rules, responsibilities and guidelines for accessing and using our website and services.",
    canonical: "/terms-and-conditions",
  },
  "/blogs": {
    title: "IHDUA Blogs | Rural Development, Education & Empowerment",
    description:
      "Explore IHDUA blogs for insights on rural development, women empowerment, education, healthcare, skill development and sustainable community growth.",
    canonical: "/blogs",
  },
  "/donate": {
    title: "Donate to IHDUA | Support Rural Development & Empowerment",
    description:
      "Support IHDUA's mission through your donation. Help empower rural communities with education, women's development, healthcare and initiatives.",
    canonical: "/donate",
  },
  "/women-empowerment": {
    title: "Women Empowerment in India | IHDUA Rural Development",
    description:
      "Discover IHDUA's women empowerment initiatives focused on financial independence, skill development, education and livelihoods for rural women in India.",
    canonical: "/women-empowerment",
  },
  "/contact": {
    title: "Contact IHDUA | Get in Touch for Rural Development",
    description:
      "Contact IHDUA to learn about rural development initiatives, women empowerment programs, educational activities and opportunities to support our mission.",
    canonical: "/contact",
  },
  "/health": {
    title: "Rural Healthcare Initiatives in India | IHDUA",
    description:
      "Explore IHDUA's healthcare initiatives focused on improving rural health, promoting hygiene awareness and making healthcare accessible to communities.",
    canonical: "/health",
  },
  "/skills-and-employment": {
    title: "Skill Development & Employment Programs in India | IHDUA",
    description:
      "IHDUA's skill development and employment programs that equip rural communities with practical training, career opportunities and financial independence.",
    canonical: "/skills-and-employment",
  },
  "/education": {
    title: "Rural Education Programs in India | IHDUA",
    description:
      "Explore IHDUA's education initiatives focused on improving learning opportunities, promoting literacy and empowering rural children through quality education.",
    canonical: "/education",
  },
  "/vinayaka-jnana-vidyashale-mysuru": {
    title: "Vinayaka Jnana Vidyashale Mysuru | Quality Education",
    description:
      "Discover Vinayaka Jnana Vidyashale in Mysuru, an educational initiative dedicated to providing quality learning and empowering children through education.",
    canonical: "/vinayaka-jnana-vidyashale-mysuru",
  },
  "/vinayakagnana-vidyashale-mysore": {
    title: "Vinayaka Jnana Vidyashale Mysuru | Quality Education",
    description:
      "Discover Vinayaka Jnana Vidyashale in Mysuru, an educational initiative dedicated to providing quality learning and empowering children through education.",
    canonical: "/vinayaka-jnana-vidyashale-mysuru",
  },
  "/stitching-unit": {
    title: "Stitching Training & Employment Opportunities | IHDUA",
    description:
      "IHDUA's stitching unit, empowering rural women through tailoring skills, vocational training and income-generating opportunities for financial independence.",
    canonical: "/stitching-unit",
  },
  "/women": {
    title: "Women Empowerment Programs in India | IHDUA",
    description:
      "IHDUA's women-focused initiatives promoting education, skill development, financial independence and better livelihood opportunities for rural women in India.",
    canonical: "/women",
  },
  "/farmer": {
    title: "Farmer Empowerment & Sustainable Agriculture | IHDUA",
    description:
      "IHDUA's farmer initiatives promoting sustainable agriculture, organic farming, modern techniques and better livelihood opportunities for rural farmers in India.",
    canonical: "/farmer",
  },
  "/farmers": {
    title: "Farmer Empowerment & Sustainable Agriculture | IHDUA",
    description:
      "IHDUA's farmer initiatives promoting sustainable agriculture, organic farming, modern techniques and better livelihood opportunities for rural farmers in India.",
    canonical: "/farmer",
  },
  "/youth": {
    title: "Youth Empowerment & Skill Development Programs | IHDUA",
    description:
      "Explore IHDUA's youth empowerment initiatives focused on education, skill development, employment opportunities and leadership for a brighter future in India.",
    canonical: "/youth",
  },
  "/adarsha-academy": {
    title: "Adarsha Academy | Rural Kindergarten to Grade 8 School",
    description:
      "Adarsha Academy provides quality education from kindergarten to Grade 8, serving children from seven villages near the Krishnarajasagara Dam in Mysuru.",
    canonical: "/adarsha-academy",
  },
  "/adarsha-academy-krs": {
    title: "Adarsha Academy | Rural Kindergarten to Grade 8 School",
    description:
      "Adarsha Academy provides quality education from kindergarten to Grade 8, serving children from seven villages near the Krishnarajasagara Dam in Mysuru.",
    canonical: "/adarsha-academy",
  },
  "/health-camps": {
    title: "Free Health Camps & Rural Healthcare Services | IHDUA",
    description:
      "IHDUA's health camps providing rural communities with medical checkups, health awareness, preventive care and access to essential healthcare services.",
    canonical: "/health-camps",
  },
  "/health-awareness": {
    title: "Health Awareness Programs in Rural India | IHDUA",
    description:
      "Explore IHDUA's health awareness programs promoting hygiene, disease prevention, healthy lifestyles and better healthcare knowledge in rural communities.",
    canonical: "/health-awareness",
  },
  "/self-help-group-and-federation": {
    title: "Self Help Groups & Federation for Rural Women | IHDUA",
    description:
      "Explore IHDUA's self-help groups and federations supporting rural women through collective savings, financial inclusion, entrepreneurship and empowerment.",
    canonical: "/self-help-group-and-federation",
  },
  "/self-help-group-federation": {
    title: "Self Help Groups & Federation for Rural Women | IHDUA",
    description:
      "Explore IHDUA's self-help groups and federations supporting rural women through collective savings, financial inclusion, entrepreneurship and empowerment.",
    canonical: "/self-help-group-and-federation",
  },
  "/micro-finance-initiative": {
    title: "Microfinance Initiatives for Rural Women & Communities | IHDUA",
    description:
      "IHDUA's microfinance initiatives providing rural women with financial support, access to credit and opportunities for entrepreneurship and independence.",
    canonical: "/micro-finance-initiative",
  },
  "/micro-finance-initiatives": {
    title: "Microfinance Initiatives for Rural Women & Communities | IHDUA",
    description:
      "IHDUA's microfinance initiatives providing rural women with financial support, access to credit and opportunities for entrepreneurship and independence.",
    canonical: "/micro-finance-initiative",
  },
  "/adarsha-academy/gallery": {
    title: "Adarsha Academy Gallery | School Events & Activities",
    description:
      "Explore the Adarsha Academy gallery featuring school events, classroom activities and memorable moments showcasing student learning and development.",
    canonical: "/adarsha-academy/gallery",
  },
  "/adarsha-academy-krs/gallery": {
    title: "Adarsha Academy Gallery | School Events & Activities",
    description:
      "Explore the Adarsha Academy gallery featuring school events, classroom activities and memorable moments showcasing student learning and development.",
    canonical: "/adarsha-academy/gallery",
  },
  "/women/gallery": {
    title: "Women Empowerment Gallery | IHDUA Programs & Activities",
    description:
      "IHDUA's women empowerment gallery showcasing training programs, community activities and initiatives that promote women's growth and independence.",
    canonical: "/women/gallery",
  },
  "/vinayaka-jnana-vidyashale-mysuru/gallery": {
    title: "Vinayaka Jnana Vidyashale Gallery | School Activities",
    description:
      "Explore the Vinayaka Jnana Vidyashale gallery featuring school events, student activities, classroom experiences and memorable moments from school life.",
    canonical: "/vinayaka-jnana-vidyashale-mysuru/gallery",
  },
  "/vinayakagnana-vidyashale-mysore/gallery": {
    title: "Vinayaka Jnana Vidyashale Gallery | School Activities",
    description:
      "Explore the Vinayaka Jnana Vidyashale gallery featuring school events, student activities, classroom experiences and memorable moments from school life.",
    canonical: "/vinayaka-jnana-vidyashale-mysuru/gallery",
  },
  "/blogs/womens-leadership-development-programme": {
    title: "Women's Leadership Development Programme | IHDUA",
    description:
      "how IHDUA's Women's Leadership Development Programme empowers rural women with leadership skills, confidence and opportunities to social change.",
    canonical: "/blogs/womens-leadership-development-programme",
  },
  "/blogs/implementation-in-bettegowdanahundi-village": {
    title: "Village Development Initiative in Bettegowdanahundi | IHDUA",
    description:
      "IHDUA's development initiatives in Bettegowdanahundi village, promoting rural empowerment, community participation and sustainable development.",
    canonical: "/blogs/implementation-in-bettegowdanahundi-village",
  },
  "/blogs/skill-development-programmes-current-projects": {
    title: "Skill Development Programmes & Current Projects | IHDUA",
    description:
      "IHDUA's skill development programmes and current projects focused on vocational training, employment opportunities and rural community empowerment.",
    canonical: "/blogs/skill-development-programmes-current-projects",
  },
  "/blogs/womens-leadership-and-community-participation": {
    title: "Women's Leadership & Community Participation | IHDUA",
    description:
      "how IHDUA promotes women's leadership and community participation through empowerment initiatives, skill development and inclusive rural development.",
    canonical: "/blogs/womens-leadership-and-community-participation",
  },
  "/blogs/skill-development-and-alternative-livelihood-opportunities": {
    title: "Skill Development & Alternative Livelihoods | IHDUA",
    description:
      "IHDUA's skill development initiatives creating alternative livelihood opportunities through vocational training, income generation and rural empowerment.",
    canonical: "/blogs/skill-development-and-alternative-livelihood-opportunities",
  },
  "/blogs/economic-empowerment-through-self-help-groups": {
    title: "Economic Empowerment Through Self Help Groups | IHDUA",
    description:
      "how IHDUA empowers rural women through self-help groups, promoting financial inclusion, collective savings, entrepreneurship and economic independence.",
    canonical: "/blogs/economic-empowerment-through-self-help-groups",
  },
  "/blogs/international-human-development-and-upliftment-academy-ihdua-organizational-profile-and-35-years-of-community-development":
    {
      title: "IHDUA's 35 Years of Rural & Community Development",
      description:
        "Learn about IHDUA's 35-year journey in rural development, women empowerment, education and sustainable community growth across underserved regions of India.",
      canonical:
        "/blogs/international-human-development-and-upliftment-academy-ihdua-organizational-profile-and-35-years-of-community-development",
    },
};

function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  return withSlash.replace(/\/+$/, "") || "/";
}

export function getPageSeo(path: string): PageSeo | undefined {
  return PAGE_SEO[normalizePath(path)];
}

/**
 * Unique preferred canonical paths from the SEO map.
 * Blog post URLs (`/blogs/...`) are excluded — those come from the CMS at runtime.
 */
export function listStaticSitePaths(): string[] {
  const seen = new Set<string>();
  const paths: string[] = [];
  for (const entry of Object.values(PAGE_SEO)) {
    const c = entry.canonical || "/";
    if (seen.has(c)) continue;
    if (c.startsWith("/blogs/")) continue;
    seen.add(c);
    paths.push(c);
  }
  return paths;
}

/** @deprecated Prefer listStaticSitePaths() */
export function listSeoCanonicalPaths(): string[] {
  return listStaticSitePaths();
}

type BuildOpts = {
  /** Route path used for lookup + default canonical, e.g. "/youth" or "youth" */
  path: string;
  title?: string | null;
  description?: string | null;
  /** Override openGraph type (default website; blogs use article). */
  type?: "website" | "article";
  images?: { url: string; alt?: string }[];
};

/** Build Next.js Metadata with title, description, canonical, and Open Graph. */
export function buildPageMetadata({
  path,
  title,
  description,
  type = "website",
  images,
}: BuildOpts): Metadata {
  const key = normalizePath(path);
  const defaults = getPageSeo(key);
  const resolvedTitle =
    (title && title.trim()) || defaults?.title || "IHDUA";
  const resolvedDescription =
    (description && description.trim()) || defaults?.description || undefined;
  const canonical = defaults?.canonical || key;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonical,
      type,
      ...(images?.length ? { images } : {}),
    },
    twitter: {
      card: images?.length ? "summary_large_image" : "summary",
      title: resolvedTitle,
      description: resolvedDescription,
      ...(images?.length ? { images: images.map((i) => i.url) } : {}),
    },
  };
}

/** Metadata for CMS impact initiative pages (CMS meta wins, SEO map is fallback). */
export function buildImpactPageMetadata(
  slug: string,
  page?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    heroTitle?: string | null;
    heroDescription?: string | null;
    name?: string | null;
  } | null,
): Metadata {
  const path = normalizePath(slug);
  const defaults = getPageSeo(path);
  if (!page && !defaults) return {};

  return buildPageMetadata({
    path,
    title:
      page?.metaTitle ||
      defaults?.title ||
      (page ? `${page.heroTitle || page.name} | IHDUA` : null),
    description:
      page?.metaDescription ||
      defaults?.description ||
      page?.heroDescription ||
      null,
  });
}

/** Metadata for initiative gallery pages. */
export function buildImpactGalleryMetadata(
  slug: string,
  page?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    heroTitle?: string | null;
    heroDescription?: string | null;
  } | null,
  galleryHeading?: string | null,
): Metadata {
  const path = normalizePath(`${slug}/gallery`);
  const defaults = getPageSeo(path);
  const pageDefaults = getPageSeo(slug);

  const title =
    defaults?.title ||
    (page
      ? `${galleryHeading || "Gallery"} · ${page.metaTitle || page.heroTitle || "IHDUA"}`
      : null);
  const description =
    defaults?.description ||
    page?.metaDescription ||
    pageDefaults?.description ||
    page?.heroDescription ||
    null;

  return buildPageMetadata({ path, title, description });
}

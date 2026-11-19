/** Public site origin used for canonicals, sitemap, and robots. */
export function getSiteOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://ihdua.org").replace(/\/$/, "");
}

export function absoluteUrl(path = "/"): string {
  const origin = getSiteOrigin();
  if (!path || path === "/") return origin;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

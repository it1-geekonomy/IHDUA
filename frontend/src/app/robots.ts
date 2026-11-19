import type { MetadataRoute } from "next";
import { absoluteUrl, getSiteOrigin } from "@/shared/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/impact-preview", "/api-docs"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: getSiteOrigin(),
  };
}

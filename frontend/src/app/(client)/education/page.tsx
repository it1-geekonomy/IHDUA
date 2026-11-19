import type { Metadata } from "next";
import { buildPageMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = buildPageMetadata({ path: "/education" });

export const dynamic = "force-dynamic";
export { default } from "@/app/(client)/impact/page";

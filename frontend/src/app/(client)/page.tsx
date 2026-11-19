import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Developmentpage from "@/domains/home/components/Developmentpage";
import {
  bannerImageUrls,
  fetchPublishedBanners,
} from "@/domains/home/lib/homeBanners";
import {
  fetchBlogCategories,
  fetchPublishedStories,
} from "@/domains/home/lib/blogs";
import { mapFieldStories } from "@/domains/home/lib/mapFieldStories";
import { buildPageMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = buildPageMetadata({ path: "/" });

export const revalidate = 300;

const Statsection = dynamic(
  () => import("@/domains/home/components/Statsection"),
  {
    loading: () => (
      <div className="min-h-[28rem] w-full bg-white" aria-hidden />
    ),
  },
);

const OurConviction = dynamic(
  () => import("@/domains/home/components/Ourconviction"),
  {
    loading: () => (
      <div className="min-h-[28rem] w-full bg-white" aria-hidden />
    ),
  },
);

const FocusAreaSection = dynamic(
  () => import("@/domains/home/components/FocusAreaSection"),
  {
    loading: () => (
      <div className="min-h-[28rem] w-full bg-[#FAF9F5]" aria-hidden />
    ),
  },
);

const MovementMarquee = dynamic(
  () => import("@/domains/home/components/Movementmarquee"),
);

const HowCanYouHelpSection = dynamic(
  () => import("@/domains/home/components/HowCanYouHelpSection"),
);

const Missionsection = dynamic(
  () => import("@/domains/home/components/Missionsection"),
  {
    loading: () => (
      <div className="min-h-[32rem] w-full bg-[#FAF9F5]" aria-hidden />
    ),
  },
);

const GeographicFootprint = dynamic(
  () => import("@/domains/home/components/GeographicFootprint"),
  {
    loading: () => (
      <div className="min-h-[28rem] w-full bg-white" aria-hidden />
    ),
  },
);

const StoriesFromField = dynamic(
  () => import("@/domains/home/components/StoriesFromField"),
  {
    loading: () => (
      <div className="min-h-[40rem] w-full bg-[#FAF9F5]" aria-hidden />
    ),
  },
);

const LastingChangeSection = dynamic(
  () => import("@/domains/home/components/LastingChangeSection"),
);

const ThreePathsSection = dynamic(
  () => import("@/domains/home/components/ThreePathsSection"),
);

export default async function ClientHomePage() {
  const [bannersResult, storiesResult, categoriesResult] =
    await Promise.allSettled([
      fetchPublishedBanners(),
      fetchPublishedStories({ sort: "newest", limit: 12 }),
      fetchBlogCategories(),
    ]);

  const bannerImages =
    bannersResult.status === "fulfilled"
      ? bannerImageUrls(bannersResult.value)
      : [];

  const initialStories =
    storiesResult.status === "fulfilled"
      ? mapFieldStories(
          storiesResult.value,
          categoriesResult.status === "fulfilled" ? categoriesResult.value : [],
          3,
        )
      : [];

  return (
    <div>
      <Developmentpage bannerImages={bannerImages} />
      <Statsection />
      <OurConviction />
      <FocusAreaSection />
      <div className="lg:pb-12">
        <MovementMarquee />
      </div>
      <HowCanYouHelpSection />
      <Missionsection />
      <LastingChangeSection />
      <GeographicFootprint />
      <StoriesFromField initialStories={initialStories} />
      <ThreePathsSection />
    </div>
  );
}

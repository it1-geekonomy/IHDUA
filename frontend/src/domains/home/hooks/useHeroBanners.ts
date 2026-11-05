"use client";

import { useEffect, useState } from "react";
import { HERO_IMAGES } from "@/domains/home/constants/development";
import { fetchPublishedBanners } from "@/domains/home/lib/homeBanners";

/** Result kept after the first load, so remounting shows images instantly with no new call. */
let resolvedImages: string[] | null = null;

/**
 * Returns `null` while loading, then the published banner URLs.
 * Falls back to the static HERO_IMAGES if the API fails or returns nothing.
 */
export function useHeroBanners() {
  const [images, setImages] = useState<string[] | null>(resolvedImages);

  useEffect(() => {
    if (resolvedImages) return; // already loaded earlier in this session

    let cancelled = false;

    fetchPublishedBanners()
      .then((banners) => {
        const urls = banners.map((b) => b.bannerImageUrl).filter(Boolean);
        resolvedImages = urls.length > 0 ? urls : HERO_IMAGES;
        if (!cancelled) setImages(resolvedImages);
      })
      .catch(() => {
        if (!cancelled) setImages(HERO_IMAGES);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return images;
}
"use client";

import { useEffect, useState } from "react";
import { fetchPublishedBanners } from "@/domains/home/lib/homeBanners";

/**
 * Returns `null` while loading, then the published banner URLs.
 * Returns `[]` if nothing is published or the API fails (no static fallback).
 * Called once per visit to the Home page.
 */
export function useHeroBanners() {
  const [images, setImages] = useState<string[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchPublishedBanners()
      .then((banners) => {
        const urls = banners.map((b) => b.bannerImageUrl).filter(Boolean);
        if (!cancelled) setImages(urls);
      })
      .catch(() => {
        if (!cancelled) setImages([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return images;
}
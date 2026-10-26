"use client";

import { useEffect, useState } from "react";

import ClientLayout from "@/app/(client)/layout";
import ClientPage from "@/app/(client)/page";
import Overlayform from "@/domains/home/components/Overlayform";

// In-memory module-level flag:
// Resets to false on full document load / browser reload (starting time / F5)
// Persists across all client-side navigations (footer links, header links, route pushes)
let initialOverlayShown = false;

function isPageReload(): boolean {
  if (typeof window === "undefined") return false;
  const navEntries = performance.getEntriesByType("navigation");
  if (navEntries.length > 0) {
    return (navEntries[0] as PerformanceNavigationTiming).type === "reload";
  }
  return (window.performance as unknown as { navigation?: { type?: number } })?.navigation?.type === 1;
}

export default function HomePage() {
  const [ready, setReady] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const isReload = isPageReload();

    // On browser reload, clear any suppression flag so the popup shows
    if (isReload) {
      sessionStorage.removeItem("suppress_overlay");
    }

    // Check if explicitly suppressed by an internal navigation (e.g. clicked from footer)
    if (sessionStorage.getItem("suppress_overlay") === "true") {
      sessionStorage.removeItem("suppress_overlay");
      initialOverlayShown = true;
      return;
    }

    // Only show on starting time or when page is reloaded
    if (!initialOverlayShown || isReload) {
      initialOverlayShown = true;
      setShowOverlay(true);
    }
  }, []);

  return (
    <>
      {ready && (
        <>
          <ClientLayout>
            <ClientPage />
          </ClientLayout>
        </>
      )}

      {showOverlay && (
        <Overlayform
          onClose={() => {
            setShowOverlay(false);
          }}
        />
      )}
    </>
  );
}
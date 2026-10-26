"use client";

import { useEffect, useState } from "react";

import ClientLayout from "@/app/(client)/layout";
import ClientPage from "@/app/(client)/page";
import Overlayform from "@/domains/home/components/Overlayform";

declare global {
  interface Window {
    __PAGE_SESSION_ID__?: number;
    __IHDUA_POPUP_SHOWN__?: boolean;
  }
}

function isPageReload(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const navEntries = performance.getEntriesByType("navigation");
    if (navEntries.length > 0) {
      return (navEntries[0] as PerformanceNavigationTiming).type === "reload";
    }
    // Fallback for older browsers
    const perfNav = (window.performance as unknown as { navigation?: { type?: number } })?.navigation;
    return perfNav?.type === 1;
  } catch {
    return false;
  }
}

export default function HomePage() {
  const [ready, setReady] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // If the user refreshed / hard-refreshed the page, ALWAYS clear suppression & dismissal
    if (isPageReload()) {
      sessionStorage.removeItem("suppress_overlay");
      sessionStorage.removeItem("ihdua_overlay_dismissed");
      sessionStorage.removeItem("ihdua_nav_time");
      window.__IHDUA_POPUP_SHOWN__ = false;
    }

    // Check if the user navigated here via an internal footer/nav link within the last 8 seconds
    const navTime = Number(sessionStorage.getItem("ihdua_nav_time") || 0);
    const isRecentInternalNav = navTime > 0 && Date.now() - navTime < 8000;

    const isSuppressed =
      isRecentInternalNav || sessionStorage.getItem("suppress_overlay") === "true";
    const isDismissed = sessionStorage.getItem("ihdua_overlay_dismissed") === "true";
    const alreadyShown = window.__IHDUA_POPUP_SHOWN__ === true;

    if (isSuppressed || isDismissed || alreadyShown) {
      // Clear the temporary internal nav timestamp once checked
      if (isRecentInternalNav) {
        sessionStorage.removeItem("ihdua_nav_time");
      }
      return;
    }

    // Show after 5 seconds instead of immediately upon entering
    const timer = setTimeout(() => {
      const currentSuppressed =
        sessionStorage.getItem("suppress_overlay") === "true";
      const currentDismissed =
        sessionStorage.getItem("ihdua_overlay_dismissed") === "true";
      const currentShown = window.__IHDUA_POPUP_SHOWN__ === true;

      if (!currentSuppressed && !currentDismissed && !currentShown) {
        window.__IHDUA_POPUP_SHOWN__ = true;
        setShowOverlay(true);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleCloseOverlay = () => {
    setShowOverlay(false);
    if (typeof window !== "undefined") {
      window.__IHDUA_POPUP_SHOWN__ = true;
      sessionStorage.setItem("ihdua_overlay_dismissed", "true");
    }
  };

  return (
    <>
      {ready && (
        <>
          <ClientLayout>
            <ClientPage />
          </ClientLayout>
        </>
      )}

      {showOverlay && <Overlayform onClose={handleCloseOverlay} />}
    </>
  );
}
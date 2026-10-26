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

// Executed only on real document loads/reloads, NEVER on client-side routing
if (typeof window !== "undefined") {
  if (!window.__PAGE_SESSION_ID__) {
    window.__PAGE_SESSION_ID__ = Math.random();
    sessionStorage.removeItem("ihdua_overlay_dismissed");
    sessionStorage.removeItem("suppress_overlay");
  }
}

export default function HomePage() {
  const [ready, setReady] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // If user clicked any footer/nav link or dismissed the overlay previously during this browser session
    const isSuppressed = sessionStorage.getItem("suppress_overlay") === "true";
    const isDismissed = sessionStorage.getItem("ihdua_overlay_dismissed") === "true";
    const alreadyShown = window.__IHDUA_POPUP_SHOWN__ === true;

    if (isSuppressed || isDismissed || alreadyShown) {
      window.__IHDUA_POPUP_SHOWN__ = true;
      sessionStorage.setItem("ihdua_overlay_dismissed", "true");
      return;
    }

    // Mark as handled for this browser session
    window.__IHDUA_POPUP_SHOWN__ = true;

    // Show after 5 seconds instead of immediately upon entering
    const timer = setTimeout(() => {
      const currentSuppressed = sessionStorage.getItem("suppress_overlay") === "true";
      const currentDismissed = sessionStorage.getItem("ihdua_overlay_dismissed") === "true";
      if (!currentSuppressed && !currentDismissed) {
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
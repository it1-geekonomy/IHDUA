"use client";

import { useEffect, useState } from "react";
import ClientLayout from "@/app/(client)/layout";
import ClientPage from "@/app/(client)/page";
import Overlayform from "@/domains/home/components/Overlayform";
import { isClientNavigated, markClientNav } from "@/shared/lib/navState";

export default function HomePage() {
  const [ready, setReady] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // Popup ONLY triggers on starting entry or page refresh / hard-reload.
    // If the user arrived here via in-app navigation (footer, navbar, etc.), DO NOT show.
    if (isClientNavigated()) {
      return;
    }

    // Show after 5 seconds instead of immediately upon entering
    const timer = setTimeout(() => {
      if (!isClientNavigated()) {
        setShowOverlay(true);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleCloseOverlay = () => {
    setShowOverlay(false);
    // Mark as navigated so it doesn't reappear during this session without reload
    markClientNav();
  };

  return (
    <>
      {ready && (
        <ClientLayout>
          <ClientPage />
        </ClientLayout>
      )}

      {showOverlay && <Overlayform onClose={handleCloseOverlay} />}
    </>
  );
}
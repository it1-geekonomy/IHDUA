"use client";

import { useEffect, useState } from "react";
import Overlayform from "@/domains/home/components/Overlayform";
import { isClientNavigated, markClientNav } from "@/shared/lib/navState";

export function DonationPopupShell() {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // Popup ONLY triggers on starting entry or page refresh / hard-reload on any page.
    // If the user arrived here via in-app navigation (footer, navbar, etc.), DO NOT show.
    if (isClientNavigated()) {
      return;
    }

    // Show after 5 seconds delay
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

  if (!showOverlay) return null;

  return <Overlayform onClose={handleCloseOverlay} />;
}

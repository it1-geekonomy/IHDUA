"use client";

import { useEffect, useState } from "react";
import Overlayform from "@/domains/home/components/Overlayform";
import { markClientNav, shouldSuppressEntryPopup } from "@/shared/lib/navState";

export function DonationPopupShell() {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // English soft nav keeps this shell mounted → suppressed via in-memory flag.
    // Kannada uses full document loads; session marker suppresses re-open on page change.
    // Browser refresh (F5) still shows the popup, same as English.
    if (shouldSuppressEntryPopup()) return;

    const timer = window.setTimeout(() => {
      if (shouldSuppressEntryPopup()) return;
      setShowOverlay(true);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, []);

  const handleCloseOverlay = () => {
    setShowOverlay(false);
    markClientNav();
  };

  if (!showOverlay) return null;

  return <Overlayform onClose={handleCloseOverlay} />;
}

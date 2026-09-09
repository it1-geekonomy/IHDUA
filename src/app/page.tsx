"use client";

import { useState } from "react";

import ClientLayout from "@/app/(client)/layout";
import ClientPage from "@/app/(client)/page";
import Overlayform from "@/domains/home/components/Overlayform";

export default function HomePage() {
  const [ready, setReady] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);

  return (
    <>
      {ready && (
        <>
          <ClientLayout>
            <ClientPage />
          </ClientLayout>
        </>
      )}

      {showOverlay && <Overlayform onClose={() => setShowOverlay(false)} />}
    </>
  );
}
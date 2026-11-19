"use client";

import dynamic from "next/dynamic";

const DonationPopupShell = dynamic(
  () =>
    import("@/shared/components/DonationPopupShell").then((m) => ({
      default: m.DonationPopupShell,
    })),
  { ssr: false },
);

const ChatbotWidget = dynamic(
  () =>
    import("@/shared/components/chatbot").then((m) => ({
      default: m.ChatbotWidget,
    })),
  { ssr: false },
);

/** Below-fold chrome — keep out of the critical SSR/JS path for LCP. */
export function ClientChrome() {
  return (
    <>
      <DonationPopupShell />
      <ChatbotWidget />
    </>
  );
}

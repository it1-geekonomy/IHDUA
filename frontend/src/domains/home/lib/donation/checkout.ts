import { DONATION_SECTION_ID } from "@/shared/constants/donation";
import { smoothScrollToId } from "@/shared/lib/smoothScroll";

export const DONATE_CHECKOUT_EVENT = "ihdua:donate-checkout";

export type DonateCheckoutDetail = {
  amount: string;
  countryCode?: string;
  /** Prefill donation cause / project name when provided */
  cause?: string;
};

export function scrollToDonateSection() {
  return smoothScrollToId(DONATION_SECTION_ID, 24, { minMs: 1100, maxMs: 2200 });
}

/**
 * Open donation details step with an amount, then glide to the CTA card.
 * `afterMs` lets overlays unlock / fade before scrolling starts.
 */
export function openDonationCheckout(
  amount: string,
  countryCode?: string,
  afterMs = 0,
  cause?: string,
) {
  if (!amount) return;

  const run = () => {
    window.dispatchEvent(
      new CustomEvent<DonateCheckoutDetail>(DONATE_CHECKOUT_EVENT, {
        detail: { amount, countryCode, cause },
      }),
    );
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        void scrollToDonateSection();
      });
    });
  };

  if (afterMs > 0) window.setTimeout(run, afterMs);
  else run();
}

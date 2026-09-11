import { ensureRupeePrefix } from "@/domains/home/lib/donation/amount";
import { DONATION_SECTION_ID } from "@/domains/home/constants/donation";
import { smoothScrollToId } from "@/shared/lib/smoothScroll";

export const DONATE_CHECKOUT_EVENT = "ihdua:donate-checkout";

export type DonateCheckoutDetail = { amount: string };

export function scrollToDonateSection() {
  return smoothScrollToId(DONATION_SECTION_ID, 24, { minMs: 1100, maxMs: 2200 });
}

/**
 * Open donation details step with an amount, then glide to the CTA card.
 * `afterMs` lets overlays unlock / fade before scrolling starts.
 */
export function openDonationCheckout(amount: string, afterMs = 0) {
  const withRupee = ensureRupeePrefix(amount);
  if (!withRupee) return;

  const run = () => {
    window.dispatchEvent(
      new CustomEvent<DonateCheckoutDetail>(DONATE_CHECKOUT_EVENT, {
        detail: { amount: withRupee },
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

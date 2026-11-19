"use client";

/**
 * Tracks whether the user has navigated client-side within the application.
 *
 * In-memory flag resets on every full document load (F5, hard reload, Kannada
 * googtrans navigations). Session storage survives Kannada hard navigations so
 * the donation popup does not reopen on every page change while language stays kn.
 * A true browser reload still allows the popup again (matches English F5).
 */
const IN_APP_NAV_KEY = "ihdua_in_app_nav";

let hasClientNavigated = false;

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    markClientNav();
  });
}

function persistInAppNav(): void {
  try {
    sessionStorage.setItem(IN_APP_NAV_KEY, "1");
  } catch {
    /* private mode / blocked storage */
  }
}

function hasPersistedInAppNav(): boolean {
  try {
    return sessionStorage.getItem(IN_APP_NAV_KEY) === "1";
  } catch {
    return false;
  }
}

export function markClientNav(): void {
  hasClientNavigated = true;
  persistInAppNav();
}

/** True for soft client navigations in the current document session. */
export function isClientNavigated(): boolean {
  return hasClientNavigated;
}

/**
 * Whether the donation (or similar) entry popup should be suppressed.
 * - Soft nav (same document): yes
 * - Kannada hard nav after an in-app click: yes
 * - Fresh entry / browser reload: no
 */
export function shouldSuppressEntryPopup(): boolean {
  if (hasClientNavigated) return true;

  if (typeof window === "undefined") return false;

  const nav = performance.getEntriesByType?.(
    "navigation",
  )?.[0] as PerformanceNavigationTiming | undefined;
  const isReload = nav?.type === "reload";
  if (isReload) return false;

  return hasPersistedInAppNav();
}

export function resetClientNav(): void {
  hasClientNavigated = false;
}

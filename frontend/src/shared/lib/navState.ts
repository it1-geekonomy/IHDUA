"use client";

/**
 * Tracks whether the user has navigated client-side within the application.
 *
 * This in-memory flag is FALSE on every initial document load, page refresh (F5),
 * or hard reload (Ctrl+F5). It becomes TRUE as soon as the user interacts with any
 * navigation element (footer, navbar, CTA buttons, browser back/forward).
 */
let hasClientNavigated = false;

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    hasClientNavigated = true;
  });
}

export function markClientNav(): void {
  hasClientNavigated = true;
}

export function isClientNavigated(): boolean {
  return hasClientNavigated;
}

export function resetClientNav(): void {
  hasClientNavigated = false;
}

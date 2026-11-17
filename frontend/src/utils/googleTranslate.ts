/**
 * Google Translate helpers for cookie sync + Kannada navigations.
 * Production-safe: same behavior on localhost and live domains.
 */

import {
  getCookieRootDomain,
  LANGUAGES,
  LANGUAGE_STORAGE_KEY,
  type LanguageCode,
} from "@/utils/languageHelper";

export const GT_STORAGE_KEY = LANGUAGE_STORAGE_KEY;

/**
 * Inline boot — restore googtrans from localStorage before paint.
 * Mirrors production cookie domain rules used by setGoogleTranslateCookie.
 */
export const GT_BOOT_SCRIPT = `(function(){
  try {
    if (location.pathname.indexOf("/admin") === 0) return;

    var ls = "";
    try { ls = localStorage.getItem("${GT_STORAGE_KEY}") || ""; } catch (e) {}

    var m = document.cookie.match(/(?:^|;\\s*)googtrans=([^;]+)/);
    var v = "";
    try { v = m ? decodeURIComponent(m[1]) : ""; } catch (e) { v = m ? m[1] : ""; }

    if (ls !== "kn") return;
    if (v.indexOf("/kn") !== -1) return;

    var host = location.hostname;
    var isLocal = host === "localhost" || host === "127.0.0.1" || /\\.localhost$/.test(host);
    var secure = location.protocol === "https:" ? "; Secure; SameSite=Lax" : "; SameSite=Lax";
    var base = "googtrans=/en/kn; path=/; max-age=31536000" + secure;
    document.cookie = base;

    if (!isLocal && host.indexOf(".") !== -1 && !/^\\d{1,3}(\\.\\d{1,3}){3}$/.test(host)) {
      var root = host.indexOf("www.") === 0 ? host.slice(4) : host;
      document.cookie = base + "; domain=" + root;
      document.cookie = base + "; domain=." + root;
    }

    var stuck = document.getElementById("gt-page-hold");
    if (stuck) stuck.remove();
    document.documentElement.removeAttribute("data-gt-pending");
  } catch (e) {}
})();`;

function getTranslateCombo(): HTMLSelectElement | null {
  return document.querySelector<HTMLSelectElement>("select.goog-te-combo");
}

/** Apply language via the widget select — never bounce through the other language. */
export function applyGoogleTranslateLanguage(lang: LanguageCode): boolean {
  const combo = getTranslateCombo();
  if (!combo) return false;

  const value = lang === LANGUAGES.ENGLISH ? "en" : lang;
  if (combo.value !== value) {
    combo.value = value;
    combo.dispatchEvent(new Event("change"));
  }
  return true;
}

export function whenTranslateReady(
  lang: LanguageCode,
  timeoutMs = 3000,
): Promise<boolean> {
  return new Promise((resolve) => {
    const started = Date.now();
    const tick = () => {
      if (applyGoogleTranslateLanguage(lang)) {
        resolve(true);
        return;
      }
      if (Date.now() - started >= timeoutMs) {
        resolve(false);
        return;
      }
      window.setTimeout(tick, 50);
    };
    tick();
  });
}

function prefersKannada(): boolean {
  try {
    const parts = document.cookie.split(";");
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed.startsWith("googtrans=")) continue;
      let value = trimmed.slice("googtrans=".length);
      try {
        value = decodeURIComponent(value);
      } catch {
        // keep raw
      }
      if (value.includes("/kn")) return true;
    }
    return localStorage.getItem(GT_STORAGE_KEY) === LANGUAGES.KANNADA;
  } catch {
    return false;
  }
}

/**
 * Kannada + Google Translate do not reliably rewrite App Router soft navigations.
 * Use a full document navigation so the googtrans cookie is honored from load.
 * Works the same on localhost and the live domain (same-origin assign).
 */
export function bindKannadaHardNav(): () => void {
  const onClickCapture = (event: MouseEvent) => {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = event.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest("a[href]");
    if (!(anchor instanceof HTMLAnchorElement)) return;

    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
    if (href.startsWith("mailto:") || href.startsWith("tel:")) return;

    let url: URL;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return;
    }
    if (url.origin !== window.location.origin) return;
    if (url.pathname.startsWith("/admin")) return;
    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search &&
      url.hash === window.location.hash
    ) {
      return;
    }

    if (!prefersKannada()) return;

    // Re-assert cookie before navigation (covers www ↔ apex and lost host-only cookies).
    try {
      const root = getCookieRootDomain(window.location.hostname);
      const secure =
        window.location.protocol === "https:" ? "; Secure; SameSite=Lax" : "; SameSite=Lax";
      const base = `googtrans=/en/kn; path=/; max-age=31536000${secure}`;
      document.cookie = base;
      if (root) {
        document.cookie = `${base}; domain=${root}`;
        document.cookie = `${base}; domain=.${root}`;
      }
      localStorage.setItem(GT_STORAGE_KEY, LANGUAGES.KANNADA);
    } catch {
      // continue with navigation anyway
    }

    event.preventDefault();
    window.location.assign(url.pathname + url.search + url.hash);
  };

  document.addEventListener("click", onClickCapture, true);
  return () => document.removeEventListener("click", onClickCapture, true);
}

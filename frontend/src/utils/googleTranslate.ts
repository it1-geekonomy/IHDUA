/**
 * Kannada boot — cookies + Google Translate + hard nav.
 * No paint-hold / blank overlay (that caused permanent white screens).
 */

import {
  getCookieRootDomain,
  LANGUAGES,
  LANGUAGE_STORAGE_KEY,
  type LanguageCode,
} from "@/utils/languageHelper";
import { markClientNav } from "@/shared/lib/navState";

export const GT_STORAGE_KEY = LANGUAGE_STORAGE_KEY;
export const GT_PENDING_ATTR = "data-gt-pending";
export const GT_HOLD_ID = "gt-page-hold";
export const GT_PAINT_HOLD_COOKIE = "gt_paint_hold";

declare global {
  interface Window {
    __gtUnlock?: () => void;
    __gtLock?: () => void;
    __gtIsLocked?: () => boolean;
  }
}

/**
 * Runs in <head>. Pref + GT start + hard-nav. Never hides the page.
 */
export const GT_BOOT_SCRIPT = `(function(){
  try {
    if (location.pathname.indexOf("/admin") === 0) return;

    var KEY = "${GT_STORAGE_KEY}";
    var ATTR = "${GT_PENDING_ATTR}";
    var PAINT = "${GT_PAINT_HOLD_COOKIE}";
    var HOLD = "${GT_HOLD_ID}";

    // Kill any leftover paint-hold from older builds (blank white screen).
    document.documentElement.removeAttribute(ATTR);
    var staleStyle = document.getElementById("gt-lock-style");
    if (staleStyle && staleStyle.parentNode) staleStyle.parentNode.removeChild(staleStyle);
    var staleHold = document.getElementById(HOLD);
    if (staleHold && staleHold.parentNode) staleHold.parentNode.removeChild(staleHold);

    // Strip old language cache-bust junk from the address bar.
    try {
      var bootUrl = new URL(location.href);
      if (bootUrl.searchParams.has("_lang") || bootUrl.searchParams.has("_t")) {
        bootUrl.searchParams.delete("_lang");
        bootUrl.searchParams.delete("_t");
        history.replaceState(null, "", bootUrl.pathname + bootUrl.search + bootUrl.hash);
      }
    } catch (e) {}

    function readWantKn() {
      var ls = "";
      try { ls = localStorage.getItem(KEY) || ""; } catch (e) {}
      var pref = "";
      var goog = "";
      try {
        var parts = document.cookie.split(";");
        for (var i = 0; i < parts.length; i++) {
          var t = parts[i].trim();
          if (t.indexOf(KEY + "=") === 0) {
            try { pref = decodeURIComponent(t.slice(KEY.length + 1)); } catch (e) { pref = t.slice(KEY.length + 1); }
          }
          if (t.indexOf("googtrans=") === 0) {
            try { goog = decodeURIComponent(t.slice(10)); } catch (e) { goog = t.slice(10); }
          }
        }
      } catch (e) {}
      return ls === "kn" || pref === "kn" || goog.indexOf("/kn") !== -1;
    }

    var host = location.hostname;
    var isLocal = host === "localhost" || host === "127.0.0.1" || /\\.localhost$/.test(host);
    var secure = location.protocol === "https:" ? "; Secure; SameSite=Lax" : "; SameSite=Lax";
    function writeKnCookies() {
      var gt = "googtrans=/en/kn; path=/; max-age=31536000" + secure;
      var prefC = KEY + "=kn; path=/; max-age=31536000" + secure;
      document.cookie = gt;
      document.cookie = prefC;
      try {
        document.cookie = PAINT + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/" + secure;
      } catch (e) {}
      if (!isLocal && host.indexOf(".") !== -1 && !/^\\d{1,3}(\\.\\d{1,3}){3}$/.test(host)) {
        var root = host.indexOf("www.") === 0 ? host.slice(4) : host;
        document.cookie = gt + "; domain=" + root;
        document.cookie = gt + "; domain=." + root;
        document.cookie = prefC + "; domain=" + root;
        document.cookie = prefC + "; domain=." + root;
      }
      try { localStorage.setItem(KEY, "kn"); } catch (e) {}
    }

    // Language toggle — always installed (EN and KN pages).
    var langSwitching = false;
    function switchLang(next) {
      if (langSwitching) return;
      langSwitching = true;
      try {
        if (next === "en") {
          document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/" + secure;
          document.cookie = KEY + "=en; path=/; max-age=31536000" + secure;
          try { localStorage.setItem(KEY, "en"); } catch (e) {}
          document.documentElement.classList.remove("translated-ltr", "translated-rtl");
          document.documentElement.setAttribute("lang", "en");
        } else {
          writeKnCookies();
          document.documentElement.setAttribute("lang", "kn");
        }
      } catch (e) {}
      try {
        var cleanUrl = new URL(location.href);
        cleanUrl.searchParams.delete("_lang");
        cleanUrl.searchParams.delete("_t");
        var clean = cleanUrl.pathname + cleanUrl.search + cleanUrl.hash;
        if (clean !== location.pathname + location.search + location.hash) {
          history.replaceState(null, "", clean);
        }
      } catch (e) {}
      location.reload();
    }
    window.__ihduaPickLang = switchLang;

    document.addEventListener("click", function(ev) {
      if (ev.button !== 0) return;
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      var t = ev.target;
      if (!t || !t.closest) return;
      var toggleRoot = t.closest("[data-lang-toggle]");
      if (!toggleRoot) return;
      var nextLang = null;
      var mobile = t.closest("[data-mobile-switch]");
      if (mobile) {
        nextLang = readWantKn() ? "en" : "kn";
      } else {
        var langBtn = t.closest("button[data-lang]");
        var langAttr = langBtn && langBtn.getAttribute("data-lang");
        if (langAttr === "en" || langAttr === "kn") nextLang = langAttr;
      }
      if (!nextLang) return;
      ev.preventDefault();
      ev.stopPropagation();
      switchLang(nextLang);
    }, true);

    // English preferred: strip leftover KN cookies so boot never re-applies Kannada.
    if (!readWantKn()) {
      try {
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/" + secure;
        document.documentElement.classList.remove("translated-ltr", "translated-rtl");
      } catch (e) {}
      return;
    }

    function writeCookies() { writeKnCookies(); }
    writeCookies();

    window.__gtLock = function(){};
    window.__gtUnlock = function(){
      document.documentElement.removeAttribute(ATTR);
      var h = document.getElementById(HOLD);
      if (h && h.parentNode) h.parentNode.removeChild(h);
    };
    window.__gtIsLocked = function(){ return false; };

    function ensureGtMount() {
      if (!document.getElementById("google_translate_element")) {
        var box = document.createElement("div");
        box.id = "google_translate_element";
        box.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
        (document.body || document.documentElement).appendChild(box);
      }
    }
    var knApplied = false;
    function applyKnOnce() {
      if (knApplied) return true;
      var combo = document.querySelector("select.goog-te-combo");
      if (!combo) return false;
      if (combo.value !== "kn") {
        combo.value = "kn";
        combo.dispatchEvent(new Event("change"));
      }
      knApplied = true;
      return true;
    }
    var gtStarted = false;
    function startGt() {
      if (gtStarted) return;
      gtStarted = true;
      ensureGtMount();
      window.googleTranslateElementInit = function() {
        try {
          ensureGtMount();
          new window.google.translate.TranslateElement(
            { pageLanguage: "en", includedLanguages: "en,kn", autoDisplay: false },
            "google_translate_element"
          );
        } catch (e) {}
        var tries = 0;
        (function waitCombo() {
          if (applyKnOnce()) return;
          if (++tries < 60) setTimeout(waitCombo, 100);
        })();
      };
      if (!document.querySelector('script[src*="translate.google.com"]')) {
        var gs = document.createElement("script");
        gs.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        gs.async = true;
        (document.head || document.documentElement).appendChild(gs);
      } else if (window.google && window.google.translate) {
        window.googleTranslateElementInit();
      }
    }
    startGt();
    document.addEventListener("DOMContentLoaded", function(){ ensureGtMount(); startGt(); });

    function hardNav(url) {
      writeCookies();
      location.assign(url);
    }

    function isInternalNav(href) {
      if (!href || href.charAt(0) === "#") return null;
      if (href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0) return null;
      try {
        var url = new URL(href, location.href);
        if (url.origin !== location.origin) return null;
        if (url.pathname.indexOf("/admin") === 0) return null;
        if (url.pathname === location.pathname && url.search === location.search && url.hash === location.hash) return null;
        return url.pathname + url.search + url.hash;
      } catch (e) {
        return null;
      }
    }

    document.addEventListener("click", function(ev) {
      if (ev.defaultPrevented) return;
      if (ev.button !== 0) return;
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      if (!readWantKn()) return;
      var t = ev.target;
      if (!t || !t.closest) return;
      // Don't steal language-toggle clicks (handled above).
      if (t.closest("[data-lang-toggle]")) return;
      var a = t.closest("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      var next = isInternalNav(a.getAttribute("href"));
      if (!next) return;
      ev.preventDefault();
      ev.stopImmediatePropagation();
      hardNav(next);
    }, true);

    var _push = history.pushState.bind(history);
    var _replace = history.replaceState.bind(history);
    history.pushState = function(state, title, url) {
      if (!readWantKn() || url == null || url === "") return _push(state, title, url);
      var next = isInternalNav(String(url));
      if (next) { hardNav(next); return; }
      return _push(state, title, url);
    };
    history.replaceState = function(state, title, url) {
      if (!readWantKn() || url == null || url === "") return _replace(state, title, url);
      try {
        var u = new URL(String(url), location.href);
        if (u.origin === location.origin && u.pathname.indexOf("/admin") !== 0 && u.pathname !== location.pathname) {
          hardNav(u.pathname + u.search + u.hash);
          return;
        }
      } catch (e) {}
      return _replace(state, title, url);
    };
  } catch (e) {}
})();`;

/** Kept for layout import compatibility — no paint hold. */
export const GT_PENDING_STYLE = `#${GT_HOLD_ID}{display:none!important}`;

export function prefersKannada(): boolean {
  try {
    const parts = document.cookie.split(";");
    let pref = "";
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.startsWith("googtrans=")) {
        let value = trimmed.slice("googtrans=".length);
        try {
          value = decodeURIComponent(value);
        } catch {
          // keep raw
        }
        if (value.includes("/kn")) return true;
      }
      if (trimmed.startsWith(`${GT_STORAGE_KEY}=`)) {
        pref = decodeURIComponent(trimmed.slice(GT_STORAGE_KEY.length + 1));
      }
    }
    if (pref === LANGUAGES.KANNADA) return true;
    return localStorage.getItem(GT_STORAGE_KEY) === LANGUAGES.KANNADA;
  } catch {
    return false;
  }
}

export function isGoogleTranslatePending(): boolean {
  return false;
}

export function markGoogleTranslatePending(): void {
  if (typeof document === "undefined") return;
  document.documentElement.removeAttribute(GT_PENDING_ATTR);
  const hold = document.getElementById(GT_HOLD_ID);
  if (hold?.parentNode) hold.parentNode.removeChild(hold);
}

export function revealTranslatedPage(): void {
  if (typeof document === "undefined") return;
  document.documentElement.removeAttribute(GT_PENDING_ATTR);
  const hold = document.getElementById(GT_HOLD_ID);
  if (hold?.parentNode) hold.parentNode.removeChild(hold);
  window.__gtUnlock?.();
}

export function armTranslateRevealFailsafe(_ms = 6000): void {
  // no-op — paint hold removed
}

export function isPageTranslatedToKannada(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const kn = (document.body?.textContent || "").match(/[\u0C80-\u0CFF]/g)?.length ?? 0;
    const translated =
      document.documentElement.classList.contains("translated-ltr") ||
      document.documentElement.classList.contains("translated-rtl");
    return translated && kn >= 40;
  } catch {
    return false;
  }
}

export function watchTranslatedThenReveal(_timeoutMs = 6000): () => void {
  return () => {};
}

function getTranslateCombo(): HTMLSelectElement | null {
  return document.querySelector<HTMLSelectElement>("select.goog-te-combo");
}

export function applyGoogleTranslateLanguage(lang: LanguageCode): boolean {
  const combo = getTranslateCombo();
  if (!combo) return false;

  const value = lang === LANGUAGES.ENGLISH ? "en" : lang;
  // Only change when needed — bouncing en↔kn causes visible language flicker.
  if (combo.value !== value) {
    combo.value = value;
    combo.dispatchEvent(new Event("change"));
  }
  return true;
}

export function whenTranslateReady(
  lang: LanguageCode,
  timeoutMs = 5000,
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
      window.setTimeout(tick, 40);
    };
    tick();
  });
}

export async function settleKannadaAfterNavigation(): Promise<void> {
  if (!prefersKannada()) return;
  await whenTranslateReady(LANGUAGES.KANNADA, 5000);
}

/**
 * React-side binder (backup). Boot script already patches clicks/history first.
 */
export function bindKannadaHardNav(): () => void {
  const onClickCapture = (event: MouseEvent) => {
    if (!prefersKannada()) return;
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

    markClientNav();
    try {
      const root = getCookieRootDomain(window.location.hostname);
      const secure =
        window.location.protocol === "https:" ? "; Secure; SameSite=Lax" : "; SameSite=Lax";
      document.cookie = `googtrans=/en/kn; path=/; max-age=31536000${secure}`;
      document.cookie = `${GT_STORAGE_KEY}=kn; path=/; max-age=31536000${secure}`;
      if (root) {
        document.cookie = `googtrans=/en/kn; path=/; max-age=31536000${secure}; domain=${root}`;
        document.cookie = `${GT_STORAGE_KEY}=kn; path=/; max-age=31536000${secure}; domain=${root}`;
      }
      localStorage.setItem(GT_STORAGE_KEY, LANGUAGES.KANNADA);
    } catch {
      // ignore
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(url.pathname + url.search + url.hash);
  };

  document.addEventListener("click", onClickCapture, true);
  return () => document.removeEventListener("click", onClickCapture, true);
}

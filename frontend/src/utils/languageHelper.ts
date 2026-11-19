/**
 * Language helper for Google Translate integration.
 * Cookie + localStorage persistence — works on localhost and live domains.
 */

export const LANGUAGES = {
  ENGLISH: "en",
  KANNADA: "kn",
} as const;

export type LanguageCode = (typeof LANGUAGES)[keyof typeof LANGUAGES];

export const LANGUAGE_STORAGE_KEY = "dygus_language";

function isLocalHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".localhost")
  );
}

/** Apex / root host so www and non-www share the same googtrans cookie. */
export function getCookieRootDomain(hostname: string): string | null {
  if (isLocalHost(hostname)) return null;
  // IPs / single-label hosts can't use Domain=
  if (!hostname.includes(".") || /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
    return null;
  }
  return hostname.startsWith("www.") ? hostname.slice(4) : hostname;
}

function cookieSecuritySuffix(): string {
  if (typeof window === "undefined") return "";
  // Live HTTPS needs Secure; SameSite=Lax keeps normal navigations working.
  return window.location.protocol === "https:" ? "; Secure; SameSite=Lax" : "; SameSite=Lax";
}

function writeGoogtransCookie(value: string, maxAgeSeconds: number): void {
  const hostname = window.location.hostname;
  const secure = cookieSecuritySuffix();
  const base = `path=/; max-age=${maxAgeSeconds}${secure}`;

  // Host-only (always)
  document.cookie = `googtrans=${value}; ${base}`;

  const root = getCookieRootDomain(hostname);
  if (!root) return;

  // Apex + leading-dot so both ihdua.org and www.ihdua.org see the preference.
  document.cookie = `googtrans=${value}; ${base}; domain=${root}`;
  document.cookie = `googtrans=${value}; ${base}; domain=.${root}`;
}

function clearGoogtransCookies(): void {
  const hostname = window.location.hostname;
  const secure = cookieSecuritySuffix();
  const expired = `expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${secure}`;

  document.cookie = `googtrans=; ${expired}`;
  document.cookie = `googtrans=; ${expired}; domain=${hostname}`;

  const root = getCookieRootDomain(hostname);
  if (root) {
    document.cookie = `googtrans=; ${expired}; domain=${root}`;
    document.cookie = `googtrans=; ${expired}; domain=.${root}`;
    document.cookie = `googtrans=; ${expired}; domain=www.${root}`;
    document.cookie = `googtrans=; ${expired}; domain=.www.${root}`;
  }
}

function writeLanguagePrefCookie(targetLang: LanguageCode): void {
  const hostname = window.location.hostname;
  const secure = cookieSecuritySuffix();
  const maxAge = 365 * 24 * 60 * 60;
  const base = `path=/; max-age=${maxAge}${secure}`;

  // Readable by Next.js SSR/middleware so refresh can hold paint before hydration.
  document.cookie = `${LANGUAGE_STORAGE_KEY}=${targetLang}; ${base}`;

  const root = getCookieRootDomain(hostname);
  if (!root) return;
  document.cookie = `${LANGUAGE_STORAGE_KEY}=${targetLang}; ${base}; domain=${root}`;
  document.cookie = `${LANGUAGE_STORAGE_KEY}=${targetLang}; ${base}; domain=.${root}`;
}

function clearLanguagePrefCookie(): void {
  const hostname = window.location.hostname;
  const secure = cookieSecuritySuffix();
  const expired = `expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${secure}`;

  document.cookie = `${LANGUAGE_STORAGE_KEY}=; ${expired}`;
  document.cookie = `${LANGUAGE_STORAGE_KEY}=; ${expired}; domain=${hostname}`;

  const root = getCookieRootDomain(hostname);
  if (root) {
    document.cookie = `${LANGUAGE_STORAGE_KEY}=; ${expired}; domain=${root}`;
    document.cookie = `${LANGUAGE_STORAGE_KEY}=; ${expired}; domain=.${root}`;
  }
}

export const setGoogleTranslateCookie = (targetLang: LanguageCode): void => {
  try {
    if (targetLang === LANGUAGES.ENGLISH) {
      // Fully clear GT cookies — do not leave /en/kn around.
      clearGoogtransCookies();
      writeLanguagePrefCookie(LANGUAGES.ENGLISH);
    } else {
      // Google Translate expects /source/target
      writeGoogtransCookie(`/en/${targetLang}`, 365 * 24 * 60 * 60);
      writeLanguagePrefCookie(targetLang);
    }

    localStorage.setItem(LANGUAGE_STORAGE_KEY, targetLang);

    // Drop leftover GT hash so reload doesn't re-apply Kannada.
    if (typeof window !== "undefined" && window.location.hash.includes("googtrans")) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  } catch {
    // cookies/localStorage may be unavailable (SSR, privacy mode, etc.)
  }
};

function readGoogtransValue(): string {
  try {
    const parts = document.cookie.split(";");
    // Prefer any cookie that already selects Kannada if duplicates exist.
    let fallback = "";
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed.startsWith("googtrans=")) continue;
      const raw = trimmed.slice("googtrans=".length);
      let value = raw;
      try {
        value = decodeURIComponent(raw);
      } catch {
        // keep raw
      }
      if (value.includes("/kn")) return value;
      if (!fallback) fallback = value;
    }
    return fallback;
  } catch {
    return "";
  }
}

function readLanguagePrefCookie(): string {
  try {
    const parts = document.cookie.split(";");
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed.startsWith(`${LANGUAGE_STORAGE_KEY}=`)) continue;
      return decodeURIComponent(trimmed.slice(LANGUAGE_STORAGE_KEY.length + 1));
    }
  } catch {
    // ignore
  }
  return "";
}

/** Cookie / localStorage preference only (no DOM). */
export const getStoredLanguage = (): LanguageCode => {
  try {
    const googtrans = readGoogtransValue();
    if (googtrans.includes("/kn")) return LANGUAGES.KANNADA;

    const prefCookie = readLanguagePrefCookie();
    if (prefCookie === LANGUAGES.KANNADA) return LANGUAGES.KANNADA;

    const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode | null;
    if (savedLang === LANGUAGES.KANNADA) return LANGUAGES.KANNADA;
    if (savedLang === LANGUAGES.ENGLISH) return LANGUAGES.ENGLISH;

    if (prefCookie === LANGUAGES.ENGLISH) return LANGUAGES.ENGLISH;

    return LANGUAGES.ENGLISH;
  } catch {
    return LANGUAGES.ENGLISH;
  }
};

/** True when Google Translate has actually flipped the page to Kannada. */
export const isPageShowingKannada = (): boolean => {
  if (typeof document === "undefined") return false;
  try {
    const html = document.documentElement;
    if (
      html.classList.contains("translated-ltr") ||
      html.classList.contains("translated-rtl") ||
      html.getAttribute("lang") === "kn"
    ) {
      return true;
    }
    const combo = document.querySelector(
      "select.goog-te-combo",
    ) as HTMLSelectElement | null;
    if (combo?.value === "kn") return true;
    const knChars =
      document.body?.textContent?.match(/[\u0C80-\u0CFF]/g)?.length ?? 0;
    return knChars > 40;
  } catch {
    return false;
  }
};

/**
 * Active UI language: prefer live DOM (GT) over stale cookies.
 * Fixes EN highlight while the page is clearly Kannada.
 */
export const getCurrentLanguage = (): LanguageCode => {
  try {
    if (isPageShowingKannada()) return LANGUAGES.KANNADA;
    return getStoredLanguage();
  } catch {
    return LANGUAGES.ENGLISH;
  }
};

export const reloadWithLanguage = (targetLang: LanguageCode): void => {
  setGoogleTranslateCookie(targetLang);
  try {
    document.documentElement.classList.remove("translated-ltr", "translated-rtl");
    if (targetLang === LANGUAGES.ENGLISH) {
      document.documentElement.setAttribute("lang", "en");
    } else {
      document.documentElement.setAttribute("lang", "kn");
    }
    window.dispatchEvent(new Event("ihdua:language"));
  } catch {
    // ignore
  }
  // Drop any leftover lang cache-bust junk, then hard reload.
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete("_lang");
    url.searchParams.delete("_t");
    const clean = url.pathname + url.search + url.hash;
    if (clean !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.replaceState(null, "", clean);
    }
  } catch {
    // ignore
  }
  window.location.reload();
};

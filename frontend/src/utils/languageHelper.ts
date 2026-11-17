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

export const setGoogleTranslateCookie = (targetLang: LanguageCode): void => {
  try {
    if (targetLang === LANGUAGES.ENGLISH) {
      clearGoogtransCookies();
    } else {
      // Google Translate expects /source/target
      writeGoogtransCookie(`/en/${targetLang}`, 365 * 24 * 60 * 60);
    }

    localStorage.setItem(LANGUAGE_STORAGE_KEY, targetLang);
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

export const getCurrentLanguage = (): LanguageCode => {
  try {
    const googtrans = readGoogtransValue();
    if (googtrans.includes("/kn")) return LANGUAGES.KANNADA;

    const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode | null;
    if (savedLang && Object.values(LANGUAGES).includes(savedLang)) {
      return savedLang;
    }

    return LANGUAGES.ENGLISH;
  } catch {
    return LANGUAGES.ENGLISH;
  }
};

export const reloadWithLanguage = (targetLang: LanguageCode): void => {
  setGoogleTranslateCookie(targetLang);
  // Let the cookie flush before reload (important on some mobile browsers / CDNs).
  window.setTimeout(() => {
    window.location.reload();
  }, 200);
};

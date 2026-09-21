/**
 * Language helper for Google Translate integration.
 * Handles cookie + localStorage persistence.
 */

export const LANGUAGES = {
  ENGLISH: "en",
  KANNADA: "kn",
} as const;

export type LanguageCode = (typeof LANGUAGES)[keyof typeof LANGUAGES];

export const setGoogleTranslateCookie = (targetLang: LanguageCode): void => {
  try {
    const domain = window.location.hostname;
    const isProduction = !domain.includes("localhost") && !domain.includes("127.0.0.1");

    if (targetLang === LANGUAGES.ENGLISH) {
      const expiredDate = "Thu, 01 Jan 1970 00:00:00 UTC";
      document.cookie = `googtrans=; expires=${expiredDate}; path=/;`;
      document.cookie = `googtrans=; expires=${expiredDate}; path=/; domain=${domain};`;

      if (isProduction) {
        document.cookie = `googtrans=; expires=${expiredDate}; path=/; domain=.${domain};`;
        if (domain.startsWith("www.")) {
          const rootDomain = domain.substring(4);
          document.cookie = `googtrans=; expires=${expiredDate}; path=/; domain=${rootDomain};`;
          document.cookie = `googtrans=; expires=${expiredDate}; path=/; domain=.${rootDomain};`;
        }
      }
    } else {
      const cookieValue = `/en/${targetLang}`;
      const expires = new Date();
      expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);

      document.cookie = `googtrans=${cookieValue}; expires=${expires.toUTCString()}; path=/;`;

      if (isProduction) {
        document.cookie = `googtrans=${cookieValue}; expires=${expires.toUTCString()}; path=/; domain=${domain};`;
        document.cookie = `googtrans=${cookieValue}; expires=${expires.toUTCString()}; path=/; domain=.${domain};`;
        if (domain.startsWith("www.")) {
          const rootDomain = domain.substring(4);
          document.cookie = `googtrans=${cookieValue}; expires=${expires.toUTCString()}; path=/; domain=${rootDomain};`;
          document.cookie = `googtrans=${cookieValue}; expires=${expires.toUTCString()}; path=/; domain=.${rootDomain};`;
        }
      }
    }

    localStorage.setItem("dygus_language", targetLang);
  } catch {
    // no-op: cookies/localStorage may be unavailable (SSR, privacy mode, etc.)
  }
};

export const getCurrentLanguage = (): LanguageCode => {
  try {
    const cookies = document.cookie.split(";");
    const googtransCookie = cookies.find((c) => c.trim().startsWith("googtrans="));

    if (googtransCookie) {
      const value = googtransCookie.split("=")[1]?.trim();
      if (value && value.includes("/kn")) {
        return LANGUAGES.KANNADA;
      }
    }

    const savedLang = localStorage.getItem("dygus_language") as LanguageCode;
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
  setTimeout(() => {
    window.location.reload();
  }, 200);
};
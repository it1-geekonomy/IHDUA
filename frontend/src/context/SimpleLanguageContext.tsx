"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import {
  getCurrentLanguage,
  getStoredLanguage,
  reloadWithLanguage,
  LANGUAGES,
  LanguageCode,
} from "@/utils/languageHelper";
import {
  applyGoogleTranslateLanguage,
  bindKannadaHardNav,
  revealTranslatedPage,
  whenTranslateReady,
} from "@/utils/googleTranslate";

type LanguageContextType = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isChanging: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

function ensureGtMount(): HTMLElement {
  let el = document.getElementById("google_translate_element");
  if (!el) {
    el = document.createElement("div");
    el.id = "google_translate_element";
    el.className = "skiptranslate";
    el.setAttribute("translate", "no");
    el.style.cssText =
      "position:absolute;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0";
    (document.body || document.documentElement).appendChild(el);
  }
  return el;
}

function initTranslateElement(): void {
  try {
    ensureGtMount();
    if (!window.google?.translate?.TranslateElement) return;
    // Avoid double-init into a broken widget.
    const host = document.getElementById("google_translate_element");
    if (host && host.querySelector(".goog-te-combo, select.goog-te-combo")) return;
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: "en,kn",
        autoDisplay: false,
      },
      "google_translate_element",
    );
  } catch {
    // ignore
  }
}

/** Load GT script and apply Kannada once the combo exists. */
function ensureKannadaTranslate(): void {
  const finish = () => {
    initTranslateElement();
    void whenTranslateReady(LANGUAGES.KANNADA, 8000).then((ok) => {
      if (!ok) {
        // Last resort: poke combo directly a few more times.
        let tries = 0;
        const id = window.setInterval(() => {
          if (applyGoogleTranslateLanguage(LANGUAGES.KANNADA) || ++tries > 40) {
            window.clearInterval(id);
          }
        }, 150);
      }
      revealTranslatedPage();
    });
  };

  if (window.google?.translate?.TranslateElement) {
    finish();
    return;
  }

  window.googleTranslateElementInit = () => {
    finish();
  };

  const existing = document.querySelector(
    'script[src*="translate.google.com"]',
  ) as HTMLScriptElement | null;

  if (existing) {
    // Script tag present but library may still be loading — wait, don't bail.
    let n = 0;
    const wait = window.setInterval(() => {
      if (window.google?.translate?.TranslateElement) {
        window.clearInterval(wait);
        finish();
      } else if (++n > 80) {
        window.clearInterval(wait);
        // Re-append a fresh script once.
        existing.remove();
        const s = document.createElement("script");
        s.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        s.async = true;
        document.head.appendChild(s);
      }
    }, 100);
    return;
  }

  const script = document.createElement("script");
  script.src =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.head.appendChild(script);
}

export function SimpleLanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [language, setLanguageState] = useState<LanguageCode>(LANGUAGES.ENGLISH);
  const [isChanging, setIsChanging] = useState(false);
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useLayoutEffect(() => {
    setIsChanging(false);
    if (isAdmin) return;
    setLanguageState(getCurrentLanguage());
  }, [isAdmin, pathname]);

  useEffect(() => {
    revealTranslatedPage();
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    return bindKannadaHardNav();
  }, [isAdmin]);

  useEffect(() => {
    if (typeof window === "undefined" || isAdmin) return;

    const sync = () => setLanguageState(getCurrentLanguage());
    sync();

    // Preference is KN → always drive the widget (boot may have started it too).
    if (getStoredLanguage() === LANGUAGES.KANNADA) {
      ensureKannadaTranslate();
    }

    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "lang"],
    });

    window.addEventListener("ihdua:language", sync);
    return () => {
      obs.disconnect();
      window.removeEventListener("ihdua:language", sync);
    };
  }, [isAdmin]);

  const setLanguage = useCallback((newLang: LanguageCode) => {
    setIsChanging(true);
    setLanguageState(newLang);
    if (newLang === LANGUAGES.KANNADA) {
      ensureKannadaTranslate();
    }
    reloadWithLanguage(newLang);
    window.setTimeout(() => setIsChanging(false), 2500);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isChanging }}>
      {children}
      {/* Mount owned by boot/ensureGtMount — no duplicate React node with same id. */}
    </LanguageContext.Provider>
  );
}

export function useSimpleLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: LANGUAGES.ENGLISH as LanguageCode,
      setLanguage: () => {},
      isChanging: false,
    };
  }
  return context;
}

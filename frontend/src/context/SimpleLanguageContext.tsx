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
  reloadWithLanguage,
  LANGUAGES,
  LanguageCode,
} from "@/utils/languageHelper";
import {
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

function injectTranslateScript(onReady?: (lang: LanguageCode) => void): void {
  const runReady = () => {
    const lang = getCurrentLanguage();
    onReady?.(lang);
    if (lang === LANGUAGES.KANNADA) {
      void whenTranslateReady(LANGUAGES.KANNADA, 4000);
    } else {
      revealTranslatedPage();
    }
  };

  if (document.querySelector('script[src*="translate.google.com"]')) {
    runReady();
    return;
  }

  if (!window.googleTranslateElementInit) {
    window.googleTranslateElementInit = () => {
      try {
        if (!document.getElementById("google_translate_element")) return;
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,kn",
            autoDisplay: false,
          },
          "google_translate_element",
        );
      } catch {
        return;
      }
      runReady();
    };
  }

  const script = document.createElement("script");
  script.src =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.head.appendChild(script);
}

export function SimpleLanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Always start as EN for SSR/hydration match; sync real pref before paint below.
  const [language, setLanguageState] = useState<LanguageCode>(LANGUAGES.ENGLISH);
  const [isChanging, setIsChanging] = useState(false);
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  // Sync + clear stuck "isChanging" after every navigation/reload.
  useLayoutEffect(() => {
    setIsChanging(false);
    if (isAdmin) return;
    setLanguageState(getCurrentLanguage());
  }, [isAdmin, pathname]);

  useEffect(() => {
    if (isAdmin) {
      revealTranslatedPage();
      return;
    }
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

    if (getCurrentLanguage() === LANGUAGES.KANNADA) {
      injectTranslateScript(sync);
    }

    // Keep highlight in sync if GT flips html.translated-ltr.
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

  // Stable document capture listener — GT can strip React onClick on the
  // footer buttons after translating; this still catches the click.
  useEffect(() => {
    if (typeof window === "undefined" || isAdmin) return;

    let locked = false;

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest("[data-lang-toggle]")) return;

      const mobileSwitch = target.closest("[data-mobile-switch]");
      let next: LanguageCode | null = null;

      if (mobileSwitch) {
        next =
          getCurrentLanguage() === LANGUAGES.KANNADA
            ? LANGUAGES.ENGLISH
            : LANGUAGES.KANNADA;
      } else {
        const btn = target.closest("button[data-lang]");
        const lang = btn?.getAttribute("data-lang");
        if (lang === LANGUAGES.ENGLISH || lang === LANGUAGES.KANNADA) {
          next = lang;
        }
      }
      if (!next || locked) return;

      event.preventDefault();
      event.stopPropagation();

      locked = true;
      setIsChanging(true);
      setLanguageState(next);
      if (next === LANGUAGES.KANNADA) {
        injectTranslateScript();
      }
      try {
        reloadWithLanguage(next);
      } catch {
        locked = false;
        setIsChanging(false);
      }
      window.setTimeout(() => {
        locked = false;
        setIsChanging(false);
      }, 3000);
    };

    // Replace any stale HMR listeners.
    const prev = (window as unknown as { __ihduaLangClick?: EventListener })
      .__ihduaLangClick;
    if (prev) document.removeEventListener("click", prev, true);
    (window as unknown as { __ihduaLangClick?: EventListener }).__ihduaLangClick =
      onClick as EventListener;

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      const cur = (window as unknown as { __ihduaLangClick?: EventListener })
        .__ihduaLangClick;
      if (cur === onClick) {
        delete (window as unknown as { __ihduaLangClick?: EventListener })
          .__ihduaLangClick;
      }
    };
  }, [isAdmin]);

  const setLanguage = useCallback((newLang: LanguageCode) => {
    // Always cookie + hard reload. Never no-op on "already selected" —
    // highlight can be wrong while the page is still the other language.
    setIsChanging(true);
    setLanguageState(newLang);
    if (newLang === LANGUAGES.KANNADA) {
      injectTranslateScript();
    }
    reloadWithLanguage(newLang);
    // Safety: if reload is blocked, re-enable after a beat.
    window.setTimeout(() => setIsChanging(false), 2500);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isChanging }}>
      {children}
      {!isAdmin && (
        <div
          id="google_translate_element"
          className="skiptranslate"
          style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        />
      )}
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

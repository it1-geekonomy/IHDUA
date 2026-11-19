"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
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

function readClientLanguage(): LanguageCode {
  if (typeof window === "undefined") return LANGUAGES.ENGLISH;
  return getCurrentLanguage();
}

function injectTranslateScript(onReady?: (lang: LanguageCode) => void): void {
  const runReady = () => {
    const lang = getCurrentLanguage();
    onReady?.(lang);
    if (lang === LANGUAGES.KANNADA) {
      // One apply only — repeating pulses caused EN↔KN flicker every second.
      void whenTranslateReady(LANGUAGES.KANNADA, 4000);
    } else {
      revealTranslatedPage();
    }
  };

  // Boot script already loads GT for Kannada — only nudge apply here.
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
  const [language, setLanguageState] = useState<LanguageCode>(readClientLanguage);
  const [isChanging, setIsChanging] = useState(false);
  const isAdmin = pathname?.startsWith("/admin") ?? false;

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

    const lang = getCurrentLanguage();
    setLanguageState(lang);

    // English: do not preload Google Translate (PSI unused-JS). Load only for Kannada.
    if (lang === LANGUAGES.KANNADA) {
      injectTranslateScript((readyLang) => setLanguageState(readyLang));
    }
  }, [isAdmin]);

  const setLanguage = useCallback(
    (newLang: LanguageCode) => {
      if (isChanging || newLang === language) return;
      setIsChanging(true);
      setLanguageState(newLang);
      if (newLang === LANGUAGES.KANNADA) {
        injectTranslateScript();
      }
      reloadWithLanguage(newLang);
    },
    [isChanging, language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isChanging }}>
      {children}
      {!isAdmin && (
        <div
          id="google_translate_element"
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

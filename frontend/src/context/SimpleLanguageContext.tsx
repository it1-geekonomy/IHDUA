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
  watchTranslatedThenReveal,
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

export function SimpleLanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [language, setLanguageState] = useState<LanguageCode>(LANGUAGES.ENGLISH);
  const [isChanging, setIsChanging] = useState(false);
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    setLanguageState(getCurrentLanguage());
  }, []);

  // Hold → reveal: clear EN flash once Kannada is on the DOM (or failsafe).
  useEffect(() => {
    if (isAdmin) {
      revealTranslatedPage();
      return;
    }
    return watchTranslatedThenReveal(2800);
  }, [isAdmin]);

  // Load Google Translate once on the public site.
  useEffect(() => {
    if (typeof window === "undefined" || isAdmin) return;
    if (document.querySelector('script[src*="translate.google.com"]')) return;

    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,kn",
            autoDisplay: false,
          },
          "google_translate_element",
        );
      } catch {
        revealTranslatedPage();
        return;
      }

      const lang = getCurrentLanguage();
      setLanguageState(lang);
      if (lang === LANGUAGES.KANNADA) {
        void whenTranslateReady(LANGUAGES.KANNADA, 3000).then((ok) => {
          if (!ok) revealTranslatedPage();
          // translated class / lang=kn is watched separately; nudge apply is enough here
        });
      } else {
        revealTranslatedPage();
      }
    };

    const script = document.createElement("script");
    // Absolute https keeps translate working on HTTPS live domains (and localhost).
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => revealTranslatedPage();
    document.head.appendChild(script);
  }, [isAdmin]);

  // Kannada: full document navigations so googtrans applies cleanly (no EN flash).
  useEffect(() => {
    if (isAdmin || language !== LANGUAGES.KANNADA) return;
    return bindKannadaHardNav();
  }, [language, isAdmin]);

  const setLanguage = useCallback(
    (newLang: LanguageCode) => {
      if (isChanging || newLang === language) return;
      setIsChanging(true);
      setLanguageState(newLang);
      reloadWithLanguage(newLang);
    },
    [isChanging, language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isChanging }}>
      {children}
      {/* Must stay in layout for the widget; visually hidden via CSS, not display:none */}
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

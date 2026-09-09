"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCurrentLanguage,
  reloadWithLanguage,
  LANGUAGES,
  LanguageCode,
} from "@/utils/languageHelper";

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
  const [language, setLanguageState] = useState<LanguageCode>(LANGUAGES.ENGLISH);
  const [isChanging, setIsChanging] = useState(false);

  // Detect language on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    setLanguageState(getCurrentLanguage());
  }, []);

  // Load Google Translate script once
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.querySelector('script[src*="translate.google.com"]')) return;

    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,kn",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      } catch {
        // ignore init errors
      }
    };

    document.head.appendChild(script);
  }, []);

  const setLanguage = (newLang: LanguageCode) => {
    if (isChanging || newLang === language) return;
    setIsChanging(true);
    setLanguageState(newLang);
    reloadWithLanguage(newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isChanging }}>
      {children}
      <div id="google_translate_element" className="hidden" />
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
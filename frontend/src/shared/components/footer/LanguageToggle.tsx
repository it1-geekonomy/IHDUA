"use client";

import { useEffect, useRef, useState } from "react";
import {
  getStoredLanguage,
  isPageShowingKannada,
  LANGUAGES,
  reloadWithLanguage,
  type LanguageCode,
} from "@/utils/languageHelper";
import { cn } from "@/lib/utils";

function readActiveLanguage(): LanguageCode {
  if (typeof document === "undefined") return LANGUAGES.ENGLISH;
  if (isPageShowingKannada()) return LANGUAGES.KANNADA;
  return getStoredLanguage();
}

function pickLanguage(lang: LanguageCode) {
  const w = window as unknown as {
    __ihduaPickLang?: (lang: LanguageCode) => void;
    __ihduaLangBusy?: boolean;
  };
  // Do NOT set busy before calling switchLang — it checks the same flag and
  // would no-op (this is what broke mobile translation).
  if (w.__ihduaLangBusy) return;

  try {
    if (typeof w.__ihduaPickLang === "function") {
      w.__ihduaPickLang(lang);
      return;
    }
  } catch {
    // fall through to direct reload
  }

  w.__ihduaLangBusy = true;
  window.setTimeout(() => {
    w.__ihduaLangBusy = false;
  }, 4000);
  reloadWithLanguage(lang);
}

export function LanguageToggle() {
  const [language, setLocalLanguage] = useState<LanguageCode>(LANGUAGES.ENGLISH);
  const armed = useRef(false);
  const isKn = language === LANGUAGES.KANNADA;

  useEffect(() => {
    const sync = () => setLocalLanguage(readActiveLanguage());
    sync();

    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "lang"],
    });

    window.addEventListener("ihdua:language", sync);
    const id = window.setInterval(sync, 400);

    return () => {
      obs.disconnect();
      window.removeEventListener("ihdua:language", sync);
      window.clearInterval(id);
    };
  }, []);

  const go = (lang: LanguageCode) => {
    if (armed.current) return;
    armed.current = true;
    pickLanguage(lang);
    window.setTimeout(() => {
      armed.current = false;
    }, 4000);
  };

  return (
    <div
      className="notranslate relative z-[60]"
      translate="no"
      data-lang-toggle
      data-active-lang={language}
    >
      {/*
        Below lg: one explicit switch. Next language comes from UI state only —
        never from cookies (cookie/UI mismatch was a silent no-op on mobile).
      */}
      <button
        type="button"
        role="switch"
        aria-checked={isKn}
        aria-label={isKn ? "Switch to English" : "Switch to Kannada"}
        data-mobile-switch
        data-lang={isKn ? "en" : "kn"}
        className="flex shrink-0 touch-manipulation items-center gap-3 lg:hidden"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          go(isKn ? LANGUAGES.ENGLISH : LANGUAGES.KANNADA);
        }}
      >
        <span
          data-lang-mobile
          data-lang="en"
          className={cn(
            "pointer-events-none select-none text-xs font-figtree",
            !isKn ? "font-bold text-[#00191B]" : "font-normal text-[#00191B]/70",
          )}
        >
          EN
        </span>
        <span
          data-lang-switch
          aria-hidden
          className={cn(
            "pointer-events-none relative isolate h-6 w-11 shrink-0 overflow-hidden rounded-full bg-black",
            isKn && "bg-[#00191B]",
          )}
        >
          <span
            data-lang-knob
            className={cn(
              "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-[left] duration-200 ease-out",
              isKn ? "left-[1.375rem]" : "left-0.5",
            )}
          />
        </span>
        <span
          data-lang-mobile
          data-lang="kn"
          className={cn(
            "pointer-events-none select-none text-xs font-figtree",
            isKn ? "font-bold text-[#00191B]" : "font-normal text-[#00191B]/70",
          )}
        >
          ಕನ್ನಡ
        </span>
      </button>

      <div className="hidden shrink-0 items-center gap-1 rounded-full bg-black px-1 py-1 lg:flex">
        <button
          type="button"
          data-lang="en"
          className={cn(
            "touch-manipulation px-3 py-1 font-figtree text-xs transition-colors md:text-sm",
            !isKn ? "font-bold text-white" : "font-normal text-[#A9C1C2]",
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            go(LANGUAGES.ENGLISH);
          }}
        >
          English
        </button>
        <button
          type="button"
          data-lang="kn"
          className={cn(
            "touch-manipulation px-3 py-1 font-figtree text-xs transition-colors md:text-sm",
            isKn ? "font-bold text-white" : "font-normal text-[#A9C1C2]",
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            go(LANGUAGES.KANNADA);
          }}
        >
          ಕನ್ನಡ
        </button>
      </div>
    </div>
  );
}

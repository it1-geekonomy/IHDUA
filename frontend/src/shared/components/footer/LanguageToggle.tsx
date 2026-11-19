"use client";

import { useEffect, useState } from "react";
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
  reloadWithLanguage(lang);
}

/** Expose for inline handlers + GT-safe clicks. */
if (typeof window !== "undefined") {
  (
    window as unknown as { __ihduaPickLang?: typeof pickLanguage }
  ).__ihduaPickLang = pickLanguage;
}

export function LanguageToggle() {
  const [language, setLocalLanguage] = useState<LanguageCode>(LANGUAGES.ENGLISH);
  const isKn = language === LANGUAGES.KANNADA;

  useEffect(() => {
    (
      window as unknown as { __ihduaPickLang?: typeof pickLanguage }
    ).__ihduaPickLang = pickLanguage;

    const sync = () => setLocalLanguage(readActiveLanguage());
    sync();

    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "lang"],
    });

    window.addEventListener("ihdua:language", sync);
    const id = window.setInterval(sync, 250);

    return () => {
      obs.disconnect();
      window.removeEventListener("ihdua:language", sync);
      window.clearInterval(id);
    };
  }, []);

  return (
    <div
      className="notranslate"
      translate="no"
      data-lang-toggle
      data-active-lang={language}
    >
      <button
        type="button"
        role="switch"
        aria-checked={isKn}
        aria-label="Toggle language"
        data-mobile-switch
        className="flex shrink-0 items-center gap-2 transition-opacity lg:hidden"
        onClick={() =>
          pickLanguage(isKn ? LANGUAGES.ENGLISH : LANGUAGES.KANNADA)
        }
      >
        <span
          data-lang="en"
          data-lang-mobile
          className={cn(
            "text-xs font-figtree",
            !isKn ? "font-bold text-[#00191B]" : "font-normal text-[#00191B]/70",
          )}
        >
          EN
        </span>
        <span
          data-lang-switch
          className={cn(
            "relative h-6 w-11 rounded-full bg-black p-0.5 transition-colors",
            isKn && "bg-[#00191B]",
          )}
        >
          <span
            className={cn(
              "block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-out",
              isKn ? "translate-x-5" : "translate-x-0",
            )}
          />
        </span>
        <span
          data-lang="kn"
          data-lang-mobile
          className={cn(
            "text-xs font-figtree",
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
            "px-3 py-1 font-figtree text-xs transition-colors md:text-sm",
            !isKn ? "font-bold text-white" : "font-normal text-[#A9C1C2]",
          )}
          onClick={() => pickLanguage(LANGUAGES.ENGLISH)}
        >
          English
        </button>
        <button
          type="button"
          data-lang="kn"
          className={cn(
            "px-3 py-1 font-figtree text-xs transition-colors md:text-sm",
            isKn ? "font-bold text-white" : "font-normal text-[#A9C1C2]",
          )}
          onClick={() => pickLanguage(LANGUAGES.KANNADA)}
        >
          ಕನ್ನಡ
        </button>
      </div>
    </div>
  );
}

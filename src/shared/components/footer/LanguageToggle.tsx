"use client";

import Typography from "@/lib/Typography";
import { useSimpleLanguage } from "@/context/SimpleLanguageContext";
import { LANGUAGES } from "@/utils/languageHelper";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { language, setLanguage, isChanging } = useSimpleLanguage();
  const disabled = isChanging;

  return (
    <>
      <button
        type="button"
        role="switch"
        aria-checked={language === LANGUAGES.KANNADA}
        aria-label="Toggle language"
        disabled={disabled}
        onClick={() =>
          setLanguage(
            language === LANGUAGES.ENGLISH ? LANGUAGES.KANNADA : LANGUAGES.ENGLISH,
          )
        }
        className={cn(
          "flex shrink-0 items-center gap-2 transition-opacity lg:hidden",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <span
          className={cn(
            "text-xs font-figtree",
            language === LANGUAGES.ENGLISH
              ? "font-bold text-[#00191B]"
              : "font-normal text-[#00191B]/70",
          )}
        >
          EN
        </span>
        <span
          className={cn(
            "relative h-6 w-11 rounded-full bg-black p-0.5 transition-colors",
            language === LANGUAGES.KANNADA && "bg-[#00191B]",
          )}
        >
          <span
            className={cn(
              "block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-out",
              language === LANGUAGES.KANNADA ? "translate-x-5" : "translate-x-0",
            )}
          />
        </span>
        <span
          className={cn(
            "text-xs font-figtree",
            language === LANGUAGES.KANNADA
              ? "font-bold text-[#00191B]"
              : "font-normal text-[#00191B]/70",
          )}
        >
          ಕನ್ನಡ
        </span>
      </button>

      <div
        className={cn(
          "hidden shrink-0 items-center gap-1 rounded-full bg-black px-1 py-1 transition-opacity lg:flex",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <button
          type="button"
          onClick={() => setLanguage(LANGUAGES.ENGLISH)}
          disabled={disabled}
          className="px-3 py-1 transition-colors"
        >
          <Typography
            variant="body-sm"
            className={cn(
              "font-figtree",
              language === LANGUAGES.ENGLISH
                ? "font-bold text-white"
                : "font-normal text-[#A9C1C2]",
            )}
          >
            English
          </Typography>
        </button>
        <button
          type="button"
          onClick={() => setLanguage(LANGUAGES.KANNADA)}
          disabled={disabled}
          className="px-3 py-1 transition-colors"
        >
          <Typography
            variant="body-sm"
            className={cn(
              "font-figtree",
              language === LANGUAGES.KANNADA
                ? "font-bold text-white"
                : "font-normal text-[#A9C1C2]",
            )}
          >
            ಕನ್ನಡ
          </Typography>
        </button>
      </div>
    </>
  );
}

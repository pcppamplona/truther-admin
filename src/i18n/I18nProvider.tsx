import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import en from "./locales/en";
import pt from "./locales/pt";
import es from "./locales/es";
import { useLanguageStore } from "@/store/language";
import type { LocaleKey } from "@/store/language";

export type Translations = Record<string, any>;

const LOCALES: Record<LocaleKey, Translations> = { en, pt, es };

const DEFAULT_LANG: LocaleKey = "en";

interface I18nContextValue {
  lang: LocaleKey;
  setLang: (lang: LocaleKey) => void;
  t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode; initialLang?: LocaleKey }> = ({ children, initialLang }) => {
  const lang = useLanguageStore((s) => s.lang);
  const setLangStore = useLanguageStore((s) => s.setLang);

  useEffect(() => {
    if (initialLang && initialLang !== lang) {
      setLangStore(initialLang);
    }
  }, [initialLang, lang, setLangStore]);

  const dict = useMemo(() => LOCALES[lang] ?? LOCALES[DEFAULT_LANG], [lang]);

  const t = useCallback(
    (key: string, fallback?: string) => {
      const parts = key.split(".");
      let node: any = dict;
      for (const p of parts) {
        if (node && typeof node === "object" && p in node) {
          node = node[p];
        } else {
          return fallback ?? key;
        }
      }
      if (typeof node === "string") return node;
      return fallback ?? key;
    },
    [dict]
  );

  const value = useMemo(() => ({ lang, setLang: setLangStore, t }), [lang, setLangStore, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}

export const locales = LOCALES;

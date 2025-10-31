import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type LocaleKey = "en" | "pt" | "es";

type LanguageStore = {
  lang: LocaleKey;
  setLang: (lang: LocaleKey) => void;
};

const DEFAULT_LANG: LocaleKey = "en";

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      lang: DEFAULT_LANG,
      setLang: (lang) => set({ lang }),
    }),
    {
      name: "app:lang",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);

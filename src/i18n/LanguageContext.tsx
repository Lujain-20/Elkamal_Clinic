import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { translations, type Lang } from "./Translation";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (path: string) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "ek-lang";

// Reads a dot-separated path ("home.hero.title") out of a
// nested translation object.
function getNested(source: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>((acc, key) => {
      if (acc && typeof acc === "object" && key in (acc as object)) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, source);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";

    const stored = window.localStorage.getItem(STORAGE_KEY);

    return stored === "ar" || stored === "en" ? stored : "en";
  });

  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";

  // Keep <html lang="..." dir="..."> and localStorage in sync
  // with the current language, site-wide.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang, dir]);

  const setLang = (next: Lang) => setLangState(next);

  const t = useMemo(() => {
    return (path: string): string => {
      const value = getNested(translations[lang], path);

      if (typeof value === "string") return value;

      // Fall back to English, then to the raw key, so a
      // missing translation never breaks the page.
      const fallback = getNested(translations.en, path);

      if (typeof fallback === "string") return fallback;

      return path;
    };
  }, [lang]);

  const value = useMemo(
    () => ({ lang, setLang, t, dir }),
    [lang, dir, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);

  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return ctx;
}
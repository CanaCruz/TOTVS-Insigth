import { useCallback, useEffect, useMemo, useState } from "react";
import enUS from "./locales/en-US";
import es from "./locales/es";
import ptBR from "./locales/pt-BR";
import { LocaleContext } from "./locale-context";
import {
  interpolate,
  LOCALE_LABELS,
  LOCALES,
  resolveDict,
  setActiveLocale,
  type Locale,
  type TranslateFn,
} from "./types";

const STORAGE_KEY = "totvs-insight-locale";

const DICTS = {
  "pt-BR": ptBR,
  "en-US": enUS,
  es,
} as const;

function lerLocale(): Locale {
  try {
    const salva = localStorage.getItem(STORAGE_KEY);
    if (salva === "pt-BR" || salva === "en-US" || salva === "es") return salva;
  } catch {
    /* ignore */
  }
  return "pt-BR";
}

function aplicarHtmlLang(locale: Locale) {
  document.documentElement.lang = locale;
  setActiveLocale(locale);
}

export default function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const inicial = lerLocale();
    aplicarHtmlLang(inicial);
    return inicial;
  });

  useEffect(() => {
    aplicarHtmlLang(locale);
  }, [locale]);

  const setLocale = useCallback((proximo: Locale) => {
    setLocaleState(proximo);
    try {
      localStorage.setItem(STORAGE_KEY, proximo);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback<TranslateFn>(
    (key, params) => {
      const fromActive = resolveDict(DICTS[locale], key);
      if (fromActive) return interpolate(fromActive, params);
      const fallback = resolveDict(DICTS["pt-BR"], key);
      if (fallback) return interpolate(fallback, params);
      return key;
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, locales: LOCALES, labels: LOCALE_LABELS }),
    [locale, setLocale, t],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

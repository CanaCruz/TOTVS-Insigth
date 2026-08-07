import { createContext } from "react";
import { LOCALE_LABELS, LOCALES, type Locale, type TranslateFn } from "./types";

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslateFn;
  locales: typeof LOCALES;
  labels: typeof LOCALE_LABELS;
}

/** Contexto isolado para o Fast Refresh não misturar provider e hook. */
export const LocaleContext = createContext<LocaleContextValue | null>(null);

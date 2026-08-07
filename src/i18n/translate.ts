import enUS from "./locales/en-US";
import es from "./locales/es";
import ptBR from "./locales/pt-BR";
import {
  getActiveLocale,
  interpolate,
  resolveDict,
  type Locale,
} from "./types";

const DICTS = {
  "pt-BR": ptBR,
  "en-US": enUS,
  es,
} as const;

/** Traduz fora do React (formatadores, repository, authService). */
export function translate(
  key: string,
  params?: Record<string, string | number>,
  locale: Locale = getActiveLocale(),
): string {
  const fromActive = resolveDict(DICTS[locale], key);
  if (fromActive) return interpolate(fromActive, params);
  const fallback = resolveDict(DICTS["pt-BR"], key);
  if (fallback) return interpolate(fallback, params);
  return key;
}

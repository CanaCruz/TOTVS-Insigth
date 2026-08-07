/** Locales suportados pela UI. */
export type Locale = "pt-BR" | "en-US" | "es";

export const LOCALES: Locale[] = ["pt-BR", "en-US", "es"];

export const LOCALE_LABELS: Record<Locale, string> = {
  "pt-BR": "Português (BR)",
  "en-US": "English (US)",
  es: "Español",
};

/** Dicionário aninhado: folhas são strings. */
export type Dict = { [key: string]: string | Dict };

export type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

/** Locale ativo para `format.ts` (evita prop drilling em formatadores). */
let localeAtivo: Locale = "pt-BR";

export function getActiveLocale(): Locale {
  return localeAtivo;
}

export function setActiveLocale(locale: Locale) {
  localeAtivo = locale;
}

export function resolveDict(dict: Dict, key: string): string | undefined {
  const parts = key.split(".");
  let cur: string | Dict | undefined = dict;
  for (const part of parts) {
    if (!cur || typeof cur === "string") return undefined;
    cur = cur[part];
  }
  return typeof cur === "string" ? cur : undefined;
}

export function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    params[name] !== undefined ? String(params[name]) : `{${name}}`,
  );
}

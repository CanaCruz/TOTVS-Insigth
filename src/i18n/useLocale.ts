import { useContext } from "react";
import { LocaleContext, type LocaleContextValue } from "./locale-context";

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale precisa estar dentro de <LocaleProvider>.");
  return ctx;
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type TemaPreferencia = "claro" | "escuro" | "sistema";
export type TemaResolvido = "claro" | "escuro";

const STORAGE_KEY = "totvs-insight-tema";

interface ThemeContextValue {
  /** Preferência do usuário (pode ser "seguir o sistema"). */
  preferencia: TemaPreferencia;
  /** Tema efetivamente aplicado na UI. */
  resolvido: TemaResolvido;
  setPreferencia: (tema: TemaPreferencia) => void;
  /** Alterna entre claro e escuro (ignora "sistema"). */
  alternar: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function lerPreferencia(): TemaPreferencia {
  try {
    const salva = localStorage.getItem(STORAGE_KEY);
    if (salva === "claro" || salva === "escuro" || salva === "sistema") return salva;
  } catch {
    /* localStorage indisponível */
  }
  return "sistema";
}

function sistemaPrefereEscuro(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolver(preferencia: TemaPreferencia): TemaResolvido {
  if (preferencia === "sistema") return sistemaPrefereEscuro() ? "escuro" : "claro";
  return preferencia;
}

function aplicarDom(tema: TemaResolvido) {
  const root = document.documentElement;
  root.classList.toggle("dark", tema === "escuro");
  root.style.colorScheme = tema === "escuro" ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preferencia, setPreferenciaState] = useState<TemaPreferencia>(() => lerPreferencia());
  const [resolvido, setResolvido] = useState<TemaResolvido>(() => resolver(lerPreferencia()));

  useEffect(() => {
    const atual = resolver(preferencia);
    setResolvido(atual);
    aplicarDom(atual);

    if (preferencia !== "sistema") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const proximo = resolver("sistema");
      setResolvido(proximo);
      aplicarDom(proximo);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [preferencia]);

  const setPreferencia = useCallback((tema: TemaPreferencia) => {
    setPreferenciaState(tema);
    try {
      localStorage.setItem(STORAGE_KEY, tema);
    } catch {
      /* ignore */
    }
  }, []);

  const alternar = useCallback(() => {
    setPreferencia(resolvido === "escuro" ? "claro" : "escuro");
  }, [resolvido, setPreferencia]);

  const value = useMemo(
    () => ({ preferencia, resolvido, setPreferencia, alternar }),
    [preferencia, resolvido, setPreferencia, alternar],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme precisa estar dentro de <ThemeProvider>.");
  return ctx;
}

import { useEffect, useRef } from "react";

/**
 * Devolve uma ref para o contêiner de um painel flutuante e dispara `onOutside`
 * quando o usuário clica fora dele.
 *
 * O listener só é registrado enquanto `active` for verdadeiro, então painéis
 * fechados não pagam o custo de escutar o documento inteiro.
 */
export default function useClickOutside<T extends HTMLElement = HTMLDivElement>(
  active: boolean,
  onOutside: () => void,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!active) return;

    function handlePointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onOutside();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [active, onOutside]);

  return ref;
}

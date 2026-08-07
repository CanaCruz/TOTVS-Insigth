/** Formatação de valores para exibição. Nada aqui toca em dados de origem. */

import { getActiveLocale } from "@/i18n/types";

/** "2026-03-18 16:00:00" → data localizada. */
export function formatarData(iso: string): string {
  const d = new Date(iso.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(getActiveLocale());
}

/** "2026-03-18 16:00:00" → data + hora localizadas. */
export function formatarDataHora(iso: string): string {
  const d = new Date(iso.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return iso;
  const locale = getActiveLocale();
  return `${d.toLocaleDateString(locale)} ${d.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

/** 5953 → "1h 39min"; 2700 → "45 min". */
export function formatarDuracao(segundos: number): string {
  const totalMin = Math.round(segundos / 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h}h` : `${h}h ${String(m).padStart(2, "0")}min`;
}

/**
 * "02.MICRO II - De R$ 500.001 a R$ 10.000.000" → "MICRO II".
 *
 * A origem prefixa a faixa com um código de ordenação e anexa o intervalo
 * completo; em tabela só o nome da faixa cabe.
 */
export function formatarFaixa(faixa: string | null): string {
  if (!faixa) return "—";
  const semPrefixo = faixa.replace(/^\d+\./, "");
  const [nome] = semPrefixo.split(" - ");
  return nome.trim() || "—";
}

/** Capitaliza rótulos que a origem entrega em caixa alta ("SERVICOS" → "Servicos"). */
export function capitalizar(texto: string | null): string {
  if (!texto) return "—";
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

/** Devolve o valor ou um travessão, para nunca renderizar "null" na tela. */
export function ouTraco(valor: string | number | null | undefined): string {
  if (valor === null || valor === undefined || valor === "") return "—";
  return String(valor);
}

import { useCallback, useEffect } from "react";
import { getTranscricao, transcricoesDisponiveis } from "@/data/repository";
import { getTextoUpload } from "@/data/sessionUploads";
import useDataset from "@/data/useDataset";
import type { Reuniao, TranscricaoCompleta } from "@/data/types";
import { useLocale } from "@/i18n/useLocale";
import { capitalizar, formatarDataHora, formatarDuracao, formatarFaixa, ouTraco } from "@/format";
import { ErrorState } from "@/components/ui/DataState";

/**
 * Busca o texto, mas só depois de confirmar que ele foi publicado — ou se
 * veio de um upload local da sessão.
 */
async function carregarTexto(id: string): Promise<TranscricaoCompleta | null> {
  if (getTextoUpload(id) !== undefined) return getTranscricao(id);
  if (!(await transcricoesDisponiveis())) return null;
  return getTranscricao(id);
}

/**
 * Painel lateral com a transcrição completa de uma reunião.
 *
 * O texto NÃO vem no índice: é buscado aqui, um arquivo por reunião. É o que
 * permite o app abrir com ~460 KB em vez dos 46 MB do dump original.
 */
export default function TranscricaoDrawer({
  reuniao,
  onClose,
}: {
  reuniao: Reuniao;
  onClose: () => void;
}) {
  const { t } = useLocale();
  const carregar = useCallback(() => carregarTexto(reuniao.id), [reuniao.id]);
  const { data, loading, error, sugestao } = useDataset<TranscricaoCompleta | null>(carregar);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const meta = [
    { label: t("transcripts.col.client"), valor: reuniao.codt },
    { label: t("transcripts.col.date"), valor: formatarDataHora(reuniao.data) },
    { label: t("transcripts.col.duration"), valor: formatarDuracao(reuniao.duracaoSegundos) },
    { label: t("transcripts.col.speakers"), valor: String(reuniao.locutores) },
    { label: "Formato", valor: capitalizar(reuniao.formato) },
    { label: t("transcripts.col.unit"), valor: ouTraco(reuniao.unidade) },
    { label: t("transcripts.col.segment"), valor: capitalizar(reuniao.segmento) },
    { label: t("transcripts.col.uf"), valor: ouTraco(reuniao.uf) },
    { label: t("transcripts.col.size"), valor: formatarFaixa(reuniao.faixaFaturamento) },
    { label: t("transcripts.col.nps"), valor: ouTraco(reuniao.nps) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-brand-navy/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-label={t("drawer.aria", { id: reuniao.id })}
        className="relative flex h-full w-full max-w-2xl flex-col bg-brand-card shadow-2xl"
      >
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div className="min-w-0">
            <p className="font-body text-meta text-brand-blue">
              {t("drawer.meetingId", { id: reuniao.id })}
            </p>
            <h2 className="font-heading truncate text-lg font-bold text-brand-text">
              {reuniao.unidade ?? t("common.unitUnknown")}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label={t("common.close")}
            className="font-body flex-shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-50"
          >
            {t("common.close")}
          </button>
        </div>

        {/* Metadados */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 border-b border-gray-100 px-6 py-4 sm:grid-cols-3">
          {meta.map((m) => (
            <div key={m.label} className="min-w-0">
              <p className="font-body text-micro text-gray-400">{m.label}</p>
              <p className="font-body truncate text-xs font-medium text-brand-text">{m.valor}</p>
            </div>
          ))}
        </div>

        {/* Transcrição */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading && (
            <div className="flex flex-col items-center gap-3 py-16">
              <span
                className="h-6 w-6 animate-spin rounded-full border-2 border-brand-blue/20 border-t-brand-blue"
                aria-hidden="true"
              />
              <p className="font-body text-xs text-gray-500">{t("drawer.loading")}</p>
            </div>
          )}

          {error && <ErrorState error={error} sugestao={sugestao} />}

          {/* Build publicado sem os textos — ausência intencional, não falha. */}
          {!loading && !error && data === null && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-6 py-10 text-center">
              <p className="font-heading text-sm font-semibold text-brand-text">
                {t("drawer.unpublishedTitle")}
              </p>
              <p className="font-body mx-auto mt-2 max-w-md text-xs leading-relaxed text-gray-500">
                {t("drawer.unpublishedBody")}
              </p>
            </div>
          )}

          {data && (
            <>
              <p className="font-body mb-3 text-micro text-gray-400">
                {t("drawer.charsNote", { n: data.texto.length.toLocaleString("pt-BR") })}
              </p>
              <pre className="font-body text-meta leading-relaxed whitespace-pre-wrap text-brand-text">
                {data.texto}
              </pre>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

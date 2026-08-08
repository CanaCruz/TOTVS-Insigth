import { useCallback, useEffect } from "react";
import { getDetalheCliente } from "@/data/repository";
import useDataset from "@/data/useDataset";
import type { DetalheCliente } from "@/data/types";
import { useLocale } from "@/i18n/useLocale";
import { capitalizar, formatarData, formatarDuracao, formatarFaixa, ouTraco } from "@/format";
import { ErrorState } from "@/components/ui/DataState";

/** Altura máxima das barras do histórico, em px. */
const ALTURA_MAX = 80;

function npsClass(nps: number) {
  if (nps >= 9) return "text-green-600";
  if (nps >= 7) return "text-gray-500";
  return "text-red-500";
}

/**
 * Histórico de reuniões do cliente, da mais antiga para a mais recente.
 *
 * Só faz sentido com volume: com 2 reuniões isso não é uma linha do tempo, é
 * duas barras. Por isso o componente pai só o renderiza a partir de 3.
 */
function Historico({
  reunioes,
  t,
}: {
  reunioes: DetalheCliente["reunioes"];
  t: (k: string, p?: Record<string, string | number>) => string;
}) {
  const cronologico = [...reunioes].reverse();
  const maior = Math.max(...cronologico.map((r) => r.duracaoSegundos), 1);

  /*
   * A base vai de 3 a 116 reuniões por cliente. Com largura mínima fixa, os
   * casos grandes transbordam horizontalmente e viram um scroll inútil — então
   * a barra afina conforme a quantidade, e o conjunto sempre cabe na largura.
   */
  const denso = cronologico.length > 32;

  return (
    <div>
      <p className="font-heading mb-3 text-sm font-semibold text-brand-text">
        {t("clientDrawer.timeline")}
      </p>
      <div className={`flex items-end ${denso ? "gap-px" : "gap-1"}`}>
        {cronologico.map((r) => (
          <div
            key={r.id}
            className={`flex-1 rounded-t bg-gradient-to-t from-brand-blue to-brand-bright ${
              denso ? "min-w-[2px]" : "min-w-1.5"
            }`}
            style={{
              height: Math.max((r.duracaoSegundos / maior) * ALTURA_MAX, 3),
            }}
            title={`${formatarData(r.data)} · ${formatarDuracao(r.duracaoSegundos)}${
              r.nps !== null ? ` · NPS ${r.nps}` : ""
            }`}
          />
        ))}
      </div>
      <p className="font-body mt-2 text-micro text-gray-400">
        {t("clientDrawer.timelineHint")} · {t("clientDrawer.timelineCount", { n: cronologico.length })}
      </p>
    </div>
  );
}

export default function ClienteDrawer({ codt, onClose }: { codt: string; onClose: () => void }) {
  const { t } = useLocale();

  const carregar = useCallback(() => getDetalheCliente(codt), [codt]);
  const { data, loading, error, sugestao } = useDataset<DetalheCliente | null>(carregar);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const cliente = data?.cliente;

  const meta = cliente
    ? [
        { label: t("clients.col.meetings"), valor: String(cliente.reunioes) },
        { label: t("clients.col.hours"), valor: formatarDuracao(cliente.segundosTotais) },
        { label: t("clientDrawer.first"), valor: formatarData(cliente.primeiraReuniao) },
        { label: t("clientDrawer.last"), valor: formatarData(cliente.ultimaReuniao) },
        { label: t("clients.col.unit"), valor: ouTraco(cliente.unidade) },
        { label: t("clients.col.segment"), valor: capitalizar(cliente.segmento) },
        { label: t("clients.col.uf"), valor: ouTraco(cliente.uf) },
        { label: t("transcripts.col.size"), valor: formatarFaixa(cliente.faixaFaturamento) },
      ]
    : [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-brand-navy/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-label={t("clientDrawer.aria", { codt })}
        className="relative flex h-full w-full max-w-2xl flex-col bg-brand-card shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div className="min-w-0">
            <p className="font-body text-meta text-brand-blue">{t("clientDrawer.client")}</p>
            <h2 className="font-heading truncate text-lg font-bold text-brand-text">{codt}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label={t("common.close")}
            className="font-body flex-shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-50"
          >
            {t("common.close")}
          </button>
        </div>

        {loading && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <span
              className="h-6 w-6 animate-spin rounded-full border-2 border-brand-blue/20 border-t-brand-blue"
              aria-hidden="true"
            />
            <p className="font-body text-xs text-gray-500">{t("clientDrawer.loading")}</p>
          </div>
        )}

        {error && (
          <div className="p-6">
            <ErrorState error={error} sugestao={sugestao} />
          </div>
        )}

        {data && cliente && (
          <>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 border-b border-gray-100 px-6 py-4 sm:grid-cols-4">
              {meta.map((m) => (
                <div key={m.label} className="min-w-0">
                  <p className="font-body text-micro text-gray-400">{m.label}</p>
                  <p className="font-body truncate text-xs font-medium text-brand-text">
                    {m.valor}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-5">
              {/*
                NPS: presente em ~26% das reuniões da base, então mostramos a
                cobertura junto com o número — uma média de 1 resposta não é média.
              */}
              <div>
                <p className="font-heading mb-2 text-sm font-semibold text-brand-text">
                  {t("clients.col.nps")}
                </p>
                {cliente.npsRespostas > 0 ? (
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span
                      className={`font-heading text-2xl font-bold ${npsClass(cliente.npsMedia!)}`}
                    >
                      {cliente.npsMedia!.toFixed(1)}
                    </span>
                    <span className="font-body text-xs text-gray-500">
                      {t("clientDrawer.npsCoverage", {
                        answers: cliente.npsRespostas,
                        total: cliente.reunioes,
                      })}
                    </span>
                  </div>
                ) : (
                  <p className="font-body text-xs text-gray-400">{t("clientDrawer.npsNone")}</p>
                )}
              </div>

              {data.reunioes.length >= 3 && <Historico reunioes={data.reunioes} t={t} />}

              <div>
                <p className="font-heading mb-3 text-sm font-semibold text-brand-text">
                  {t("clientDrawer.meetings")}
                </p>
                <div className="flex flex-col divide-y divide-gray-100">
                  {data.reunioes.map((r) => (
                    <div key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                      <div className="min-w-0">
                        <p className="font-heading truncate text-xs font-medium text-brand-text">
                          {r.unidade ?? t("common.unitUnknown")}
                        </p>
                        <p className="font-body text-micro text-gray-400">
                          {formatarData(r.data)} · {formatarDuracao(r.duracaoSegundos)} ·{" "}
                          {r.locutores} {t("clients.col.speakersShort")}
                        </p>
                      </div>
                      {r.nps !== null && (
                        <span
                          className={`font-body flex-shrink-0 rounded-full px-2 py-0.5 text-micro ${
                            r.nps >= 9
                              ? "bg-green-50 text-green-600"
                              : r.nps >= 7
                                ? "bg-gray-50 text-gray-500"
                                : "bg-red-50 text-red-600"
                          }`}
                        >
                          NPS {r.nps}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

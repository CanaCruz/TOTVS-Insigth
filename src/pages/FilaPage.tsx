import { useCallback } from "react";
import { GRADIENT_PROGRESS } from "@/theme";
import { getIndice } from "@/data/repository";
import useDataset from "@/data/useDataset";
import type { IndiceReunioes } from "@/data/types";
import { useLocale } from "@/i18n/useLocale";
import { formatarData, formatarDuracao } from "@/format";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/DataState";

export default function FilaPage() {
  const { t, locale } = useLocale();
  const { data, loading, error, sugestao } = useDataset<IndiceReunioes>(
    useCallback(() => getIndice(), []),
  );

  const reunioes = data?.reunioes ?? [];
  const pendentes = reunioes.filter((r) => r.status !== "COMPLETED");
  const concluidas = reunioes.length - pendentes.length;

  return (
    <div>
      <PageHeader title={t("queue.title")} subtitle={t("queue.subtitle")} />

      {loading && <LoadingState label={t("queue.loading")} />}
      {error && <ErrorState error={error} sugestao={sugestao} />}

      {data && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-blue-50 p-5">
              <p className="font-heading text-2xl font-bold text-blue-600">{pendentes.length}</p>
              <p className="font-body mt-1 text-xs text-gray-500">{t("queue.processing")}</p>
            </div>
            <div className="rounded-xl bg-green-50 p-5">
              <p className="font-heading text-2xl font-bold text-green-600">
                {concluidas.toLocaleString(locale)}
              </p>
              <p className="font-body mt-1 text-xs text-gray-500">{t("queue.processed")}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-5">
              <p className="font-heading text-2xl font-bold text-brand-text">100%</p>
              <p className="font-body mt-1 text-xs text-gray-500">{t("queue.completion")}</p>
            </div>
          </div>

          {pendentes.length === 0 ? (
            <EmptyState
              titulo={t("queue.emptyTitle")}
              descricao={t("queue.emptyBody", { n: concluidas.toLocaleString(locale) })}
            />
          ) : (
            <div className="flex flex-col gap-3">
              {pendentes.map((item) => (
                <Card key={item.id} className="p-5">
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-heading text-micro font-medium text-brand-blue">
                          {item.id}
                        </span>
                        <StatusBadge status="Processando" />
                      </div>
                      <p className="font-heading text-sm font-semibold text-brand-text">
                        {item.unidade ?? t("common.unitUnknown")}
                      </p>
                      <p className="font-body mt-1 text-xs text-gray-500">
                        {t("queue.itemMeta", {
                          codt: item.codt,
                          data: formatarData(item.dataCriacao),
                        })}
                      </p>
                    </div>
                    <span className="font-body text-xs whitespace-nowrap text-gray-400">
                      {t("queue.audio", { dur: formatarDuracao(item.duracaoSegundos) })}
                    </span>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-gray-100">
                    <div
                      className="h-1.5 w-1/2 rounded-full"
                      style={{ background: GRADIENT_PROGRESS }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

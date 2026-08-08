import { useCallback, useMemo, useState } from "react";
import { getClientes } from "@/data/repository";
import useDataset from "@/data/useDataset";
import type { Cliente } from "@/data/types";
import { useLocale } from "@/i18n/useLocale";
import { capitalizar, formatarData, formatarDuracao, formatarFaixa, ouTraco } from "@/format";
import { SearchIcon } from "@/icons";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/DataState";
import ClienteDrawer from "@/components/ClienteDrawer";

const POR_PAGINA = 25;

const COL_KEYS = ["client", "meetings", "hours", "lastMeeting", "unit", "segment", "uf", "nps"] as const;

/** Ordenações disponíveis. `volume` é o padrão — ver comentário em `agruparClientes`. */
type Ordem = "volume" | "hours" | "recent" | "nps";

const ORDENS: Ordem[] = ["volume", "hours", "recent", "nps"];

const ALL = "__all__";

function npsClass(nps: number) {
  if (nps >= 9) return "text-green-600";
  if (nps >= 7) return "text-gray-500";
  return "text-red-500";
}

function ordenar(clientes: Cliente[], ordem: Ordem): Cliente[] {
  const copia = [...clientes];
  switch (ordem) {
    case "hours":
      return copia.sort((a, b) => b.segundosTotais - a.segundosTotais);
    case "recent":
      return copia.sort((a, b) => b.ultimaReuniao.localeCompare(a.ultimaReuniao));
    case "nps":
      /* Sem nota vai para o fim: ordenar por um valor ausente não diz nada. */
      return copia.sort((a, b) => {
        if (a.npsMedia === null) return 1;
        if (b.npsMedia === null) return -1;
        return a.npsMedia - b.npsMedia;
      });
    case "volume":
    default:
      return copia.sort((a, b) => b.reunioes - a.reunioes);
  }
}

export default function ClientesPage() {
  const { t } = useLocale();
  const [search, setSearch] = useState("");
  const [segmento, setSegmento] = useState(ALL);
  const [ordem, setOrdem] = useState<Ordem>("volume");
  const [pagina, setPagina] = useState(0);
  const [aberto, setAberto] = useState<Cliente | null>(null);

  const { data, loading, error, sugestao } = useDataset<Cliente[]>(
    useCallback(() => getClientes(), []),
  );

  const clientes = data ?? [];

  const segmentos = useMemo(() => {
    const set = new Set<string>();
    for (const c of clientes) if (c.segmento) set.add(c.segmento);
    return [...set].sort();
  }, [clientes]);

  const filtrados = useMemo(() => {
    const termo = search.trim().toLowerCase();
    const base = clientes.filter(
      (c) =>
        (segmento === ALL || c.segmento === segmento) &&
        (termo === "" ||
          c.codt.toLowerCase().includes(termo) ||
          (c.unidade ?? "").toLowerCase().includes(termo)),
    );
    return ordenar(base, ordem);
  }, [clientes, search, segmento, ordem]);

  const totalPaginas = Math.max(Math.ceil(filtrados.length / POR_PAGINA), 1);
  const paginaAtual = Math.min(pagina, totalPaginas - 1);
  const visiveis = filtrados.slice(paginaAtual * POR_PAGINA, (paginaAtual + 1) * POR_PAGINA);

  /** Resumo do topo — calculado sobre o conjunto filtrado, não sobre a base toda. */
  const resumo = useMemo(() => {
    const comHistorico = filtrados.filter((c) => c.reunioes >= 3).length;
    const comNps = filtrados.filter((c) => c.npsRespostas > 0).length;
    return { total: filtrados.length, comHistorico, comNps };
  }, [filtrados]);

  function aoFiltrar<T>(setter: (v: T) => void) {
    return (valor: T) => {
      setter(valor);
      setPagina(0);
    };
  }

  return (
    <div>
      <PageHeader title={t("clients.title")} subtitle={t("clients.subtitle")} />

      {loading && <LoadingState label={t("clients.loading")} />}
      {error && <ErrorState error={error} sugestao={sugestao} />}

      {data && (
        <>
          {/* Resumo */}
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <p className="font-heading text-2xl font-bold text-brand-text">
                {resumo.total.toLocaleString()}
              </p>
              <p className="font-body mt-1 text-xs text-gray-500">{t("clients.statTotal")}</p>
            </Card>
            <Card className="p-5">
              <p className="font-heading text-2xl font-bold text-brand-text">
                {resumo.comHistorico.toLocaleString()}
              </p>
              <p className="font-body mt-1 text-xs text-gray-500">{t("clients.statHistory")}</p>
            </Card>
            <Card className="p-5">
              <p className="font-heading text-2xl font-bold text-brand-text">
                {resumo.comNps.toLocaleString()}
              </p>
              <p className="font-body mt-1 text-xs text-gray-500">{t("clients.statNps")}</p>
            </Card>
          </div>

          {/* Barra de ferramentas */}
          <div className="mb-5 flex flex-wrap gap-3">
            <div className="relative min-w-48 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
                <SearchIcon size={13} />
              </span>
              <input
                value={search}
                onChange={(e) => aoFiltrar(setSearch)(e.target.value)}
                placeholder={t("clients.searchPlaceholder")}
                aria-label={t("clients.searchAria")}
                className="font-body w-full rounded-lg border border-gray-200 bg-brand-card py-2 pr-3 pl-9 text-xs text-brand-text transition-colors outline-none focus:border-brand-blue"
              />
            </div>

            <select
              value={segmento}
              onChange={(e) => aoFiltrar(setSegmento)(e.target.value)}
              aria-label={t("clients.filterSegment")}
              className="font-body rounded-lg border border-gray-200 bg-brand-card px-3 py-2 text-xs text-brand-text outline-none"
            >
              <option value={ALL}>{t("common.allM")}</option>
              {segmentos.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={ordem}
              onChange={(e) => aoFiltrar(setOrdem)(e.target.value as Ordem)}
              aria-label={t("clients.sortAria")}
              className="font-body rounded-lg border border-gray-200 bg-brand-card px-3 py-2 text-xs text-brand-text outline-none"
            >
              {ORDENS.map((o) => (
                <option key={o} value={o}>
                  {t(`clients.sort.${o}`)}
                </option>
              ))}
            </select>
          </div>

          {filtrados.length === 0 ? (
            <EmptyState titulo={t("clients.emptyTitle")} descricao={t("clients.emptyBody")} />
          ) : (
            <>
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        {COL_KEYS.map((key) => (
                          <th
                            key={key}
                            className="font-body px-4 py-3 text-left font-medium whitespace-nowrap text-gray-500"
                          >
                            {t(`clients.col.${key}`)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visiveis.map((c, i) => (
                        <tr
                          key={c.codt}
                          onClick={() => setAberto(c)}
                          className={`cursor-pointer border-b border-gray-50 transition-colors hover:bg-blue-50/40 ${
                            i % 2 === 0 ? "" : "bg-gray-50/40"
                          }`}
                        >
                          <td className="font-heading px-4 py-3 font-medium whitespace-nowrap text-brand-blue">
                            {c.codt}
                          </td>
                          <td className="font-body px-4 py-3 text-center font-medium text-brand-text">
                            {c.reunioes}
                          </td>
                          <td className="font-body px-4 py-3 whitespace-nowrap text-gray-500">
                            {formatarDuracao(c.segundosTotais)}
                          </td>
                          <td className="font-body px-4 py-3 whitespace-nowrap text-gray-500">
                            {formatarData(c.ultimaReuniao)}
                          </td>
                          <td className="font-body max-w-44 truncate px-4 py-3 text-gray-600">
                            {ouTraco(c.unidade)}
                          </td>
                          <td className="font-body px-4 py-3 whitespace-nowrap text-gray-500">
                            {capitalizar(c.segmento)}
                          </td>
                          <td className="font-body px-4 py-3 text-gray-500">{ouTraco(c.uf)}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {c.npsMedia !== null ? (
                              <span
                                className={`font-body text-meta font-semibold ${npsClass(c.npsMedia)}`}
                              >
                                {c.npsMedia.toFixed(1)}
                                <span className="ml-1 font-normal text-gray-400">
                                  ({c.npsRespostas})
                                </span>
                              </span>
                            ) : (
                              <span className="font-body text-meta text-gray-300">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="font-body text-meta text-gray-500">
                  {t("clients.pagination", {
                    total: filtrados.length.toLocaleString(),
                    from: paginaAtual * POR_PAGINA + 1,
                    to: Math.min((paginaAtual + 1) * POR_PAGINA, filtrados.length),
                  })}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagina((p) => Math.max(p - 1, 0))}
                    disabled={paginaAtual === 0}
                    className="font-body rounded-lg border border-gray-200 bg-brand-card px-3 py-1.5 text-meta text-brand-text transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
                  >
                    {t("common.prev")}
                  </button>
                  <span className="font-body text-meta text-gray-500">
                    {paginaAtual + 1} / {totalPaginas}
                  </span>
                  <button
                    onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas - 1))}
                    disabled={paginaAtual >= totalPaginas - 1}
                    className="font-body rounded-lg border border-gray-200 bg-brand-card px-3 py-1.5 text-meta text-brand-text transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
                  >
                    {t("common.next")}
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {aberto && <ClienteDrawer codt={aberto.codt} onClose={() => setAberto(null)} />}
    </div>
  );
}

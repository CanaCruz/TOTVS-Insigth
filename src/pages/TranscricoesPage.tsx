import { useCallback, useMemo, useState } from "react";
import { getReunioes } from "@/data/repository";
import useDataset from "@/data/useDataset";
import type { Reuniao } from "@/data/types";
import { useLocale } from "@/i18n/useLocale";
import { capitalizar, formatarData, formatarDuracao, formatarFaixa, ouTraco } from "@/format";
import { SearchIcon, UploadIcon } from "@/icons";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/DataState";
import TranscricaoDrawer from "@/components/TranscricaoDrawer";

const POR_PAGINA = 25;

const COL_KEYS = [
  "id",
  "client",
  "date",
  "duration",
  "speakers",
  "unit",
  "segment",
  "uf",
  "size",
  "nps",
] as const;

/** Sentinelas estáveis dos filtros "todos" — só o rótulo é traduzido. */
const ALL_SEGMENTO = "__all__";
const ALL_UF = "__all__";

/** Opções de filtro montadas a partir dos valores que existem na base. */
function opcoesDe(reunioes: Reuniao[], campo: keyof Reuniao): string[] {
  const set = new Set<string>();
  for (const r of reunioes) {
    const v = r[campo];
    if (v !== null && v !== undefined && v !== "") set.add(String(v));
  }
  return [...set].sort();
}

function npsClass(nps: number) {
  if (nps >= 9) return "text-green-600";
  if (nps >= 7) return "text-gray-500";
  return "text-red-500";
}

export default function TranscricoesPage() {
  const { t } = useLocale();
  const [search, setSearch] = useState("");
  const [segmento, setSegmento] = useState(ALL_SEGMENTO);
  const [uf, setUf] = useState(ALL_UF);
  const [pagina, setPagina] = useState(0);
  const [aberta, setAberta] = useState<Reuniao | null>(null);

  const { data, loading, error, sugestao } = useDataset<Reuniao[]>(
    useCallback(() => getReunioes(), []),
  );

  const reunioes = data ?? [];

  const segmentos = useMemo(() => opcoesDe(reunioes, "segmento"), [reunioes]);
  const ufs = useMemo(() => opcoesDe(reunioes, "uf"), [reunioes]);

  const filtradas = useMemo(() => {
    const termo = search.trim().toLowerCase();
    return reunioes.filter(
      (r) =>
        (segmento === ALL_SEGMENTO || r.segmento === segmento) &&
        (uf === ALL_UF || r.uf === uf) &&
        (termo === "" ||
          r.codt.toLowerCase().includes(termo) ||
          r.id.includes(termo) ||
          (r.unidade ?? "").toLowerCase().includes(termo)),
    );
  }, [reunioes, search, segmento, uf]);

  const totalPaginas = Math.ceil(filtradas.length / POR_PAGINA);
  const paginaAtual = Math.min(pagina, Math.max(totalPaginas - 1, 0));
  const visiveis = filtradas.slice(paginaAtual * POR_PAGINA, (paginaAtual + 1) * POR_PAGINA);

  /** Qualquer mudança de filtro volta para a primeira página. */
  function aoFiltrar<T>(setter: (v: T) => void) {
    return (valor: T) => {
      setter(valor);
      setPagina(0);
    };
  }

  return (
    <div>
      <PageHeader title={t("transcripts.title")} subtitle={t("transcripts.subtitle")} />

      {loading && <LoadingState label={t("transcripts.loading")} />}
      {error && <ErrorState error={error} sugestao={sugestao} />}

      {data && (
        <>
          {/* Barra de ferramentas */}
          <div className="mb-5 flex flex-wrap gap-3">
            <div className="relative min-w-48 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
                <SearchIcon size={13} />
              </span>
              <input
                value={search}
                onChange={(e) => aoFiltrar(setSearch)(e.target.value)}
                placeholder={t("transcripts.searchPlaceholder")}
                aria-label={t("transcripts.searchAria")}
                className="font-body w-full rounded-lg border border-gray-200 bg-brand-card py-2 pr-3 pl-9 text-xs text-brand-text transition-colors outline-none focus:border-brand-blue"
              />
            </div>

            <select
              value={segmento}
              onChange={(e) => aoFiltrar(setSegmento)(e.target.value)}
              aria-label={t("transcripts.filterSegment")}
              className="font-body rounded-lg border border-gray-200 bg-brand-card px-3 py-2 text-xs text-brand-text outline-none"
            >
              <option value={ALL_SEGMENTO}>{t("common.allM")}</option>
              {segmentos.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={uf}
              onChange={(e) => aoFiltrar(setUf)(e.target.value)}
              aria-label={t("transcripts.filterState")}
              className="font-body rounded-lg border border-gray-200 bg-brand-card px-3 py-2 text-xs text-brand-text outline-none"
            >
              <option value={ALL_UF}>{t("common.allF")}</option>
              {ufs.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>

            <button className="font-heading flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-xs text-white transition-colors hover:bg-brand-blue-dark">
              <UploadIcon size={13} />
              {t("transcripts.upload")}
            </button>
          </div>

          {filtradas.length === 0 ? (
            <EmptyState
              titulo={t("transcripts.emptyTitle")}
              descricao={t("transcripts.emptyBody")}
            />
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
                            {t(`transcripts.col.${key}`)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visiveis.map((r, i) => (
                        <tr
                          key={r.id}
                          onClick={() => setAberta(r)}
                          className={`cursor-pointer border-b border-gray-50 transition-colors hover:bg-blue-50/40 ${
                            i % 2 === 0 ? "" : "bg-gray-50/40"
                          }`}
                        >
                          <td className="font-heading px-4 py-3 font-medium whitespace-nowrap text-brand-blue">
                            {r.id}
                          </td>
                          <td className="font-body px-4 py-3 whitespace-nowrap text-gray-600">
                            {r.codt}
                          </td>
                          <td className="font-body px-4 py-3 whitespace-nowrap text-gray-500">
                            {formatarData(r.data)}
                          </td>
                          <td className="font-body px-4 py-3 whitespace-nowrap text-gray-500">
                            {formatarDuracao(r.duracaoSegundos)}
                          </td>
                          <td className="font-body px-4 py-3 text-center text-gray-500">
                            {r.locutores}
                          </td>
                          <td className="font-body max-w-44 truncate px-4 py-3 text-gray-600">
                            {ouTraco(r.unidade)}
                          </td>
                          <td className="font-body px-4 py-3 whitespace-nowrap text-gray-500">
                            {capitalizar(r.segmento)}
                          </td>
                          <td className="font-body px-4 py-3 text-gray-500">{ouTraco(r.uf)}</td>
                          <td className="font-body px-4 py-3 whitespace-nowrap text-gray-500">
                            {formatarFaixa(r.faixaFaturamento)}
                          </td>
                          <td className="px-4 py-3">
                            {r.nps !== null ? (
                              <span
                                className={`font-body text-meta font-semibold ${npsClass(r.nps)}`}
                              >
                                {r.nps}
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

              {/* Paginação */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="font-body text-meta text-gray-500">
                  {t("transcripts.pagination", {
                    total: filtradas.length.toLocaleString("pt-BR"),
                    from: paginaAtual * POR_PAGINA + 1,
                    to: Math.min((paginaAtual + 1) * POR_PAGINA, filtradas.length),
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

      {aberta && <TranscricaoDrawer reuniao={aberta} onClose={() => setAberta(null)} />}
    </div>
  );
}

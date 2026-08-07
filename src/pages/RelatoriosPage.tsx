import { RELATORIOS } from "@/data/mockData";
import { useLocale } from "@/i18n/useLocale";
import { DownloadIcon } from "@/icons";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";

const RESUMO_KEYS = [
  { key: "totalGenerated", value: "5", icon: "📄" },
  { key: "thisMonth", value: "1", icon: "📅" },
  { key: "totalExported", value: "14.7 MB", icon: "💾" },
  { key: "pending", value: "1", icon: "⏳" },
] as const;

const COL_KEYS = ["name", "type", "generated", "size", "status", "action"] as const;

export default function RelatoriosPage() {
  const { t } = useLocale();

  return (
    <div>
      <PageHeader title={t("reports.title")} subtitle={t("reports.subtitle")} />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {RESUMO_KEYS.map((c) => (
          <Card key={c.key} className="flex items-center gap-3 p-5">
            <span className="text-2xl">{c.icon}</span>
            <div className="min-w-0">
              <p className="font-heading text-xl font-bold text-brand-text">{c.value}</p>
              <p className="font-body text-micro text-gray-500">{t(`reports.${c.key}`)}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-3">
          <p className="font-heading text-sm font-semibold text-brand-text">
            {t("reports.tableTitle")}
          </p>
          <button className="font-heading rounded-lg bg-brand-blue px-3 py-1.5 text-xs text-white transition-colors hover:bg-brand-blue-dark">
            {t("reports.generate")}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {COL_KEYS.map((key) => (
                  <th
                    key={key}
                    className="font-body px-4 py-3 text-left font-medium whitespace-nowrap text-gray-500"
                  >
                    {t(`reports.col.${key}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RELATORIOS.map((r, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-50 transition-colors hover:bg-blue-50/30"
                >
                  <td className="font-body px-4 py-3 font-medium text-brand-text">{r.nome}</td>
                  <td className="font-body px-4 py-3 whitespace-nowrap text-gray-500">{r.tipo}</td>
                  <td className="font-body px-4 py-3 whitespace-nowrap text-gray-500">
                    {r.gerado}
                  </td>
                  <td className="font-body px-4 py-3 whitespace-nowrap text-gray-500">
                    {r.tamanho}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3">
                    {r.status === "Concluído" && (
                      <button className="font-body flex items-center gap-1 text-micro text-brand-blue hover:underline">
                        <DownloadIcon size={11} />
                        {t("reports.download")}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

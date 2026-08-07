import { TriangleIcon } from "@/icons";
import { useLocale } from "@/i18n/useLocale";
import Card from "./Card";

export interface KpiCardProps {
  title: string;
  value: string;
  /** Variação percentual formatada, ex.: "+18%". Omita quando não houver base de comparação. */
  change?: string;
  positive?: boolean;
  /** Cor de fundo do círculo do ícone. */
  iconBg: string;
  /** Classe de cor do ícone, ex.: "text-brand-blue". */
  iconColor: string;
  icon: React.ReactNode;
  /** Texto auxiliar sob o valor, quando não há variação. */
  hint?: string;
}

export default function KpiCard({
  title,
  value,
  change,
  positive = true,
  iconBg,
  iconColor,
  icon,
  hint,
}: KpiCardProps) {
  const { t } = useLocale();

  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="font-heading text-xs leading-tight text-gray-500">{title}</p>
        <div
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${iconColor}`}
          style={{ background: iconBg }}
        >
          {icon}
        </div>
      </div>

      <p className="font-heading text-2xl leading-none font-bold text-brand-text">{value}</p>

      {change ? (
        <div className="flex flex-wrap items-center gap-1">
          <TriangleIcon className={positive ? "text-green-500" : "text-red-500"} />
          <span
            className={`font-heading text-xs font-semibold ${
              positive ? "text-green-600" : "text-red-500"
            }`}
          >
            {change}
          </span>
          <span className="font-body text-micro text-gray-400">{t("kpi.vsPrevious")}</span>
        </div>
      ) : (
        hint && <p className="font-body text-micro text-gray-400">{hint}</p>
      )}
    </Card>
  );
}

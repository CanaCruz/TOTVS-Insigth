import { useLocale } from "@/i18n/useLocale";

const STATUS_STYLES: Record<string, string> = {
  Analisado: "bg-green-100 text-green-700",
  "Em fila": "bg-yellow-100 text-yellow-700",
  Processando: "bg-blue-100 text-blue-700",
  Erro: "bg-red-100 text-red-600",
  Concluído: "bg-green-100 text-green-700",
  Pendente: "bg-gray-100 text-gray-600",
  Ativo: "bg-blue-100 text-blue-700",
};

export default function StatusBadge({ status }: { status: string }) {
  const { t } = useLocale();
  const label = t(`status.${status}`);
  return (
    <span
      className={`font-body inline-block rounded-full px-2 py-0.5 text-micro font-medium whitespace-nowrap ${
        STATUS_STYLES[status] ?? "bg-gray-100 text-gray-500"
      }`}
    >
      {label === `status.${status}` ? status : label}
    </span>
  );
}

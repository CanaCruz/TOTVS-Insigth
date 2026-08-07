import { AlertTriangleIcon } from "@/icons";
import { translate } from "@/i18n/translate";
import Card from "./Card";

/** Placeholder pulsante usado enquanto os dados carregam. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-200/70 ${className}`} />;
}

export function LoadingState({ label }: { label?: string }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 p-12">
      <span
        className="h-6 w-6 animate-spin rounded-full border-2 border-brand-blue/20 border-t-brand-blue"
        aria-hidden="true"
      />
      <p className="font-body text-xs text-gray-500">{label ?? translate("common.loading")}</p>
    </Card>
  );
}

export function ErrorState({ error, sugestao }: { error: string; sugestao?: string | null }) {
  return (
    <Card className="flex items-start gap-3 border-red-100 bg-red-50/40 p-6">
      <span className="mt-0.5 flex-shrink-0 text-red-500">
        <AlertTriangleIcon size={18} />
      </span>
      <div className="min-w-0">
        <p className="font-heading text-sm font-semibold text-red-700">
          {translate("errors.genericTitle")}
        </p>
        <p className="font-body mt-1 text-xs text-red-600">{error}</p>
        {sugestao && <p className="font-body mt-2 text-meta text-red-500/80">{sugestao}</p>}
      </div>
    </Card>
  );
}

/** Estado vazio neutro — nenhum dado a exibir, mas nada deu errado. */
export function EmptyState({ titulo, descricao }: { titulo: string; descricao?: string }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-1 p-12 text-center">
      <p className="font-heading text-sm font-semibold text-brand-text">{titulo}</p>
      {descricao && <p className="font-body max-w-md text-xs text-gray-500">{descricao}</p>}
    </Card>
  );
}

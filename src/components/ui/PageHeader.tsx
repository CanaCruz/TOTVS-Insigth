export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Conteúdo alinhado à direita do título (botões de ação, filtros…). */
  actions?: React.ReactNode;
}

/** Cabeçalho padrão de todas as páginas internas do dashboard. */
export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-heading text-xl font-bold text-brand-text">{title}</h1>
        {subtitle && <p className="font-body mt-1 text-xs text-gray-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

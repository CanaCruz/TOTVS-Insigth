export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Superfície branca padrão das páginas — mesma borda, raio e sombra em todo o app.
 *
 * Convenção de padding, para as páginas não divergirem:
 *   `p-5`  cards dentro de um grid (KPIs, blocos de configuração)
 *   `p-6`  cards únicos ocupando a largura toda (timeline, formulários)
 *   `p-12` estados de vazio, carregando e erro
 */
export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-xl border border-gray-100 bg-brand-card shadow-sm ${className}`}>
      {children}
    </div>
  );
}

/** Cabeçalho de um Card: título à esquerda, ação opcional à direita. */
export function CardHeader({
  title,
  action,
  className = "",
}: {
  title: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-4 flex items-center justify-between gap-3 ${className}`}>
      <h3 className="font-heading text-sm font-semibold text-brand-text">{title}</h3>
      {action}
    </div>
  );
}

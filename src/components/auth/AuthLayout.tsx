import { GRADIENT_BRAND, GRADIENT_PANEL } from "@/theme";
import TotvsLogo from "@/components/TotvsLogo";

/** Fundo em gradiente que ocupa a viewport nas telas de autenticação. */
export function GradientBg({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen w-full items-center justify-center p-4"
      style={{ background: GRADIENT_BRAND }}
    >
      {children}
    </div>
  );
}

/** Cartão branco central. `wide` ativa o layout de duas colunas. */
export function AuthCard({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div
      className={`flex overflow-hidden rounded-2xl bg-brand-card/90 shadow-2xl backdrop-blur-sm ${
        wide ? "w-[760px] max-w-[95vw]" : "w-[440px] max-w-[95vw]"
      }`}
    >
      {children}
    </div>
  );
}

/** Coluna escura da esquerda, com a logo e um texto de apoio. */
export function AuthLeftPanel({ subtitle }: { subtitle?: React.ReactNode }) {
  return (
    <div
      className="hidden min-w-[220px] flex-col items-center justify-center px-8 py-10 text-white sm:flex"
      style={{ background: GRADIENT_PANEL }}
    >
      <TotvsLogo className="mb-4 h-14 w-14" tone="light" />
      <p className="font-heading text-center text-base leading-tight">TOTVS Insight</p>
      {subtitle && (
        <p className="font-body mt-4 text-center text-xs leading-relaxed text-white/70">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/** Bloco de ícone circular + título usado no topo das telas secundárias. */
export function AuthHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-brand-blue">
        {icon}
      </div>
      <h2 className="font-heading text-center text-base font-semibold text-brand-text">{title}</h2>
    </div>
  );
}

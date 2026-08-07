import logoUrl from "@/assets/totvs-logo.png";

/*
 * PONTO ÚNICO DE TROCA DA LOGO
 * ────────────────────────────
 * Toda a aplicação (sidebar, telas de login, preloader) renderiza a logo por
 * aqui. Para trocar pelo arquivo oficial, basta substituir o import acima:
 *
 *     import logoUrl from "@/assets/totvs-logo.svg";
 *
 * O Vite resolve .svg e .png da mesma forma (retorna a URL do asset), então
 * nenhum outro arquivo precisa mudar.
 *
 * Arquivo local em `src/assets/totvs-logo.png` (não depende da Figma).
 */

export interface TotvsLogoProps {
  className?: string;
  /**
   * `light` pinta a marca de branco (para os fundos escuros do menu, do
   * preloader e do painel de login). `dark` mantém o azul-marinho original,
   * para uso sobre fundo claro.
   */
  tone?: "light" | "dark";
}

export default function TotvsLogo({ className = "h-8 w-8", tone = "light" }: TotvsLogoProps) {
  return (
    <img
      src={logoUrl}
      alt="TOTVS"
      className={`object-contain ${className}`}
      /*
       * O asset é monocromático azul-marinho sobre fundo transparente.
       * `brightness(0) invert(1)` o achata para branco puro sem tocar no
       * canal alpha — garante contraste sobre os gradientes escuros.
       */
      style={tone === "light" ? { filter: "brightness(0) invert(1)" } : undefined}
    />
  );
}

/** Logo + wordmark "TOTVS Insight", travados no mesmo alinhamento vertical. */
export function TotvsLogoLockup({
  className = "",
  logoClassName = "h-8 w-8",
  tone = "light",
}: TotvsLogoProps & { logoClassName?: string }) {
  return (
    <div className={`flex min-w-0 items-center gap-2.5 ${className}`}>
      <TotvsLogo className={`flex-shrink-0 ${logoClassName}`} tone={tone} />
      <span
        className={`font-heading truncate text-sm leading-tight ${
          tone === "light" ? "text-white" : "text-brand-text"
        }`}
      >
        TOTVS Insight
      </span>
    </div>
  );
}

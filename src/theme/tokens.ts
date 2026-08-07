/**
 * Tokens visuais compartilhados.
 *
 * Cores e fontes da marca vivem em `src/index.css` (bloco `@theme`), o que as
 * expõe como utilitários Tailwind: `font-heading`, `font-body`,
 * `bg-brand-blue`, `text-brand-text`, `bg-brand-card`, etc. Prefira esses
 * utilitários no JSX. O modo escuro remapeia os tokens em `html.dark`.
 *
 * Preferência claro/escuro: `ThemeContext.tsx` neste mesmo diretório.
 *
 * Este arquivo guarda apenas o que não vira utilitário — os gradientes.
 */

/** Gradiente principal: preloader, header e fundos de autenticação. */
export const GRADIENT_BRAND = "linear-gradient(117.79deg, #1A1B63 22.596%, #00A9E6 100%)";

/** Gradiente escuro vertical: sidebar e painel lateral das telas de login. */
export const GRADIENT_PANEL = "linear-gradient(181.19deg, #0C0C3A 42.068%, #003A8C 102.99%)";

/** Gradiente das barras de progresso da fila de processamento. */
export const GRADIENT_PROGRESS = "linear-gradient(90deg, #003A8C, #00A9E6)";

/** Largura da sidebar expandida, em px. Compartilhada com o botão flutuante. */
export const SIDEBAR_WIDTH = 224;

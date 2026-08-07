import { useState } from "react";
import { SIDEBAR_WIDTH } from "@/theme";
import type { NavId } from "@/navigation";
import { useLocale } from "@/i18n/useLocale";
import { ChevronLeftIcon } from "@/icons";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import PageRouter from "@/pages/PageRouter";

/** Metade da largura do botão — o que o faz montar sobre a borda da sidebar. */
const TOGGLE_OVERLAP = 12;

export default function DashboardScreen({ onLogout }: { onLogout: () => void }) {
  const { t } = useLocale();
  const [activeNav, setActiveNav] = useState<NavId>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const toggleLabel = collapsed ? t("sidebar.expand") : t("sidebar.collapse");

  const sidebarWidth = collapsed ? 0 : SIDEBAR_WIDTH;

  /*
   * Quando recolhido não há borda para montar, então o botão encosta na
   * lateral da janela em vez de sair da viewport (0 - 12 = -12px).
   */
  const toggleLeft = collapsed ? 8 : SIDEBAR_WIDTH - TOGGLE_OVERLAP;

  return (
    <div className="flex min-h-screen bg-brand-surface">
      <Sidebar active={activeNav} onNav={setActiveNav} onLogout={onLogout} collapsed={collapsed} />

      {/*
       * Botão único de recolher/expandir.
       *
       * Vive aqui, e não dentro da Sidebar, porque aquele contêiner usa
       * `overflow:hidden` para animar a largura — um filho posicionado fora
       * dos seus limites seria recortado. Como `fixed`, ele flutua sobre a
       * borda sem nunca cortar nem sobrepor o conteúdo.
       */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        title={toggleLabel}
        aria-label={toggleLabel}
        aria-expanded={!collapsed}
        className="fixed top-1/2 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-brand-blue text-white shadow-md transition-colors hover:bg-brand-dark"
        style={{
          left: toggleLeft,
          transform: "translateY(-50%)",
          transition: "left 0.3s ease, background-color 0.2s ease",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        >
          <ChevronLeftIcon size={10} />
        </span>
      </button>

      <div
        className="flex flex-1 flex-col"
        style={{
          marginLeft: sidebarWidth,
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header onLogout={onLogout} onNav={setActiveNav} />
        {/*
         * Shell único de conteúdo: todas as páginas herdam o mesmo respiro e o
         * mesmo teto de largura, para tabelas não esticarem em telas ultrawide.
         */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <PageRouter activeNav={activeNav} onNav={setActiveNav} />
          </div>
        </main>
      </div>
    </div>
  );
}

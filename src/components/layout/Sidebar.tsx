import { useState } from "react";
import { GRADIENT_PANEL, SIDEBAR_WIDTH } from "@/theme";
import type { NavId } from "@/navigation";
import { useLocale } from "@/i18n/useLocale";
import { TotvsLogoLockup } from "@/components/TotvsLogo";
import {
  BarChartIcon,
  ChatIcon,
  ClockIcon,
  CloseIcon,
  FileTextIcon,
  GridIcon,
  QueueIcon,
  SettingsIcon,
  UsersIcon,
} from "@/icons";

/** Duração da animação do logo ao voltar pro dashboard (ms). */
const LOGO_HOME_MS = 420;

const NAV_IDS: { id: NavId; key: string; icon: React.ReactNode }[] = [
  { id: "dashboard", key: "nav.dashboard", icon: <GridIcon /> },
  { id: "clientes", key: "nav.clients", icon: <UsersIcon /> },
  { id: "transcricoes", key: "nav.transcripts", icon: <FileTextIcon /> },
  { id: "fila", key: "nav.queue", icon: <QueueIcon /> },
  { id: "historico", key: "nav.history", icon: <ClockIcon /> },
  { id: "relatorios", key: "nav.reports", icon: <BarChartIcon /> },
  { id: "assistente", key: "nav.assistant", icon: <ChatIcon /> },
  { id: "configuracoes", key: "nav.settings", icon: <SettingsIcon /> },
];

export interface SidebarProps {
  active: NavId;
  onNav: (id: NavId) => void;
  onLogout: () => void;
  /**
   * Desktop (`dock`): anima a largura para 0 quando fechado.
   * Mobile (`drawer`): mantém a largura e desliza para fora da tela.
   */
  open: boolean;
  mode: "dock" | "drawer";
  /** Fecha o drawer (só mobile). */
  onClose?: () => void;
}

/**
 * Menu lateral.
 *
 * O botão de recolher do desktop NÃO vive aqui: o contêiner em modo `dock`
 * usa `overflow:hidden` para animar a largura. No mobile (`drawer`) o menu
 * sobe como overlay e o Header controla abertura/fechamento.
 */
export default function Sidebar({ active, onNav, onLogout, open, mode, onClose }: SidebarProps) {
  const { t } = useLocale();
  const isDrawer = mode === "drawer";
  const [logoBump, setLogoBump] = useState(false);

  function navigate(id: NavId) {
    onNav(id);
    if (isDrawer) onClose?.();
  }

  function irParaDashboard() {
    setLogoBump(true);
    window.setTimeout(() => setLogoBump(false), LOGO_HOME_MS);
    navigate("dashboard");
  }

  return (
    <aside
      className={`fixed top-0 left-0 flex h-screen flex-shrink-0 flex-col overflow-hidden ${
        isDrawer ? "z-40 shadow-2xl" : "z-20"
      }`}
      style={{
        width: SIDEBAR_WIDTH,
        background: GRADIENT_PANEL,
        ...(isDrawer
          ? {
              transform: open ? "translateX(0)" : "translateX(-100%)",
              transition: "transform 0.3s ease",
            }
          : {
              width: open ? SIDEBAR_WIDTH : 0,
              transition: "width 0.3s ease",
            }),
      }}
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-4">
        <button
          type="button"
          onClick={irParaDashboard}
          aria-label={t("nav.dashboard")}
          className={`logo-home-btn min-w-0 rounded-md text-left ${logoBump ? "logo-home-bump" : ""}`}
        >
          <TotvsLogoLockup logoClassName="h-8 w-8" tone="light" />
        </button>
        {isDrawer && (
          <button
            type="button"
            onClick={onClose}
            aria-label={t("header.closeMenu")}
            className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <CloseIcon size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {NAV_IDS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={`font-heading flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs leading-tight transition-colors ${
                isActive
                  ? "bg-brand-blue text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="truncate">{t(item.key)}</span>
            </button>
          );
        })}
      </nav>

      <div className="m-3 rounded-lg bg-brand-blue/80 p-3">
        <div className="mb-1.5 flex items-center gap-2">
          <div className="h-5 w-5 flex-shrink-0 rounded-full bg-gray-300/30" />
          <p className="font-heading text-meta font-medium text-white">
            {t("sidebar.assistantCard.title")}
          </p>
        </div>
        <p className="font-body mb-2.5 text-micro leading-relaxed text-white/60">
          {t("sidebar.assistantCard.body")}
        </p>
        <button
          onClick={() => navigate("assistente")}
          className="font-heading w-full rounded bg-brand-blue py-1.5 text-micro text-white transition-colors hover:bg-brand-blue-dark"
        >
          {t("sidebar.assistantCard.cta")}
        </button>
      </div>

      <button
        onClick={onLogout}
        className="font-body m-3 mt-0 text-left text-micro text-white/50 transition-colors hover:text-white/80"
      >
        {t("sidebar.logout")}
      </button>
    </aside>
  );
}

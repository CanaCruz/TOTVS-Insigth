import { GRADIENT_PANEL, SIDEBAR_WIDTH } from "@/theme";
import type { NavId } from "@/navigation";
import { useLocale } from "@/i18n/useLocale";
import { TotvsLogoLockup } from "@/components/TotvsLogo";
import {
  BarChartIcon,
  ChatIcon,
  ClockIcon,
  FileTextIcon,
  GridIcon,
  QueueIcon,
  SettingsIcon,
} from "@/icons";

const NAV_IDS: { id: NavId; key: string; icon: React.ReactNode }[] = [
  { id: "dashboard", key: "nav.dashboard", icon: <GridIcon /> },
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
  collapsed: boolean;
}

/**
 * Menu lateral fixo.
 *
 * O botão de recolher NÃO vive aqui: como este contêiner usa `overflow:hidden`
 * para animar a largura, qualquer filho posicionado fora dos seus limites seria
 * recortado. O botão é renderizado pelo `DashboardScreen`, flutuando por cima.
 */
export default function Sidebar({ active, onNav, onLogout, collapsed }: SidebarProps) {
  const { t } = useLocale();

  return (
    <aside
      className="fixed top-0 left-0 z-20 flex h-screen flex-shrink-0 flex-col overflow-hidden"
      style={{
        width: collapsed ? 0 : SIDEBAR_WIDTH,
        background: GRADIENT_PANEL,
        transition: "width 0.3s ease",
      }}
      aria-hidden={collapsed}
    >
      {/* Logo */}
      <div className="border-b border-white/10 px-4 py-4">
        <TotvsLogoLockup logoClassName="h-8 w-8" tone="light" />
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto py-3">
        {NAV_IDS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
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

      {/* Card do assistente */}
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
          onClick={() => onNav("assistente")}
          className="font-heading w-full rounded bg-brand-blue py-1.5 text-micro text-white transition-colors hover:bg-brand-blue-dark"
        >
          {t("sidebar.assistantCard.cta")}
        </button>
      </div>

      {/* Sair */}
      <button
        onClick={onLogout}
        className="font-body m-3 mt-0 text-left text-micro text-white/50 transition-colors hover:text-white/80"
      >
        {t("sidebar.logout")}
      </button>
    </aside>
  );
}

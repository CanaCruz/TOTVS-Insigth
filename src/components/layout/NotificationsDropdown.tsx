import { useCallback, useState } from "react";
import { GRADIENT_BRAND } from "@/theme";
import { NOTIFICACOES_INICIAIS, type Notificacao, type TipoNotificacao } from "@/data/notificacoes";
import { useLocale } from "@/i18n/useLocale";
import useClickOutside from "@/hooks/useClickOutside";
import {
  AlertTriangleIcon,
  BarChartIcon,
  BellIcon,
  CheckCircleIcon,
  TrendingUpIcon,
} from "@/icons";

/** Ícone e cor por tipo de evento. */
const ESTILO: Record<
  TipoNotificacao,
  {
    icon: React.ReactNode;
    bg: string;
    text: string;
  }
> = {
  churn: {
    icon: <AlertTriangleIcon size={13} />,
    bg: "bg-red-50",
    text: "text-red-600",
  },
  oportunidade: {
    icon: <TrendingUpIcon size={13} />,
    bg: "bg-green-50",
    text: "text-green-600",
  },
  analise: {
    icon: <CheckCircleIcon size={13} />,
    bg: "bg-blue-50",
    text: "text-brand-blue",
  },
  relatorio: {
    icon: <BarChartIcon size={13} />,
    bg: "bg-orange-50",
    text: "text-[#B33D0A]",
  },
};

export default function NotificationsDropdown() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(NOTIFICACOES_INICIAIS);

  const close = useCallback(() => setOpen(false), []);
  const ref = useClickOutside<HTMLDivElement>(open, close);

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  function marcarComoLida(id: string) {
    setNotificacoes((atual) => atual.map((n) => (n.id === id ? { ...n, lida: true } : n)));
  }

  function marcarTodasComoLidas() {
    setNotificacoes((atual) => atual.map((n) => ({ ...n, lida: true })));
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={
          naoLidas > 0 ? t("notifications.ariaUnread", { n: naoLidas }) : t("notifications.aria")
        }
        className="relative rounded-lg p-1 text-white transition-colors hover:bg-white/10"
      >
        <BellIcon size={20} />
        {naoLidas > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-micro font-bold text-white">
            {naoLidas}
          </span>
        )}
      </button>

      {/* Painel */}
      <div
        role="menu"
        className="absolute top-full right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-gray-100 bg-brand-card shadow-xl"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.97)",
          transition: "opacity 0.18s ease, transform 0.18s ease",
          pointerEvents: open ? "all" : "none",
        }}
      >
        {/* Cabeçalho */}
        <div
          className="flex items-center justify-between gap-3 px-4 py-3"
          style={{ background: GRADIENT_BRAND }}
        >
          <div>
            <p className="font-heading text-sm font-semibold text-white">
              {t("notifications.title")}
            </p>
            <p className="font-body text-micro text-white/70">
              {naoLidas === 0
                ? t("notifications.allClear")
                : naoLidas === 1
                  ? t("notifications.unreadOne")
                  : t("notifications.unreadMany", { n: naoLidas })}
            </p>
          </div>
          {naoLidas > 0 && (
            <button
              onClick={marcarTodasComoLidas}
              className="font-body rounded-lg bg-white/15 px-2.5 py-1 text-micro text-white transition-colors hover:bg-white/25"
            >
              {t("notifications.markAllRead")}
            </button>
          )}
        </div>

        {/* Lista */}
        <div className="max-h-96 overflow-y-auto">
          {notificacoes.length === 0 ? (
            <p className="font-body px-4 py-10 text-center text-xs text-gray-400">
              {t("notifications.empty")}
            </p>
          ) : (
            notificacoes.map((n) => {
              const estilo = ESTILO[n.tipo];
              return (
                <button
                  key={n.id}
                  role="menuitem"
                  onClick={() => marcarComoLida(n.id)}
                  className={`flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                    n.lida ? "" : "bg-blue-50/40"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${estilo.bg} ${estilo.text}`}
                  >
                    {estilo.icon}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <p
                        className={`font-heading flex-1 text-xs leading-tight ${
                          n.lida ? "font-medium text-gray-500" : "font-semibold text-brand-text"
                        }`}
                      >
                        {n.titulo}
                      </p>
                      {!n.lida && (
                        <span
                          className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-bright"
                          aria-label={t("notifications.unreadDot")}
                        />
                      )}
                    </div>
                    <p className="font-body mt-1 text-meta leading-relaxed text-gray-500">
                      {n.descricao}
                    </p>
                    <p className="font-body mt-1 text-micro text-gray-400">{n.tempo}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

import { GRADIENT_BRAND } from "@/theme";
import { useTheme } from "@/theme/ThemeContext";
import { useLocale } from "@/i18n/useLocale";
import type { NavId } from "@/navigation";
import { MenuIcon, MoonIcon, SunIcon } from "@/icons";
import NotificationsDropdown from "./NotificationsDropdown";
import UserDropdown from "./UserDropdown";

export interface HeaderProps {
  onLogout?: () => void;
  /** Repassado ao UserDropdown para "Meu perfil" e "Configurações". */
  onNav?: (id: NavId) => void;
  /** Abre o drawer da sidebar no mobile. */
  onMenuClick?: () => void;
  menuOpen?: boolean;
}

export default function Header({ onLogout, onNav, onMenuClick, menuOpen }: HeaderProps) {
  const { resolvido, alternar } = useTheme();
  const { t } = useLocale();
  const escuro = resolvido === "escuro";
  const themeTitle = escuro ? t("header.themeToLight") : t("header.themeToDark");
  const menuLabel = menuOpen ? t("header.closeMenu") : t("header.openMenu");

  return (
    <header
      className="sticky top-0 z-10 flex h-14 items-center gap-2 px-4 sm:gap-3 sm:px-6"
      style={{ background: GRADIENT_BRAND }}
    >
      {onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          title={menuLabel}
          aria-label={menuLabel}
          aria-expanded={menuOpen}
          className="rounded-lg p-1.5 text-white transition-colors hover:bg-white/10 md:hidden"
        >
          <MenuIcon size={20} />
        </button>
      )}

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={alternar}
          title={themeTitle}
          aria-label={themeTitle}
          className="rounded-lg p-1.5 text-white transition-colors hover:bg-white/10"
        >
          {escuro ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        </button>
        <NotificationsDropdown />
        <UserDropdown onLogout={onLogout} onNav={onNav} />
      </div>
    </header>
  );
}

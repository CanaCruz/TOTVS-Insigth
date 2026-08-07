import { GRADIENT_BRAND } from "@/theme";
import { useTheme } from "@/theme/ThemeContext";
import { useLocale } from "@/i18n/useLocale";
import type { NavId } from "@/navigation";
import { MoonIcon, SunIcon } from "@/icons";
import NotificationsDropdown from "./NotificationsDropdown";
import UserDropdown from "./UserDropdown";

export interface HeaderProps {
  onLogout?: () => void;
  /** Repassado ao UserDropdown para "Meu perfil" e "Configurações". */
  onNav?: (id: NavId) => void;
}

export default function Header({ onLogout, onNav }: HeaderProps) {
  const { resolvido, alternar } = useTheme();
  const { t } = useLocale();
  const escuro = resolvido === "escuro";
  const themeTitle = escuro ? t("header.themeToLight") : t("header.themeToDark");

  return (
    <header
      className="sticky top-0 z-10 flex h-14 items-center justify-end gap-3 px-6"
      style={{ background: GRADIENT_BRAND }}
    >
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
    </header>
  );
}

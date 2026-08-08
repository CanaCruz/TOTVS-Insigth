import type { NavId } from "@/navigation";
import AjudaPage from "./AjudaPage";
import AssistentePage from "./AssistentePage";
import ClientesPage from "./ClientesPage";
import ConfiguracoesPage from "./ConfiguracoesPage";
import DashboardContent from "./DashboardContent";
import FilaPage from "./FilaPage";
import HistoricoPage from "./HistoricoPage";
import PerfilPage from "./PerfilPage";
import RelatoriosPage from "./RelatoriosPage";
import TranscricoesPage from "./TranscricoesPage";

export default function PageRouter({
  activeNav,
  onNav,
}: {
  activeNav: NavId;
  onNav: (id: NavId) => void;
}) {
  switch (activeNav) {
    case "clientes":
      return <ClientesPage />;
    case "transcricoes":
      return <TranscricoesPage />;
    case "fila":
      return <FilaPage />;
    case "historico":
      return <HistoricoPage />;
    case "relatorios":
      return <RelatoriosPage />;
    case "assistente":
      return <AssistentePage />;
    case "configuracoes":
      return <ConfiguracoesPage onNav={onNav} />;
    case "perfil":
      return <PerfilPage />;
    case "ajuda":
      return <AjudaPage onNav={onNav} />;
    case "dashboard":
    default:
      return <DashboardContent />;
  }
}

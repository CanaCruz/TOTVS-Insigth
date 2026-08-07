import { useState } from "react";
import type { AuthScreen } from "@/navigation";
import { useAuth } from "@/auth/AuthContext";
import Preloader from "@/screens/Preloader";
import LoginScreen from "@/screens/LoginScreen";
import ForgotScreen from "@/screens/ForgotScreen";
import VerifyCodeScreen from "@/screens/VerifyCodeScreen";
import NewPasswordScreen from "@/screens/NewPasswordScreen";
import FirstAccessScreen from "@/screens/FirstAccessScreen";
import DashboardScreen from "@/screens/DashboardScreen";

export default function App() {
  const { autenticado, sair } = useAuth();
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState<AuthScreen>("login");

  if (!ready) return <Preloader onDone={() => setReady(true)} />;

  /*
   * O dashboard é alcançável apenas por `autenticado`, que só o `authService`
   * consegue tornar verdadeiro. Nenhuma tela navega para cá por conta própria.
   */
  if (autenticado) {
    return (
      <DashboardScreen
        onLogout={() => {
          sair();
          setScreen("login");
        }}
      />
    );
  }

  switch (screen) {
    case "forgot":
      return <ForgotScreen onNav={setScreen} />;
    case "verify-code":
      return <VerifyCodeScreen onNav={setScreen} />;
    case "new-password":
      return <NewPasswordScreen onNav={setScreen} />;
    case "first-access":
      return <FirstAccessScreen onNav={setScreen} />;
    case "login":
    default:
      return <LoginScreen onNav={setScreen} />;
  }
}

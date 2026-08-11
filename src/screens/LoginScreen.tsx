import { useState } from "react";
import type { AuthScreen } from "@/navigation";
import { useAuth } from "@/auth/AuthContext";
import { validarCredenciais } from "@/auth/authService";
import type { ErrosFormulario } from "@/auth/types";
import { useLocale } from "@/i18n/useLocale";
import { AlertTriangleIcon, EyeIcon } from "@/icons";
import { AuthCard, AuthLeftPanel, GradientBg } from "@/components/layout/AuthLayout";
import InputField from "@/components/ui/InputField";
import LinkBtn from "@/components/ui/LinkBtn";
import PrimaryBtn from "@/components/ui/PrimaryBtn";

export interface LoginScreenProps {
  onNav: (screen: AuthScreen) => void;
}

export default function LoginScreen({ onNav }: LoginScreenProps) {
  const { entrar } = useAuth();
  const { t } = useLocale();

  const [email, setEmail] = useState("rafael.almeida@totvs.com.br");
  const [senha, setSenha] = useState("Totvs@2026");
  const [showPass, setShowPass] = useState(false);

  const [erros, setErros] = useState<ErrosFormulario>({});
  const [erroLogin, setErroLogin] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function submeter(e?: React.FormEvent) {
    e?.preventDefault();
    if (carregando) return;

    setErroLogin(null);

    const errosCampos = validarCredenciais({ email, senha });
    setErros(errosCampos);
    if (Object.keys(errosCampos).length > 0) return;

    setCarregando(true);
    const erro = await entrar({ email, senha });
    setCarregando(false);

    /*
     * Em caso de sucesso não há navegação aqui: o `App` observa `autenticado`
     * e troca de tela sozinho. Assim existe uma única fonte de verdade sobre
     * quem tem acesso ao dashboard.
     */
    if (erro) {
      setErroLogin(erro);
      setSenha("");
    }
  }

  /** Limpa o erro do campo assim que o usuário volta a digitar nele. */
  function aoDigitar(campo: keyof ErrosFormulario, setter: (v: string) => void) {
    return (valor: string) => {
      setter(valor);
      if (erros[campo]) setErros((e) => ({ ...e, [campo]: undefined }));
      if (erroLogin) setErroLogin(null);
    };
  }

  return (
    <GradientBg>
      <AuthCard wide>
        <AuthLeftPanel subtitle={t("auth.restricted")} />

        <form onSubmit={submeter} className="flex flex-1 flex-col gap-5 p-5 sm:p-8">
          <div>
            <h2 className="font-heading mb-1 text-lg font-semibold text-brand-text">
              {t("auth.loginTitle")}
            </h2>
            <p className="font-body text-xs text-gray-500">{t("auth.loginSubtitle")}</p>
          </div>

          {/* Erro de credencial — some assim que o usuário corrige algo */}
          {erroLogin && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3"
            >
              <span className="mt-0.5 flex-shrink-0 text-red-500">
                <AlertTriangleIcon size={14} />
              </span>
              <p className="font-body text-xs leading-relaxed text-red-600">
                {t(`auth.errors.${erroLogin}`)}
              </p>
            </div>
          )}

          <InputField
            label={t("auth.email")}
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            value={email}
            onChange={aoDigitar("email", setEmail)}
            error={erros.email ? t(`auth.errors.${erros.email}`) : undefined}
            disabled={carregando}
            autoComplete="username"
          />
          <InputField
            label={t("auth.password")}
            type={showPass ? "text" : "password"}
            placeholder="••••••••••••"
            value={senha}
            onChange={aoDigitar("senha", setSenha)}
            error={erros.senha ? t(`auth.errors.${erros.senha}`) : undefined}
            disabled={carregando}
            autoComplete="current-password"
            icon={<EyeIcon open={showPass} />}
            onIconClick={() => setShowPass((v) => !v)}
          />

          <PrimaryBtn type="submit" loading={carregando}>
            {carregando ? t("auth.submitting") : t("auth.loginTitle")}
          </PrimaryBtn>

          <div className="text-center">
            <LinkBtn onClick={() => onNav("forgot")} disabled={carregando}>
              {t("auth.forgot")}
            </LinkBtn>
          </div>
          <div className="border-t pt-3 text-center">
            <LinkBtn onClick={() => onNav("first-access")} disabled={carregando}>
              {t("auth.firstAccessLink")}
            </LinkBtn>
          </div>
        </form>
      </AuthCard>
    </GradientBg>
  );
}

import { useState } from "react";
import type { AuthScreen } from "@/navigation";
import { useLocale } from "@/i18n/useLocale";
import { EyeIcon, LockIcon } from "@/icons";
import { AuthCard, AuthHeading, AuthLeftPanel, GradientBg } from "@/components/auth/AuthLayout";
import CheckItem from "@/components/ui/CheckItem";
import InputField from "@/components/ui/InputField";
import PrimaryBtn from "@/components/ui/PrimaryBtn";

/** Regras de força de senha, compartilhadas com a validação do formulário. */
export function passwordChecks(password: string) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    special: /[^a-zA-Z0-9]/.test(password) && /[0-9]/.test(password),
  };
}

export default function NewPasswordScreen({ onNav }: { onNav: (screen: AuthScreen) => void }) {
  const { t } = useLocale();
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const checks = passwordChecks(pass);

  return (
    <GradientBg>
      <AuthCard wide>
        <AuthLeftPanel subtitle={t("auth.newPassSubtitle")} />

        <div className="flex flex-1 flex-col gap-5 p-5 sm:p-8">
          <AuthHeading icon={<LockIcon size={26} />} title={t("auth.newPassTitle")} />

          <InputField
            label={t("auth.newPassField")}
            type={showPass ? "text" : "password"}
            placeholder="••••••••••••"
            value={pass}
            onChange={setPass}
            autoComplete="new-password"
            icon={<EyeIcon open={showPass} />}
            onIconClick={() => setShowPass((v) => !v)}
          />
          <InputField
            label={t("auth.newPassConfirm")}
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••••••"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            icon={<EyeIcon open={showConfirm} />}
            onIconClick={() => setShowConfirm((v) => !v)}
          />

          <div className="flex flex-col gap-2">
            <CheckItem label={t("auth.ruleMin")} ok={checks.length} />
            <CheckItem label={t("auth.ruleUpper")} ok={checks.upper} />
            <CheckItem label={t("auth.ruleSpecial")} ok={checks.special} />
          </div>

          <PrimaryBtn onClick={() => onNav("login")}>{t("auth.newPassSubmit")}</PrimaryBtn>
        </div>
      </AuthCard>
    </GradientBg>
  );
}

import { useState } from "react";
import type { AuthScreen } from "@/navigation";
import { useLocale } from "@/i18n/useLocale";
import { MailIcon } from "@/icons";
import { AuthCard, AuthHeading, AuthLeftPanel, GradientBg } from "@/components/auth/AuthLayout";
import InputField from "@/components/ui/InputField";
import InfoBox from "@/components/ui/InfoBox";
import LinkBtn from "@/components/ui/LinkBtn";
import PrimaryBtn from "@/components/ui/PrimaryBtn";

export default function ForgotScreen({ onNav }: { onNav: (screen: AuthScreen) => void }) {
  const { t } = useLocale();
  const [email, setEmail] = useState("");

  return (
    <GradientBg>
      <AuthCard wide>
        <AuthLeftPanel subtitle={t("auth.forgotSubtitle")} />

        <div className="flex flex-1 flex-col gap-5 p-8">
          <AuthHeading icon={<MailIcon size={28} />} title={t("auth.forgotTitle")} />

          <InputField
            label={t("auth.email")}
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            value={email}
            onChange={setEmail}
            autoComplete="username"
          />

          <InfoBox>{t("auth.forgotInfo")}</InfoBox>

          <PrimaryBtn onClick={() => onNav("verify-code")}>{t("auth.forgotSubmit")}</PrimaryBtn>

          <div className="text-center">
            <LinkBtn onClick={() => onNav("login")}>{t("auth.backToLogin")}</LinkBtn>
          </div>
        </div>
      </AuthCard>
    </GradientBg>
  );
}

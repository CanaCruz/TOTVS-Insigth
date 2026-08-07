import { useRef, useState } from "react";
import type { AuthScreen } from "@/navigation";
import { useLocale } from "@/i18n/useLocale";
import { ShieldCheckIcon } from "@/icons";
import { AuthCard, AuthHeading, AuthLeftPanel, GradientBg } from "@/components/auth/AuthLayout";
import LinkBtn from "@/components/ui/LinkBtn";
import PrimaryBtn from "@/components/ui/PrimaryBtn";

const CODE_LENGTH = 6;

export default function VerifyCodeScreen({ onNav }: { onNav: (screen: AuthScreen) => void }) {
  const { t } = useLocale();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));

  /*
   * Uma única ref guardando o array de inputs. A versão anterior chamava
   * `useRef` dentro de um `Array.from(...)`, o que viola as regras de hooks —
   * só não quebrava porque o tamanho era constante.
   */
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  function handleDigit(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  return (
    <GradientBg>
      <AuthCard wide>
        <AuthLeftPanel subtitle={t("auth.verifySubtitle")} />

        <div className="flex flex-1 flex-col gap-5 p-8">
          <AuthHeading icon={<ShieldCheckIcon size={28} />} title={t("auth.verifyTitle")} />

          <div className="flex justify-center gap-2">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                aria-label={t("auth.verifyDigit", { i: i + 1, n: CODE_LENGTH })}
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="font-heading h-12 w-11 rounded-lg border-2 border-gray-300 text-center text-lg font-bold text-brand-text transition-all outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              />
            ))}
          </div>

          <PrimaryBtn onClick={() => onNav("new-password")}>{t("auth.verifySubmit")}</PrimaryBtn>

          <div className="flex flex-col items-center gap-2">
            <LinkBtn>{t("auth.verifyResend")}</LinkBtn>
            <LinkBtn onClick={() => onNav("login")}>{t("auth.backToLogin")}</LinkBtn>
          </div>
        </div>
      </AuthCard>
    </GradientBg>
  );
}

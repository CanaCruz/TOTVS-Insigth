import { useState } from "react";
import type { NavId } from "@/navigation";
import { useLocale } from "@/i18n/useLocale";
import { ChatIcon, HelpIcon, MailIcon, ShieldCheckIcon } from "@/icons";
import Card, { CardHeader } from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";

const FAQ_IDS = ["login", "transcripts", "reports", "language", "dark"] as const;

export default function AjudaPage({ onNav }: { onNav?: (id: NavId) => void }) {
  const { t } = useLocale();
  const [aberto, setAberto] = useState<string | null>("login");

  return (
    <div>
      <PageHeader title={t("help.title")} subtitle={t("help.subtitle")} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card className="p-5">
            <CardHeader title={t("help.faqTitle")} />
            <div className="flex flex-col divide-y divide-gray-100">
              {FAQ_IDS.map((id) => {
                const expandido = aberto === id;
                return (
                  <div key={id}>
                    <button
                      type="button"
                      onClick={() => setAberto(expandido ? null : id)}
                      aria-expanded={expandido}
                      className="flex w-full items-center justify-between gap-3 py-3 text-left"
                    >
                      <span className="font-heading text-xs font-medium text-brand-text">
                        {t(`help.faq.${id}.q`)}
                      </span>
                      <span className="font-body flex-shrink-0 text-meta text-gray-400">
                        {expandido ? "−" : "+"}
                      </span>
                    </button>
                    {expandido && (
                      <p className="font-body pb-3 text-xs leading-relaxed text-gray-500">
                        {t(`help.faq.${id}.a`)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
              <ChatIcon size={16} />
            </div>
            <h3 className="font-heading text-sm font-semibold text-brand-text">
              {t("help.assistantTitle")}
            </h3>
            <p className="font-body mt-1 text-xs leading-relaxed text-gray-500">
              {t("help.assistantBody")}
            </p>
            <button
              type="button"
              onClick={() => onNav?.("assistente")}
              className="font-heading mt-4 w-full rounded-lg bg-brand-blue px-3 py-2 text-xs text-white transition-colors hover:bg-brand-blue-dark"
            >
              {t("help.assistantCta")}
            </button>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
              <MailIcon size={16} />
            </div>
            <h3 className="font-heading text-sm font-semibold text-brand-text">
              {t("help.contactTitle")}
            </h3>
            <p className="font-body mt-1 text-xs leading-relaxed text-gray-500">
              {t("help.contactBody")}
            </p>
            <a
              href="mailto:suporte.insight@totvs.com.br?subject=TOTVS%20Insight%20-%20Suporte"
              className="font-heading mt-4 inline-flex w-full items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-xs text-brand-blue transition-colors hover:bg-gray-50"
            >
              {t("help.contactCta")}
            </a>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
              <ShieldCheckIcon size={16} />
            </div>
            <h3 className="font-heading text-sm font-semibold text-brand-text">
              {t("help.securityTitle")}
            </h3>
            <p className="font-body mt-1 text-xs leading-relaxed text-gray-500">
              {t("help.securityBody")}
            </p>
          </Card>

          <div className="flex items-start gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <span className="mt-0.5 text-brand-blue">
              <HelpIcon size={14} />
            </span>
            <p className="font-body text-micro leading-relaxed text-gray-500">{t("help.tip")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

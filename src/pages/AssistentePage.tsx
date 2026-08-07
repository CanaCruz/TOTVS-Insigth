import { useEffect, useRef, useState } from "react";
import {
  RESPOSTAS_ASSISTENTE,
  SUGESTOES_ASSISTENTE,
  type SugestaoAssistente,
} from "@/data/mockData";
import { useAuth } from "@/auth/AuthContext";
import { useLocale } from "@/i18n/useLocale";
import { SendIcon } from "@/icons";
import PageHeader from "@/components/ui/PageHeader";

interface Msg {
  role: "user" | "bot";
  text: string;
}

/** Atraso simulado da resposta do bot, em ms. */
const REPLY_DELAY_MS = 800;

export default function AssistentePage() {
  const { usuario } = useAuth();
  const { t } = useLocale();
  const primeiroNome = usuario?.nome.split(" ")[0] ?? "";
  const iniciaisUsuario = usuario?.iniciais ?? "EU";

  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: t("assistant.greeting", {
        name: primeiroNome ? `, ${primeiroNome}` : "",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  function send(text?: string, sugestaoId?: SugestaoAssistente) {
    const msg = (text ?? input).trim();
    if (!msg) return;

    setInput("");
    setMsgs((prev) => [...prev, { role: "user", text: msg }]);

    setTimeout(() => {
      const reply = sugestaoId
        ? RESPOSTAS_ASSISTENTE[sugestaoId]
        : t("assistant.replyDefault");
      setMsgs((prev) => [...prev, { role: "bot", text: reply }]);
    }, REPLY_DELAY_MS);
  }

  function enviarSugestao(id: SugestaoAssistente) {
    send(t(`assistant.suggestion.${id}`), id);
  }

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col">
      <PageHeader title={t("assistant.title")} subtitle={t("assistant.subtitle")} />

      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-gray-100 bg-brand-card shadow-sm">
        {/* Mensagens */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className={`font-heading flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-micro font-bold ${
                  m.role === "bot" ? "bg-brand-blue text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {m.role === "bot" ? "AI" : iniciaisUsuario}
              </div>
              <div
                className={`font-body max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                  m.role === "bot"
                    ? "rounded-tl-none bg-gray-50 text-brand-text"
                    : "rounded-tr-none bg-brand-blue text-white"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Sugestões — só antes da primeira pergunta */}
        {msgs.length === 1 && (
          <div className="flex flex-wrap gap-2 px-5 pb-3">
            {SUGESTOES_ASSISTENTE.map((id) => (
              <button
                key={id}
                onClick={() => enviarSugestao(id)}
                className="font-body rounded-full border border-brand-blue/30 px-3 py-1 text-micro text-brand-blue transition-colors hover:bg-brand-blue hover:text-white"
              >
                {t(`assistant.suggestion.${id}`)}
              </button>
            ))}
          </div>
        )}

        {/* Entrada */}
        <div className="flex gap-2 border-t border-gray-100 p-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={t("assistant.placeholder")}
            aria-label={t("assistant.inputAria")}
            className="font-body flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs text-brand-text transition-colors outline-none focus:border-brand-blue"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim()}
            aria-label={t("assistant.sendAria")}
            className="rounded-lg bg-brand-blue px-4 py-2 text-white transition-colors hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SendIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Notificações de exemplo.
 *
 * Não há origem real: `ANON_transcricao.json` não registra eventos. Quando
 * houver backend, troque `NOTIFICACOES_INICIAIS` por um fetch — o formato do
 * tipo `Notificacao` é o contrato a manter.
 */

export type TipoNotificacao = "churn" | "oportunidade" | "analise" | "relatorio";

export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  titulo: string;
  descricao: string;
  /** Tempo relativo já formatado, ex.: "há 12 min". */
  tempo: string;
  lida: boolean;
}

export const NOTIFICACOES_INICIAIS: Notificacao[] = [
  {
    id: "n-1",
    tipo: "churn",
    titulo: "Risco de churn detectado",
    descricao:
      "Cliente TFEEI4 acumula 3 reuniões seguidas com NPS abaixo de 6. Recomendado contato proativo.",
    tempo: "há 12 min",
    lida: false,
  },
  {
    id: "n-2",
    tipo: "oportunidade",
    titulo: "Nova oportunidade identificada",
    descricao:
      "Menções recorrentes a expansão de licenças nas últimas 4 reuniões da TOTVS Rio Grande do Sul.",
    tempo: "há 1 h",
    lida: false,
  },
  {
    id: "n-3",
    tipo: "analise",
    titulo: "Análise concluída",
    descricao: "Reunião 1397068 processada — 70.847 caracteres e 41 rótulos de locutor.",
    tempo: "há 3 h",
    lida: false,
  },
  {
    id: "n-4",
    tipo: "relatorio",
    titulo: "Relatório pronto para download",
    descricao: "Relatório mensal de abril/2026 foi gerado e está disponível em Relatórios.",
    tempo: "ontem",
    lida: true,
  },
  {
    id: "n-5",
    tipo: "analise",
    titulo: "Lote processado",
    descricao: "433 reuniões de março/2026 foram indexadas com sucesso na base.",
    tempo: "há 2 dias",
    lida: true,
  },
];

/**
 * Tipos da base de reuniões.
 *
 * Inferidos das colunas de `ANON_transcricao.json`. Campos anuláveis são os que
 * a origem omite quando vazios — a cobertura real está anotada em cada um.
 */

/** Uma reunião, sem o texto da transcrição. */
export interface Reuniao {
  /** `ID_MEETING`. Único no índice: ids repetidos na origem foram deduplicados. */
  id: string;
  /** `DT_MEETING`, no formato "AAAA-MM-DD HH:MM:SS". */
  data: string;
  /** `DT_CRIACAO` — sempre anterior a `data`. */
  dataCriacao: string;
  /** `FORMATO_MEETING`: "VIDEO" ou "LINK". */
  formato: string;
  /** `STATUS_MEETING`. Na base atual é sempre "COMPLETED". */
  status: string;
  /** `ID_STATUS_MEETING`. */
  statusId: string;
  /** `DURACAO_MEETING` cru, em "HH:MM:SS". */
  duracao: string;
  /** `DURACAO_MEETING` convertida para segundos. */
  duracaoSegundos: number;
  /** `CODT` — código anonimizado do cliente. É o identificador de cliente disponível. */
  codt: string;
  /** `FLG_EXTERNO`. */
  externo: boolean;

  /** `TP_RECURSO`: "customer" ou "lead". Presente em ~20% dos registros. */
  tipoRecurso: string | null;
  /** `UF`. Presente em ~64%. */
  uf: string | null;
  /** `CNAE`. Presente em ~64%. */
  cnae: string | null;
  /** `NOME_UNIDADE` — a unidade TOTVS, não o nome do cliente. Presente em ~64%. */
  unidade: string | null;
  /** `NOME_SEGMENTO`. Presente em ~64%. */
  segmento: string | null;
  /** `FAIXA_FATURAMENTO_CLIENTE_EC`. Presente em ~64%. */
  faixaFaturamento: string | null;
  /** `NOTA_NPS`, de 0 a 10. Presente em apenas ~26%. */
  nps: number | null;
  /** `DT_ULTIMA_PESQUISA`. Presente em ~26%. */
  dataUltimaPesquisa: string | null;

  /**
   * Derivado: quantidade de rótulos `[LOCUTOR N]` distintos na transcrição.
   *
   * NÃO é a contagem de participantes. A diarização da origem super-segmenta —
   * uma conversa entre duas pessoas pode gerar dezenas de rótulos. Trate como
   * limite superior / indicador de fragmentação, nunca como número de pessoas.
   */
  locutores: number;
  /** Derivado: tamanho da transcrição em caracteres. */
  tamanhoTranscricao: number;
}

/** Estrutura do arquivo `public/data/meetings-index.json`. */
export interface IndiceReunioes {
  gerarEm: string;
  origem: string;
  total: number;
  /**
   * `false` quando o índice foi gerado com `--sem-transcricoes`, ou seja, os
   * textos não foram publicados. A UI usa isto para explicar a ausência em vez
   * de tentar buscar arquivos que não existem.
   */
  transcricoesDisponiveis?: boolean;
  reunioes: Reuniao[];
}

/** Texto completo de uma reunião, carregado sob demanda. */
export interface TranscricaoCompleta {
  id: string;
  texto: string;
}

/** Indicador exibido nos cards do topo do dashboard. */
export interface Kpi {
  id: string;
  titulo: string;
  valor: string;
  /** Texto auxiliar. Usado no lugar da variação, que a base não permite calcular. */
  detalhe: string;
}

/** Uma fatia de uma distribuição (por segmento, UF, formato…). */
export interface Fatia {
  rotulo: string;
  quantidade: number;
  /** Percentual sobre o total da distribuição, de 0 a 100. */
  percentual: number;
}

/** Recorte de NPS no padrão promotores / neutros / detratores. */
export interface ResumoNps {
  /** Registros que têm nota — bem menor que o total de reuniões. */
  respondentes: number;
  media: number | null;
  promotores: number;
  neutros: number;
  detratores: number;
  /** Promotores% − detratores%, de -100 a 100. Nulo sem respondentes. */
  score: number | null;
}

/**
 * Um cliente, agregado a partir das reuniões que compartilham o mesmo `CODT`.
 *
 * Não existe cadastro de clientes na origem — o `CODT` é o único identificador,
 * e tudo aqui é derivado das reuniões dele.
 */
export interface Cliente {
  /** `CODT` — código anonimizado. É o nome que temos. */
  codt: string;
  reunioes: number;
  segundosTotais: number;
  /** Da mais antiga para a mais recente. */
  primeiraReuniao: string;
  ultimaReuniao: string;
  /** Campos do cliente, tirados da reunião mais recente que os informa. */
  unidade: string | null;
  segmento: string | null;
  uf: string | null;
  faixaFaturamento: string | null;
  /** NPS: presente em ~26% das reuniões, então pode ser nulo mesmo com histórico. */
  npsUltimo: number | null;
  npsMedia: number | null;
  /** Quantas reuniões dele têm nota. */
  npsRespostas: number;
}

/** Cliente com a lista completa de reuniões, para a tela de detalhe. */
export interface DetalheCliente {
  cliente: Cliente;
  /** Da mais recente para a mais antiga. */
  reunioes: Reuniao[];
}

/** Erro de carga com mensagem pronta para exibição. */
export class DadosIndisponiveisError extends Error {
  constructor(
    message: string,
    /** Sugestão de ação para quem está vendo a tela. */
    readonly sugestao: string,
  ) {
    super(message);
    this.name = "DadosIndisponiveisError";
  }
}

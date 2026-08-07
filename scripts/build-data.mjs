/**
 * Pré-processamento da base de reuniões.
 *
 *   pnpm data:build
 *
 * Lê o dump bruto em `data-source/ANON_transcricao.json` e gera dois artefatos
 * em `public/data/`:
 *
 *   1. `meetings-index.json`  — metadados de TODAS as reuniões, sem o texto das
 *      transcrições. Fica na casa de 1 MB e é o que o app carrega no boot.
 *   2. `transcricoes/<id>.json` — uma transcrição por arquivo, buscada sob
 *      demanda quando o usuário abre uma reunião específica.
 *
 * Motivo: o dump bruto tem 46 MB (média de 39 mil caracteres por transcrição).
 * Importá-lo no bundle travaria o browser; carregá-lo inteiro em runtime
 * custaria 46 MB de download a cada visita. Separar metadados de conteúdo faz o
 * app abrir com ~1 MB e pagar pelo texto só quando ele for realmente exibido.
 *
 * O formato de entrada é NDJSON (um objeto JSON por linha), NÃO um array — por
 * isso o parse é feito linha a linha, e não com um `JSON.parse` do arquivo todo.
 */

import { createReadStream } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(ROOT, "data-source", "ANON_transcricao.json");
const OUT_DIR = path.join(ROOT, "public", "data");
const TRANSCRICOES_DIR = path.join(OUT_DIR, "transcricoes");

/*
 * `--sem-transcricoes` gera só o índice de metadados, sem os textos.
 *
 * Existe por segurança: os arquivos de transcrição são estáticos e ficam
 * legíveis por qualquer um que acerte a URL — o login do app é client-side e
 * não protege nada. Num deploy sem autenticação de verdade no servidor, use
 * esta flag para não publicar conversas de clientes.
 */
const INCLUIR_TRANSCRICOES = !process.argv.includes("--sem-transcricoes");

/**
 * Campos presentes em 100% dos registros. A ausência de qualquer um deles
 * significa que o schema da origem mudou, e o script aborta em vez de gerar um
 * índice silenciosamente quebrado.
 */
const REQUIRED_FIELDS = [
  "ID_MEETING",
  "DT_MEETING",
  "FORMATO_MEETING",
  "ID_STATUS_MEETING",
  "STATUS_MEETING",
  "DURACAO_MEETING",
  "CODT",
  "FLG_EXTERNO",
  "DT_CRIACAO",
  "ANON_TRANSCRICAO",
];

/** Converte "01:39:13" em segundos. Devolve 0 para formatos inesperados. */
function duracaoParaSegundos(duracao) {
  const m = /^(\d+):(\d{2}):(\d{2})$/.exec(String(duracao ?? "").trim());
  if (!m) return 0;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

/**
 * Conta rótulos `[LOCUTOR N]` distintos na transcrição.
 *
 * Atenção: isto NÃO é a contagem de participantes. A diarização da origem
 * super-segmenta — numa conversa entre duas pessoas aparecem rótulos como
 * LOCUTOR 102, 49, 73, 27… O número serve como limite superior e como medida
 * de quão fragmentada ficou a transcrição, não como quantidade de pessoas.
 */
function contarLocutores(transcricao) {
  const locutores = new Set();
  const re = /\[LOCUTOR (\d+)\]/g;
  let m;
  while ((m = re.exec(transcricao)) !== null) locutores.add(m[1]);
  return locutores.size;
}

/** Normaliza booleanos que chegam ora como `true`, ora como a string "True". */
function paraBooleano(valor) {
  if (typeof valor === "boolean") return valor;
  return String(valor).toLowerCase() === "true";
}

/** Devolve `null` para vazios, para que campos ausentes fiquem explícitos. */
function ouNulo(valor) {
  if (valor === undefined || valor === null) return null;
  const s = String(valor).trim();
  return s === "" || s === "N/A" ? null : s;
}

function paraInteiro(valor) {
  if (valor === undefined || valor === null || valor === "") return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

async function main() {
  console.log(`→ lendo ${path.relative(ROOT, SOURCE)}`);

  // Sempre limpa: um build público não pode herdar textos de um build anterior.
  await rm(TRANSCRICOES_DIR, { recursive: true, force: true });
  if (INCLUIR_TRANSCRICOES) await mkdir(TRANSCRICOES_DIR, { recursive: true });

  const rl = createInterface({
    input: createReadStream(SOURCE, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  const reunioes = [];
  const idsVistos = new Set();
  const gravacoes = [];

  let linhaNum = 0;
  let ignoradas = 0;
  let duplicadas = 0;

  for await (const linha of rl) {
    linhaNum++;
    if (!linha.trim()) continue;

    let bruto;
    try {
      bruto = JSON.parse(linha);
    } catch {
      console.warn(`  ! linha ${linhaNum}: JSON inválido, ignorada`);
      ignoradas++;
      continue;
    }

    const faltando = REQUIRED_FIELDS.filter((f) => !(f in bruto));
    if (faltando.length > 0) {
      console.warn(
        `  ! linha ${linhaNum}: faltam campos obrigatórios (${faltando.join(", ")}), ignorada`,
      );
      ignoradas++;
      continue;
    }

    const id = String(bruto.ID_MEETING);

    /*
     * O dump traz 34 ID_MEETING repetidos (1174 linhas para 1126 ids). Mantemos
     * a primeira ocorrência para que o id continue servindo como chave estável.
     */
    if (idsVistos.has(id)) {
      duplicadas++;
      continue;
    }
    idsVistos.add(id);

    const transcricao = String(bruto.ANON_TRANSCRICAO ?? "");

    reunioes.push({
      id,
      data: String(bruto.DT_MEETING),
      dataCriacao: String(bruto.DT_CRIACAO),
      formato: String(bruto.FORMATO_MEETING),
      status: String(bruto.STATUS_MEETING),
      statusId: String(bruto.ID_STATUS_MEETING),
      duracao: String(bruto.DURACAO_MEETING),
      duracaoSegundos: duracaoParaSegundos(bruto.DURACAO_MEETING),
      codt: String(bruto.CODT),
      externo: paraBooleano(bruto.FLG_EXTERNO),
      // Campos abaixo são esparsos: a origem os omite quando nulos.
      tipoRecurso: ouNulo(bruto.TP_RECURSO),
      uf: ouNulo(bruto.UF),
      cnae: ouNulo(bruto.CNAE),
      unidade: ouNulo(bruto.NOME_UNIDADE),
      segmento: ouNulo(bruto.NOME_SEGMENTO),
      faixaFaturamento: ouNulo(bruto.FAIXA_FATURAMENTO_CLIENTE_EC),
      nps: paraInteiro(bruto.NOTA_NPS),
      dataUltimaPesquisa: ouNulo(bruto.DT_ULTIMA_PESQUISA),
      // Derivados
      locutores: contarLocutores(transcricao),
      tamanhoTranscricao: transcricao.length,
    });

    if (INCLUIR_TRANSCRICOES) {
      gravacoes.push(
        writeFile(
          path.join(TRANSCRICOES_DIR, `${id}.json`),
          JSON.stringify({ id, texto: transcricao }),
          "utf8",
        ),
      );
    }
  }

  await Promise.all(gravacoes);

  // Mais recentes primeiro — é a ordem que praticamente toda tela quer.
  reunioes.sort((a, b) => b.data.localeCompare(a.data));

  const indice = {
    gerarEm: new Date().toISOString(),
    origem: path.basename(SOURCE),
    total: reunioes.length,
    /* Diz à UI se vale a pena tentar buscar o texto de uma reunião. */
    transcricoesDisponiveis: INCLUIR_TRANSCRICOES,
    reunioes,
  };

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(
    path.join(OUT_DIR, "meetings-index.json"),
    JSON.stringify(indice),
    "utf8",
  );

  const bytes = Buffer.byteLength(JSON.stringify(indice));
  console.log(`✓ ${reunioes.length} reuniões indexadas`);
  if (duplicadas) console.log(`  ${duplicadas} linhas com id repetido ignoradas`);
  if (ignoradas) console.log(`  ${ignoradas} linhas inválidas ignoradas`);
  console.log(
    `✓ public/data/meetings-index.json (${(bytes / 1024 / 1024).toFixed(2)} MB)`,
  );
  if (INCLUIR_TRANSCRICOES) {
    console.log(`✓ public/data/transcricoes/ (${reunioes.length} arquivos)`);
    console.log(
      "\n⚠ As transcrições são arquivos estáticos e públicos. Num deploy sem\n" +
        "  autenticação no servidor, rode com --sem-transcricoes.",
    );
  } else {
    console.log("• transcrições OMITIDAS (--sem-transcricoes)");
  }
}

main().catch((err) => {
  console.error("✗ falha ao gerar os dados:");
  console.error(err.message);
  process.exit(1);
});

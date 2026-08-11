# TOTVS Insight

Dashboard de análise de transcrições de reuniões comerciais. Lê um dump de
reuniões já anonimizadas e apresenta indicadores, distribuições, histórico por
cliente e o texto de cada conversa.

A base atual cobre **1.126 reuniões** de novembro/2025 a abril/2026 — 913 horas
de conversa, 484 clientes, duração média de 49 minutos.

## Stack

React 19, TypeScript, Vite 8 e Tailwind CSS v4. Sem biblioteca de componentes,
sem biblioteca de gráficos (as barras são CSS) e sem gerenciador de estado
global — os ícones são SVG do próprio projeto, em `src/icons/`.

Node 22 e pnpm 10.34.3, fixados no `.mise.toml`.

## Rodando

```bash
pnpm install
pnpm data:build
pnpm dev
```

O `pnpm data:build` é obrigatório na primeira vez: sem ele o app abre no estado
de erro "base não encontrada". O servidor sobe em <http://localhost:8443>.

### Scripts

| Comando | O que faz |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm data:build` | Gera `public/data/` — índice **e** transcrições |
| `pnpm data:build:publico` | Gera **só** o índice, sem os textos |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm build` | Build de produção em `dist/` |
| `pnpm build:pages` | Build com base relativa, para o GitHub Pages |
| `pnpm format` | Formata `src/` com oxfmt |

## Camada de dados

A origem é `data-source/ANON_transcricao.json`: 46 MB em **NDJSON** — um objeto
JSON por linha, **não um array**. Um `JSON.parse` do arquivo inteiro falha; o
parse tem que ser linha a linha.

O `scripts/build-data.mjs` quebra esse dump em dois artefatos dentro de
`public/data/`:

- **`meetings-index.json`** (~470 KB) — metadados de todas as reuniões, buscado
  uma única vez no boot
- **`transcricoes/<id>.json`** (~44 MB no total) — um arquivo por transcrição,
  buscado só quando alguém abre a reunião

A separação existe porque carregar os 46 MB de uma vez custaria esse download a
cada visita. Assim o app abre com menos de 1 MB e paga pelo texto só quando ele
vai realmente aparecer na tela.

### Particularidades da base

O schema é **esparso**: campos nulos são omitidos do registro em vez de virem
vazios. `UF`, `CNAE`, `unidade` e `segmento` aparecem em 63% das reuniões, faixa
de faturamento em 58% e **NPS em apenas 28%**. Qualquer agregação precisa tratar
ausência, não assumir preenchimento.

O dump tem 1.174 linhas para 1.126 reuniões — 48 `ID_MEETING` repetidos. O
script mantém a primeira ocorrência de cada id.

Duas colunas enganam:

- **`CODT` é o cliente** (anonimizado, no formato `TFEEI4`). O `NOME_UNIDADE` é
  a unidade da TOTVS que atendeu, não o nome do cliente.
- **`locutores` não é o número de participantes.** É a contagem de rótulos
  `[LOCUTOR N]` distintos, e a diarização da origem super-segmenta: uma conversa
  entre duas pessoas pode gerar quarenta rótulos. Serve como medida de
  fragmentação da transcrição, não de quantas pessoas estavam na call.

### Ponto único de acesso

**Todo acesso a dados passa por `src/data/repository.ts`.** Nenhum componente
faz fetch nem conhece o formato da origem. Para trocar os arquivos estáticos por
uma API, basta reescrever `carregarIndice()` e `getTranscricao()` — as funções
exportadas e os tipos continuam iguais.

Nas telas, os loaders são consumidos por `useDataset()`, que devolve
`{ data, loading, error }`.

## Dados reais e dados de exemplo

Vem da base: os indicadores do dashboard, o volume mensal, as distribuições por
segmento/estado/unidade, a tabela de transcrições, a página de clientes e a fila
de processamento (vazia, porque a base está 100% `COMPLETED`).

É exemplo: as onze abas de insight do dashboard (oportunidades, churn,
sentimento, concorrentes…), as notificações, o histórico, os relatórios e as
respostas do assistente. Todos vivem em `src/data/mockData.ts`, que documenta o
porquê de cada um — nenhum deles tem coluna correspondente na origem, e derivá-los
exigiria análise de linguagem sobre as transcrições.

A aba "Visão Geral" é a única do dashboard que sai da base de verdade.

As abas de exemplo exibem o selo **"Dados ilustrativos"**. Se for mexer nelas,
mantenha o selo: sem ele os números inventados ficam indistinguíveis dos reais.

## Estrutura

```
src/
├── screens/      Telas de página inteira (preloader, autenticação, dashboard)
├── pages/        Páginas internas do dashboard + PageRouter
├── components/
│   ├── ui/       Primitivos (Card, KpiCard, StatusBadge, InputField…)
│   └── layout/   Sidebar, Header, dropdowns, AuthLayout
├── data/         Repositório, tipos, useDataset, dados de exemplo
├── auth/         Contexto e serviço de autenticação
├── i18n/         Dicionários pt-BR / en-US / es e o provider
├── theme/        Tokens, gradientes e modo claro/escuro
├── icons/        Ícones SVG em currentColor
└── assets/       Logo e fontes
```

O `index.css` concentra os `@font-face`, o import do Tailwind e o bloco
`@theme` com as cores da marca e a escala tipográfica. O modo escuro é feito
redefinindo tokens sob `html.dark`, não com utilitários `dark:`.

## Internacionalização

Três idiomas — português, inglês e espanhol — com as mesmas chaves nos três
dicionários, em `src/i18n/locales/`. Texto novo entra nos três de uma vez.

Formatação de número e data usa sempre o locale ativo (`getActiveLocale()`),
nunca um locale fixo.

## Autenticação

**O login não protege nada.** Ele valida no navegador, e os dados são arquivos
estáticos servidos junto com o app. Qualquer pessoa com a URL lê o conteúdo sem
nunca passar pela tela de login:

```bash
curl https://seu-dominio/data/transcricoes/1397068.json
```

As contas de demonstração estão em `src/auth/authService.ts` e vêm
pré-preenchidas na tela de login. **Troque as duas coisas antes de qualquer uso
real.**

Para autenticação de verdade, os dois pontos de troca já estão isolados:
`login()` em `src/auth/authService.ts` e `getTranscricao()` em
`src/data/repository.ts`.

## Deploy

O `.github/workflows/pages.yml` publica no GitHub Pages a cada push na `main`.
Os detalhes e as restrições estão no [DEPLOY.md](DEPLOY.md) — **leia antes de
publicar em qualquer lugar.**

Em resumo: só publique com `pnpm data:build:publico`, que gera o índice sem os
textos. As transcrições são conversas reais de clientes; anonimizadas nos nomes,
mas com o teor comercial intacto (preços, contratos, insatisfações).

## Armadilhas conhecidas

Três coisas que já custaram tempo neste projeto:

**O `pnpm build` não checa tipos.** O esbuild remove as anotações sem validá-las,
então o build passa em código que o `tsc` rejeitaria. Valide sempre com
`pnpm typecheck` — não confie no build sozinho.

**Binários estão em Git LFS.** O `.gitattributes` põe `*.png`, `*.ttf` e
`*.woff2` no LFS, então o que está versionado é um ponteiro de 130 bytes. Um
checkout sem LFS produz um site sem logo e sem as fontes da marca — e **sem erro
nenhum**, porque o servidor devolve HTTP 200 com o `content-type` correto. O
workflow usa `lfs: true` e tem um passo que aborta o build se algum ponteiro
escapar.

**O oxfmt 0.2.0 corrompia sintaxe de tipos.** Removia o `;` separador dentro de
type literals e os parênteses de `(keyof X)[]`, que virava `keyof X[]` — um tipo
diferente que ainda compila. O `pnpm build` reportava sucesso o tempo todo. A
versão está fixada em 0.62.0, onde os dois bugs não existem.

## Pendências

- Botões sem ação: "Gerar novo" e "Baixar" em Relatórios, "Alterar senha" e
  "2FA" em Configurações
- Sem persistência: perfil, configurações e notificações voltam ao estado
  original ao recarregar a página
- Credenciais pré-preenchidas na tela de login

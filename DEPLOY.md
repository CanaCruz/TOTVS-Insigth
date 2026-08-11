# Deploy

## Antes de tudo: o login não protege nada

O `login()` roda no browser. Os dados são arquivos estáticos servidos junto com
o app, então **qualquer pessoa com a URL lê os dados sem nunca ver a tela de
login**:

```bash
curl https://seu-dominio/data/transcricoes/1397068.json
```

Isso devolve a conversa inteira. As transcrições são reuniões reais de clientes
(anonimizadas em `[PESSOA]`, `[EMPRESA]`, `[LOCAL]`, `[TELEFONE]`, mas o teor
comercial está lá: preços, contratos, insatisfações).

Enquanto não existir autenticação validada no servidor, **publique sem os
textos**. É o que `pnpm data:build:publico` faz.

## O que subir

| Comando                   | Gera                                               | Publicar?                   |
| ------------------------- | -------------------------------------------------- | --------------------------- |
| `pnpm data:build`         | Índice (471 KB) **+ 1.126 transcrições (43,7 MB)** | Só local, ou atrás de senha |
| `pnpm data:build:publico` | Só o índice (471 KB)                               | Sim                         |

Com o build público, o app funciona inteiro — dashboard, KPIs, tabela, filtros,
paginação. Só o painel de transcrição mostra um aviso explicando a ausência.

## Passo a passo (GitHub Pages — automático no push)

O workflow `.github/workflows/pages.yml` gera o site em todo push na `main`, a
partir de `dist/`. Não existe mais pasta `docs/`.

Antes de subir o artefato, o workflow **força `transcricoesDisponiveis: false`**
no índice. Isso existe porque o índice versionado costuma vir de um
`pnpm data:build` local, que o marca `true`: sem a correção, o painel de
transcrição tentaria buscar um arquivo que nunca foi publicado e mostraria erro
em vez do aviso de "não publicado". Ou seja, commitar o índice do build completo
por engano não quebra mais o site.

### Git LFS — não remova o `lfs: true`

O `.gitattributes` põe `*.png`, `*.ttf` e `*.woff2` no Git LFS. O que está
versionado é um ponteiro de 130 bytes, não o binário.

Se o checkout do workflow rodar sem `lfs: true`, o build empacota o texto do
ponteiro como se fosse imagem e fonte. **O deploy não falha** — o servidor
devolve HTTP 200 com `content-type: image/png` — mas o site sobe sem a logo e
sem a tipografia da marca. Foi o que aconteceu até agora.

Existe um passo "Checar binários do LFS" que aborta o build se algum ponteiro
escapar (útil se a cota de LFS do repositório estourar).

### Uma vez no GitHub

1. **Settings → Pages → Source: GitHub Actions** (não use mais “Deploy from a branch /docs”)
2. Faça commit do workflow + do índice público:
   - `.github/workflows/pages.yml`
   - `public/data/meetings-index.json` (sem pasta `transcricoes/`)
   - `.gitignore` atualizado

### No dia a dia

```bash
git add .
git commit -m "sua mensagem"
git push
```

Espere 1–2 min e confira a Action em **Actions → GitHub Pages**.

### Quando a base de reuniões mudar

Aí sim, localmente (com `data-source/` na máquina):

```bash
pnpm data:build:publico
git add public/data/meetings-index.json
git commit -m "Atualiza índice de reuniões"
git push
```

Depois disso, rode `pnpm data:build` de novo se quiser as transcrições de volta
no ambiente local — o build público apaga `public/data/transcricoes/`. O índice
vai voltar a ficar marcado como modificado no git, e tudo bem: o workflow
normaliza a flag na publicação.

## Passo a passo (Vercel)

O `vercel.json` já está configurado: build, rewrite de SPA, `X-Robots-Tag:
noindex` e cache dos assets.

```bash
pnpm dlx vercel --prod
```

Atenção a uma pegadinha: `data-source/` está no `.gitignore` (são 46 MB de
conteúdo de cliente, que não devem ir para o repositório). Ou seja, **um build
rodando na nuvem não encontra o arquivo de origem e falha**. Duas saídas:

1. **Build local, deploy do resultado** (recomendado enquanto for protótipo):

   ```bash
   pnpm data:build:publico
   pnpm build
   pnpm dlx vercel deploy --prebuilt --prod
   ```

2. **Versionar só o índice**: tire `public/data/` do `.gitignore` e adicione
   `public/data/transcricoes/` no lugar. Aí o índice de 471 KB vai para o
   repositório e o build na nuvem funciona sem a origem.

## Se precisar publicar as transcrições

Não deixe como arquivo estático. Duas opções, em ordem de esforço:

1. **Proteção da plataforma** — Vercel Deployment Protection ou Netlify
   Password Protection põem uma senha na frente de tudo, inclusive de
   `/data/`. Resolve o vazamento, mas é uma senha única para todo mundo.
2. **Backend de verdade** — as transcrições saem de `public/` e passam a ser
   servidas por um endpoint que valida a sessão. Os dois pontos de troca já
   estão isolados e comentados: `login()` em `src/auth/authService.ts` e
   `getTranscricao()` em `src/data/repository.ts`.

## Checklist antes de publicar

- [ ] Rodou `pnpm data:build:publico` (e não o `data:build` completo)
- [ ] `dist/data/transcricoes/` **não existe**
- [ ] `npx tsc --noEmit` limpo (o `pnpm build` sozinho não checa tipos)
- [ ] Trocou as contas de demonstração em `src/auth/authService.ts`

/**
 * SERVIÇO DE AUTENTICAÇÃO
 * ═══════════════════════
 *
 * `login()` é o único ponto que a UI conhece. Todo o resto deste arquivo é
 * implementação substituível.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ PONTO DE INTEGRAÇÃO COM O BACKEND                                        │
 * │                                                                          │
 * │ Troque o corpo de `login()` pela chamada real, por exemplo:              │
 * │                                                                          │
 * │   const r = await fetch("/api/auth/login", {                             │
 * │     method: "POST",                                                      │
 * │     headers: { "Content-Type": "application/json" },                     │
 * │     body: JSON.stringify(credenciais),                                   │
 * │     credentials: "include",   // deixe o servidor gravar o cookie        │
 * │   });                                                                    │
 * │   if (r.status === 401) return { ok: false, erro: ERRO_CREDENCIAL };     │
 * │   if (!r.ok) return { ok: false, erro: ERRO_INDISPONIVEL };             │
 * │   return { ok: true, usuario: await r.json() };                          │
 * │                                                                          │
 * │ A assinatura e os tipos não mudam, então nenhum componente é afetado.    │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * ⚠️ AVISO DE SEGURANÇA
 * A lista `CONTAS` abaixo existe só para destravar o protótipo enquanto não há
 * backend. Credenciais em código de front-end são públicas — qualquer pessoa
 * lê no bundle. Isto NÃO pode ir para produção: a verificação de senha tem que
 * acontecer no servidor, contra hash (bcrypt/argon2), com sessão em cookie
 * httpOnly. Enquanto isso não existir, trate o acesso como não protegido.
 */

import type { Credenciais, ErrosFormulario, ResultadoLogin, Usuario } from "./types";

const ERRO_CREDENCIAL = "credentials";
const ERRO_INDISPONIVEL = "unavailable";

/** Latência simulada, para o estado de "carregando" ser observável. */
const LATENCIA_MS = 700;

interface ContaDemo {
  senha: string;
  usuario: Usuario;
}

/** Contas de demonstração. Ver aviso de segurança no topo do arquivo. */
const CONTAS: ContaDemo[] = [
  {
    senha: "Totvs@2026",
    usuario: {
      id: "u-001",
      nome: "Rafael Almeida",
      cargo: "Analista Sênior",
      email: "rafael.almeida@totvs.com.br",
      telefone: "+55 11 98765-4321",
      departamento: "Inteligência Comercial",
      localizacao: "São Paulo, SP",
      iniciais: "RA",
      stats: [
        { label: "Análises", value: "128" },
        { label: "Reuniões", value: "47" },
        { label: "Relatórios", value: "12" },
      ],
    },
  },
  {
    senha: "Totvs@2026",
    usuario: {
      id: "u-002",
      nome: "Marina Costa",
      cargo: "Analista Júnior",
      email: "marina.costa@totvs.com.br",
      telefone: "+55 11 91234-5678",
      departamento: "Inteligência Comercial",
      localizacao: "Belo Horizonte, MG",
      iniciais: "MC",
      stats: [
        { label: "Análises", value: "34" },
        { label: "Reuniões", value: "12" },
        { label: "Relatórios", value: "3" },
      ],
    },
  },
];

// ─── Validação de formulário ─────────────────────────────────────────────────

/**
 * Aceita o formato usual de e-mail. Deliberadamente permissiva: validar e-mail
 * por regex a fundo rejeita endereços legítimos, e quem decide se a conta
 * existe é o servidor.
 */
const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Valida os campos antes de qualquer requisição.
 *
 * Devolve um objeto vazio quando está tudo certo — assim a chamada fica
 * `Object.keys(validar(...)).length === 0`.
 */
export function validarCredenciais(credenciais: Credenciais): ErrosFormulario {
  const erros: ErrosFormulario = {};

  const email = credenciais.email.trim();
  if (!email) {
    erros.email = "emailRequired";
  } else if (!RE_EMAIL.test(email)) {
    erros.email = "emailInvalid";
  }

  if (!credenciais.senha) {
    erros.senha = "passwordRequired";
  } else if (credenciais.senha.length < 8) {
    erros.senha = "passwordMin";
  }

  return erros;
}

// ─── Login ───────────────────────────────────────────────────────────────────

function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Autentica um usuário.
 *
 * Nunca lança por credencial inválida: devolve `{ ok: false, erro }`. Exceções
 * ficam reservadas para falhas de infraestrutura, e mesmo essas são convertidas
 * em `ok: false` para a UI ter um caminho único de tratamento.
 */
export async function login(credenciais: Credenciais): Promise<ResultadoLogin> {
  try {
    await esperar(LATENCIA_MS);

    const email = credenciais.email.trim().toLowerCase();
    const conta = CONTAS.find(
      (c) => c.usuario.email.toLowerCase() === email && c.senha === credenciais.senha,
    );

    /*
     * Mensagem idêntica para e-mail inexistente e senha errada: distinguir os
     * dois casos revela quais contas existem.
     */
    if (!conta) return { ok: false, erro: ERRO_CREDENCIAL };

    return { ok: true, usuario: conta.usuario };
  } catch {
    return { ok: false, erro: ERRO_INDISPONIVEL };
  }
}

/**
 * Encerra a sessão.
 *
 * Hoje só limpa o estado em memória. Com backend, chame `POST /api/auth/logout`
 * aqui para invalidar o cookie de sessão no servidor.
 */
export async function logout(): Promise<void> {
  // Nada a fazer enquanto a sessão não sai do estado do React.
}

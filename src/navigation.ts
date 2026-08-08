/** Páginas alcançáveis dentro do dashboard. */
export type NavId =
  | "dashboard"
  | "clientes"
  | "transcricoes"
  | "fila"
  | "historico"
  | "relatorios"
  | "assistente"
  | "configuracoes"
  | "perfil"
  | "ajuda";

/** Telas do fluxo de autenticação, antes de entrar no dashboard. */
export type AuthScreen = "login" | "forgot" | "verify-code" | "new-password" | "first-access";

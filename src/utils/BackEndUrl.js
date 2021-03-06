const env = process.env.REACT_APP_ENV;
export const BACK_END =
  env === "DEV" ? "http://localhost:8080" : "https://dge-bi-api.herokuapp.com";
export const LOGIN_API = "/oauth/token";
export const USERS = "/api/usuarios";
export const AUTH_USER = "/usuario-autenticado";
export const RELATORIOS_URI = "/api/relatorios";
export const CHECK_SESSION = "/check-session";
export const REFRESH_REPORT = "/atualizar-dados";

import api from "./config";
import type { AxiosResponse } from "axios";

// ─── Enums ────────────────────────────────────────────────

export enum TipoUsuario {
  PAI = "PAI",
  BABA = "BABA",
}

// ─── Interfaces ───────────────────────────────────────────

interface Image {
  attachment_key: string;
  url: string;
}

export interface Usuario {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  tipo: TipoUsuario;
  foto?: Image;
  telefone: string;
  is_active: boolean;
  is_staff: boolean;
}

// ─── Payloads ─────────────────────────────────────────────

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  tipo: TipoUsuario;
  foto_attachment_key?: string;
}

// ─── Respostas ────────────────────────────────────────────

interface TokenResponse {
  access: string;
  refresh: string;
}

interface RegisterResponse {
  id: number;
  email: string;
  tipo: TipoUsuario;
  access: string;
  refresh: string;
}

// ─── Requests ─────────────────────────────────────────────

export const accessTokenRequest = (
  data: LoginPayload
): Promise<AxiosResponse<TokenResponse>> => {
  return api.post("/token/", data);
};

export const refreshTokenRequest = (
  refresh: string
): Promise<AxiosResponse<{ access: string }>> => {
  return api.post("/token/refresh/", { refresh });
};

export const createUser = (
  data: RegisterPayload
): Promise<AxiosResponse<RegisterResponse>> => {
  return api.post("/registro/", data);
};

export const meRequest = (): Promise<AxiosResponse<Usuario>> => {
  return api.get("/usuarios/me/");
};



import { api } from "./api";
import { getToken, setToken, removeTokens } from "../utils/token";

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  papel: string;
}

interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

export interface RegisterTutorData {
  nome: string;
  email: string;
  password: string;
  cpf: string;
  telefone: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
  dataNascimento: string;
}

export interface RegisterTutorResponse {
  message: string;
  email: string;
  codigoTeste?: string;
}

export async function registerTutor(
  tutorData: RegisterTutorData,
): Promise<RegisterTutorResponse> {
  const { data } = await api.post<RegisterTutorResponse>(
    "/auth/register",
    {
      ...tutorData,
      email: tutorData.email.trim().toLowerCase(),
      cpf: tutorData.cpf.replace(/\D/g, ""),
      cep: tutorData.cep.replace(/\D/g, ""),
    },
  );

  return data;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", {
    email: email.trim().toLowerCase(),
    password,
  });

  setToken(data.accessToken);

  return data;
}

export async function logout(): Promise<void> {
  removeTokens();
}

export async function getSession() {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const { data: user } = await api.get<AuthUser>("/auth/me");

    return {
      access_token: token,
      token_type: "Bearer",
      user,
    };
  } catch {
    removeTokens();
    return null;
  }
}

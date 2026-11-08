
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

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", {
    email: email.trim().toLowerCase(),
    password,
  });

  // Guarda o token retornado pelo backend.
  setToken(data.accessToken);

  return data;
}

export async function logout(): Promise<void> {
  // O backend ainda não possui uma rota de logout.
  // Removemos o token local para encerrar o acesso nesta sessão.
  removeTokens();
}

export async function getSession() {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    // Confirma que o token continua válido no backend.
    const { data: user } = await api.get<AuthUser>("/auth/me");

    return {
      access_token: token,
      token_type: "Bearer",
      user,
    };
  } catch {
    // Se o token expirou ou não é mais válido, remove-o.
    removeTokens();
    return null;
  }
}

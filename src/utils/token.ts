
export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setToken(token: string): void {
  localStorage.setItem("token", token);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem("refreshToken");
}

export function removeTokens(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
}

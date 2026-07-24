export function getToken() {
    return localStorage.getItem("token");
}

export function getRefreshToken() {
    return localStorage.getItem("refreshToken");
}

export function removeTokens() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
}
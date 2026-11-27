import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/";

const api = axios.create({
  baseURL,
});

// Rotas públicas: um token velho salvo no navegador não pode atrapalhar
// o login nem o cadastro.
const ROTAS_PUBLICAS = ["/token/", "/registro/"];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  const publica = ROTAS_PUBLICAS.some((rota) => config.url?.includes(rota));
  if (token && !publica) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function tryRefresh(): Promise<string | null> {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return null;

  try {
    const { data } = await axios.post(
      `${baseURL.replace(/\/+$/, "")}/token/refresh/`,
      { refresh }
    );
    localStorage.setItem("access_token", data.access);
    return data.access as string;
  } catch {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes("/token/")
    ) {
      original._retry = true;

      refreshPromise = refreshPromise ?? tryRefresh();
      const newToken = await refreshPromise;
      refreshPromise = null;

      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }

      // Sessão expirada de vez (refresh também venceu): volta para o login
      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
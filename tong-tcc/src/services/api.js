import axios from "axios";

const runtimeOrigin =
  typeof window !== "undefined" && window.location?.origin
    ? window.location.origin
    : "";

const configuredUrl = import.meta.env.VITE_API_URL?.trim();
const fallbackUrl = import.meta.env.DEV ? "http://localhost:8000" : runtimeOrigin;

function normalizeRootUrl(url) {
  return String(url || "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/api$/i, "");
}

export const API_ROOT_URL = normalizeRootUrl(configuredUrl || fallbackUrl);

const sharedConfig = {
  timeout: 15_000,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    Accept: "application/json",
  },
};

export const appApi = axios.create({
  ...sharedConfig,
  baseURL: API_ROOT_URL || undefined,
});

// Alias explícito para consumidores que preferem o nome apiRoot.
export const apiRoot = appApi;

export const api = axios.create({
  ...sharedConfig,
  baseURL: API_ROOT_URL ? `${API_ROOT_URL}/api` : "/api",
});

let csrfRequest;

export function ensureCsrfCookie() {
  if (!csrfRequest) {
    csrfRequest = appApi.get("/sanctum/csrf-cookie").finally(() => {
      csrfRequest = undefined;
    });
  }
  return csrfRequest;
}

export function assetUrl(path, fallback = "") {
  if (!path) return fallback;

  const value = String(path).trim();
  if (!value) return fallback;

  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  if (/^\/(?!storage\/)/i.test(value)) return value;

  const normalizedPath = value
    .replace(/^\/+/, "")
    .replace(/^storage\//i, "");
  const prefix = API_ROOT_URL || "";
  return `${prefix}/storage/${normalizedPath}`;
}

export function getErrorMessage(error, fallback = "Não foi possível concluir a operação.") {
  if (!error) return fallback;

  const validationErrors = error.response?.data?.errors;
  if (validationErrors && typeof validationErrors === "object") {
    const firstError = Object.values(validationErrors).flat().find(Boolean);
    if (firstError) return String(firstError);
  }

  const serverMessage = error.response?.data?.message || error.response?.data?.error;
  if (serverMessage) return String(serverMessage);

  if (error.code === "ECONNABORTED") {
    return "A conexão demorou demais. Tente novamente.";
  }

  if (!error.response && error.request) {
    return "Não foi possível conectar ao estabelecimento. Verifique sua internet e tente novamente.";
  }

  return error.message || fallback;
}

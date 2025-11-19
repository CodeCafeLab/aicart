export function getApiBaseUrl() {
  const isBrowser = typeof window !== "undefined";
  if (isBrowser) {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") return "";
    const origin = window.location.origin;
    const envBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (envBase && envBase.startsWith(origin)) {
      return "";
    }
  }
  const envBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envBase && envBase.length > 0) return envBase;
  return "";
}

export const API_BASE_URL = getApiBaseUrl();

export async function apiFetch(path: string, init?: RequestInit) {
  const url = `${getApiBaseUrl()}${path}`;
  return fetch(url, init);
}
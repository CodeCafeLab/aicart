export function getApiBaseUrl() {
  const envBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envBase && envBase.length > 0) return envBase;
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "http://localhost:4000";
}

export const API_BASE_URL = getApiBaseUrl();

export async function apiFetch(path: string, init?: RequestInit) {
  const url = `${getApiBaseUrl()}${path}`;
  return fetch(url, init);
}
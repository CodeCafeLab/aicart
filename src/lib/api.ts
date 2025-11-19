export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:6000";

export async function apiFetch(path: string, init?: RequestInit) {
  const url = `${API_BASE_URL}${path}`;
  return fetch(url, init);
}
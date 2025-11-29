/**
 * Get the API base URL for making requests
 * - In production: Uses Next.js rewrites (returns empty string to use relative paths)
 * - In local dev: Uses direct backend URL or env variable
 */
export function getApiBaseUrl() {
  const isBrowser = typeof window !== "undefined";
  
  // Check for explicit environment variable first
  const envBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (isBrowser) {
    const host = window.location.hostname;
    
    // Local development - use direct backend URL
    if (host === "localhost" || host === "127.0.0.1") {
      if (envBase && envBase.length > 0) {
        // Remove trailing slash if present
        return envBase.replace(/\/$/, "");
      }
      return "http://localhost:4000";
    }
    
    // Production - check if we should use rewrites or direct URL
    if (envBase && envBase.length > 0) {
      // If env var is set and it's a full URL, use it
      if (envBase.startsWith("http://") || envBase.startsWith("https://")) {
        return envBase.replace(/\/$/, "");
      }
      // If it's empty or relative, use rewrites (return empty string)
      if (envBase === "" || envBase === "/") {
        return "";
      }
    }
    
    // Default: use Next.js rewrites in production (relative paths)
    return "";
  }
  
  // Server-side rendering
  if (envBase && envBase.length > 0) {
    return envBase.replace(/\/$/, "");
  }
  
  // Default for SSR: assume local development
  return "http://localhost:4000";
}

export const API_BASE_URL = getApiBaseUrl();

/**
 * Fetch from API with proper error handling
 * Automatically handles both local (direct) and production (rewrite) scenarios
 */
export async function apiFetch(path: string, init?: RequestInit) {
  const baseUrl = getApiBaseUrl();
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  
  // Build full URL
  const url = baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
  
  // Add default headers
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type") && init?.body && typeof init.body === "string") {
    headers.set("Content-Type", "application/json");
  }
  
  // Get auth token if available
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  
  try {
    const response = await fetch(url, {
      ...init,
      headers,
    });
    
    return response;
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
}
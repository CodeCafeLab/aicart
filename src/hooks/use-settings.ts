import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Settings = Record<string, any>;

let settingsCache: Settings | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useSettings() {
  // Start with empty object to match server render
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted (client-side only)
    setMounted(true);
    
    // Only fetch on client
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    // Check cache first
    if (settingsCache && Date.now() - cacheTimestamp < CACHE_TTL) {
      setSettings(settingsCache);
      setLoading(false);
      return;
    }

    apiFetch("/api/settings")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();
        settingsCache = data.settings || {};
        cacheTimestamp = Date.now();
        setSettings(settingsCache);
      })
      .catch((err) => {
        console.error("Error fetching settings:", err);
        setError(err);
        // Use empty object on error
        setSettings({});
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { settings, loading: loading || !mounted, error };
}

export function useSetting(key: string, defaultValue: any = null) {
  const { settings, loading } = useSettings();
  return { value: settings[key] ?? defaultValue, loading };
}

export function useFeatureEnabled(feature: string) {
  const { value, loading } = useSetting(`features.${feature}.enabled`, false);
  return { enabled: value === true, loading };
}

/**
 * Invalidate settings cache (call after updating settings)
 */
export function invalidateSettingsCache() {
  settingsCache = null;
  cacheTimestamp = 0;
}


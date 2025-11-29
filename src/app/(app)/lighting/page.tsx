"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Sun,
  Wand2,
  Sparkles,
  X,
  Loader2,
  Lightbulb,
  CircleDot,
  ArrowUpRight,
  ArrowUp,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  Save,
  Plus,
  Trash2,
  Search,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type LightingPreset = {
  id: string;
  name: string;
  intensity: number;
  temperature: number;
  softness: number;
  shadow: number;
  direction?: string;
  image_url?: string;
  metadata?: Record<string, any>;
  created_at?: string;
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?w=900&q=80";
const FALLBACK_PRESET_IMAGE = "https://images.unsplash.com/photo-1555617981-47c49f0b57f9?w=900&q=80";

const directions = [
  { id: "top", icon: <ArrowUp className="h-4 w-4" />, label: "Top" },
  { id: "front", icon: <CircleDot className="h-4 w-4" />, label: "Front" },
  { id: "right", icon: <ArrowRight className="h-4 w-4" />, label: "Right" },
  { id: "left", icon: <ArrowLeft className="h-4 w-4" />, label: "Left" },
  { id: "bottom", icon: <ArrowDown className="h-4 w-4" />, label: "Bottom" },
  { id: "45deg", icon: <ArrowUpRight className="h-4 w-4" />, label: "45°" },
];

export default function LightingPage() {
  const [presets, setPresets] = useState<LightingPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<LightingPreset | null>(null);
  const [intensity, setIntensity] = useState(60);
  const [temperature, setTemperature] = useState(5200);
  const [softness, setSoftness] = useState(60);
  const [shadow, setShadow] = useState(40);
  const [activeDirection, setActiveDirection] = useState("front");
  const [search, setSearch] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [loadingPresets, setLoadingPresets] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch lighting presets from API
  const fetchPresets = useCallback(async () => {
    setLoadingPresets(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const endpoint = params.size ? `/api/lighting/presets?${params}` : "/api/lighting/presets";
      
      const res = await apiFetch(endpoint);
      if (!res.ok) throw new Error("Failed to load presets");
      const data = await res.json();
      setPresets(data.items || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load lighting presets. Please try again.");
      toast({
        title: "Failed to load presets",
        description: "Please refresh the page to try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingPresets(false);
    }
  }, [search, toast]);

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  // Apply preset values to controls
  const applyPreset = useCallback((preset: LightingPreset) => {
    setIntensity(preset.intensity);
    setTemperature(preset.temperature);
    setSoftness(preset.softness);
    setShadow(preset.shadow);
    setActiveDirection(preset.direction || "front");
    setSelectedPreset(preset);
  }, []);

  // Calculate temperature color
  const getTemperatureColor = (temp: number) => {
    if (temp < 3500) return "rgb(255, 180, 100)"; // Warm orange
    if (temp < 5000) return "rgb(255, 220, 150)"; // Warm white
    if (temp < 6500) return "rgb(255, 255, 200)"; // Neutral white
    return "rgb(200, 220, 255)"; // Cool blue
  };

  // Apply lighting to scene
  async function applyLighting() {
    setIsApplying(true);
    try {
      // In a real implementation, this would apply lighting to the current scene
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast({
        title: "Lighting applied",
        description: "Your lighting settings have been applied to the scene.",
      });
    } catch (err) {
      toast({
        title: "Failed to apply lighting",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  }

  // Save current settings as preset
  async function savePreset() {
    if (!presetName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your preset.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const res = await apiFetch("/api/lighting/presets", {
        method: "POST",
        body: JSON.stringify({
          name: presetName.trim(),
          intensity,
          temperature,
          softness,
          shadow,
          direction: activeDirection,
          image_url: FALLBACK_PRESET_IMAGE,
        }),
      });

      if (!res.ok) throw new Error("Failed to save preset");
      const data = await res.json();
      
      setPresets((prev) => [data.item, ...prev]);
      setPresetName("");
      setShowSaveDialog(false);
      toast({
        title: "Preset saved",
        description: "Your lighting preset has been saved successfully.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to save preset",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  // Delete preset
  async function deletePreset(presetId: string) {
    if (!confirm("Are you sure you want to delete this preset?")) return;

    try {
      const res = await apiFetch(`/api/lighting/presets/${presetId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete preset");
      
      setPresets((prev) => prev.filter((p) => p.id !== presetId));
      if (selectedPreset?.id === presetId) {
        setSelectedPreset(null);
      }
      toast({
        title: "Preset deleted",
        description: "The lighting preset has been deleted.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to delete preset",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  }

  // Filtered presets based on search
  const filteredPresets = useMemo(() => {
    if (!search) return presets;
    const lowerSearch = search.toLowerCase();
    return presets.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerSearch) ||
        p.metadata?.description?.toLowerCase().includes(lowerSearch)
    );
  }, [presets, search]);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white">
      {/* HEADER */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Lighting Studio</h1>
          <p className="text-muted-foreground mt-1">Adjust lighting direction, temperature & intensity for your scene.</p>
        </div>
        <Button
          onClick={() => setShowSaveDialog(true)}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Preset
        </Button>
      </div>

      {/* MAIN GRID */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[380px,1fr,380px] gap-6">
        {/* LEFT: PRESETS */}
        <aside className="space-y-6">
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Lighting Presets
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                <Input
                  type="text"
                  placeholder="Search presets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-black/20 border-white/10 text-white placeholder:text-white/50"
                />
              </div>

              {/* Presets List */}
              {loadingPresets ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-20 w-full rounded-xl bg-white/10" />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8 text-sm text-red-400">{error}</div>
              ) : filteredPresets.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">No presets found</div>
              ) : (
                filteredPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className={cn(
                      "flex gap-3 w-full text-left p-3 rounded-xl border transition-all",
                      selectedPreset?.id === preset.id
                        ? "bg-[#FFB400]/20 border-[#FFB400] shadow-lg shadow-[#FFB400]/20"
                        : "bg-white/5 hover:bg-white/10 border-white/10"
                    )}
                  >
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={preset.image_url || FALLBACK_PRESET_IMAGE}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{ backgroundColor: getTemperatureColor(preset.temperature) }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{preset.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                          {preset.intensity}%
                        </Badge>
                        <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                          {preset.temperature}K
                        </Badge>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePreset(preset.id);
                      }}
                      className="p-1.5 rounded hover:bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </aside>

        {/* CENTER: PREVIEW */}
        <main className="flex flex-col gap-6">
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Lighting Preview
              </CardTitle>
            </CardHeader>

            <CardContent className="flex items-center justify-center h-[60vh] overflow-hidden relative">
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={FALLBACK_IMAGE}
                  alt="preview"
                  className="max-h-[55vh] rounded-xl object-contain shadow-2xl"
                />

                {/* Dynamic lighting overlay */}
                <div
                  className="absolute inset-0 mix-blend-screen pointer-events-none rounded-xl transition-all duration-300"
                  style={{
                    background: `radial-gradient(circle at ${getDirectionPosition(activeDirection)}, ${getTemperatureColor(temperature)} ${intensity / 3}%, transparent ${intensity}%)`,
                    filter: `blur(${softness / 8}px)`,
                    opacity: intensity / 100,
                  }}
                />

                {/* Shadow overlay */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(ellipse at ${getDirectionPosition(activeDirection)}, transparent 30%, rgba(0,0,0,${shadow / 200}) 100%)`,
                    opacity: shadow / 100,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </main>

        {/* RIGHT: CONTROLS */}
        <aside className="space-y-6">
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Adjust Lighting
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Intensity */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Intensity</label>
                  <span className="text-sm text-[#FFB400] font-semibold">{intensity}%</span>
                </div>
                <Slider
                  value={[intensity]}
                  onValueChange={([value]) => setIntensity(value)}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Temperature */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Temperature</label>
                  <span className="text-sm text-[#FFB400] font-semibold">{temperature}K</span>
                </div>
                <Slider
                  value={[temperature]}
                  onValueChange={([value]) => setTemperature(value)}
                  min={2500}
                  max={9000}
                  step={100}
                  className="w-full"
                />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-orange-400">Warm</span>
                  <div className="flex-1 h-1 bg-gradient-to-r from-orange-400 via-yellow-200 to-blue-200 rounded" />
                  <span className="text-blue-200">Cool</span>
                </div>
              </div>

              {/* Softness */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Light Softness</label>
                  <span className="text-sm text-[#FFB400] font-semibold">{softness}%</span>
                </div>
                <Slider
                  value={[softness]}
                  onValueChange={([value]) => setSoftness(value)}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Shadows */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Shadow Strength</label>
                  <span className="text-sm text-[#FFB400] font-semibold">{shadow}%</span>
                </div>
                <Slider
                  value={[shadow]}
                  onValueChange={([value]) => setShadow(value)}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Light Direction */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Light Direction</label>
                <div className="grid grid-cols-3 gap-2">
                  {directions.map((dir) => (
                    <button
                      key={dir.id}
                      onClick={() => setActiveDirection(dir.id)}
                      className={cn(
                        "p-3 rounded-lg border transition-all flex flex-col items-center gap-1",
                        activeDirection === dir.id
                          ? "border-[#FFB400] bg-[#FFB400]/20 shadow-lg shadow-[#FFB400]/20"
                          : "border-white/10 hover:border-white/20 bg-white/5"
                      )}
                    >
                      {dir.icon}
                      <span className="text-xs">{dir.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full mt-4 flex items-center gap-2 bg-gradient-to-r from-[#FFB400] to-[#FF9500] hover:from-[#FF9500] hover:to-[#FFB400]"
                onClick={applyLighting}
                disabled={isApplying}
              >
                {isApplying ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Apply Lighting
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* SAVE PRESET DIALOG */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-[#0E152E] border-white/10">
            <CardHeader>
              <CardTitle>Save Lighting Preset</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Preset Name</label>
                <Input
                  type="text"
                  placeholder="e.g., Softbox Studio"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className="bg-black/20 border-white/10 text-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") savePreset();
                  }}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={savePreset}
                  disabled={isSaving || !presetName.trim()}
                  className="flex-1"
                >
                  {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSaveDialog(false);
                    setPresetName("");
                  }}
                  className="border-white/20 text-white"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* PRESET DETAILS DRAWER */}
      {selectedPreset && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-md bg-[#0E152E] border-l border-white/10 h-full p-6 overflow-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedPreset.name}</h2>
              <button onClick={() => setSelectedPreset(null)} className="p-2 rounded hover:bg-white/10">
                <X />
              </button>
            </div>

            <div className="mt-4 rounded-xl overflow-hidden">
              <img
                src={selectedPreset.image_url || FALLBACK_PRESET_IMAGE}
                alt="Lighting preset preview"
                className="w-full h-64 object-cover"
              />
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-sm">Intensity</span>
                <span className="font-semibold text-[#FFB400]">{selectedPreset.intensity}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-sm">Temperature</span>
                <span className="font-semibold text-[#FFB400]">{selectedPreset.temperature}K</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-sm">Softness</span>
                <span className="font-semibold text-[#FFB400]">{selectedPreset.softness}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-sm">Shadow</span>
                <span className="font-semibold text-[#FFB400]">{selectedPreset.shadow}%</span>
              </div>
            </div>

            <Button
              className="w-full mt-6 flex items-center gap-2"
              onClick={() => {
                applyPreset(selectedPreset);
                setSelectedPreset(null);
              }}
            >
              <Sun className="h-4 w-4" />
              Apply This Preset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get position based on direction
function getDirectionPosition(direction: string): string {
  const positions: Record<string, string> = {
    top: "50% 0%",
    front: "50% 50%",
    right: "100% 50%",
    left: "0% 50%",
    bottom: "50% 100%",
    "45deg": "75% 25%",
  };
  return positions[direction] || "50% 50%";
}

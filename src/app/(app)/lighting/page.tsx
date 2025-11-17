"use client";

import { useState } from "react";
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
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const lightingPresets = [
  {
    id: "l1",
    name: "Softbox Studio",
    intensity: 70,
    temperature: 5200,
    softness: 80,
    shadow: 40,
    thumb:
      "https://images.unsplash.com/photo-1555617981-47c49f0b57f9?w=900&q=80",
  },
  {
    id: "l2",
    name: "Rim Light Glow",
    intensity: 85,
    temperature: 6000,
    softness: 60,
    shadow: 30,
    thumb:
      "https://images.unsplash.com/photo-1533536270299-4f4f229f03d9?w=900&q=80",
  },
  {
    id: "l3",
    name: "Warm Ambient Light",
    intensity: 55,
    temperature: 4200,
    softness: 90,
    shadow: 20,
    thumb:
      "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=900&q=80",
  },
  {
    id: "l4",
    name: "Hard Shadow Spotlight",
    intensity: 95,
    temperature: 5000,
    softness: 20,
    shadow: 100,
    thumb:
      "https://images.unsplash.com/photo-1499083097717-a156f48e0a5e?w=900&q=80",
  },
];

export default function LightingPage() {
  const [selectedPreset, setSelectedPreset] = useState<any>(null);
  const [intensity, setIntensity] = useState(60);
  const [temperature, setTemperature] = useState(5200);
  const [softness, setSoftness] = useState(60);
  const [shadow, setShadow] = useState(40);
  const [activeDirection, setActiveDirection] = useState("front");

  const [isApplying, setIsApplying] = useState(false);

  function applyLighting() {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      alert("Lighting applied to scene! (UI mock)");
    }, 1200);
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white">
      {/* HEADER */}
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Lighting Studio
        </h1>
        <p className="text-muted-foreground mt-1">
          Adjust lighting direction, temperature & intensity for your scene.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[400px,1fr,400px] gap-6">
        
        {/* LEFT: PRESETS */}
        <aside className="space-y-6">
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle>Lighting Presets</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {lightingPresets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPreset(p);
                    setIntensity(p.intensity);
                    setTemperature(p.temperature);
                    setSoftness(p.softness);
                    setShadow(p.shadow);
                  }}
                  className="flex gap-3 w-full text-left bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 transition"
                >
                  <img
                    src={p.thumb}
                    alt={p.name}
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-[#FFB400] mt-1">Preset</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </aside>

        {/* CENTER: PREVIEW */}
        <main className="flex flex-col gap-6">
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle>Lighting Preview</CardTitle>
            </CardHeader>

            <CardContent className="flex items-center justify-center h-[60vh] overflow-hidden">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?w=900&q=80"
                  alt="preview"
                  className="max-h-[55vh] rounded-xl object-contain shadow-xl"
                />

                {/* Fake lighting overlay tint */}
                <div
                  className="absolute inset-0 mix-blend-screen pointer-events-none rounded-xl"
                  style={{
                    background: `rgba(255, 230, 150, ${
                      intensity / 250
                    })`,
                    filter: `blur(${softness / 8}px)`,
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* RIGHT: CONTROLS */}
        <aside className="space-y-6">
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle>Adjust Lighting</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Intensity */}
              <div>
                <label className="text-sm">Intensity</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">{intensity}%</p>
              </div>

              {/* Temperature */}
              <div>
                <label className="text-sm">Temperature (Kelvin)</label>
                <input
                  type="range"
                  min={2500}
                  max={9000}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {temperature}K
                </p>
              </div>

              {/* Softness */}
              <div>
                <label className="text-sm">Light Softness</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={softness}
                  onChange={(e) => setSoftness(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">{softness}%</p>
              </div>

              {/* Shadows */}
              <div>
                <label className="text-sm">Shadow Strength</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={shadow}
                  onChange={(e) => setShadow(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">{shadow}%</p>
              </div>

              {/* Light Direction Mini Map */}
              <div>
                <label className="text-sm">Light Direction</label>

                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { id: "top", icon: <ArrowUp /> },
                    { id: "front", icon: <CircleDot /> },
                    { id: "right", icon: <ArrowRight /> },
                    { id: "left", icon: <ArrowLeft /> },
                    { id: "bottom", icon: <ArrowDown /> },
                    { id: "45deg", icon: <ArrowUpRight /> },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveDirection(item.id)}
                      className={cn(
                        "p-3 rounded-lg border flex items-center justify-center",
                        activeDirection === item.id
                          ? "border-[#FFB400] bg-[#FFB4000A]"
                          : "border-white/10 hover:border-white/20"
                      )}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full mt-4 flex items-center gap-2"
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

      {/* PRESET DETAILS DRAWER */}
      {selectedPreset && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-md bg-[#0E152E] border-l border-white/10 h-full p-6 overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedPreset.name}</h2>
              <button
                onClick={() => setSelectedPreset(null)}
                className="p-2 rounded hover:bg-white/10"
              >
                <X />
              </button>
            </div>

            {/* Image */}
            <div className="mt-4 rounded-xl overflow-hidden">
              <img
                src={selectedPreset.thumb}
                alt="Lighting preset preview"
                className="w-full h-64 object-cover"
              />
            </div>

            {/* Stats */}
            <div className="mt-6 space-y-2 text-sm">
              <p>Intensity: {selectedPreset.intensity}%</p>
              <p>Temperature: {selectedPreset.temperature}K</p>
              <p>Softness: {selectedPreset.softness}%</p>
              <p>Shadow: {selectedPreset.shadow}%</p>
            </div>

            {/* Apply */}
            <Button
              className="w-full mt-6 flex items-center gap-2"
              onClick={applyLighting}
              disabled={isApplying}
            >
              {isApplying ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              Apply Lighting Preset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

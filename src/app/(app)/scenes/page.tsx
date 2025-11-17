"use client";

import { useState } from "react";
import {
  Wand2,
  Filter,
  X,
  Sparkles,
  Loader2,
  Mountain,
  Home,
  Building,
  Camera,
  Palette,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock scenes
const mockScenes = [
  {
    id: "s1",
    name: "Minimal White Studio",
    category: "Studio",
    mood: "Clean",
    thumb:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=900&q=80",
  },
  {
    id: "s2",
    name: "Urban Street Lifestyle",
    category: "Urban",
    mood: "Energetic",
    thumb:
      "https://images.unsplash.com/photo-1520975918319-258b6a2139f0?w=900&q=80",
  },
  {
    id: "s3",
    name: "Warm Cozy Home Interior",
    category: "Indoor",
    mood: "Warm",
    thumb:
      "https://images.unsplash.com/photo-1616594039964-ae9021b39d2e?w=900&q=80",
  },
  {
    id: "s4",
    name: "Luxury Gold Aesthetic",
    category: "Luxury",
    mood: "Premium",
    thumb:
      "https://images.unsplash.com/photo-1524699828488-5e27b3b03d9c?w=900&q=80",
  },
  {
    id: "s5",
    name: "Nature Forest Soft Light",
    category: "Nature",
    mood: "Natural",
    thumb:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=80",
  },
  {
    id: "s6",
    name: "Outdoor Sunny Terrace",
    category: "Outdoor",
    mood: "Bright",
    thumb:
      "https://images.unsplash.com/photo-1524231757912-b50f8a38239a?w=900&q=80",
  },
];

export default function SceneStylistPage() {
  const [scenes, setScenes] = useState(mockScenes);
  const [selectedScene, setSelectedScene] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = ["All", "Studio", "Outdoor", "Luxury", "Indoor", "Urban", "Nature"];

  const filteredScenes =
    selectedCategory === "All"
      ? scenes
      : scenes.filter((s) => s.category === selectedCategory);

  function generateScene() {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const newScene = {
        id: "ai-" + Math.random(),
        name: prompt,
        category: "AI Generated",
        mood: "Custom",
        thumb:
          "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?w=900&q=80",
      };
      setScenes((prev) => [newScene, ...prev]);
      setIsGenerating(false);
      setPrompt("");
    }, 1400);
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white">
      {/* HEADER */}
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Scene Stylist
        </h1>
        <p className="text-muted-foreground mt-1">
          Choose or generate scenes for your AI shoots.
        </p>
      </div>

      {/* FILTERS & AI GENERATOR */}
      <Card className="mt-6 bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & AI Scene Generator
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full border text-sm transition",
                  selectedCategory === cat
                    ? "border-[#FFB400] bg-[#FFB4000A]"
                    : "border-white/10 hover:border-white/20"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* AI Scene Generator */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Wand2 className="h-5 w-5" /> AI Scene Generator
            </h3>

            <p className="text-muted-foreground text-sm mt-1 mb-3">
              Describe a scene and AI will generate a customized background.
            </p>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., a premium studio with warm golden spotlights and velvet backdrop"
              className="w-full h-24 p-3 rounded bg-black/20 border border-white/10 resize-none"
            />

            <Button
              className="mt-3 flex items-center gap-2"
              disabled={isGenerating}
              onClick={generateScene}
            >
              {isGenerating ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate Scene
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SCENE GRID */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredScenes.map((scene) => (
          <button
            key={scene.id}
            onClick={() => setSelectedScene(scene)}
            className="rounded-xl bg-white/5 border border-white/10 hover:border-[#FFB400] overflow-hidden transition shadow-lg hover:shadow-yellow-500/10 text-left"
          >
            <img
              src={scene.thumb}
              alt={scene.name}
              className="h-52 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{scene.name}</h3>
              <p className="text-xs text-[#FFB400] uppercase tracking-wide mt-1">
                {scene.category}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Mood: {scene.mood}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* ------------------------ SCENE DETAIL DRAWER ------------------------ */}
      {selectedScene && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-xl bg-[#0E152E] border-l border-white/10 h-full p-6 overflow-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{selectedScene.name}</h2>
              <button
                onClick={() => setSelectedScene(null)}
                className="p-2 rounded hover:bg-white/10"
              >
                <X />
              </button>
            </div>

            <div className="mt-4 rounded-xl overflow-hidden">
              <img
                src={selectedScene.thumb}
                alt="scene-preview"
                className="w-full h-64 object-cover"
              />
            </div>

            <p className="mt-3 text-sm text-[#FFB400] uppercase tracking-wide">
              {selectedScene.category}
            </p>

            <p className="mt-2 text-muted-foreground">Mood: {selectedScene.mood}</p>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <Button className="flex items-center gap-2">
                <Camera className="h-4 w-4" /> Use This Scene
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Palette className="h-4 w-4" /> View Similar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

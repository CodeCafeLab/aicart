"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Wand2,
  Filter,
  X,
  Sparkles,
  Loader2,
  Camera,
  Palette,
  Search,
  BarChart3,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type SceneRecord = {
  id: string;
  name: string;
  category: string;
  mood?: string | null;
  description?: string | null;
  image_url?: string | null;
  metadata?: Record<string, any> | null;
  is_generated?: boolean;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?w=900&q=80&auto=format&fit=crop";

export default function SceneStylistPage() {
  const [scenes, setScenes] = useState<SceneRecord[]>([]);
  const [selectedScene, setSelectedScene] = useState<SceneRecord | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [prompt, setPrompt] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingScenes, setLoadingScenes] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const selectedSceneId = selectedScene?.id;

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handle);
  }, [search]);

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const res = await apiFetch("/api/library/categories?type=scenes");
      if (!res.ok) throw new Error("Failed to load categories");
      const data = await res.json();
      const names: string[] = Array.from(
        new Set(
          (data.items || [])
            .map((item: any) => item?.name)
            .filter((name: string | null | undefined) => Boolean(name))
        )
      );
      setCategories(["All", ...names]);
    } catch (err) {
      console.error(err);
      toast({
        title: "Could not load categories",
        description: "Please refresh or check the API connection.",
        variant: "destructive",
      });
    } finally {
      setLoadingCategories(false);
    }
  }, [toast]);

  const fetchScenes = useCallback(
    async (categoryValue: string, searchValue: string) => {
      setLoadingScenes(true);
      setError(null);
      const params = new URLSearchParams();
      if (categoryValue) params.set("category", categoryValue);
      if (searchValue) params.set("search", searchValue);
      const query = params.toString();
      const endpoint = query ? `/api/library/scenes?${query}` : "/api/library/scenes";

      try {
        const res = await apiFetch(endpoint);
        if (!res.ok) throw new Error("Failed to load scenes");
        const data = await res.json();
        setScenes(data.items || []);
      } catch (err) {
        console.error(err);
        setError("We could not load scenes from the database. Try again.");
      } finally {
        setLoadingScenes(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchScenes(selectedCategory, debouncedSearch);
  }, [fetchScenes, selectedCategory, debouncedSearch]);

  useEffect(() => {
    if (!selectedSceneId) return;
    const fresh = scenes.find((scene) => scene.id === selectedSceneId);
    if (!fresh) {
      setSelectedScene(null);
    } else {
      setSelectedScene(fresh);
    }
  }, [scenes, selectedSceneId]);

  const displayScenes = useMemo(() => scenes, [scenes]);

  async function generateScene() {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const payload = {
        name: prompt.trim(),
        category: selectedCategory === "All" ? "AI Generated" : selectedCategory,
        mood: "Custom",
        description: prompt.trim(),
        image_url: FALLBACK_IMAGE,
        metadata: { prompt: prompt.trim(), source: "ai_generator" },
        is_generated: true,
      };
      const res = await apiFetch("/api/library/scenes", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to generate scene");
      const data = await res.json();
      setScenes((prev) => [data.item, ...prev]);
      setPrompt("");
      toast({
        title: "Scene generated",
        description: "Your AI scene is ready in the grid.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Scene generation failed",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Scene Stylist</h1>
          <p className="text-muted-foreground mt-1">Choose or generate scenes for your AI shoots.</p>
        </div>
        <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
          <Link href="/categories" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Manage Categories
          </Link>
        </Button>
      </div>

      <Card className="mt-6 bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & AI Scene Generator
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {(loadingCategories ? Array.from({ length: 5 }) : categories).map((cat, index) =>
                loadingCategories ? (
                  <Skeleton key={index} className="h-9 w-20 rounded-full bg-white/10" />
                ) : (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-4 py-1.5 rounded-full border text-sm transition",
                      selectedCategory === cat
                        ? "border-[#FFB400] bg-[#FFB40014]"
                        : "border-white/10 hover:border-white/25"
                    )}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search scenes..."
                className="bg-black/30 border-white/10 pl-9 text-white placeholder:text-white/50"
              />
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Wand2 className="h-5 w-5" /> AI Scene Generator
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Describe a scene and AI will log it in your scene library.
                </p>
              </div>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., a premium studio with warm golden spotlights and velvet backdrop"
              className="mt-4 w-full h-24 p-3 rounded bg-black/20 border border-white/10 resize-none"
            />
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <Button className="flex items-center gap-2" disabled={isGenerating || !prompt.trim()} onClick={generateScene}>
                {isGenerating ? <Loader2 className="animate-spin h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                {isGenerating ? "Generating..." : "Generate Scene"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Scenes are saved to the database so collaborators can re-use them.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </div>
        )}
        {loadingScenes ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <Skeleton key={idx} className="h-72 w-full rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : displayScenes.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/20 rounded-3xl bg-white/5">
            <p className="text-lg font-semibold">No scenes found</p>
            <p className="text-muted-foreground mt-2">
              Try another category or generate a new scene with AI.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayScenes.map((scene) => (
              <button
                key={scene.id}
                onClick={() => setSelectedScene(scene)}
                className="rounded-xl bg-white/5 border border-white/10 hover:border-[#FFB400] overflow-hidden transition shadow-lg hover:shadow-yellow-500/10 text-left"
              >
                <div className="relative">
                  <img
                    src={scene.image_url || FALLBACK_IMAGE}
                    alt={scene.name}
                    className="h-52 w-full object-cover"
                  />
                  {scene.is_generated && (
                    <Badge className="absolute top-3 right-3 bg-black/70 text-[#FFB400]">AI</Badge>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{scene.name}</h3>
                  <p className="text-xs text-[#FFB400] uppercase tracking-wide mt-1">{scene.category}</p>
                  {scene.mood && (
                    <p className="mt-2 text-sm text-muted-foreground">Mood: {scene.mood}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedScene && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-xl bg-[#0E152E] border-l border-white/10 h-full p-6 overflow-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedScene.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedScene.category}</p>
              </div>
              <button onClick={() => setSelectedScene(null)} className="p-2 rounded hover:bg-white/10">
                <X />
              </button>
            </div>

            <div className="mt-4 rounded-xl overflow-hidden">
              <img
                src={selectedScene.image_url || FALLBACK_IMAGE}
                alt="scene-preview"
                className="w-full h-64 object-cover"
              />
            </div>

            <div className="flex items-center gap-3 mt-4">
              {selectedScene.mood && (
                <Badge variant="outline" className="border-white/20 text-white">
                  Mood: {selectedScene.mood}
                </Badge>
              )}
              {selectedScene.is_generated && (
                <Badge variant="outline" className="border-[#FFB400] text-[#FFB400]">
                  AI Generated
                </Badge>
              )}
            </div>

            {selectedScene.description && (
              <p className="mt-4 text-sm text-muted-foreground">{selectedScene.description}</p>
            )}

            <div className="mt-6 flex gap-3 flex-wrap">
              <Button className="flex items-center gap-2">
                <Camera className="h-4 w-4" /> Use This Scene
              </Button>
              <Button variant="outline" className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10">
                <Palette className="h-4 w-4" /> View Similar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

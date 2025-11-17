"use client";

import { useState } from "react";
import {
  Wand2,
  Sparkles,
  Loader2,
  Lightbulb,
  Camera,
  Image as ImageIcon,
  ChevronRight,
  X,
  Palette,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const styleCategories = [
  { id: "minimal", name: "Minimal & Clean" },
  { id: "luxury", name: "Luxury Premium" },
  { id: "editorial", name: "Editorial Fashion" },
  { id: "neon", name: "Neon Tech" },
  { id: "street", name: "Street Aesthetic" },
  { id: "nature", name: "Nature Soft" },
  { id: "pop", name: "Product Pop" },
];

export default function ArtDirectorPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [concept, setConcept] = useState<any>(null);
  const [previewDrawer, setPreviewDrawer] = useState(false);

  const generateArtDirection = () => {
    if (!prompt.trim() && !selectedStyle) return;

    setIsGenerating(true);

    setTimeout(() => {
      setConcept({
        mood: "High-end, modern, minimalistic.",
        lighting: "Soft studio glow with subtle rim highlights.",
        camera: "45° angle, medium close-up, shallow depth of field.",
        color: "Warm beige, muted gold, clean white highlights.",
        composition:
          "Centered product focus with symmetrical balance on both sides.",
        props: ["Soft shadows", "Matte blocks", "Mirror reflections"],
        reference:
          "https://images.unsplash.com/photo-1581287053822-d85c8c9e5c81?w=900&q=80",
      });

      setIsGenerating(false);
      setPreviewDrawer(true);
    }, 1400);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white">
      {/* HEADER */}
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          AI Art Director
        </h1>
        <p className="text-muted-foreground mt-1">
          Get creative direction, concepts & moodboards powered by AI.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[380px,1fr,380px] gap-6">

        {/* LEFT SIDEBAR — Style Selection */}
        <aside>
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Choose a Style</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              {styleCategories.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStyle(s.id)}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition",
                    selectedStyle === s.id
                      ? "border-[#FFB400] bg-[#FFB4000A]"
                      : "border-white/10 hover:border-white/20"
                  )}
                >
                  {s.name}
                </button>
              ))}

              {selectedStyle && (
                <p className="text-xs text-[#FFB400] mt-2">
                  Selected: {selectedStyle}
                </p>
              )}
            </CardContent>
          </Card>
        </aside>

        {/* MIDDLE — PROMPT + GENERATOR */}
        <main>
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Creative Concept Generator</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <textarea
                placeholder="Describe your scene, product, emotion, or concept... (e.g., warm luxury theme with soft sunlight reflections)"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-36 p-3 rounded-xl bg-black/20 border border-white/10 resize-none"
              />

              <Button
                className="flex items-center gap-2 w-full"
                onClick={generateArtDirection}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                Generate Art Direction
              </Button>

              <p className="text-xs text-muted-foreground mt-2">
                AI will generate a complete photoshoot direction, including
                lighting, angles, mood, and props.
              </p>
            </CardContent>
          </Card>
        </main>

        {/* RIGHT — Inspiration Grid */}
        <aside>
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Moodboard Inspiration</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-3">
              {[
                "https://images.unsplash.com/photo-1520975918319-258b6a2139f0?w=800",
                "https://images.unsplash.com/photo-1580910723167-8a1dba1dabfb?w=800",
                "https://images.unsplash.com/photo-1616627981468-22e9c5bcacae?w=800",
                "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800",
              ].map((img, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-white/10 hover:border-[#FFB400] transition cursor-pointer"
                >
                  <img src={img} alt="mood" className="object-cover h-28 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* ------------------------- ART DIRECTION DRAWER --------------------------- */}
      {previewDrawer && concept && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-xl bg-[#0E152E] border-l border-white/10 h-full p-6 overflow-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">AI Art Direction</h2>
              <button
                className="p-2 rounded hover:bg-white/10"
                onClick={() => setPreviewDrawer(false)}
              >
                <X />
              </button>
            </div>

            {/* Preview Image */}
            <div className="overflow-hidden rounded-xl border border-white/10">
              <img
                src={concept.reference}
                alt="concept"
                className="w-full h-64 object-cover"
              />
            </div>

            {/* Details */}
            <div className="space-y-4 mt-6">
              <div>
                <h3 className="font-semibold mb-1">Mood</h3>
                <p className="text-muted-foreground">{concept.mood}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Lighting</h3>
                <p className="text-muted-foreground">{concept.lighting}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Camera Angle</h3>
                <p className="text-muted-foreground">{concept.camera}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Color Palette</h3>
                <p className="text-muted-foreground">{concept.color}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Composition</h3>
                <p className="text-muted-foreground">{concept.composition}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Props Suggestion</h3>
                <ul className="list-disc pl-5 text-muted-foreground">
                  {concept.props.map((p: string, i: number) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Send to shoot */}
            <Button className="w-full mt-6 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Send to Shoot
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

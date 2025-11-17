"use client";

import { useState } from "react";
import {
  Sparkles,
  Filter,
  ChevronRight,
  X,
  ImageIcon,
  Layers,
  Loader2,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mockPacks = [
  {
    id: "p1",
    name: "Essential Pack",
    category: "Studio",
    description: "Perfect clean studio looks with soft shadows & neutral tones.",
    thumb: "https://images.unsplash.com/photo-1616627981468-22e9c5bcacae?q=80&w=800",
    samples: [
      "https://images.unsplash.com/photo-1555617117-08e9a0e5a5a5?w=800",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    ],
  },
  {
    id: "p2",
    name: "Dynamic Motion",
    category: "Motion",
    description: "Add dynamic movement & energy to product visuals.",
    thumb: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
    samples: [
      "https://images.unsplash.com/photo-1587809238102-f7f67f82005f?w=800",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
    ],
  },
  {
    id: "p3",
    name: "POV Lifestyle",
    category: "Lifestyle",
    description: "Realistic lifestyle views from first-person perspective.",
    thumb: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800",
    samples: [
      "https://images.unsplash.com/photo-1505876104692-2e2df49f7543?w=800",
      "https://images.unsplash.com/photo-1535295972055-1c4c6a55c2f3?w=800",
    ],
  },
  {
    id: "p4",
    name: "Plus Pack",
    category: "Premium",
    description: "High-end luxury styling with professional retouching.",
    thumb: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800",
    samples: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
      "https://images.unsplash.com/photo-1504198266285-165a16f0c54f?w=800",
    ],
  },
];

export default function CreativePacksPage() {
  const [selectedPack, setSelectedPack] = useState<any>(null);
  const [category, setCategory] = useState("All");
  const [isApplying, setIsApplying] = useState(false);

  const categories = ["All", "Studio", "Lifestyle", "Premium", "Motion"];

  const filteredPacks =
    category === "All"
      ? mockPacks
      : mockPacks.filter((p) => p.category === category);

  function applyPack() {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      alert("Creative Pack applied! (UI mock)");
    }, 1400);
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Creative Packs
          </h1>
          <p className="text-muted-foreground mt-1">
            Choose from hand-designed creative presets for instant styling.
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <Card className="mt-6 bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" /> Filters
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "px-4 py-1.5 rounded-full border text-sm transition",
                category === c
                  ? "border-[#FFB400] bg-[#FFB4000A]"
                  : "border-white/10 hover:border-white/20"
              )}
            >
              {c}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* PACKS GRID */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPacks.map((pack) => (
          <button
            key={pack.id}
            className="rounded-xl bg-white/5 border border-white/10 hover:border-[#FFB400] overflow-hidden transition shadow-lg hover:shadow-yellow-500/10 text-left"
            onClick={() => setSelectedPack(pack)}
          >
            <img
              src={pack.thumb}
              alt={pack.name}
              className="h-52 w-full object-cover"
            />

            <div className="p-4">
              <h3 className="font-semibold text-lg">{pack.name}</h3>
              <p className="text-xs text-[#FFB400] uppercase tracking-wide mt-1">
                {pack.category}
              </p>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {pack.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* ---------------------- Pack Detail Drawer ---------------------- */}
      {selectedPack && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-xl bg-[#0E152E] border-l border-white/10 h-full p-6 overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{selectedPack.name}</h2>
              <button
                onClick={() => setSelectedPack(null)}
                className="p-2 rounded hover:bg-white/10"
              >
                <X />
              </button>
            </div>

            {/* Thumbnail */}
            <div className="mt-4 rounded-xl overflow-hidden">
              <img
                src={selectedPack.thumb}
                alt="pack-preview"
                className="w-full h-64 object-cover"
              />
            </div>

            {/* Category */}
            <p className="mt-3 text-sm text-[#FFB400] uppercase tracking-wide">
              {selectedPack.category}
            </p>

            {/* Description */}
            <p className="mt-2 text-muted-foreground">{selectedPack.description}</p>

            {/* Samples */}
            <h3 className="text-lg font-semibold mt-6 mb-2">Sample Outputs</h3>
            <div className="grid grid-cols-2 gap-4">
              {selectedPack.samples.map((img: string, i: number) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden border border-white/10"
                >
                  <img
                    src={img}
                    alt="sample"
                    className="h-40 w-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-2">
              <Button
                className="flex items-center gap-2"
                onClick={applyPack}
                disabled={isApplying}
              >
                {isApplying ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Apply Pack
              </Button>

              <Button variant="outline" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Preview Styles
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

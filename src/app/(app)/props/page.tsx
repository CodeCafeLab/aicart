"use client";

import { useState } from "react";
import {
  Filter,
  Search,
  X,
  Plus,
  Sofa,
  TreePine,
  Lamp,
  Cpu,
  Sparkles,
  Loader2,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock backgrounds
const mockBackgrounds = [
  {
    id: "b1",
    name: "Minimal White Studio",
    category: "Studio",
    thumb:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=900&q=80",
  },
  {
    id: "b2",
    name: "Warm Interior Room",
    category: "Indoor",
    thumb:
      "https://images.unsplash.com/photo-1616594039964-ae9021b39d2e?w=900&q=80",
  },
  {
    id: "b3",
    name: "Modern Luxury Hall",
    category: "Luxury",
    thumb:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=900&q=80",
  },
  {
    id: "b4",
    name: "Street Urban Walls",
    category: "Urban",
    thumb:
      "https://images.unsplash.com/photo-1520975918319-258b6a2139f0?w=900&q=80",
  },
];

// Mock props
const mockProps = [
  {
    id: "p1",
    name: "Wooden Chair",
    type: "Furniture",
    icon: <Sofa className="h-6 w-6" />,
  },
  {
    id: "p2",
    name: "Indoor Plant",
    type: "Plant",
    icon: <TreePine className="h-6 w-6" />,
  },
  {
    id: "p3",
    name: "Studio Lamp",
    type: "Lighting",
    icon: <Lamp className="h-6 w-6" />,
  },
  {
    id: "p4",
    name: "Tech Display Pad",
    type: "Tech",
    icon: <Cpu className="h-6 w-6" />,
  },
];

export default function PropsPage() {
  const [selectedBg, setSelectedBg] = useState<any>(null);
  const [selectedProp, setSelectedProp] = useState<any>(null);
  const [category, setCategory] = useState("All");
  const [propFilter, setPropFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const bgCategories = ["All", "Studio", "Indoor", "Luxury", "Urban"];
  const propCategories = ["All", "Furniture", "Plant", "Lighting", "Tech"];

  const filteredBackgrounds =
    category === "All"
      ? mockBackgrounds
      : mockBackgrounds.filter((b) => b.category === category);

  const filteredProps =
    propFilter === "All"
      ? mockProps
      : mockProps.filter((p) => p.type === propFilter);

  function applyItem() {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      alert("Applied to scene (mock)");
    }, 1000);
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white">
      {/* HEADER */}
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Backgrounds & Props
        </h1>
        <p className="text-muted-foreground mt-1">
          Add backgrounds & props to enhance your AI scenes.
        </p>
      </div>

      {/* SEARCH & FILTERS */}
      <Card className="mt-6 bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" /> Filters & Search
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 opacity-60" />
            <input
              type="text"
              placeholder="Search backgrounds or props..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 p-3 rounded-xl bg-black/20 border border-white/10"
            />
          </div>

          {/* Background Category Filter */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Background Categories</h3>
            <div className="flex flex-wrap gap-2">
              {bgCategories.map((cat) => (
                <button
                  key={cat}
                  className={cn(
                    "px-4 py-1.5 rounded-full border text-sm transition",
                    category === cat
                      ? "border-[#FFB400] bg-[#FFB4000A]"
                      : "border-white/10 hover:border-white/20"
                  )}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Props Filter */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Prop Types</h3>
            <div className="flex flex-wrap gap-2">
              {propCategories.map((type) => (
                <button
                  key={type}
                  className={cn(
                    "px-4 py-1.5 rounded-full border text-sm transition",
                    propFilter === type
                      ? "border-[#FFB400] bg-[#FFB4000A]"
                      : "border-white/10 hover:border-white/20"
                  )}
                  onClick={() => setPropFilter(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* -------- BACKGROUNDS GRID -------- */}
      <h2 className="mt-10 mb-3 font-bold text-xl">Backgrounds</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBackgrounds.map((bg) => (
          <button
            key={bg.id}
            className="rounded-xl bg-white/5 border border-white/10 hover:border-[#FFB400] overflow-hidden transition text-left shadow-lg hover:shadow-yellow-500/10"
            onClick={() => setSelectedBg(bg)}
          >
            <img
              src={bg.thumb}
              alt={bg.name}
              className="h-52 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{bg.name}</h3>
              <p className="text-xs text-[#FFB400] uppercase tracking-wide mt-1">
                {bg.category}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* -------- PROPS GRID -------- */}
      <h2 className="mt-10 mb-3 font-bold text-xl">Props</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {filteredProps.map((prop) => (
          <button
            key={prop.id}
            className="rounded-xl bg-white/5 border border-white/10 hover:border-[#FFB400] p-6 transition text-center shadow hover:shadow-yellow-500/10 flex flex-col items-center gap-3"
            onClick={() => setSelectedProp(prop)}
          >
            <div className="p-4 bg-black/20 border border-white/10 rounded-xl">
              {prop.icon}
            </div>
            <div className="font-medium">{prop.name}</div>
            <div className="text-xs text-muted-foreground">{prop.type}</div>
          </button>
        ))}
      </div>

      {/* -------------------- BACKGROUND PREVIEW DRAWER -------------------- */}
      {selectedBg && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
          <div className="w-full max-w-xl bg-[#0E152E] border-l border-white/10 h-full p-6 overflow-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{selectedBg.name}</h2>
              <button
                onClick={() => setSelectedBg(null)}
                className="p-2 rounded hover:bg-white/10"
              >
                <X />
              </button>
            </div>

            <div className="mt-4 rounded-xl overflow-hidden">
              <img
                src={selectedBg.thumb}
                alt="Background Preview"
                className="w-full h-64 object-cover"
              />
            </div>

            {/* Apply */}
            <Button
              className="mt-6 flex items-center gap-2"
              onClick={applyItem}
              disabled={isApplying}
            >
              {isApplying ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add Background to Scene
            </Button>
          </div>
        </div>
      )}

      {/* -------------------- PROP PREVIEW DRAWER -------------------- */}
      {selectedProp && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
          <div className="w-full max-w-md bg-[#0E152E] border-l border-white/10 h-full p-6 overflow-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedProp.name}</h2>
              <button
                onClick={() => setSelectedProp(null)}
                className="p-2 rounded hover:bg-white/10"
              >
                <X />
              </button>
            </div>

            <div className="mt-6 p-6 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center">
              <div className="p-6 bg-black/20 border border-white/10 rounded-xl mb-4">
                {selectedProp.icon}
              </div>

              <p className="text-muted-foreground text-sm">
                Type: {selectedProp.type}
              </p>

              {/* Apply */}
              <Button
                className="mt-6 w-full flex items-center gap-2"
                onClick={applyItem}
                disabled={isApplying}
              >
                {isApplying ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Add Prop to Scene
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

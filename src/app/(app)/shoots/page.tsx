"use client";

import { useState, useRef } from "react";
import {
  UploadCloud,
  Layers,
  Wand2,
  Sparkles,
  Sun,
  Camera,
  Users,
  ImageIcon,
  Trash2,
  Settings,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * AI SHOOTS WORKSPACE — FULL RESPONSIVE DESIGN
 *
 * 3-panel layout:
 *  - Left: Toolbar
 *  - Middle: Canvas
 *  - Right: Inspector (layers, scene, avatar, lighting, camera)
 *
 * Works on all screen sizes (smartphones → 4K).
 */

export default function AiShootsPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string>("upload");

  const [layers, setLayers] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const tools = [
    { id: "upload", name: "Upload", icon: <UploadCloud className="w-5 h-5" /> },
    { id: "layers", name: "Layers", icon: <Layers className="w-5 h-5" /> },
    { id: "effects", name: "Effects", icon: <Wand2 className="w-5 h-5" /> },
    { id: "lighting", name: "Lighting", icon: <Sun className="w-5 h-5" /> },
    { id: "camera", name: "Camera", icon: <Camera className="w-5 h-5" /> },
    { id: "avatar", name: "Avatar", icon: <Users className="w-5 h-5" /> },
  ];

  const handleUpload = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setLayers((prev) => [...prev, file.name]);
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-gradient-to-b from-[#071029] to-[#0E152E] text-white">
      {/* PAGE HEADER */}
      <div className="p-4 md:p-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          AI Shoots Workspace
        </h1>
        <p className="text-muted-foreground mt-1">
          Build, edit & generate AI-enhanced product shoots.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="flex flex-1 overflow-hidden">
        {/* ---------------- LEFT TOOLBAR ---------------- */}
        <aside className="w-20 bg-white/5 backdrop-blur-md border-r border-white/10 flex flex-col items-center py-6 gap-6 sticky left-0 top-0">
          {tools.map((t) => (
            <button
              key={t.id}
              className={cn(
                "p-3 rounded-xl transition hover:bg-white/10 flex flex-col items-center gap-1 text-xs",
                activeTool === t.id && "bg-white/10 border border-[#FFB400]"
              )}
              onClick={() => setActiveTool(t.id)}
            >
              {t.icon}
              <span>{t.name}</span>
            </button>
          ))}
        </aside>

        {/* ---------------- CANVAS AREA ---------------- */}
        <main className="flex-1 flex flex-col p-4 md:p-6 overflow-auto">
          <Card className="h-full bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Canvas</CardTitle>
              <span className="text-xs text-muted-foreground">
                {imageUrl ? "1 Layer" : "Empty Canvas"}
              </span>
            </CardHeader>

            <CardContent className="h-[70vh] flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Uploaded asset"
                  className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                />
              ) : (
                <div
                  className="text-center text-muted-foreground border-2 border-dashed border-white/20 rounded-xl p-10 cursor-pointer hover:border-[#FFB400] transition"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="mx-auto h-12 w-12 mb-3 opacity-60" />
                  <p className="">Click to upload an asset</p>
                  <p className="text-xs mt-1">PNG / JPG / WEBP up to 50MB</p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUpload(e.target.files?.[0] ?? undefined)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        {/* ---------------- RIGHT INSPECTOR PANEL ---------------- */}
        <aside className="hidden xl:flex flex-col w-96 border-l border-white/10 bg-white/5 backdrop-blur-md p-4 overflow-auto gap-6">

          {/* LAYERS PANEL */}
          {activeTool === "layers" && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Layers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {layers.length ? (
                  layers.map((l, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-white/5 p-3 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 opacity-60" />
                        <span className="text-sm">{l}</span>
                      </div>
                      <button
                        onClick={() =>
                          setLayers((prev) => prev.filter((x) => x !== l))
                        }
                      >
                        <Trash2 className="w-4 h-4 text-red-400 hover:text-red-500" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No layers yet</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* EFFECTS */}
          {activeTool === "effects" && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Effects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm">Brightness</label>
                  <input type="range" min={-100} max={100} className="w-full" />
                </div>

                <div>
                  <label className="text-sm">Contrast</label>
                  <input type="range" min={-100} max={100} className="w-full" />
                </div>

                <div>
                  <label className="text-sm">Saturation</label>
                  <input type="range" min={-100} max={100} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* LIGHTING */}
          {activeTool === "lighting" && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Lighting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm">Temperature</label>
                  <input type="range" min={2500} max={9000} className="w-full" />
                </div>

                <div>
                  <label className="text-sm">Shadow Depth</label>
                  <input type="range" min={0} max={100} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* CAMERA */}
          {activeTool === "camera" && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Camera</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm">Aperture (f)</label>
                  <input type="range" min={1.4} max={16} step={0.1} className="w-full" />
                </div>

                <div>
                  <label className="text-sm">Focal Length (mm)</label>
                  <input type="range" min={20} max={200} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* AVATAR */}
          {activeTool === "avatar" && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Avatar Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Coming soon</p>
                <Button size="sm">Open Avatar Library</Button>
              </CardContent>
            </Card>
          )}

          {/* DEFAULT (UPLOAD TOOL) */}
          {activeTool === "upload" && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Upload Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full mb-3"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload New Layer
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleUpload(e.target.files?.[0] ?? undefined)}
                />

                <p className="text-xs text-muted-foreground">
                  Supports PNG, JPG, WEBP
                </p>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>

      {/* ---------------- MOBILE INSPECTOR DRAWER ---------------- */}
      <MobileDrawer
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        layers={layers}
        setLayers={setLayers}
      />
    </div>
  );
}

/* --------------------- MOBILE DRAWER COMPONENT --------------------- */

function MobileDrawer({
  activeTool,
  setActiveTool,
  layers,
  setLayers,
}: {
  activeTool: string;
  setActiveTool: (id: string) => void;
  layers: string[];
  setLayers: (l: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const renderMobilePanel = () => {
    switch (activeTool) {
      case "layers":
        return (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Layers</h3>
            {layers.length ? (
              layers.map((l, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white/10 p-2 rounded"
                >
                  <span>{l}</span>
                  <Trash2
                    className="h-4 w-4 text-red-400"
                    onClick={() =>
                      setLayers(layers.filter((x) => x !== l))
                    }
                  />
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No layers added</p>
            )}
          </div>
        );

      case "effects":
        return (
          <div>
            <h3 className="font-semibold mb-2 text-lg">Effects</h3>
            <label className="block mb-4">
              <span className="text-sm">Brightness</span>
              <input type="range" className="w-full" />
            </label>
            <label className="block mb-4">
              <span className="text-sm">Contrast</span>
              <input type="range" className="w-full" />
            </label>
          </div>
        );

      default:
        return <p className="text-sm text-muted-foreground">Select a tool</p>;
    }
  };

  return (
    <>
      {/* Floating toggle button on mobile */}
      <button
        className="xl:hidden fixed bottom-5 right-5 bg-[#FFB400] text-[#071029] p-4 rounded-full shadow-lg hover:scale-105 transition"
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronDown /> : <Settings />}
      </button>

      {/* Drawer */}
      {open && (
        <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-[#071029] border-t border-white/10 p-4 max-h-[50vh] overflow-auto rounded-t-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Tools</h2>
            <button onClick={() => setOpen(false)}>
              <ChevronDown />
            </button>
          </div>

          {renderMobilePanel()}
        </div>
      )}
    </>
  );
}

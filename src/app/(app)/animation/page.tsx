"use client";

import { useState, useRef } from "react";
import {
  UploadCloud,
  Play,
  Pause,
  RefreshCw,
  Loader2,
  X,
  Film,
  CirclePlay,
  CircleDashed,
  ArrowLeftRight,
  Sparkles,
  Timer,
  RotateCcw,
  Download,
  Video,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Animation types
const animationTypes = [
  { id: "spin", name: "360° Spin", icon: <RotateCcw className="h-5 w-5" /> },
  { id: "catwalk", name: "Catwalk Loop", icon: <CirclePlay className="h-5 w-5" /> },
  { id: "float", name: "Floating Product", icon: <CircleDashed className="h-5 w-5" /> },
  { id: "zoom", name: "Slow Zoom In", icon: <Video className="h-5 w-5" /> },
  { id: "orbit", name: "Orbit Movement", icon: <ArrowLeftRight className="h-5 w-5" /> },
  { id: "parallax", name: "Parallax Motion", icon: <Film className="h-5 w-5" /> },
];

export default function AnimationPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const [speed, setSpeed] = useState(1.2);
  const [duration, setDuration] = useState(3);
  const [fps, setFps] = useState(30);
  const [loop, setLoop] = useState(true);

  const [isGenerating, setIsGenerating] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const handleUpload = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSelectedImage(url);
  };

  const generateAnimation = () => {
    if (!selectedImage || !selectedType) return;

    setIsGenerating(true);
    setOutputUrl(null);

    setTimeout(() => {
      setIsGenerating(false);
      setOutputUrl(selectedImage); // mock animation
    }, 2000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white">
      {/* HEADER */}
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Animation Studio
        </h1>
        <p className="text-muted-foreground mt-1">
          Generate dynamic animations for your products or avatars.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[350px,1fr,350px] gap-6">

        {/* LEFT: ANIMATION TYPES */}
        <aside className="space-y-6">
          {/* Upload */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Upload Asset</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-white/20 rounded-xl p-5 text-center cursor-pointer hover:border-[#FFB400] transition"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="mx-auto h-12 w-12 opacity-60" />
                <p className="mt-2">Upload product or avatar</p>
                <p className="text-xs text-muted-foreground">
                  PNG / JPG / WEBP up to 50MB
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files?.[0] ?? undefined)}
                />
              </div>

              {selectedImage && (
                <div className="mt-4 rounded-xl overflow-hidden border border-white/20">
                  <img
                    src={selectedImage}
                    alt="uploaded"
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Animation Types */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Animation Types</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {animationTypes.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedType(a.id)}
                  className={cn(
                    "w-full flex gap-4 items-center p-3 rounded-xl border transition",
                    selectedType === a.id
                      ? "border-[#FFB400] bg-[#FFB4000A]"
                      : "border-white/10 hover:border-white/20"
                  )}
                >
                  {a.icon}
                  <div>
                    <p className="font-semibold">{a.name}</p>
                    <p className="text-xs text-muted-foreground">Preset</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </aside>

        {/* CENTER: PREVIEW */}
        <main className="flex flex-col gap-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Animation Preview</CardTitle>
            </CardHeader>

            <CardContent className="flex items-center justify-center h-[60vh] overflow-hidden">
              {!selectedImage && (
                <div className="text-center text-muted-foreground">
                  <UploadCloud className="mx-auto h-10 w-10 opacity-50 mb-3" />
                  <p>No asset uploaded yet</p>
                </div>
              )}

              {selectedImage && !outputUrl && !isGenerating && (
                <div className="text-center">
                  <img
                    src={selectedImage}
                    alt="preview"
                    className="max-h-[55vh] rounded-xl shadow-xl object-contain"
                  />
                  <p className="text-sm text-muted-foreground mt-3">
                    Select an animation type to preview
                  </p>
                </div>
              )}

              {/* GENERATING */}
              {isGenerating && (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p>Generating animation…</p>
                </div>
              )}

              {/* FINAL OUTPUT */}
              {outputUrl && (
                <div className="relative">
                  <img
                    src={outputUrl}
                    alt="result"
                    className="max-h-[55vh] rounded-xl shadow-xl object-contain animate-pulse"
                  />
                  <div className="absolute bottom-3 right-3 bg-black/40 px-3 py-1 rounded-full text-xs">
                    Preview Animation (Mock)
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        {/* RIGHT: CONTROLS */}
        <aside className="space-y-6">
          {/* Animation Controls */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Animation Controls</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Speed */}
              <div>
                <label className="text-sm">Speed</label>
                <input
                  type="range"
                  min={0.2}
                  max={3}
                  step={0.1}
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {speed.toFixed(1)}x
                </p>
              </div>

              {/* Duration */}
              <div>
                <label className="text-sm">Duration</label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {duration}s
                </p>
              </div>

              {/* FPS */}
              <div>
                <label className="text-sm">FPS</label>
                <input
                  type="range"
                  min={12}
                  max={60}
                  value={fps}
                  onChange={(e) => setFps(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">{fps} fps</p>
              </div>

              {/* Loop toggle */}
              <div className="flex items-center justify-between">
                <p className="text-sm">Loop Animation</p>
                <button
                  onClick={() => setLoop(!loop)}
                  className={cn(
                    "px-3 py-1 rounded-full border",
                    loop
                      ? "border-[#FFB400] bg-[#FFB4000A]"
                      : "border-white/10"
                  )}
                >
                  {loop ? "On" : "Off"}
                </button>
              </div>

              {/* Generate */}
              <Button
                className="w-full mt-3 flex items-center gap-2"
                onClick={generateAnimation}
                disabled={!selectedImage || !selectedType || isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Generate Animation
              </Button>
            </CardContent>
          </Card>

          {/* EXPORT */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Export</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {outputUrl ? (
                <>
                  <Button className="w-full flex items-center gap-2">
                    <Download className="h-4 w-4" /> Download MP4
                  </Button>
                  <Button className="w-full flex items-center gap-2">
                    <Download className="h-4 w-4" /> Download GIF
                  </Button>
                  <Button className="w-full flex items-center gap-2">
                    <Download className="h-4 w-4" /> Download WebM
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Generate an animation to download.
                </p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

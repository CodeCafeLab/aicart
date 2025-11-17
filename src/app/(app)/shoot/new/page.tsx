"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle,
  UploadCloud,
  ChevronRight,
  Shirt,
  Sparkles,
  Lightbulb,
  Palette,
  Users,
  Footprints,
  Gem,
  Blend,
  Lamp,
  Utensils,
  Computer,
  ImageIcon,
  X,
  Loader2,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const productTypes = [
  { name: "Apparel", icon: <Shirt className="h-5 w-5" /> },
  { name: "Jewelry", icon: <Gem className="h-5 w-5" /> },
  { name: "Footwear", icon: <Footprints className="h-5 w-5" /> },
  { name: "Cosmetics", icon: <Blend className="h-5 w-5" /> },
  { name: "Tech Gadgets", icon: <Computer className="h-5 w-5" /> },
  { name: "Home Decor", icon: <Lamp className="h-5 w-5" /> },
  { name: "Food & Beverage", icon: <Utensils className="h-5 w-5" /> },
];

const mockAvatars = [
  { id: "a1", name: "Maya", img: "https://i.pravatar.cc/380?img=47", tags: ["Female", "Casual"] },
  { id: "a2", name: "Ravi", img: "https://i.pravatar.cc/380?img=12", tags: ["Male", "Formal"] },
  { id: "a3", name: "Lina", img: "https://i.pravatar.cc/380?img=22", tags: ["Neutral", "Street"] },
  { id: "a4", name: "Ishaan", img: "https://i.pravatar.cc/380?img=56", tags: ["Male", "Sporty"] },
];

const mockScenes = [
  { id: "s1", name: "Studio Minimal", thumb: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1200&auto=format&fit=crop&crop=entropy" },
  { id: "s2", name: "Urban Edge", thumb: "https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1200&auto=format&fit=crop&crop=entropy" },
  { id: "s3", name: "Coastal Zen", thumb: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop&crop=entropy" },
  { id: "s4", name: "Luxury Interior", thumb: "https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1200&auto=format&fit=crop&crop=entropy" },
];

type GeneratedImage = { id: string; url: string; variant: string };

export default function NewShootPageImproved() {
  const [selectedProductType, setSelectedProductType] = useState<string | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [productPreviewUrl, setProductPreviewUrl] = useState<string | null>(null);
  const [processedPreviewUrl, setProcessedPreviewUrl] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [showCreateAvatarModal, setShowCreateAvatarModal] = useState(false);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [scenePrompt, setScenePrompt] = useState<string>("Premium studio with soft purple lights and wooden floor");
  const [isGeneratingScene, setIsGeneratingScene] = useState(false);
  const [brightness, setBrightness] = useState(0);
  const [temperature, setTemperature] = useState(5500);
  const [shadowDepth, setShadowDepth] = useState(50);
  const [aperture, setAperture] = useState(2.8);
  const [focalLength, setFocalLength] = useState(35);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateStage, setGenerateStage] = useState<number>(0);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const generateStages = [
    "Preparing product",
    "Merging avatar",
    "Applying scene",
    "Adjusting lighting",
    "Rendering final output",
  ];
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (productPreviewUrl) URL.revokeObjectURL(productPreviewUrl);
      if (processedPreviewUrl) URL.revokeObjectURL(processedPreviewUrl);
    };
  }, [productPreviewUrl, processedPreviewUrl]);

  function handleFileSelected(file?: File | null) {
    if (!file) return;
    setProductFile(file);
    const url = URL.createObjectURL(file);
    setProductPreviewUrl(url);

    setTimeout(() => {
      setProcessedPreviewUrl(url);
    }, 600);
  }

  function onFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    handleFileSelected(f);
  }

  function onDropFile(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0] ?? null;
    handleFileSelected(f);
  }

  async function generateSceneFromPrompt() {
    if (!scenePrompt.trim()) return;
    setIsGeneratingScene(true);
    await new Promise((r) => setTimeout(r, 1200));
    const random = mockScenes[Math.floor(Math.random() * mockScenes.length)];
    setSelectedScene(random.id);
    setIsGeneratingScene(false);
  }

  function startGenerate() {
    if (!productFile) {
      alert("Please upload a product image before generating.");
      return;
    }
    if (!selectedAvatar) {
      alert("Please select an avatar.");
      return;
    }
    if (!selectedScene) {
      alert("Please select or generate a scene.");
      return;
    }

    setIsGenerating(true);
    setGenerateStage(0);
    setGeneratedImages([]);
    let stage = 0;
    const interval = setInterval(() => {
      stage += 1;
      setGenerateStage(stage);
      if (stage >= generateStages.length) {
        clearInterval(interval);
        const results: GeneratedImage[] = new Array(6).fill(null).map((_, i) => ({
          id: `g-${Date.now()}-${i}`,
          url: productPreviewUrl ?? `https://picsum.photos/800/1000?random=${Math.floor(Math.random() * 1000) + i}`,
          variant: `Variant ${i + 1}`,
        }));
        setTimeout(() => {
          setGeneratedImages(results);
          setIsGenerating(false);
        }, 400);
      }
    }, 900);
  }

  function handleDownload(img: GeneratedImage) {
    const a = document.createElement("a");
    a.href = img.url;
    a.download = `${img.id}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }


  return (
    <div className="min-h-screen">
       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Start New Shoot</h1>
          <p className="text-muted-foreground">Create a professional shoot in minutes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
        <div className="space-y-8">
          {/* STEP 1: PRODUCT */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shirt className="h-5 w-5" /> Product</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Select Product Type (Optional)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {productTypes.map((type) => {
                    const active = selectedProductType === type.name;
                    return (
                      <button
                        aria-pressed={active}
                        key={type.name}
                        onClick={() => setSelectedProductType(type.name)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 rounded-xl border transition",
                          active
                            ? "border-2 border-primary bg-primary/10 shadow-md"
                            : "border-border hover:border-primary/60"
                        )}
                      >
                        <div className="p-2 rounded-md bg-card/80">
                          {React.cloneElement(type.icon as any, { className: "h-6 w-6" })}
                        </div>
                        <span className="text-sm font-medium text-center">{type.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div
                onDrop={onDropFile}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed rounded-xl p-4 bg-transparent transition hover:border-primary/60"
              >
                  <label
                    htmlFor="file-input"
                    className="flex flex-col items-center justify-center gap-4 p-6 rounded-lg cursor-pointer"
                  >
                    <UploadCloud className="h-12 w-12 text-muted-foreground" />
                    <Button
                      variant="outline"
                      onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
                      className="flex items-center gap-2"
                    >
                      Upload Product Image
                    </Button>
                    <input
                      id="file-input"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={onFileInputChange}
                      className="sr-only"
                    />
                    <p className="text-sm text-muted-foreground mt-1">or drag & drop image here (PNG, JPG)</p>
                  </label>
              </div>
            </CardContent>
          </Card>

          {/* STEP 2: AVATAR */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Avatar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {mockAvatars.map((a) => {
                    const active = selectedAvatar === a.id;
                    return (
                      <button
                        key={a.id}
                        onClick={() => setSelectedAvatar(a.id)}
                        className={cn(
                          "p-2 rounded-xl border transition flex flex-col items-center gap-2",
                          active ? "border-2 border-primary bg-primary/10 shadow" : "border-border hover:border-primary/60"
                        )}
                        aria-pressed={active}
                      >
                        <img src={a.img} alt={a.name} className="h-28 w-28 rounded-md object-cover" />
                        <div className="text-sm font-medium">{a.name}</div>
                        <div className="text-xs text-muted-foreground">{a.tags.join(" • ")}</div>
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setShowCreateAvatarModal(true)}
                    className="p-2 rounded-xl border-dashed border-2 border-border flex items-center justify-center"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="rounded-full p-3 bg-card mb-2">
                        <Users className="h-6 w-6" />
                      </div>
                      <div className="text-sm font-medium">Create Custom</div>
                      <div className="text-xs text-muted-foreground">Customize an avatar</div>
                    </div>
                  </button>
                </div>
            </CardContent>
          </Card>

          {/* STEP 3: SCENE */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" /> Scene</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {mockScenes.map((s) => {
                  const active = selectedScene === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedScene(s.id)}
                      className={cn(
                        "rounded-lg overflow-hidden border",
                        active ? "border-2 border-primary" : "border-border hover:scale-[1.02] transition"
                      )}
                    >
                      <img src={s.thumb} alt={s.name} className="h-36 w-full object-cover" />
                      <div className="p-2">
                        <div className="text-sm font-medium">{s.name}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">AI Scene Generator</h4>
                  <textarea
                    value={scenePrompt}
                    onChange={(e) => setScenePrompt(e.target.value)}
                    className="w-full p-2 rounded border resize-none bg-background text-foreground"
                    rows={3}
                    placeholder="e.g. premium studio with soft purple lights..."
                  />
                  <div className="flex gap-2 justify-end mt-2">
                    <Button onClick={generateSceneFromPrompt} disabled={isGeneratingScene}>
                      {isGeneratingScene ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                      Generate Scene
                    </Button>
                  </div>
              </div>
            </CardContent>
          </Card>

          {/* STEP 4: LIGHTING & CAMERA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" /> Lighting & Camera</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Brightness ({brightness})</span>
                    <input type="range" min={-100} max={100} value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Temperature ({temperature}K)</span>
                    <input type="range" min={2500} max={9000} value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} />
                  </label>
              </div>
              <div className="space-y-4">
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Aperture (f/{aperture.toFixed(1)})</span>
                    <input type="range" min={1.4} max={16} step={0.1} value={aperture} onChange={(e) => setAperture(Number(e.target.value))} />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Focal Length ({focalLength}mm)</span>
                    <input type="range" min={20} max={200} value={focalLength} onChange={(e) => setFocalLength(Number(e.target.value))} />
                  </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <aside className="lg:sticky top-24 h-fit space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                {selectedScene && <img src={mockScenes.find(s => s.id === selectedScene)?.thumb} className="absolute inset-0 w-full h-full object-cover" />}
                {selectedAvatar && <img src={mockAvatars.find(a => a.id === selectedAvatar)?.img} className="absolute h-3/4 bottom-0" />}
                {productPreviewUrl && <img src={productPreviewUrl} className="relative z-10 w-1/2 object-contain" />}
                {!productPreviewUrl && (
                  <div className="text-center text-muted-foreground z-20">
                    <ImageIcon className="mx-auto mb-2" />
                    <p>Upload a product to start</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary"/> Generate</CardTitle>
            </CardHeader>
            <CardContent>
               <Button onClick={startGenerate} size="lg" className="w-full" disabled={isGenerating}>
                {isGenerating ? <Loader2 className="animate-spin" /> : "Start Shoot"}
              </Button>

              {isGenerating && (
                 <div className="flex flex-col items-center justify-center gap-3 mt-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <div className="text-sm text-muted-foreground">{generateStages[generateStage]}...</div>
                 </div>
              )}

              {generatedImages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Output Gallery</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {generatedImages.slice(0, 4).map((g) => (
                        <div key={g.id} className="rounded-lg overflow-hidden bg-card border">
                          <img src={g.url} alt={g.variant} className="object-cover h-32 w-full" />
                          <div className="p-2 flex items-center justify-between">
                            <div className="text-xs">{g.variant}</div>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDownload(g)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

        </aside>
      </div>

       {showCreateAvatarModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowCreateAvatarModal(false)}
          />
          <Card className="relative z-10 w-full max-w-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create Avatar (Mock)</h3>
              <button onClick={() => setShowCreateAvatarModal(false)} className="p-1 rounded">
                <X />
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

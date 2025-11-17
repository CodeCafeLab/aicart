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
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Product", icon: <Shirt className="h-5 w-5" /> },
  { id: 2, title: "Avatar", icon: <Users className="h-5 w-5" /> },
  { id: 3, title: "Scene", icon: <Palette className="h-5 w-5" /> },
  { id: 4, title: "Lighting", icon: <Lightbulb className="h-5 w-5" /> },
  { id: 5, title: "Generate", icon: <Sparkles className="h-5 w-5" /> },
];

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
  const [currentStep, setCurrentStep] = useState<number>(1);
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
      setCurrentStep(1);
      return;
    }
    if (!selectedAvatar) {
      alert("Please select an avatar.");
      setCurrentStep(2);
      return;
    }
    if (!selectedScene) {
      alert("Please select or generate a scene.");
      setCurrentStep(3);
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

  function gotoStep(n: number) {
    setCurrentStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleContinue() {
    if (currentStep < 5) {
      const next = Math.min(currentStep + 1, 5);
      setCurrentStep(next);
    } else {
      startGenerate();
    }
  }

  function renderStep() {
    switch (currentStep) {
      case 1:
        return (
          <section className="space-y-8 animate-in fade-in">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Select Product Type (Optional)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
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
                          ? "border-2 border-[#FFB400] bg-[#FFB400]/10 shadow-md"
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
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 w-full">
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

                <div className="w-full md:w-72 flex flex-col gap-2">
                  <p className="text-sm font-medium">Preview</p>
                  <Card className="h-48 w-full bg-muted/10 flex items-center justify-center overflow-hidden">
                    {productPreviewUrl ? (
                      <img
                        src={productPreviewUrl}
                        alt="Product preview"
                        className="object-contain h-full w-full"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="mx-auto mb-2" />
                        <div className="text-xs">No image uploaded</div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          </section>
        );
      case 2:
        return (
          <section className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-bold">Choose Your Model</h2>
              <p className="text-sm text-muted-foreground max-w-xl">Select a model/avatar to showcase the product.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {mockAvatars.map((a) => {
                  const active = selectedAvatar === a.id;
                  return (
                    <button
                      key={a.id}
                      onClick={() => setSelectedAvatar(a.id)}
                      className={cn(
                        "p-2 rounded-xl border transition flex flex-col items-center gap-2",
                        active ? "border-2 border-green-500 bg-green-500/10 shadow" : "border-border hover:border-primary/60"
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

              <aside className="md:w-80">
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">Selected Avatar</h4>
                      <p className="text-xs text-muted-foreground">Preview & quick controls</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    {selectedAvatar ? (
                      <>
                        <img
                          src={mockAvatars.find((m) => m.id === selectedAvatar)!.img}
                          alt="Selected avatar"
                          className="h-40 w-40 object-cover rounded-md"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => alert("Try-on simulated")}>Try on product</Button>
                          <Button size="sm" variant="outline" onClick={() => setSelectedAvatar(null)}>
                            Remove
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-40 w-40 bg-muted/10 rounded-md flex items-center justify-center">
                          <Users className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div className="text-sm text-muted-foreground">No avatar selected</div>
                      </>
                    )}
                  </div>
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
          </section>
        );
      case 3:
        return (
          <section className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-bold">Choose a Scene</h2>
              <p className="text-sm text-muted-foreground max-w-xl">Select a background or generate one with AI.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {mockScenes.map((s) => {
                  const active = selectedScene === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedScene(s.id)}
                      className={cn(
                        "rounded-lg overflow-hidden border transition",
                        active ? "border-2 border-primary" : "border-border hover:scale-[1.02]"
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

              <aside className="space-y-3">
                <Card className="p-3">
                  <h4 className="font-semibold">AI Scene Generator</h4>
                  <textarea
                    value={scenePrompt}
                    onChange={(e) => setScenePrompt(e.target.value)}
                    className="w-full mt-2 p-2 rounded border resize-none bg-background text-foreground"
                    rows={4}
                  />
                  <div className="flex gap-2 justify-end mt-2">
                    <Button onClick={generateSceneFromPrompt} disabled={isGeneratingScene}>
                      {isGeneratingScene ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                      Generate
                    </Button>
                  </div>
                </Card>
              </aside>
            </div>
          </section>
        );
      case 4:
        return (
          <section className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-bold">Lighting & Camera</h2>
              <p className="text-sm text-muted-foreground max-w-xl">Fine tune lighting and camera.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <Card className="p-4">
                  <div className="space-y-3">
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Brightness ({brightness})</span>
                      <input type="range" min={-100} max={100} value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Temperature ({temperature}K)</span>
                      <input type="range" min={2500} max={9000} value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} />
                    </label>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="space-y-3">
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Aperture (f/{aperture.toFixed(1)})</span>
                      <input type="range" min={1.4} max={16} step={0.1} value={aperture} onChange={(e) => setAperture(Number(e.target.value))} />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Focal Length ({focalLength}mm)</span>
                      <input type="range" min={20} max={200} value={focalLength} onChange={(e) => setFocalLength(Number(e.target.value))} />
                    </label>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        );
      case 5:
        return (
          <section className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-bold">Generate Shoot</h2>
              <p className="text-sm text-muted-foreground">Start rendering your configured shoot.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <Card className="p-4">
                  <div className="mt-4 h-80 flex items-center justify-center bg-muted/10 rounded">
                    {isGenerating ? (
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <div className="text-sm">Rendering: {generateStage}/{generateStages.length}</div>
                      </div>
                    ) : generatedImages.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2 w-full p-2">
                        {generatedImages.map((g) => (
                          <div key={g.id} className="rounded overflow-hidden bg-white/5">
                            <img src={g.url} alt={g.variant} className="object-cover h-36 w-full" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-sm">Click Start to render.</div>
                    )}
                  </div>
                </Card>

                {generatedImages.length > 0 && (
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Output Gallery</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {generatedImages.map((g) => (
                        <div key={g.id} className="rounded overflow-hidden bg-card">
                          <img src={g.url} alt={g.variant} className="object-cover h-44 w-full" />
                          <div className="p-2 flex items-center justify-between">
                            <div className="text-sm">{g.variant}</div>
                            <Button size="sm" variant="ghost" onClick={() => handleDownload(g)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </section>
        );
      default:
        return <div>Unknown step</div>;
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-4">
            <div>
              <h1 className="text-2xl font-bold">Start New Shoot</h1>
              <p className="text-sm text-muted-foreground mt-1">Create a professional shoot in minutes.</p>
            </div>

            <div className="space-y-2">
              {steps.map((s) => {
                const active = currentStep === s.id;
                const completed = currentStep > s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => gotoStep(s.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg transition text-left",
                      active ? "bg-white/10 border border-primary shadow" : "hover:bg-white/5"
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", active ? "bg-primary text-primary-foreground" : "bg-card")}>
                      {completed ? <CheckCircle className="h-5 w-5 text-green-500" /> : s.icon}
                    </div>
                    <div>
                      <div className="font-medium">{s.title}</div>
                      <div className="text-xs text-muted-foreground">Step {s.id}</div>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5" />
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="lg:col-span-9">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold">Step {currentStep} — {steps.find(s => s.id === currentStep)?.title}</h2>
          </div>

          <div className="space-y-8">
            {renderStep()}
          </div>

          <div className="mt-8 pt-6 border-t border-border flex justify-end">
            <Button onClick={handleContinue} size="lg" disabled={isGenerating}>
              {isGenerating ? <Loader2 className="animate-spin" /> : (currentStep < 5 ? "Continue" : "Start Shoot")}
              {currentStep < 5 && <ChevronRight className="ml-2 h-5 w-5" />}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}

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

/**
 * START NEW SHOOT PAGE
 *
 * - 4-step wizard + Generate step
 * - Upload preview, avatar select, scene select, lighting sliders
 * - Simulated generate pipeline with progress stages
 * - Download/save results (simulated)
 *
 * NOTE: this is self-contained UI. Replace mocks with real API calls as needed.
 */

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

  // Product & upload state
  const [selectedProductType, setSelectedProductType] = useState<string | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [productPreviewUrl, setProductPreviewUrl] = useState<string | null>(null);
  const [processedPreviewUrl, setProcessedPreviewUrl] = useState<string | null>(null); // simulated bg removed

  // Avatar state
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [showCreateAvatarModal, setShowCreateAvatarModal] = useState(false);

  // Scene state
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [scenePrompt, setScenePrompt] = useState<string>("Premium studio with soft purple lights and wooden floor");
  const [isGeneratingScene, setIsGeneratingScene] = useState(false);

  // Lighting & camera
  const [brightness, setBrightness] = useState(0);
  const [temperature, setTemperature] = useState(5500);
  const [shadowDepth, setShadowDepth] = useState(50);
  const [aperture, setAperture] = useState(2.8);
  const [focalLength, setFocalLength] = useState(35);

  // Generate pipeline
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

  // refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // cleanup preview url
  useEffect(() => {
    return () => {
      if (productPreviewUrl) URL.revokeObjectURL(productPreviewUrl);
      if (processedPreviewUrl) URL.revokeObjectURL(processedPreviewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle local upload
  function handleFileSelected(file?: File | null) {
    if (!file) return;
    setProductFile(file);
    const url = URL.createObjectURL(file);
    setProductPreviewUrl(url);

    // simulate background removal by creating a "processed" variant using same blob (for mock)
    // In real app, call an API to process background removal and set processedPreviewUrl accordingly
    setTimeout(() => {
      setProcessedPreviewUrl(url); // for now same preview; replace with real processed URL
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

  // scene generation mock
  async function generateSceneFromPrompt() {
    if (!scenePrompt.trim()) return;
    setIsGeneratingScene(true);
    // simulate API delay
    await new Promise((r) => setTimeout(r, 1200));
    // pick random scene as "generated"
    const random = mockScenes[Math.floor(Math.random() * mockScenes.length)];
    setSelectedScene(random.id);
    setIsGeneratingScene(false);
  }

  // generate pipeline simulation
  function startGenerate() {
    // validations
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
        // produce mock generated images after completion
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

  // download result (simulated by opening image)
  function handleDownload(img: GeneratedImage) {
    // create a temporary link to download
    const a = document.createElement("a");
    a.href = img.url;
    a.download = `${img.id}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // step navigation helpers
  function gotoStep(n: number) {
    setCurrentStep(n);
    // scroll top of main content on mobile for UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // responsive: if user clicks Continue on last step -> generate
  function handleContinue() {
    if (currentStep < 5) {
      const next = Math.min(currentStep + 1, 5);
      setCurrentStep(next);
    } else {
      startGenerate();
    }
  }

  // small helper to render step content
  function renderStep() {
    switch (currentStep) {
      case 1:
        return (
          <section className="space-y-8 animate-in fade-in">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Product Type (Optional)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
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
                      <div className="p-2 rounded-md bg-card">
                        {React.cloneElement(type.icon as any, { className: "h-6 w-6" })}
                      </div>
                      <span className="text-sm font-medium">{type.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold">Upload Your Product</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                StudioForge will auto-remove backgrounds & prepare your product for the shoot.
              </p>
            </div>

            <div
              onDrop={onDropFile}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed rounded-xl p-4 bg-transparent transition hover:border-primary/60"
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <label
                    htmlFor="file-input"
                    className="flex flex-col items-center justify-center gap-4 p-6 rounded-lg cursor-pointer"
                  >
                    <UploadCloud className="h-12 w-12 text-muted-foreground" />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
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
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">or drag & drop image here (PNG, JPG, up to 50MB)</p>
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

                  <div className="flex items-center gap-2 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-primary mr-2"
                        checked={!!processedPreviewUrl}
                        readOnly
                      />
                      Show processed (bg removed)
                    </label>
                    <div className="text-xs text-muted-foreground ml-auto">Shadow</div>
                    <input
                      aria-label="shadow"
                      type="range"
                      min={0}
                      max={100}
                      value={shadowDepth}
                      onChange={(e) => setShadowDepth(Number(e.target.value))}
                      className="w-24"
                    />
                  </div>
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
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                {mockAvatars.map((a) => {
                  const active = selectedAvatar === a.id;
                  return (
                    <button
                      key={a.id}
                      onClick={() => setSelectedAvatar(a.id)}
                      className={cn(
                        "p-2 rounded-xl border transition flex flex-col items-center gap-2",
                        active ? "border-2 border-brand-green bg-brand-green/10 shadow" : "border-border hover:border-primary/60"
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
                  <div className="flex flex-col items-center">
                    <div className="rounded-full p-3 bg-card mb-2">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="text-sm font-medium">Create Custom</div>
                    <div className="text-xs text-muted-foreground">Customize an avatar</div>
                  </div>
                </button>
              </div>

              <aside className="w-full md:w-80">
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">Selected Avatar</h4>
                      <p className="text-xs text-muted-foreground">Preview & quick controls</p>
                    </div>
                    <div className="text-xs text-muted-foreground">Pose: Default</div>
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

            {/* Create Avatar modal */}
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

                  <div className="space-y-3">
                    <label className="block">
                      <div className="text-sm font-medium">Avatar Name</div>
                      <input className="w-full mt-1 p-2 rounded border" placeholder="Enter name (e.g., Zara)" />
                    </label>

                    <div className="flex gap-2">
                      <Button onClick={() => { setShowCreateAvatarModal(false); alert("Avatar created (mock)"); }}>
                        Create (Mock)
                      </Button>
                      <Button variant="outline" onClick={() => setShowCreateAvatarModal(false)}>
                        Cancel
                      </Button>
                    </div>
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
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">AI Scene Generator</h4>
                      <p className="text-xs text-muted-foreground">Describe a scene and generate it.</p>
                    </div>
                  </div>

                  <textarea
                    value={scenePrompt}
                    onChange={(e) => setScenePrompt(e.target.value)}
                    className="w-full p-2 rounded border resize-none"
                    rows={4}
                  />
                  <div className="flex gap-2 justify-end mt-2">
                    <Button onClick={generateSceneFromPrompt} disabled={isGeneratingScene}>
                      {isGeneratingScene ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                      Generate Scene
                    </Button>
                    <Button variant="outline" onClick={() => { setScenePrompt(""); }}>
                      Clear
                    </Button>
                  </div>
                </Card>

                <Card className="p-3">
                  <div>
                    <h5 className="font-semibold">Selected Preview</h5>
                    <div className="mt-2 h-40 flex items-center justify-center bg-muted/10 rounded">
                      {selectedScene ? (
                        <img src={mockScenes.find((x) => x.id === selectedScene)!.thumb} alt="scene" className="h-full w-full object-cover" />
                      ) : (
                        <div className="text-sm text-muted-foreground">No scene selected</div>
                      )}
                    </div>
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
              <p className="text-sm text-muted-foreground max-w-xl">Fine tune lighting and camera to achieve the perfect look.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <Card className="p-4">
                  <div className="space-y-3">
                    <label className="flex flex-col">
                      <span className="text-sm font-medium">Brightness</span>
                      <input
                        type="range"
                        min={-100}
                        max={100}
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                      />
                    </label>

                    <label className="flex flex-col">
                      <span className="text-sm font-medium">Temperature (K)</span>
                      <input
                        type="range"
                        min={2500}
                        max={9000}
                        value={temperature}
                        onChange={(e) => setTemperature(Number(e.target.value))}
                      />
                    </label>

                    <label className="flex flex-col">
                      <span className="text-sm font-medium">Shadow Depth</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={shadowDepth}
                        onChange={(e) => setShadowDepth(Number(e.target.value))}
                      />
                    </label>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="space-y-3">
                    <label className="flex flex-col">
                      <span className="text-sm font-medium">Aperture (f)</span>
                      <input
                        type="range"
                        min={1.4}
                        max={16}
                        step={0.1}
                        value={aperture}
                        onChange={(e) => setAperture(Number(e.target.value))}
                      />
                      <div className="text-xs text-muted-foreground mt-1">Current: f/{aperture.toFixed(1)}</div>
                    </label>

                    <label className="flex flex-col">
                      <span className="text-sm font-medium">Focal Length (mm)</span>
                      <input
                        type="range"
                        min={20}
                        max={200}
                        value={focalLength}
                        onChange={(e) => setFocalLength(Number(e.target.value))}
                      />
                      <div className="text-xs text-muted-foreground mt-1">Current: {focalLength}mm</div>
                    </label>
                  </div>
                </Card>
              </div>

              <aside>
                <Card className="p-3">
                  <h5 className="font-semibold mb-2">Live Lighting Preview</h5>
                  <div className="h-56 bg-muted/10 rounded flex items-center justify-center overflow-hidden">
                    {/* Composite preview: show processed product and avatar + scene */}
                    <div className="relative w-full h-full">
                      {selectedScene ? (
                        <img
                          src={mockScenes.find((x) => x.id === selectedScene)!.thumb}
                          alt="bg"
                          className="absolute inset-0 h-full w-full object-cover filter brightness-[0.85]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-deep to-surface-dark" />
                      )}

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-40 h-40 bg-white/10 rounded-md flex items-center justify-center">
                          {productPreviewUrl ? (
                            <img src={productPreviewUrl} alt="p" className="object-contain h-full w-full p-2" />
                          ) : (
                            <ImageIcon className="h-10 w-10 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button size="sm" onClick={() => alert("Apply sample studio preset (mock)")}>Apply Preset</Button>
                    <Button variant="outline" size="sm" onClick={() => { setBrightness(0); setTemperature(5500); setShadowDepth(50); }}>
                      Reset
                    </Button>
                  </div>
                </Card>
              </aside>
            </div>
          </section>
        );
      case 5:
        return (
          <section className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-bold">Generate Shoot</h2>
              <p className="text-sm text-muted-foreground">Start rendering your configured shoot. You can cancel anytime.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Final Preview</h4>
                      <p className="text-xs text-muted-foreground">This is a quick preview before rendering.</p>
                    </div>
                    <div className="text-xs text-muted-foreground">Variants: 6</div>
                  </div>

                  <div className="mt-4 h-80 flex items-center justify-center bg-muted/10 rounded">
                    {/* show live composite */}
                    {isGenerating ? (
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <div className="text-sm">Rendering: {generateStage}/{generateStages.length}</div>
                        <div className="w-48 h-2 bg-muted rounded overflow-hidden">
                          <div
                            style={{ width: `${(generateStage / generateStages.length) * 100}%` }}
                            className="h-full bg-primary"
                          />
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">{generateStages[Math.max(0, generateStage - 1)]}</div>
                      </div>
                    ) : generatedImages.length ? (
                      <div className="grid grid-cols-3 gap-2 w-full p-2">
                        {generatedImages.map((g) => (
                          <div key={g.id} className="rounded overflow-hidden bg-white/5">
                            <img src={g.url} alt={g.variant} className="object-cover h-36 w-full" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-sm">No generated images yet. Click Start to render.</div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button onClick={startGenerate} disabled={isGenerating}>
                      {isGenerating ? "Rendering…" : "Start Shoot"}
                    </Button>
                    <Button variant="outline" onClick={() => { setGeneratedImages([]); setIsGenerating(false); setGenerateStage(0); }}>
                      Reset
                    </Button>
                    <Button variant="ghost" onClick={() => alert("Save project (mock)")}>Save Project</Button>
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
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleDownload(g)}>
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              <aside>
                <Card className="p-3">
                  <h5 className="font-semibold">Render Settings</h5>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between"><span>Variants</span><strong>6</strong></div>
                    <div className="flex justify-between"><span>Resolution</span><strong>2048 × 2560</strong></div>
                    <div className="flex justify-between"><span>Commercial License</span><strong>Included</strong></div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button size="sm" onClick={() => alert("Export project (mock)")}>Export ZIP</Button>
                    <Button size="sm" variant="outline" onClick={() => alert("Share link (mock)")}>Share</Button>
                  </div>
                </Card>
              </aside>
            </div>
          </section>
        );
      default:
        return <div>Unknown step</div>;
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-brand-deep to-surface-dark text-white">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr_360px] gap-8">
        {/* Stepper Sidebar */}
        <aside className="hidden lg:block">
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
                      active ? "bg-white/5 border border-primary shadow" : "hover:bg-white/5"
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", active ? "bg-primary text-brand-deep" : "bg-card")}>
                      {completed ? <CheckCircle className="h-5 w-5 text-brand-green" /> : s.icon}
                    </div>

                    <div>
                      <div className="font-medium">{s.title}</div>
                      <div className="text-xs text-muted-foreground">Step {s.id}</div>
                    </div>

                    <div className="ml-auto hidden md:block">
                      <ChevronRight />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4">
              <div className="text-xs text-muted-foreground">Quick actions</div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={() => gotoStep(1)}>Upload</Button>
                <Button size="sm" variant="outline" onClick={() => gotoStep(2)}>Avatar</Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="bg-white/5 p-6 rounded-xl min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Step {currentStep} — {steps.find(s => s.id === currentStep)?.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">Follow the guided steps to configure your shoot.</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">Auto-save</div>
              <div className="w-3 h-3 rounded-full bg-brand-green" aria-hidden />
            </div>
          </div>

          <div className="mt-6">{renderStep()}</div>

          {/* Mobile stepper / actions */}
          <div className="mt-6 border-t pt-4 flex items-center justify-between">
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" onClick={() => setCurrentStep((s) => Math.max(1, s - 1))} disabled={currentStep === 1}>Back</Button>
              <div className="text-sm text-muted-foreground">Step {currentStep} of {steps.length}</div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              {currentStep < 5 ? (
                <Button onClick={handleContinue}>
                  Continue <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button onClick={startGenerate} disabled={isGenerating}>
                  {isGenerating ? "Rendering…" : "Start Shoot"}
                </Button>
              )}
            </div>
          </div>
        </main>

        {/* Preview / Right Panel */}
        <aside className="hidden xl:block">
          <div className="sticky top-24 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Live Preview</h3>
              <p className="text-xs text-muted-foreground">Your current configuration preview</p>
            </div>

            <Card className="h-[640px] overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-full w-full bg-gradient-to-tr from-brand-deep to-surface-dark">
                  {/* Background */}
                  {selectedScene ? (
                    <img
                      src={mockScenes.find((s) => s.id === selectedScene)!.thumb}
                      alt="scene"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-deep to-surface-dark" />
                  )}

                  {/* Product / avatar composite */}
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="w-56 h-72 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden">
                      {processedPreviewUrl ? (
                        <img src={processedPreviewUrl} alt="processed" className="object-contain h-full w-full p-2" />
                      ) : productPreviewUrl ? (
                        <img src={productPreviewUrl} alt="prod" className="object-contain h-full w-full p-2" />
                      ) : (
                        <div className="text-muted-foreground text-sm">Upload a product to preview</div>
                      )}
                    </div>
                  </div>

                  {/* overlay controls */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                    <div className="bg-black/40 rounded px-3 py-1 text-xs">Brightness: {brightness}</div>
                    <div className="bg-black/40 rounded px-3 py-1 text-xs">Temp: {temperature}K</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button size="sm" onClick={() => alert("Open in studio (mock)")}>Open in AI Shoots Workspace</Button>
              <Button variant="outline" size="sm" onClick={() => alert("Save config as template (mock)")}>Save Template</Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

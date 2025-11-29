"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Sparkles,
  Camera,
  Users,
  Shirt,
  Eye,
  Settings2,
  Upload,
  MessageSquare,
  Library,
  Layers,
  Link as LinkIcon,
  LayoutGrid,
  Palette,
  RectangleVertical,
  RectangleHorizontal,
  Square,
  GalleryVertical,
  User,
  ChevronDown,
  ChevronLeft,
  WandSparkles,
  BrainCircuit,
  Image as ImageIcon,
  Loader2,
  X,
  Package,
  Lightbulb,
  Sun,
  Video,
  Trash2,
  Plus,
  RefreshCw,
  Download,
  ZoomIn,
  PersonStanding,
  Smile,
  Type,
  Maximize,
  Heart,
  Film,
  MinusCircle,
  Paintbrush,
  Aperture,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createWebhookJob, pollWebhookJobStatus, type WebhookJobInput } from "@/lib/webhook";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { sceneStylingWithAI } from "@/ai/flows/scene-styling-with-ai";
import { suggestLightingAndAngles } from "@/ai/flows/suggest-lighting-and-angles";
async function imageUrlToDataUrl(url: string): Promise<string> {
  const r = await fetch(url);
  const blob = await r.blob();
  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}
function dataUrlToFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

const studioTabs = [
  { icon: <Shirt size={16} />, label: "Apparel" },
  { icon: <Package size={16} />, label: "Product" },
  { icon: <WandSparkles size={16} />, label: "Design" },
  { icon: <BrainCircuit size={16} />, label: "Re-imagine" },
];

const StudioHeader = ({
  onGenerate,
  isGenerating,
  activeTab,
  setActiveTab,
}: {
  onGenerate: () => void;
  isGenerating: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const router = useRouter();
  const user =
    typeof window !== "undefined" && localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") as string)
      : null;
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
  return (
  <header className="sticky top-0 z-20 shrink-0 flex flex-col md:flex-row items-center justify-between p-4 border-b border-white/10 bg-[#171A24] print:hidden">
    <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
      <h1 className="text-xl font-bold">Virtual Studio</h1>
      <div className="hidden md:flex items-center gap-1 rounded-lg bg-[#0E1019] p-1 border border-white/10">
        {studioTabs.map((item) => (
          <Button
            key={item.label}
            variant={activeTab === item.label ? "secondary" : "ghost"}
            onClick={() => setActiveTab(item.label)}
            className={cn(
              "text-sm h-8 px-3 text-muted-foreground min-w-[88px]",
              activeTab === item.label && "bg-white/10 text-white"
            )}
          >
            {item.icon}
            <span className="ml-2 whitespace-nowrap leading-tight">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
    <div className="flex items-center gap-3 w-full md:w-auto">
      <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
        <span>Credits: 4,982</span>
      </div>
      {role === "admin" && (
        <Button
          variant="outline"
          className="w-full md:w-auto flex items-center gap-2"
          onClick={() => router.push("/dashboard")}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      )}
      <Button
        className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
        onClick={onGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {isGenerating ? "Generating..." : "Generate"}
      </Button>
      <div className="hidden md:flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://i.pravatar.cc/150?u=aicart-user" alt="Profile" />
                <AvatarFallback>{(user?.email || "U").slice(0,1).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/projects">Projects</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/shoots">Shoots</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/scenes">Scenes</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/brand">Brand Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/team">Team Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/help">Help</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { localStorage.removeItem("role"); localStorage.removeItem("user"); router.push("/login"); }}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
  );
};

const ImageUpload = ({
  onDrop,
  title,
  description,
  icon,
  uploadedImage,
  onRemove,
}: {
  onDrop: (files: File[]) => void;
  title: string;
  description: string;
  icon: React.ReactNode;
  uploadedImage: string | null;
  onRemove: () => void;
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed border-white/10 rounded-lg p-4 h-40 flex flex-col items-center justify-center text-center flex-grow bg-[#0E1019] cursor-pointer transition-colors",
        isDragActive && "border-purple-500 bg-purple-500/10"
      )}
    >
      <input {...getInputProps()} />
      {uploadedImage ? (
        <div className="relative w-full h-full">
          <Image
            src={uploadedImage}
            alt="Uploaded asset"
            fill
            style={{ objectFit: "contain" }}
            className="rounded-md"
          />
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-1 right-1 h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X size={14} />
          </Button>
        </div>
      ) : (
        <>
          {icon}
          <h3 className="font-semibold mt-2 text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </>
      )}
    </div>
  );
};

const InputsPanel = ({
  setModelImage,
  setApparelImage,
  setModelPrompt,
  setApparelPrompt,
  setProductPrompt,
  modelImage,
  apparelImage,
  modelPrompt,
  apparelPrompt,
  productPrompt,
  activeTab,
}: {
  setModelImage: (file: File | null) => void;
  setApparelImage: (file: File | null) => void;
  setModelPrompt: (prompt: string) => void;
  setApparelPrompt: (prompt: string) => void;
  setProductPrompt: (prompt: string) => void;
  modelImage: File | null;
  apparelImage: File | null;
  modelPrompt: string;
  apparelPrompt: string;
  productPrompt: string;
  activeTab: string;
}) => {
  const [modelInputType, setModelInputType] = useState("Upload");
  const [bodyType, setBodyType] = useState("Athletic");
  const [apparelFit, setApparelFit] = useState("Regular");
  const [modelLibraryItems, setModelLibraryItems] = useState<{ id: string; name: string; image_url?: string; gender?: string; style?: string; color?: string }[]>([]);
  const [modelLibraryLoading, setModelLibraryLoading] = useState(false);

  useEffect(() => {
    if (modelInputType !== "Models") return;
    setModelLibraryLoading(true);
    apiFetch("/api/avatars")
      .then((r) => r.json())
      .then((data) => {
        setModelLibraryItems((data?.items || []).map((a: any) => ({ id: a.id, name: a.name, image_url: a.image_url, gender: a.gender, style: a.style, color: a.color })));
      })
      .finally(() => setModelLibraryLoading(false));
  }, [modelInputType]);

  const onModelDrop = useCallback(
    (acceptedFiles: File[]) => {
      setModelImage(acceptedFiles[0]);
    },
    [setModelImage]
  );

  const onApparelDrop = useCallback(
    (acceptedFiles: File[]) => {
      setApparelImage(acceptedFiles[0]);
    },
    [setApparelImage]
  );

  const onProductDrop = useCallback(
    (acceptedFiles: File[]) => {
      setApparelImage(acceptedFiles[0]); // Re-use apparel image state for product
    },
    [setApparelImage]
  );

  

  const renderContent = () => {
    switch (activeTab) {
      case "Apparel":
        return (
          <Tabs defaultValue="model" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="model">Model</TabsTrigger>
              <TabsTrigger value="apparel">Apparel</TabsTrigger>
            </TabsList>
            <TabsContent value="model">
              <Accordion type="single" collapsible defaultValue={"model"}>
                <AccordionItem value="model">
                  <AccordionTrigger className="font-semibold text-base hover:no-underline">
                    <Users className="mr-2 flex-shrink-0" size={20} /> Model
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="flex gap-2 p-1 bg-[#0E1019] rounded-md border border-white/10">
                      <Button
                        onClick={() => setModelInputType("Upload")}
                        variant={modelInputType === "Upload" ? "secondary" : "ghost"}
                        className={cn("flex-1 text-xs", modelInputType === "Upload" && "bg-white/5 text-white")}
                      >
                        <Upload className="mr-1.5" size={14} /> Upload
                      </Button>
                      <Button
                        onClick={() => setModelInputType("Prompt")}
                        variant={modelInputType === "Prompt" ? "secondary" : "ghost"}
                        className={cn("flex-1 text-xs text-muted-foreground", modelInputType === "Prompt" && "bg-white/5 text-white")}
                      >
                        <MessageSquare className="mr-1.5" size={14} /> Prompt
                      </Button>
                      <Button
                        onClick={() => setModelInputType("Models")}
                        variant={modelInputType === "Models" ? "secondary" : "ghost"}
                        className={cn("flex-1 text-xs text-muted-foreground", modelInputType === "Models" && "bg-white/5 text-white")}
                      >
                        <Library className="mr-1.5" size={14} /> Library
                      </Button>
                    </div>
                    {modelInputType === "Upload" && (
                      <ImageUpload
                        onDrop={onModelDrop}
                        title="Upload Your Model"
                        description="Drag 'n' drop or click"
                        icon={<User className="h-8 w-8 text-muted-foreground" />}
                        uploadedImage={modelImage ? URL.createObjectURL(modelImage) : null}
                        onRemove={() => setModelImage(null)}
                      />
                    )}
                    {modelInputType === "Prompt" && (
                      <textarea
                        value={modelPrompt}
                        onChange={(e) => setModelPrompt(e.target.value)}
                        placeholder="e.g., A confident woman with curly hair, smiling, wearing a simple t-shirt..."
                        className="w-full h-32 p-3 rounded-xl bg-[#0E1019] border border-white/10 resize-none text-sm"
                      />
                    )}
                    {modelInputType === "Models" && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Pick from your avatar library</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {modelLibraryItems.map((a) => (
                            <button
                              key={a.id}
                              className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
                              onClick={async () => {
                                if (a.image_url) {
                                  const dataUrl = await imageUrlToDataUrl(a.image_url);
                                  const file = dataUrlToFile(dataUrl, `${a.name}.png`);
                                  setModelImage(file);
                                }
                              }}
                            >
                              {a.image_url ? (
                                <img src={a.image_url} alt={a.name} className="h-24 w-full object-cover" />
                              ) : (
                                <div className="h-24 w-full flex items-center justify-center text-xs text-muted-foreground">No image</div>
                              )}
                              <div className="p-2 text-left">
                                <div className="text-xs font-medium truncate">{a.name}</div>
                                <div className="text-[10px] text-muted-foreground truncate">{[a.gender, a.style].filter(Boolean).join(" • ")}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                        {modelLibraryLoading && <div className="text-sm text-muted-foreground mt-2">Loading...</div>}
                      </div>
                    )}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Age</label>
                        <Slider defaultValue={[25]} max={60} min={18} step={1} className="my-2" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Body Type</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {["Slim", "Athletic", "Average", "Curvy"].map((bt) => (
                            <Button key={bt} onClick={() => setBodyType(bt)} variant={bodyType === bt ? "secondary" : "outline"} className={cn("bg-transparent border-white/10", bodyType === bt && "bg-white/10 text-white")}>{bt}</Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            <TabsContent value="apparel">
              <Accordion type="multiple" defaultValue={["apparel", "apparel-controls", "pose"]}>
                <AccordionItem value="apparel">
                  <AccordionTrigger className="font-semibold text-base hover:no-underline">
                    <Shirt className="mr-2 flex-shrink-0" size={20} /> Apparel
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <ImageUpload
                      onDrop={onApparelDrop}
                      title="Upload Your Apparel"
                      description="Drag 'n' drop or click"
                      icon={<Shirt className="h-8 w-8 text-muted-foreground" />}
                      uploadedImage={apparelImage ? URL.createObjectURL(apparelImage) : null}
                      onRemove={() => setApparelImage(null)}
                    />
                    <textarea
                      value={apparelPrompt}
                      onChange={(e) => setApparelPrompt(e.target.value)}
                      placeholder="Or describe the apparel (e.g., red floral summer dress)."
                      className="w-full h-24 p-3 rounded-xl bg-[#0E1019] border border-white/10 resize-none text-sm"
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="apparel-controls">
                  <AccordionTrigger className="font-semibold text-base hover:no-underline">
                    <Settings2 className="mr-2 flex-shrink-0" size={20} /> Apparel Controls
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Fit Adjustment</label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {["Tight", "Regular", "Loose"].map((fit) => (
                          <Button key={fit} onClick={() => setApparelFit(fit)} variant={apparelFit === fit ? "secondary" : "outline"} className={cn("bg-transparent border-white/10", apparelFit === fit && "bg-white/10 text-white")}>{fit}</Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Cloth Simulation</label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <Button variant="outline" className="bg-transparent border-white/10">Cotton</Button>
                        <Button variant="outline" className="bg-transparent border-white/10">Silk</Button>
                        <Button variant="outline" className="bg-transparent border-white/10">Denim</Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-muted-foreground">Auto De-wrinkle</label>
                      <Switch defaultChecked />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="pose" className="border-b-0">
                  <AccordionTrigger className="font-semibold text-base hover:no-underline">
                    <PersonStanding className="mr-2 flex-shrink-0" size={20} /> Pose & Expression
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Pose</label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <Button variant="outline" className="bg-transparent border-white/10">Standing</Button>
                        <Button variant="outline" className="bg-transparent border-white/10">Sitting</Button>
                        <Button variant="outline" className="bg-transparent border-white/10">Walking</Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Expression</label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <Button variant="outline" className="bg-transparent border-white/10">Neutral</Button>
                        <Button variant="outline" className="bg-transparent border-white/10">Smiling</Button>
                        <Button variant="outline" className="bg-transparent border-white/10">Serious</Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        );
      case "Product":
        return (
          <Accordion
            type="multiple"
            defaultValue={["product", "product-controls"]}
            className="w-full"
          >
            <AccordionItem value="product">
              <AccordionTrigger className="font-semibold text-base hover:no-underline">
                <Package className="mr-2 flex-shrink-0" size={20} /> Product
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <ImageUpload
                  onDrop={onProductDrop}
                  title="Upload Product Image"
                  description="PNG with transparent background recommended"
                  icon={<Package className="h-8 w-8 text-muted-foreground" />}
                  uploadedImage={
                    apparelImage ? URL.createObjectURL(apparelImage) : null
                  }
                  onRemove={() => setApparelImage(null)}
                />
                <Textarea
                  value={productPrompt}
                  onChange={(e) => setProductPrompt(e.target.value)}
                  placeholder="Describe the product and desired shot type. e.g., 'A sleek black watch on a marble surface'."
                  className="w-full h-32 p-3 rounded-xl bg-[#0E1019] border border-white/10 resize-none text-sm"
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="product-controls" className="border-b-0">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <Settings2 className="mr-2 flex-shrink-0" size={20} /> Product Controls
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-muted-foreground">
                    Realistic Shadow
                  </label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-muted-foreground">
                    Floating Product
                  </label>
                  <Switch />
                </div>
                <Textarea
                  placeholder="Product Angle (e.g., front view, 45-degree angle)"
                  className="w-full p-3 rounded-xl bg-[#0E1019] border border-white/10 resize-none text-sm"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      case "Design":
        return (
          <div className="flex flex-col gap-4 flex-grow">
            <h3 className="font-semibold text-base">Moodboard Generator</h3>
            <textarea
              placeholder="Describe your design concept. The AI will generate a moodboard and style guide... e.g., 'A 90s retro-futurism theme for a new sneaker launch'."
              className="w-full flex-grow p-3 rounded-xl bg-[#0E1019] border border-white/10 resize-none text-sm"
            />
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2">
              <WandSparkles className="h-4 w-4" /> Generate Moodboard
            </Button>
          </div>
        );
      case "Re-imagine":
        return (
          <div className="flex flex-col gap-4 flex-grow">
            <h3 className="font-semibold text-base">Image Transformation</h3>
            <ImageUpload
              onDrop={onApparelDrop} // Re-using for simplicity
              title="Upload Image to Re-imagine"
              description="Upload any image to transform it"
              icon={<BrainCircuit className="h-8 w-8 text-muted-foreground" />}
              uploadedImage={
                apparelImage ? URL.createObjectURL(apparelImage) : null
              }
              onRemove={() => setApparelImage(null)}
            />
            <textarea
              placeholder="Describe how you want to transform the image. e.g., 'Change the background to a futuristic neon city'."
              className="w-full h-32 p-3 rounded-xl bg-[#0E1019] border border-white/10 resize-none text-sm"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="bg-[#171A24] rounded-lg p-4 flex flex-col gap-4 overflow-y-auto min-h-0 h-full print:hidden">
      <h2 className="text-lg font-semibold">Inputs</h2>
      {renderContent()}
    </aside>
  );
};

const CanvasPanel = ({
  generatedImages,
  isGenerating,
  aspectRatio,
  onZoom,
  onRefresh,
  onDownload,
  onDelete,
}: {
  generatedImages: string[];
  isGenerating: boolean;
  aspectRatio: string;
  onZoom: (img: string) => void;
  onRefresh: (index: number) => void;
  onDownload: (img: string) => void;
  onDelete: (index: number) => void;
}) => (
  <main className="bg-[#0E1019] rounded-lg flex flex-col items-center justify-center p-4 md:p-6 text-center overflow-auto min-h-0 h-full border-2 border-white/5">
    {isGenerating ? (
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-purple-400 animate-spin" />
        <h2 className="text-xl font-semibold">Generating your vision...</h2>
        <p className="text-muted-foreground mt-2 max-w-xs">
          The AI is currently crafting your images. This may take a moment.
        </p>
      </div>
    ) : generatedImages.length > 0 ? (
      <div className="w-full h-full overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
          {generatedImages.map((imgSrc, index) => (
            <div
              key={index}
              className="relative group rounded-xl overflow-hidden border-2 border-white/10 bg-white/5 hover:border-[#FFB400]/50 transition-all shadow-lg hover:shadow-[#FFB400]/20"
            >
              <div
                className={
                  aspectRatio === "Portrait"
                    ? "aspect-[3/4]"
                    : aspectRatio === "Square"
                    ? "aspect-square"
                    : aspectRatio === "Landscape"
                    ? "aspect-[4/3]"
                    : "aspect-[9/16]"
                }
              >
                <Image
                  src={imgSrc}
                  alt={`Generated image ${index + 1}`}
                  fill
                  className="object-cover"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                #{index + 1}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center gap-2 p-4">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onZoom(imgSrc)}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <ZoomIn size={16} className="mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onRefresh(index)}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <RefreshCw size={16} className="mr-1" />
                  Regenerate
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onDownload(imgSrc)}
                  className="bg-[#FFB400]/80 hover:bg-[#FFB400] text-black border-[#FFB400]"
                >
                  <Download size={16} className="mr-1" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(index)}
                  className="bg-red-500/80 hover:bg-red-500"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <>
        <div className="p-4 bg-purple-600/10 rounded-full mb-4 border border-purple-500/20">
          <Sparkles className="h-8 w-8 text-purple-400" />
        </div>
        <h2 className="text-xl font-semibold">Virtual Studio Canvas</h2>
        <p className="text-muted-foreground mt-2 max-w-xs">
          Your generated images will appear here. Add inputs and click Generate.
        </p>
      </>
    )}
  </main>
);

const SettingsPanel = ({
  numImages,
  setNumImages,
  setScenePrompt,
  scenePrompt,
  aspectRatio,
  setAspectRatio,
  imageQuality,
  setImageQuality,
  transparentBg,
  setTransparentBg,
  upscale,
  setUpscale,
  negativePrompt,
  setNegativePrompt,
  exportType,
  setExportType,
  autoCleanup,
  setAutoCleanup,
  watermark,
  setWatermark,
  safeMode,
  setSafeMode,
  compareMode,
  setCompareMode,
  beforeAfter,
  setBeforeAfter,
  productPrompt,
  apparelPrompt,
  setArtDirectorOpen,
  setArtDirectorOutput,
  pbLibraryOpen,
  setPbLibraryOpen,
  pbActiveTab,
  setPbActiveTab,
  pbCategory,
  setPbCategory,
  pbItems,
  pbLoading,
  selectedScene,
  setSelectedScene,
  selectedLighting,
  setSelectedLighting,
  selectedBackground,
  setSelectedBackground,
  selectedProps,
  setSelectedProps,
  scenes,
  scenesLoading,
  lightingPresets,
  lightingLoading,
}: {
  numImages: number;
  setNumImages: (num: number) => void;
  setScenePrompt: (prompt: string) => void;
  scenePrompt: string;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
  imageQuality: string;
  setImageQuality: (q: string) => void;
  transparentBg: boolean;
  setTransparentBg: (v: boolean) => void;
  upscale: boolean;
  setUpscale: (v: boolean) => void;
  negativePrompt: string;
  setNegativePrompt: (v: string) => void;
  exportType: string;
  setExportType: (t: string) => void;
  autoCleanup: boolean;
  setAutoCleanup: (v: boolean) => void;
  watermark: boolean;
  setWatermark: (v: boolean) => void;
  safeMode: boolean;
  setSafeMode: (v: boolean) => void;
  compareMode: boolean;
  setCompareMode: (v: boolean) => void;
  beforeAfter: boolean;
  setBeforeAfter: (v: boolean) => void;
  productPrompt: string;
  apparelPrompt: string;
  setArtDirectorOpen: (v: boolean) => void;
  setArtDirectorOutput: (v: any) => void;
  pbLibraryOpen: boolean;
  setPbLibraryOpen: (v: boolean) => void;
  pbActiveTab: string;
  setPbActiveTab: (v: string) => void;
  pbCategory: string;
  setPbCategory: (v: string) => void;
  pbItems: any[];
  pbLoading: boolean;
  selectedScene: any | null;
  setSelectedScene: (v: any | null) => void;
  selectedLighting: any | null;
  setSelectedLighting: (v: any | null) => void;
  selectedBackground: any | null;
  setSelectedBackground: (v: any | null) => void;
  selectedProps: any[];
  setSelectedProps: (v: any[]) => void;
  scenes: any[];
  scenesLoading: boolean;
  lightingPresets: any[];
  lightingLoading: boolean;
}) => {
  return (
    <aside className="bg-[#171A24] rounded-lg p-4 flex flex-col gap-4 overflow-y-auto print:hidden">
      <h2 className="text-lg font-semibold">Settings</h2>
      <Accordion
        type="multiple"
        defaultValue={[
          "output",
          "scene-style",
          "lighting",
          "camera",
          "looks",
          "creative-controls",
        ]}
        className="w-full"
      >
        <AccordionItem value="output">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <Camera className="mr-2" size={20} /> Output
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div>
              <h4 className="font-medium text-sm mb-2 text-muted-foreground">
                Aspect Ratio
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {[
                  { label: "Portrait", icon: <RectangleVertical size={16} /> },
                  { label: "Square", icon: <Square size={16} /> },
                  {
                    label: "Landscape",
                    icon: <RectangleHorizontal size={16} />,
                  },
                  { label: "Stories", icon: <GalleryVertical size={16} /> },
                ].map((ratio) => (
                  <Button
                    key={ratio.label}
                    variant={
                      aspectRatio === ratio.label ? "secondary" : "outline"
                    }
                    onClick={() => setAspectRatio(ratio.label)}
                    className={cn(
                      "text-xs h-9 bg-transparent border-white/10 text-muted-foreground min-w-0",
                      aspectRatio === ratio.label && "bg-white/10 text-white"
                    )}
                  >
                    {ratio.icon}
                    <span className="ml-1.5 whitespace-nowrap truncate leading-tight">{ratio.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2 text-muted-foreground">
                Number of Images
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 4, 8].map((num) => (
                  <Button
                    key={num}
                    variant={numImages === num ? "secondary" : "outline"}
                    onClick={() => setNumImages(num)}
                    className={cn(
                      "h-9 bg-transparent border-white/10 text-muted-foreground min-w-0",
                      numImages === num &&
                        "bg-purple-600 text-white border-purple-600"
                    )}
                  >
                    <span className="whitespace-nowrap truncate leading-tight">{num}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="mt-3">
              <h4 className="font-medium text-sm mb-2 text-muted-foreground">File Type Export</h4>
              <div className="grid grid-cols-3 gap-2">
                {["PNG", "JPG", "WebP"].map((t) => (
                  <Button
                    key={t}
                    variant={exportType === t ? "secondary" : "outline"}
                    onClick={() => setExportType(t)}
                    className={cn(
                      "h-9 bg-transparent border-white/10 text-muted-foreground min-w-0",
                      exportType === t && "bg-white/10 text-white"
                    )}
                  >
                    <span className="whitespace-nowrap truncate leading-tight">{t}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <p className="font-medium text-sm">Auto Cleanup</p>
              <Switch checked={autoCleanup} onCheckedChange={setAutoCleanup} />
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">Watermark</p>
              <Switch checked={watermark} onCheckedChange={setWatermark} />
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">Safe Mode</p>
              <Switch checked={safeMode} onCheckedChange={setSafeMode} />
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">Compare View</p>
              <Switch checked={compareMode} onCheckedChange={setCompareMode} />
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">Before / After</p>
              <Switch checked={beforeAfter} onCheckedChange={setBeforeAfter} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Transparent Background</p>
              </div>
              <Switch
                checked={transparentBg}
                onCheckedChange={setTransparentBg}
              />
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2 text-muted-foreground">
                Image Quality
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {["Standard", "HD", "Ultra"].map((q) => (
                  <Button
                    key={q}
                    variant={imageQuality === q ? "secondary" : "outline"}
                    onClick={() => setImageQuality(q)}
                    className={cn(
                      "h-9 bg-transparent border-white/10 text-muted-foreground",
                      imageQuality === q && "bg-white/10 text-white"
                    )}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">High-Res Upscale</p>
              </div>
              <Switch checked={upscale} onCheckedChange={setUpscale} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="scene-style">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <Palette className="mr-2 flex-shrink-0" size={20} />
            Scene & Style
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            <Card className="bg-[#0E1019] border-white/10">
              <CardContent className="p-3">
                <h4 className="font-medium text-sm mb-2 text-muted-foreground">
                  AI Scene Prompt
                </h4>
                <textarea
                  value={scenePrompt}
                  onChange={(e) => setScenePrompt(e.target.value)}
                  placeholder="e.g., A bright, sunny day at a beach with palm trees."
                  className="w-full h-24 p-3 rounded-xl bg-[#0E1019] border border-white/10 resize-none"
                />
              </CardContent>
            </Card>
            <div>
              <h4 className="font-medium text-sm mb-2 text-muted-foreground">Mood Presets</h4>
              <div className="grid grid-cols-3 gap-2">
                {["Studio", "Natural", "Neon", "Outdoor", "Luxury", "Minimal"].map((m) => (
                  <Button
                    key={m}
                    variant="outline"
                    className="h-9 bg-transparent border-white/10 text-muted-foreground min-w-0"
                    onClick={() => setScenePrompt(scenePrompt ? scenePrompt + ` ${m} mood.` : `${m} mood.`)}
                  >
                    <span className="whitespace-nowrap truncate leading-tight">{m}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2 text-muted-foreground">Design Complexity</h4>
              <div className="grid grid-cols-3 gap-2">
                {["Simple", "Medium", "Production-level"].map((lvl) => (
                  <Button
                    key={lvl}
                    variant="outline"
                    className="h-9 bg-transparent border-white/10 text-muted-foreground min-w-0"
                    onClick={() => setScenePrompt(scenePrompt ? scenePrompt + ` ${lvl} set.` : `${lvl} set.`)}
                  >
                    <span className="whitespace-nowrap truncate leading-tight">{lvl}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2 text-muted-foreground">Scene Library</h4>
              {scenesLoading ? (
                <div className="text-sm text-muted-foreground">Loading scenes...</div>
              ) : scenes.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {scenes.slice(0, 6).map((scene) => (
                    <button
                      key={scene.id}
                      onClick={() => {
                        setSelectedScene(scene);
                        const desc = scene.description || scene.name;
                        setScenePrompt(scenePrompt ? `${scenePrompt} Scene: ${desc}.` : `Scene: ${desc}.`);
                      }}
                      className={cn(
                        "rounded-lg border overflow-hidden text-left transition",
                        selectedScene?.id === scene.id
                          ? "border-[#FFB400] bg-[#FFB400]/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      )}
                    >
                      {scene.image_url && (
                        <img src={scene.image_url} alt={scene.name} className="h-16 w-full object-cover" />
                      )}
                      <div className="p-2">
                        <div className="text-xs font-medium truncate">{scene.name}</div>
                        {scene.category && (
                          <div className="text-[10px] text-muted-foreground truncate">{scene.category}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No scenes available</div>
              )}
            </div>
            <Card className="bg-[#0E1019] border-white/10">
              <CardContent className="p-3">
                <h4 className="font-medium text-sm mb-2 text-muted-foreground">
                  Props & Backgrounds
                </h4>
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-white/10"
                  onClick={() => setPbLibraryOpen(true)}
                >
                  Open Library
                </Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="lighting">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <Sun className="mr-2 flex-shrink-0" size={20} />
            Lighting Studio
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div>
              <h4 className="font-medium text-sm mb-2 text-muted-foreground">Lighting Presets</h4>
              {lightingLoading ? (
                <div className="text-sm text-muted-foreground">Loading presets...</div>
              ) : lightingPresets.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {lightingPresets.slice(0, 4).map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setSelectedLighting(preset);
                        const lightingDesc = `Lighting: ${preset.name}, intensity ${preset.intensity}%, temperature ${preset.temperature}K, softness ${preset.softness}%, shadow ${preset.shadow}%, direction ${preset.direction || 'front'}.`;
                        setScenePrompt(scenePrompt ? `${scenePrompt} ${lightingDesc}` : lightingDesc);
                      }}
                      className={cn(
                        "rounded-lg border p-2 text-left transition text-xs",
                        selectedLighting?.id === preset.id
                          ? "border-[#FFB400] bg-[#FFB400]/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      )}
                    >
                      <div className="font-medium truncate">{preset.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {preset.intensity}% • {preset.temperature}K
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No presets available</div>
              )}
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2 text-muted-foreground">Light Type</h4>
              <div className="grid grid-cols-3 gap-2">
                {["Softbox", "Spotlight", "Ring Light"].map((t) => (
                  <Button key={t} variant="outline" className="h-9 bg-transparent border-white/10 text-muted-foreground">{t}</Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Intensity
              </label>
              <Slider defaultValue={[70]} max={100} step={1} className="my-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Temperature
              </label>
              <Slider
                defaultValue={[5500]}
                min={2000}
                max={8000}
                step={100}
                className="my-2"
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">Rim Light</p>
              <Switch />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Shadow Strength</label>
              <Slider defaultValue={[50]} max={100} step={1} className="my-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Direction</label>
              <Slider defaultValue={[45]} min={0} max={180} step={1} className="my-2" />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="camera">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <Camera className="mr-2 flex-shrink-0" size={20} />
            Camera Controls
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Focal Length
              </label>
              <Slider
                defaultValue={[50]}
                min={24}
                max={105}
                step={1}
                className="my-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Aperture (f-stop)
              </label>
              <Slider
                defaultValue={[2.8]}
                min={1.4}
                max={16}
                step={0.1}
                className="my-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Zoom</label>
              <Slider defaultValue={[1]} min={1} max={3} step={0.1} className="my-2" />
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2 text-muted-foreground">Angle Presets</h4>
              <div className="grid grid-cols-3 gap-2">
                {["Front", "Three-Quarter", "Top", "Low"].map((ang) => (
                  <Button key={ang} variant="outline" className="h-9 bg-transparent border-white/10 text-muted-foreground">{ang}</Button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">Motion Blur</p>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">Perspective</p>
              <Switch />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="looks">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <Eye className="mr-2 flex-shrink-0" size={20} />
            Looks & Styles
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="grid grid-cols-2 gap-2 min-w-0">
              <Button
                variant="outline"
                className="bg-transparent border-white/10 h-auto flex flex-col items-center py-2 min-w-0"
                onClick={() =>
                  setScenePrompt(
                    scenePrompt ? scenePrompt + " Film look." : "Film look."
                  )
                }
              >
                <Film size={20} />
                <span className="text-xs mt-1 w-full text-center truncate leading-tight">Film</span>
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-white/10 h-auto flex flex-col items-center py-2 min-w-0"
                onClick={() =>
                  setScenePrompt(
                    scenePrompt
                      ? scenePrompt + " Vintage style."
                      : "Vintage style."
                  )
                }
              >
                <Heart size={20} />
                <span className="text-xs mt-1 w-full text-center truncate leading-tight">Vintage</span>
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-white/10 h-auto flex flex-col items-center py-2 min-w-0"
                onClick={() =>
                  setScenePrompt(
                    scenePrompt
                      ? scenePrompt + " Black and white."
                      : "Black and white."
                  )
                }
              >
                <Maximize size={20} />
                <span className="text-xs mt-1 w-full text-center truncate leading-tight">B & W</span>
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-white/10 h-auto flex flex-col items-center py-2 min-w-0"
                onClick={() =>
                  setScenePrompt(
                    scenePrompt
                      ? scenePrompt +
                          " Clean e-commerce lighting and background."
                      : "Clean e-commerce lighting and background."
                  )
                }
              >
                <Sparkles size={20} />
                <span className="text-xs mt-1 w-full text-center truncate leading-tight">E-commerce</span>
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-white/10 h-auto flex flex-col items-center py-2 min-w-0"
                onClick={() =>
                  setScenePrompt(
                    scenePrompt ? scenePrompt + " High-fashion editorial." : "High-fashion editorial."
                  )
                }
              >
                <Sparkles size={20} />
                <span className="text-xs mt-1 w-full text-center truncate leading-tight">Editorial</span>
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-white/10 h-auto flex flex-col items-center py-2 min-w-0"
                onClick={() =>
                  setScenePrompt(
                    scenePrompt ? scenePrompt + " Gradient neon." : "Gradient neon."
                  )
                }
              >
                <Sparkles size={20} />
                <span className="text-xs mt-1 w-full text-center truncate leading-tight">Neon</span>
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-white/10 h-auto flex flex-col items-center py-2 min-w-0"
                onClick={() =>
                  setScenePrompt(
                    scenePrompt ? scenePrompt + " DSLR RAW style." : "DSLR RAW style."
                  )
                }
              >
                <Camera size={20} />
                <span className="text-xs mt-1 w-full text-center truncate leading-tight">DSLR RAW</span>
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="creative-controls" className="border-b-0">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <Settings2 className="mr-2 flex-shrink-0" size={20} />
            Advanced Controls
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smile size={16} className="text-muted-foreground" />
                <label
                  htmlFor="face-correction"
                  className="font-medium text-sm"
                >
                  Face Correction
                </label>
              </div>
              <Switch id="face-correction" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb size={16} className="text-muted-foreground" />
                <label
                  htmlFor="smart-relighting"
                  className="font-medium text-sm"
                >
                  Smart Relighting
                </label>
              </div>
              <Switch id="smart-relighting" defaultChecked />
            </div>
            <div className="space-y-2">
              <label className="font-medium text-sm">Background Blur</label>
              <Slider defaultValue={[20]} max={100} step={1} />
            </div>
            <div className="space-y-2">
              <label className="font-medium text-sm">Sharpening</label>
              <Slider defaultValue={[10]} max={100} step={1} />
            </div>
            <div className="space-y-2">
              <label className="font-medium text-sm">Grain</label>
              <Slider defaultValue={[5]} max={100} step={1} />
            </div>
            <div>
              <Button
                variant="outline"
                className="w-full bg-transparent border-white/10"
              >
                <Paintbrush size={16} className="mr-2" /> Inpainting /
                Outpainting
              </Button>
            </div>
            <div>
              <label className="flex items-center gap-2 font-medium text-sm mb-2">
                <MinusCircle size={16} /> Negative Prompt
              </label>
              <Textarea
                placeholder="e.g., extra fingers, distorted face, blurry"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
              />
            </div>
            <div>
              <Button
                variant="outline"
                className="w-full bg-transparent border-white/10"
                onClick={async () => {
                  try {
                    setArtDirectorOpen(true);
                    const sceneRes = await sceneStylingWithAI({ prompt: scenePrompt || productPrompt || "Product shoot" });
                    const lightRes = await suggestLightingAndAngles({ productDescription: productPrompt || apparelPrompt || "product", shootDescription: scenePrompt || "studio" });
                    setArtDirectorOutput({
                      sceneDescription: (sceneRes as any)?.sceneDescription,
                      moodSuggestions: (sceneRes as any)?.moodSuggestions,
                      propSuggestions: (sceneRes as any)?.propSuggestions,
                      storylineSuggestions: (sceneRes as any)?.storylineSuggestions,
                      cameraSuggestions: (sceneRes as any)?.cameraSuggestions,
                      lightingList: (lightRes as any)?.lightingSuggestions,
                      angleList: (lightRes as any)?.angleSuggestions,
                      conceptList: (lightRes as any)?.conceptSuggestions,
                    });
                  } catch (e) {
                    setArtDirectorOutput({ sceneDescription: "No suggestions available." });
                  }
                }}
              >
                <Sparkles size={16} className="mr-2" /> AI Art Director
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Dialog open={pbLibraryOpen} onOpenChange={setPbLibraryOpen}>
        <DialogContent className="max-w-4xl bg-[#0E1019] border border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Library</h3>
            <Button variant="ghost" onClick={() => setPbLibraryOpen(false)}>Close</Button>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button size="sm" variant={pbActiveTab === "backgrounds" ? "secondary" : "outline"} onClick={() => setPbActiveTab("backgrounds")}>Backgrounds</Button>
            <Button size="sm" variant={pbActiveTab === "props" ? "secondary" : "outline"} onClick={() => setPbActiveTab("props")}>Props</Button>
          </div>
          <DynamicCategories
            type={pbActiveTab}
            selected={pbCategory}
            onSelect={setPbCategory}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {pbItems.map((it) => {
              const isSelected = pbActiveTab === "backgrounds" 
                ? selectedBackground?.id === it.id
                : selectedProps.some(p => p.id === it.id);
              
              return (
                <button 
                  key={it.id} 
                  className={cn(
                    "rounded-xl border overflow-hidden transition-all",
                    isSelected
                      ? "border-[#FFB400] bg-[#FFB400]/10 ring-2 ring-[#FFB400]/30"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  )}
                  onClick={() => {
                    if (pbActiveTab === "backgrounds") {
                      setSelectedBackground(isSelected ? null : it);
                      const piece = `Background: ${it.name}${pbCategory && pbCategory !== "All" ? ` (${pbCategory})` : ""}.`;
                      setScenePrompt(scenePrompt ? `${scenePrompt} ${piece}` : piece);
                    } else {
                      if (isSelected) {
                        setSelectedProps(selectedProps.filter(p => p.id !== it.id));
                      } else {
                        setSelectedProps([...selectedProps, it]);
                      }
                      const piece = `Prop: ${it.name}${pbCategory && pbCategory !== "All" ? ` (${pbCategory})` : ""}.`;
                      setScenePrompt(scenePrompt ? `${scenePrompt} ${piece}` : piece);
                    }
                  }}
                >
                  {it.image_url ? (
                    <img src={it.image_url} alt={it.name} className="h-24 w-full object-cover" />
                  ) : (
                    <div className="h-24 w-full flex items-center justify-center text-xs text-muted-foreground">No image</div>
                  )}
                  <div className="p-2 text-left">
                    <div className="text-xs font-medium truncate">{it.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{pbCategory}</div>
                    {isSelected && (
                      <div className="text-[10px] text-[#FFB400] mt-1">✓ Selected</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          {pbLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
        </DialogContent>
      </Dialog>
    </aside>
  );
};

function DynamicCategories({ type, selected, onSelect }: { type: string; selected: string; onSelect: (v: string) => void }) {
  const [cats, setCats] = useState<any[]>([]);
  useEffect(() => {
    apiFetch(`/api/library/categories?type=${type}`)
      .then((r) => r.json())
      .then((d) => setCats(d?.items?.length ? d.items : ["All","Studio","Indoor","Luxury","Urban"].map((name) => ({ name }))))
      .catch(() => setCats(["All","Studio","Indoor","Luxury","Urban"].map((name) => ({ name }))));
  }, [type]);
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {cats.map((cat) => (
        <Button
          key={cat.name}
          size="sm"
          variant={selected === cat.name ? "secondary" : "outline"}
          onClick={() => onSelect(cat.name)}
          className="bg-transparent border-white/10"
          style={{ background: cat.bg_color || undefined, color: cat.accent_color || undefined }}
        >
          {cat.name}
        </Button>
      ))}
    </div>
  );
}

export default function VirtualStudioPage() {
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [apparelImage, setApparelImage] = useState<File | null>(null);
  const [modelPrompt, setModelPrompt] = useState("");
  const [apparelPrompt, setApparelPrompt] = useState("");
  const [productPrompt, setProductPrompt] = useState("");
  const [scenePrompt, setScenePrompt] = useState("");
  const [numImages, setNumImages] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string>("");
  const [activeStudioTab, setActiveStudioTab] = useState(studioTabs[0].label);
  const [aspectRatio, setAspectRatio] = useState("Portrait");
  const [imageQuality, setImageQuality] = useState("Standard");
  const [transparentBg, setTransparentBg] = useState(false);
  const [upscale, setUpscale] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const { toast } = useToast();
  const [exportType, setExportType] = useState("PNG");
  const [autoCleanup, setAutoCleanup] = useState(false);
  const [watermark, setWatermark] = useState(false);
  const [safeMode, setSafeMode] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [beforeAfter, setBeforeAfter] = useState(false);
  const [artDirectorOpen, setArtDirectorOpen] = useState(false);
  const [artDirectorOutput, setArtDirectorOutput] = useState<{ sceneDescription?: string; moodSuggestions?: string[]; lightingSuggestions?: string; propSuggestions?: string[]; storylineSuggestions?: string; cameraSuggestions?: string; lightingList?: string[]; angleList?: string[]; conceptList?: string[] } | null>(null);
  const [pbLibraryOpen, setPbLibraryOpen] = useState(false);
  const [pbActiveTab, setPbActiveTab] = useState("backgrounds");
  const [pbCategory, setPbCategory] = useState("All");
  const [pbItems, setPbItems] = useState<any[]>([]);
  const [pbLoading, setPbLoading] = useState(false);
  
  // Dynamic selections
  const [scenes, setScenes] = useState<any[]>([]);
  const [selectedScene, setSelectedScene] = useState<any | null>(null);
  const [scenesLoading, setScenesLoading] = useState(false);
  const [lightingPresets, setLightingPresets] = useState<any[]>([]);
  const [selectedLighting, setSelectedLighting] = useState<any | null>(null);
  const [lightingLoading, setLightingLoading] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<any | null>(null);
  const [selectedProps, setSelectedProps] = useState<any[]>([]);

  // Fetch scenes
  useEffect(() => {
    setScenesLoading(true);
    apiFetch("/api/library/scenes?limit=20")
      .then((r) => r.json())
      .then((data) => setScenes(data?.items || []))
      .catch(() => setScenes([]))
      .finally(() => setScenesLoading(false));
  }, []);

  // Fetch lighting presets
  useEffect(() => {
    setLightingLoading(true);
    apiFetch("/api/lighting/presets")
      .then((r) => r.json())
      .then((data) => setLightingPresets(data?.items || []))
      .catch(() => setLightingPresets([]))
      .finally(() => setLightingLoading(false));
  }, []);

  useEffect(() => {
    try {
      const url = typeof window !== "undefined" ? localStorage.getItem("selectedAvatarImageUrl") : null;
      if (url) {
        imageUrlToDataUrl(url).then((dataUrl) => {
          const file = dataUrlToFile(dataUrl, "avatar.png");
          setModelImage(file);
          localStorage.removeItem("selectedAvatarImageUrl");
        }).catch(() => {});
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!pbLibraryOpen) return;
    setPbLoading(true);
    const endpoint = pbActiveTab === "backgrounds" ? "/api/library/backgrounds" : "/api/library/props";
    const q = pbCategory && pbCategory !== "All" ? `?category=${encodeURIComponent(pbCategory)}` : "";
    apiFetch(`${endpoint}${q}`)
      .then((r) => r.json())
      .then((data) => setPbItems(data?.items || []))
      .finally(() => setPbLoading(false));
  }, [pbLibraryOpen, pbActiveTab, pbCategory]);

  const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const buildErrorMessage = (error: any) => {
    const message =
      typeof error === "string"
        ? error
        : error?.message || error?.toString() || "Unknown error";
    if (message.toLowerCase().includes("quota") || message.includes("429")) {
      return {
        title: "Gemini quota exceeded",
        description:
          "The configured Gemini API key has exhausted its quota. Update the key in your environment or wait before trying again.",
      };
    }
    return {
      title: "Generation failed",
      description: message,
    };
  };

  const handleGenerate = async () => {
    if (!modelImage && !modelPrompt && activeStudioTab === "Apparel") {
      alert("Please provide either a model image or a model prompt.");
      return;
    }
    if (!apparelImage && !apparelPrompt && activeStudioTab === "Product") {
      alert("Please provide a product image or description.");
      return;
    }

    setIsGenerating(true);
    setGeneratedImages([]);
    try {
      toast({
        title: "Creating job",
        description: "Preparing image generation job...",
      });
      
      // Prepare input data
      let finalModelPrompt =
        activeStudioTab === "Apparel" ? modelPrompt : undefined;
      let finalApparelPrompt =
        activeStudioTab === "Apparel" || activeStudioTab === "Product"
          ? apparelPrompt || productPrompt
          : undefined;
      let finalModelImage = activeStudioTab === "Apparel" ? modelImage : null;
      let finalApparelImage =
        activeStudioTab === "Apparel" ||
        activeStudioTab === "Product" ||
        activeStudioTab === "Re-imagine"
          ? apparelImage
          : null;
      
      let finalScene = scenePrompt;
      
      // Add selected scene details
      if (selectedScene) {
        const sceneDesc = selectedScene.description || selectedScene.name;
        finalScene = finalScene
          ? `${finalScene} Scene setting: ${sceneDesc}.`
          : `Scene setting: ${sceneDesc}.`;
        if (selectedScene.mood) {
          finalScene = `${finalScene} Mood: ${selectedScene.mood}.`;
        }
      }
      
      // Add selected background
      if (selectedBackground) {
        finalScene = finalScene
          ? `${finalScene} Background: ${selectedBackground.name}${selectedBackground.category ? ` (${selectedBackground.category})` : ''}.`
          : `Background: ${selectedBackground.name}${selectedBackground.category ? ` (${selectedBackground.category})` : ''}.`;
      }
      
      // Add selected props
      if (selectedProps.length > 0) {
        const propsList = selectedProps.map(p => p.name).join(', ');
        finalScene = finalScene
          ? `${finalScene} Props: ${propsList}.`
          : `Props: ${propsList}.`;
      }
      
      // Add selected lighting
      if (selectedLighting) {
        finalScene = finalScene
          ? `${finalScene} Lighting: ${selectedLighting.name}, intensity ${selectedLighting.intensity}%, temperature ${selectedLighting.temperature}K, softness ${selectedLighting.softness}%, shadow ${selectedLighting.shadow}%, direction ${selectedLighting.direction || 'front'}.`
          : `Lighting: ${selectedLighting.name}, intensity ${selectedLighting.intensity}%, temperature ${selectedLighting.temperature}K, softness ${selectedLighting.softness}%, shadow ${selectedLighting.shadow}%, direction ${selectedLighting.direction || 'front'}.`;
      }
      
      if (aspectRatio)
        finalScene = finalScene
          ? finalScene + ` Aspect ratio: ${aspectRatio}.`
          : `Aspect ratio: ${aspectRatio}.`;
      if (imageQuality && imageQuality !== "Standard")
        finalScene = finalScene
          ? finalScene + ` Quality: ${imageQuality}.`
          : `Quality: ${imageQuality}.`;
      if (transparentBg)
        finalScene = finalScene
          ? finalScene + ` Transparent background.`
          : `Transparent background.`;
      if (upscale)
        finalScene = finalScene
          ? finalScene + ` High-resolution upscale.`
          : `High-resolution upscale.`;
      
      // Prepare webhook input
      const webhookInput: WebhookJobInput = {
        numImages,
        scenePrompt: finalScene || undefined,
        negativePrompt: negativePrompt || undefined,
        aspectRatio,
        imageQuality,
        transparentBg,
        upscale,
        selectedScene,
        selectedLighting,
        selectedBackground,
        selectedProps: selectedProps.length > 0 ? selectedProps : undefined,
      };
      
      if (finalModelImage) {
        webhookInput.modelImage = await fileToDataURI(finalModelImage);
      }
      if (finalApparelImage) {
        webhookInput.apparelImage = await fileToDataURI(finalApparelImage);
      }
      if (finalModelPrompt) {
        webhookInput.modelPrompt = finalModelPrompt;
      }
      if (finalApparelPrompt) {
        webhookInput.apparelPrompt = finalApparelPrompt;
      }
      
      // Create webhook job
      const jobResponse = await createWebhookJob(webhookInput);
      setCurrentJobId(jobResponse.jobId);
      setJobStatus("pending");
      
      toast({
        title: "Job created",
        description: `Job ID: ${jobResponse.jobId}. Processing in n8n...`,
      });
      
      // Poll for job status
      setJobStatus("processing");
      const status = await pollWebhookJobStatus(
        jobResponse.jobId,
        (currentStatus) => {
          setJobStatus(currentStatus.status);
          if (currentStatus.imageUrls.length > 0) {
            setGeneratedImages(currentStatus.imageUrls);
          }
        }
      );
      
      if (status.status === "completed" && status.imageUrls.length > 0) {
        setGeneratedImages(status.imageUrls);
        toast({
          title: "Completed",
          description: `Generated ${status.imageUrls.length} images.`,
        });
      } else if (status.status === "failed") {
        throw new Error("Job failed in n8n");
      }
    } catch (error) {
      console.error("Generation failed:", error);
      const { title, description } = buildErrorMessage(error);
      toast({
        variant: "destructive",
        title,
        description,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0E1019] text-white font-body overflow-hidden">
      <StudioHeader
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        activeTab={activeStudioTab}
        setActiveTab={setActiveStudioTab}
      />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr),minmax(0,2fr),minmax(0,1fr)] xl:grid-cols-[380px,1fr,380px] gap-3 p-3 overflow-hidden min-h-0">
        <InputsPanel
          modelImage={modelImage}
          apparelImage={apparelImage}
          modelPrompt={modelPrompt}
          apparelPrompt={apparelPrompt}
          productPrompt={productPrompt}
          setModelImage={setModelImage}
          setApparelImage={setApparelImage}
          setModelPrompt={setModelPrompt}
          setApparelPrompt={setApparelPrompt}
          setProductPrompt={setProductPrompt}
          activeTab={activeStudioTab}
        />
        <CanvasPanel
          generatedImages={generatedImages}
          isGenerating={isGenerating}
          aspectRatio={aspectRatio}
          onZoom={(img) => setZoomImage(img)}
          onRefresh={async (i) => {
            try {
              setIsGenerating(true);
              // Use the same logic as handleGenerate but for single image
              let finalModelPrompt =
                activeStudioTab === "Apparel" ? modelPrompt : undefined;
              let finalApparelPrompt =
                activeStudioTab === "Apparel" || activeStudioTab === "Product"
                  ? apparelPrompt || productPrompt
                  : undefined;
              let finalModelImage = activeStudioTab === "Apparel" ? modelImage : null;
              let finalApparelImage =
                activeStudioTab === "Apparel" ||
                activeStudioTab === "Product" ||
                activeStudioTab === "Re-imagine"
                  ? apparelImage
                  : null;
              
              let finalScene = scenePrompt;
              
              // Add selected scene details
              if (selectedScene) {
                const sceneDesc = selectedScene.description || selectedScene.name;
                finalScene = finalScene
                  ? `${finalScene} Scene setting: ${sceneDesc}.`
                  : `Scene setting: ${sceneDesc}.`;
                if (selectedScene.mood) {
                  finalScene = `${finalScene} Mood: ${selectedScene.mood}.`;
                }
              }
              
              // Add selected background
              if (selectedBackground) {
                finalScene = finalScene
                  ? `${finalScene} Background: ${selectedBackground.name}${selectedBackground.category ? ` (${selectedBackground.category})` : ''}.`
                  : `Background: ${selectedBackground.name}${selectedBackground.category ? ` (${selectedBackground.category})` : ''}.`;
              }
              
              // Add selected props
              if (selectedProps.length > 0) {
                const propsList = selectedProps.map(p => p.name).join(', ');
                finalScene = finalScene
                  ? `${finalScene} Props: ${propsList}.`
                  : `Props: ${propsList}.`;
              }
              
              // Add selected lighting
              if (selectedLighting) {
                finalScene = finalScene
                  ? `${finalScene} Lighting: ${selectedLighting.name}, intensity ${selectedLighting.intensity}%, temperature ${selectedLighting.temperature}K, softness ${selectedLighting.softness}%, shadow ${selectedLighting.shadow}%, direction ${selectedLighting.direction || 'front'}.`
                  : `Lighting: ${selectedLighting.name}, intensity ${selectedLighting.intensity}%, temperature ${selectedLighting.temperature}K, softness ${selectedLighting.softness}%, shadow ${selectedLighting.shadow}%, direction ${selectedLighting.direction || 'front'}.`;
              }
              
              if (aspectRatio)
                finalScene = finalScene
                  ? finalScene + ` Aspect ratio: ${aspectRatio}.`
                  : `Aspect ratio: ${aspectRatio}.`;
              if (imageQuality && imageQuality !== "Standard")
                finalScene = finalScene
                  ? finalScene + ` Quality: ${imageQuality}.`
                  : `Quality: ${imageQuality}.`;
              if (transparentBg)
                finalScene = finalScene
                  ? finalScene + ` Transparent background.`
                  : `Transparent background.`;
              if (upscale)
                finalScene = finalScene
                  ? finalScene + ` High-resolution upscale.`
                  : `High-resolution upscale.`;
              
              const webhookInput: WebhookJobInput = {
                numImages: 1,
                scenePrompt: finalScene || undefined,
                negativePrompt: negativePrompt || undefined,
                aspectRatio,
                imageQuality,
                transparentBg,
                upscale,
                selectedScene,
                selectedLighting,
                selectedBackground,
                selectedProps: selectedProps.length > 0 ? selectedProps : undefined,
              };
              
              if (finalModelImage) {
                webhookInput.modelImage = await fileToDataURI(finalModelImage);
              }
              if (finalApparelImage) {
                webhookInput.apparelImage = await fileToDataURI(finalApparelImage);
              }
              if (finalModelPrompt) {
                webhookInput.modelPrompt = finalModelPrompt;
              }
              if (finalApparelPrompt) {
                webhookInput.apparelPrompt = finalApparelPrompt;
              }
              
              const jobResponse = await createWebhookJob(webhookInput);
              const status = await pollWebhookJobStatus(jobResponse.jobId);
              
              if (status.status === "completed" && status.imageUrls[0]) {
                setGeneratedImages((imgs) =>
                  imgs.map((img, idx) =>
                    idx === i ? status.imageUrls[0] : img
                  )
                );
              }
            } catch (error) {
              console.error("Regeneration failed:", error);
              toast({
                variant: "destructive",
                title: "Regeneration failed",
                description: "Please try again.",
              });
            } finally {
              setIsGenerating(false);
            }
          }}
          onDownload={(img) => {
            const a = document.createElement("a");
            a.href = img;
            const ext = exportType.toLowerCase();
            a.download = `aicart-image.${ext}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
          onDelete={(index) =>
            setGeneratedImages((imgs) => imgs.filter((_, i) => i !== index))
          }
        />
        <SettingsPanel
          numImages={numImages}
          setNumImages={setNumImages}
          scenePrompt={scenePrompt}
          setScenePrompt={setScenePrompt}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          imageQuality={imageQuality}
          setImageQuality={setImageQuality}
          transparentBg={transparentBg}
          setTransparentBg={setTransparentBg}
          upscale={upscale}
          setUpscale={setUpscale}
          negativePrompt={negativePrompt}
          setNegativePrompt={setNegativePrompt}
          exportType={exportType}
          setExportType={setExportType}
          autoCleanup={autoCleanup}
          setAutoCleanup={setAutoCleanup}
          watermark={watermark}
          setWatermark={setWatermark}
          safeMode={safeMode}
          setSafeMode={setSafeMode}
          compareMode={compareMode}
          setCompareMode={setCompareMode}
          beforeAfter={beforeAfter}
          setBeforeAfter={setBeforeAfter}
          productPrompt={productPrompt}
          apparelPrompt={apparelPrompt}
          setArtDirectorOpen={setArtDirectorOpen}
          setArtDirectorOutput={setArtDirectorOutput}
          pbLibraryOpen={pbLibraryOpen}
          setPbLibraryOpen={setPbLibraryOpen}
          pbActiveTab={pbActiveTab}
          setPbActiveTab={setPbActiveTab}
          pbCategory={pbCategory}
          setPbCategory={setPbCategory}
          pbItems={pbItems}
          pbLoading={pbLoading}
          selectedScene={selectedScene}
          setSelectedScene={setSelectedScene}
          selectedLighting={selectedLighting}
          setSelectedLighting={setSelectedLighting}
          selectedBackground={selectedBackground}
          setSelectedBackground={setSelectedBackground}
          selectedProps={selectedProps}
          setSelectedProps={setSelectedProps}
          scenes={scenes}
          scenesLoading={scenesLoading}
          lightingPresets={lightingPresets}
          lightingLoading={lightingLoading}
        />
      </div>
      <Dialog
        open={!!zoomImage}
        onOpenChange={(open) => setZoomImage(open ? zoomImage : null)}
      >
        <DialogContent className="max-w-3xl">
          {zoomImage && (
            <img src={zoomImage} alt="Zoom" className="w-full h-auto" />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={artDirectorOpen} onOpenChange={setArtDirectorOpen}>
        <DialogContent className="max-w-2xl">
          <div className="space-y-3">
            {artDirectorOutput ? (
              <div className="space-y-2 text-sm">
                {artDirectorOutput.sceneDescription && (
                  <div>
                    <strong>Scene:</strong> {artDirectorOutput.sceneDescription}
                  </div>
                )}
                {artDirectorOutput.moodSuggestions && (
                  <div>
                    <strong>Moods:</strong> {artDirectorOutput.moodSuggestions.join(", ")}
                  </div>
                )}
                {artDirectorOutput.lightingSuggestions && (
                  <div>
                    <strong>Lighting:</strong> {artDirectorOutput.lightingSuggestions}
                  </div>
                )}
                {artDirectorOutput.propSuggestions && (
                  <div>
                    <strong>Props:</strong> {artDirectorOutput.propSuggestions.join(", ")}
                  </div>
                )}
                {artDirectorOutput.storylineSuggestions && (
                  <div>
                    <strong>Storyline:</strong> {artDirectorOutput.storylineSuggestions}
                  </div>
                )}
                {artDirectorOutput.cameraSuggestions && (
                  <div>
                    <strong>Camera:</strong> {artDirectorOutput.cameraSuggestions}
                  </div>
                )}
                {artDirectorOutput.lightingList && (
                  <div>
                    <strong>Lighting Ideas:</strong> {artDirectorOutput.lightingList.join(", ")}
                  </div>
                )}
                {artDirectorOutput.angleList && (
                  <div>
                    <strong>Angles:</strong> {artDirectorOutput.angleList.join(", ")}
                  </div>
                )}
                {artDirectorOutput.conceptList && (
                  <div>
                    <strong>Concepts:</strong> {artDirectorOutput.conceptList.join(", ")}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm">No suggestions yet.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

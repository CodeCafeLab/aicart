
"use client";

import React, { useState, useCallback } from "react";
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
import { generateVirtualShoot } from "@/ai/flows/virtual-shoot";
import type { GenerateVirtualShootInput } from "@/ai/flows/virtual-shoot-schemas";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

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
}) => (
  <header className="flex flex-col md:flex-row items-center justify-between p-4 border-b border-white/10 bg-[#171A24] print:hidden">
    <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
      <h1 className="text-xl font-bold">Virtual Studio</h1>
      <div className="hidden md:flex items-center gap-1 rounded-lg bg-[#0E1019] p-1 border border-white/10">
        {studioTabs.map((item) => (
          <Button
            key={item.label}
            variant={activeTab === item.label ? "secondary" : "ghost"}
            onClick={() => setActiveTab(item.label)}
            className={cn(
              "text-sm h-8 px-3 text-muted-foreground",
              activeTab === item.label && "bg-white/10 text-white"
            )}
          >
            {item.icon}
            <span className="ml-2">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
    <div className="flex items-center gap-3 w-full md:w-auto">
       <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
        <span>Credits: 4,982</span>
      </div>
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
      <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
        <User size={16} />
        <span>premium.user@virtualstudio.ai</span>
        <ChevronDown size={16} />
      </div>
    </div>
  </header>
);

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
            style={{objectFit: "contain"}}
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

  const onModelDrop = useCallback((acceptedFiles: File[]) => {
    setModelImage(acceptedFiles[0]);
  }, [setModelImage]);

  const onApparelDrop = useCallback((acceptedFiles: File[]) => {
    setApparelImage(acceptedFiles[0]);
  }, [setApparelImage]);

  const onProductDrop = useCallback((acceptedFiles: File[]) => {
    setApparelImage(acceptedFiles[0]); // Re-use apparel image state for product
  }, [setApparelImage]);

  const renderContent = () => {
    switch (activeTab) {
      case "Apparel":
        return (
          <Accordion type="multiple" defaultValue={['model', 'apparel', 'pose']} className="w-full">
            <AccordionItem value="model">
              <AccordionTrigger className="font-semibold text-base hover:no-underline"><Users className="mr-2" size={20} /> Model</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                  <div className="flex gap-2 p-1 bg-[#0E1019] rounded-md border border-white/10">
                  <Button onClick={() => setModelInputType('Upload')} variant={modelInputType === 'Upload' ? 'secondary' : 'ghost'} className={cn('flex-1 text-xs', modelInputType === 'Upload' && 'bg-white/5 text-white')}>
                      <Upload className="mr-1.5" size={14} />
                      Upload
                  </Button>
                  <Button onClick={() => setModelInputType('Prompt')} variant={modelInputType === 'Prompt' ? 'secondary' : 'ghost'} className={cn('flex-1 text-xs text-muted-foreground', modelInputType === 'Prompt' && 'bg-white/5 text-white')}>
                      <MessageSquare className="mr-1.5" size={14} />
                      Prompt
                  </Button>
                  <Button onClick={() => setModelInputType('Models')} variant={modelInputType === 'Models' ? 'secondary' : 'ghost'} className={cn('flex-1 text-xs text-muted-foreground', modelInputType === 'Models' && 'bg-white/5 text-white')}>
                      <Library className="mr-1.5" size={14} />
                      Library
                  </Button>
                  </div>
                  {modelInputType === 'Upload' && (
                  <ImageUpload
                      onDrop={onModelDrop}
                      title="Upload Your Model"
                      description="Drag 'n' drop or click"
                      icon={<User className="h-8 w-8 text-muted-foreground" />}
                      uploadedImage={modelImage ? URL.createObjectURL(modelImage) : null}
                      onRemove={() => setModelImage(null)}
                  />
                  )}
                  {modelInputType === 'Prompt' && (
                  <textarea
                      value={modelPrompt}
                      onChange={(e) => setModelPrompt(e.target.value)}
                      placeholder="e.g., A confident woman with curly hair, smiling, wearing a simple t-shirt..."
                      className="w-full h-32 p-3 rounded-xl bg-[#0E1019] border border-white/10 resize-none text-sm"
                  />
                  )}
                  {modelInputType === 'Models' && (
                    <div className="text-center text-muted-foreground p-8 bg-[#0E1019] rounded-lg border border-dashed border-white/10">Model Library Coming Soon</div>
                  )}
                  <div className="space-y-4">
                      <div>
                          <label className="text-sm font-medium text-muted-foreground">Age</label>
                          <Slider defaultValue={[25]} max={60} min={18} step={1} className="my-2"/>
                      </div>
                      <div>
                          <label className="text-sm font-medium text-muted-foreground">Body Type</label>
                           <div className="grid grid-cols-2 gap-2 mt-2">
                                {["Slim", "Athletic", "Average", "Curvy"].map(bt => (
                                    <Button key={bt} onClick={() => setBodyType(bt)} variant={bodyType === bt ? 'secondary' : 'outline'} className={cn('bg-transparent border-white/10', bodyType === bt && 'bg-white/10 text-white')}>
                                        {bt}
                                    </Button>
                                ))}
                           </div>
                      </div>
                  </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="apparel">
              <AccordionTrigger className="font-semibold text-base hover:no-underline"><Shirt className="mr-2" size={20} /> Apparel</AccordionTrigger>
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
                <AccordionTrigger className="font-semibold text-base hover:no-underline"><Settings2 className="mr-2" size={20}/> Apparel Controls</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Fit Adjustment</label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                           {["Tight", "Regular", "Loose"].map(fit => (
                               <Button key={fit} onClick={() => setApparelFit(fit)} variant={apparelFit === fit ? 'secondary' : 'outline'} className={cn('bg-transparent border-white/10', apparelFit === fit && 'bg-white/10 text-white')}>
                                   {fit}
                               </Button>
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
                <AccordionTrigger className="font-semibold text-base hover:no-underline"><PersonStanding className="mr-2" size={20}/> Pose & Expression</AccordionTrigger>
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
        );
      case "Product":
        return (
          <Accordion type="multiple" defaultValue={['product', 'product-controls']} className="w-full">
            <AccordionItem value="product">
              <AccordionTrigger className="font-semibold text-base hover:no-underline"><Package className="mr-2" size={20} /> Product</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                  <ImageUpload
                      onDrop={onProductDrop}
                      title="Upload Product Image"
                      description="PNG with transparent background recommended"
                      icon={<Package className="h-8 w-8 text-muted-foreground" />}
                      uploadedImage={apparelImage ? URL.createObjectURL(apparelImage) : null}
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
                <AccordionTrigger className="font-semibold text-base hover:no-underline"><Settings2 className="mr-2" size={20}/> Product Controls</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                     <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-muted-foreground">Realistic Shadow</label>
                        <Switch defaultChecked />
                    </div>
                     <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-muted-foreground">Floating Product</label>
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
              uploadedImage={apparelImage ? URL.createObjectURL(apparelImage) : null}
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
    <aside className="bg-[#171A24] rounded-lg p-4 flex flex-col gap-4 overflow-y-auto print:hidden">
      <h2 className="text-lg font-semibold">Inputs</h2>
      {renderContent()}
    </aside>
  );
};

const CanvasPanel = ({ generatedImages, isGenerating }: { generatedImages: string[]; isGenerating: boolean }) => (
  <main className="bg-[#0E1019] rounded-lg flex flex-col items-center justify-center p-4 md:p-8 text-center overflow-auto border-2 border-white/5">
    {isGenerating ? (
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-purple-400 animate-spin" />
        <h2 className="text-xl font-semibold">Generating your vision...</h2>
        <p className="text-muted-foreground mt-2 max-w-xs">
          The AI is currently crafting your images. This may take a moment.
        </p>
      </div>
    ) : generatedImages.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-full">
        {generatedImages.map((imgSrc, index) => (
          <div key={index} className="relative group rounded-lg overflow-hidden border border-white/10">
            <Image
              src={imgSrc}
              alt={`Generated image ${index + 1}`}
              fill
              style={{objectFit: "cover"}}
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="icon" variant="ghost"><ZoomIn size={20} /></Button>
                <Button size="icon" variant="ghost"><RefreshCw size={20} /></Button>
                <Button size="icon" variant="ghost"><Download size={20} /></Button>
                <Button size="icon" variant="destructive"><Trash2 size={20} /></Button>
            </div>
          </div>
        ))}
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
}: {
  numImages: number;
  setNumImages: (num: number) => void;
  setScenePrompt: (prompt: string) => void;
  scenePrompt: string;
}) => {
  const [aspectRatio, setAspectRatio] = useState("Portrait");
  const [imageQuality, setImageQuality] = useState("Standard");


  return (
    <aside className="bg-[#171A24] rounded-lg p-4 flex flex-col gap-4 overflow-y-auto print:hidden">
      <h2 className="text-lg font-semibold">Settings</h2>
      <Accordion
        type="multiple"
        defaultValue={["output", "scene-style", "lighting", "camera", "looks", "creative-controls"]}
        className="w-full"
      >
        <AccordionItem value="output">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <Camera className="mr-2" size={20} /> Output
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div>
              <h4 className="font-medium text-sm mb-2 text-muted-foreground">Aspect Ratio</h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {[
                  { label: 'Portrait', icon: <RectangleVertical size={16} /> },
                  { label: 'Square', icon: <Square size={16} /> },
                  { label: 'Landscape', icon: <RectangleHorizontal size={16} /> },
                  { label: 'Stories', icon: <GalleryVertical size={16} /> }
                ].map((ratio) => (
                  <Button
                    key={ratio.label}
                    variant={aspectRatio === ratio.label ? "secondary" : "outline"}
                    onClick={() => setAspectRatio(ratio.label)}
                    className={cn(
                      "text-xs h-9 bg-transparent border-white/10 text-muted-foreground",
                      aspectRatio === ratio.label && "bg-white/10 text-white"
                    )}
                  >
                    {ratio.icon}
                    <span className="ml-1.5">{ratio.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2 text-muted-foreground">Number of Images</h4>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 4].map((num) => (
                  <Button
                    key={num}
                    variant={numImages === num ? "secondary" : "outline"}
                    onClick={() => setNumImages(num)}
                    className={cn(
                      "h-9 bg-transparent border-white/10 text-muted-foreground",
                      numImages === num && "bg-purple-600 text-white border-purple-600"
                    )}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>
             <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-sm">Transparent Background</p>
                </div>
                <Switch />
            </div>
             <div>
              <h4 className="font-medium text-sm mb-2 text-muted-foreground">Image Quality</h4>
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
                <Switch />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="scene-style">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <Palette className="mr-2" size={20} />
            Scene & Style
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
             <Card className="bg-[#0E1019] border-white/10">
                <CardContent className="p-3">
                    <h4 className="font-medium text-sm mb-2 text-muted-foreground">AI Scene Prompt</h4>
                    <textarea
                        value={scenePrompt}
                        onChange={(e) => setScenePrompt(e.target.value)}
                        placeholder="e.g., A bright, sunny day at a beach with palm trees."
                        className="w-full h-24 p-3 rounded-xl bg-[#0E1019] border border-white/10 resize-none"
                    />
                </CardContent>
            </Card>
             <Card className="bg-[#0E1019] border-white/10">
                <CardContent className="p-3">
                     <h4 className="font-medium text-sm mb-2 text-muted-foreground">Props & Backgrounds</h4>
                     <Button variant="outline" className="w-full bg-transparent border-white/10">Open Library</Button>
                </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="lighting">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <Sun className="mr-2" size={20} />
            Lighting Studio
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div>
                <label className="text-sm font-medium text-muted-foreground">Intensity</label>
                <Slider defaultValue={[70]} max={100} step={1} className="my-2"/>
            </div>
            <div>
                <label className="text-sm font-medium text-muted-foreground">Temperature</label>
                <Slider defaultValue={[5500]} min={2000} max={8000} step={100} className="my-2"/>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="camera">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <Camera className="mr-2" size={20} />
            Camera Controls
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div>
                <label className="text-sm font-medium text-muted-foreground">Focal Length</label>
                <Slider defaultValue={[50]} min={24} max={105} step={1} className="my-2"/>
            </div>
            <div>
                <label className="text-sm font-medium text-muted-foreground">Aperture (f-stop)</label>
                <Slider defaultValue={[2.8]} min={1.4} max={16} step={0.1} className="my-2"/>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="looks">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <Eye className="mr-2" size={20} />
            Looks & Styles
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="bg-transparent border-white/10 h-auto flex flex-col items-center py-2">
                    <Film size={20} />
                    <span className="text-xs mt-1">Film</span>
                </Button>
                <Button variant="outline" className="bg-transparent border-white/10 h-auto flex flex-col items-center py-2">
                    <Heart size={20} />
                    <span className="text-xs mt-1">Vintage</span>
                </Button>
                <Button variant="outline" className="bg-transparent border-white/10 h-auto flex flex-col items-center py-2">
                    <Maximize size={20} />
                    <span className="text-xs mt-1">B & W</span>
                </Button>
                <Button variant="outline" className="bg-transparent border-white/10 h-auto flex flex-col items-center py-2">
                    <Sparkles size={20} />
                    <span className="text-xs mt-1">E-commerce</span>
                </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="creative-controls" className="border-b-0">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <Settings2 className="mr-2" size={20} />
            Advanced Controls
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smile size={16} className="text-muted-foreground" />
                <label htmlFor="face-correction" className="font-medium text-sm">Face Correction</label>
              </div>
              <Switch id="face-correction" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb size={16} className="text-muted-foreground" />
                <label htmlFor="smart-relighting" className="font-medium text-sm">Smart Relighting</label>
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
                 <Button variant="outline" className="w-full bg-transparent border-white/10">
                    <Paintbrush size={16} className="mr-2"/> Inpainting / Outpainting
                </Button>
            </div>
            <div>
              <label className="flex items-center gap-2 font-medium text-sm mb-2">
                <MinusCircle size={16}/> Negative Prompt
              </label>
              <Textarea placeholder="e.g., extra fingers, distorted face, blurry"/>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
};

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
  const [activeStudioTab, setActiveStudioTab] = useState(studioTabs[0].label);

  const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    if (!modelImage && !modelPrompt && activeStudioTab === 'Apparel') {
      alert("Please provide either a model image or a model prompt.");
      return;
    }
     if (!apparelImage && !apparelPrompt && activeStudioTab === 'Product') {
      alert("Please provide a product image or description.");
      return;
    }

    setIsGenerating(true);
    setGeneratedImages([]);
    try {
      const input: GenerateVirtualShootInput = {
        numImages,
      };
      
      let finalModelPrompt = (activeStudioTab === 'Apparel') ? modelPrompt : undefined;
      let finalApparelPrompt = (activeStudioTab === 'Apparel' || activeStudioTab === 'Product') ? apparelPrompt : productPrompt;
      let finalModelImage = (activeStudioTab === 'Apparel') ? modelImage : null;
      let finalApparelImage = (activeStudioTab === 'Apparel' || activeStudioTab === 'Product' || activeStudioTab === 'Re-imagine') ? apparelImage : null;

      if (finalModelImage) input.modelImage = await fileToDataURI(finalModelImage);
      if (finalApparelImage) input.apparelImage = await fileToDataURI(finalApparelImage);
      
      // Don't send empty prompts
      if (finalModelPrompt) input.modelPrompt = finalModelPrompt;
      if (finalApparelPrompt) input.apparelPrompt = finalApparelPrompt;
      if (scenePrompt) input.scenePrompt = scenePrompt;
      
      const result = await generateVirtualShoot(input);
      setGeneratedImages(result.imageUrls);

    } catch (error) {
      console.error("Generation failed:", error);
      // You could add a toast notification here to inform the user
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0E1019] text-white font-body">
      <StudioHeader 
        onGenerate={handleGenerate} 
        isGenerating={isGenerating}
        activeTab={activeStudioTab}
        setActiveTab={setActiveStudioTab}
      />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr),minmax(0,2fr),minmax(0,1fr)] xl:grid-cols-[380px,1fr,380px] gap-4 p-4 overflow-hidden">
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
        <CanvasPanel generatedImages={generatedImages} isGenerating={isGenerating} />
        <SettingsPanel
          numImages={numImages}
          setNumImages={setNumImages}
          scenePrompt={scenePrompt}
          setScenePrompt={setScenePrompt}
        />
      </div>
    </div>
  );
}

    

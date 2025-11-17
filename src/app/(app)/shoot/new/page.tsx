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

const StudioHeader = ({ onGenerate, isGenerating }: { onGenerate: () => void; isGenerating: boolean }) => (
  <header className="flex flex-col md:flex-row items-center justify-between p-4 border-b border-white/10 bg-[#171A24] print:hidden">
    <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
      <h1 className="text-xl font-bold">Virtual Studio</h1>
      <div className="hidden md:flex items-center gap-1 rounded-lg bg-[#0E1019] p-1 border border-white/10">
        {[
          { icon: <Shirt size={16} />, label: "Apparel" },
          { icon: <ImageIcon size={16} />, label: "Product" },
          { icon: <WandSparkles size={16} />, label: "Design" },
          { icon: <BrainCircuit size={16} />, label: "Re-imagine" },
        ].map((item, index) => (
          <Button
            key={item.label}
            variant={index === 0 ? "secondary" : "ghost"}
            className={cn(
              "text-sm h-8 px-3 text-muted-foreground",
              index === 0 && "bg-white/10 text-white"
            )}
          >
            {item.icon}
            <span className="ml-2">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
    <div className="flex items-center gap-3 w-full md:w-auto">
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
        "border-2 border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center justify-center text-center flex-grow bg-[#0E1019] cursor-pointer transition-colors",
        isDragActive && "border-purple-500 bg-purple-500/10"
      )}
    >
      <input {...getInputProps()} />
      {uploadedImage ? (
        <div className="relative w-full h-full">
          <Image
            src={uploadedImage}
            alt="Uploaded asset"
            layout="fill"
            objectFit="contain"
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
          <h3 className="font-semibold mt-4">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
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
  modelImage,
  apparelImage,
  modelPrompt,
  apparelPrompt,
}: {
  setModelImage: (file: File | null) => void;
  setApparelImage: (file: File | null) => void;
  setModelPrompt: (prompt: string) => void;
  setApparelPrompt: (prompt: string) => void;
  modelImage: File | null;
  apparelImage: File | null;
  modelPrompt: string;
  apparelPrompt: string;
}) => {
  const [inputType, setInputType] = useState("Model");
  const [modelInputType, setModelInputType] = useState("Upload");

  const onModelDrop = useCallback((acceptedFiles: File[]) => {
    setModelImage(acceptedFiles[0]);
  }, [setModelImage]);

  const onApparelDrop = useCallback((acceptedFiles: File[]) => {
    setApparelImage(acceptedFiles[0]);
  }, [setApparelImage]);

  return (
    <aside className="bg-[#171A24] rounded-lg p-4 flex flex-col gap-4 overflow-y-auto print:hidden">
      <h2 className="text-lg font-semibold">Inputs</h2>
      <div className="flex gap-2 p-1 bg-[#0E1019] rounded-md border border-white/10">
        <Button
          onClick={() => setInputType("Model")}
          variant={inputType === "Model" ? "secondary" : "ghost"}
          className={cn("flex-1", inputType === "Model" && "bg-white/10 text-white")}
        >
          <Users className="mr-2" size={16} />
          Model
        </Button>
        <Button
          onClick={() => setInputType("Apparel")}
          variant={inputType === "Apparel" ? "secondary" : "ghost"}
          className={cn("flex-1 text-muted-foreground", inputType === "Apparel" && "bg-white/10 text-white")}
        >
          <Shirt className="mr-2" size={16} />
          Apparel
        </Button>
      </div>

      {inputType === "Model" && (
        <>
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
              Models
            </Button>
          </div>
          {modelInputType === 'Upload' && (
            <ImageUpload
              onDrop={onModelDrop}
              title="Upload Your Model"
              description="Drag 'n' drop or click to browse"
              icon={<User className="h-10 w-10 text-muted-foreground mb-4" />}
              uploadedImage={modelImage ? URL.createObjectURL(modelImage) : null}
              onRemove={() => setModelImage(null)}
            />
          )}
          {modelInputType === 'Prompt' && (
            <textarea
              value={modelPrompt}
              onChange={(e) => setModelPrompt(e.target.value)}
              placeholder="e.g., A confident woman with curly hair, smiling, wearing a simple t-shirt..."
              className="w-full h-36 p-3 rounded-xl bg-[#0E1019] border border-white/10 resize-none"
            />
          )}
        </>
      )}

      {inputType === "Apparel" && (
        <ImageUpload
          onDrop={onApparelDrop}
          title="Upload Your Apparel"
          description="Drag 'n' drop or click to browse"
          icon={<Shirt className="h-10 w-10 text-muted-foreground mb-4" />}
          uploadedImage={apparelImage ? URL.createObjectURL(apparelImage) : null}
          onRemove={() => setApparelImage(null)}
        />
      )}
    </aside>
  );
};

const CanvasPanel = ({ generatedImages, isGenerating }: { generatedImages: string[]; isGenerating: boolean }) => (
  <main className="bg-[#171A24] rounded-lg flex flex-col items-center justify-center p-4 md:p-8 text-center overflow-auto">
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
          <div key={index} className="relative rounded-lg overflow-hidden border border-white/10">
            <Image
              src={imgSrc}
              alt={`Generated image ${index + 1}`}
              layout="fill"
              objectFit="cover"
            />
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
          Your generated images will appear here. Begin by adding a model and apparel.
        </p>
      </>
    )}
  </main>
);

const SettingsPanel = ({
  aspectRatio,
  setAspectRatio,
  numImages,
  setNumImages,
  setScenePrompt,
  scenePrompt,
}: {
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
  numImages: number;
  setNumImages: (num: number) => void;
  setScenePrompt: (prompt: string) => void;
  scenePrompt: string;
}) => {
  const [ecommercePack, setEcommercePack] = useState("Off");

  return (
    <aside className="bg-[#171A24] rounded-lg p-4 flex flex-col gap-4 overflow-y-auto print:hidden">
      <h2 className="text-lg font-semibold">Settings</h2>
      <Accordion
        type="multiple"
        defaultValue={["output", "scene-style", "e-commerce", "social", "asset-pack", "looks", "creative-controls"]}
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="scene-style">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <Palette className="mr-2" size={20} />
            Scene & Style
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <textarea
              value={scenePrompt}
              onChange={(e) => setScenePrompt(e.target.value)}
              placeholder="e.g., A bright, sunny day at a beach with palm trees."
              className="w-full h-24 p-3 rounded-xl bg-[#0E1019] border border-white/10 resize-none"
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="e-commerce">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <LayoutGrid className="mr-2" size={20} />
            E-commerce Pack
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Automatically generate a standard set of shots for your product page.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Off", "Essential", "Plus", "Dynamic", "Editorial", "POV"].map(
                (pack) => (
                  <Button
                    key={pack}
                    variant={ecommercePack === pack ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setEcommercePack(pack)}
                    className={cn(
                      "text-xs bg-transparent border-white/10 text-muted-foreground",
                      ecommercePack === pack && "bg-white/10 text-white"
                    )}
                  >
                    {pack}
                  </Button>
                )
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="social">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <LinkIcon className="mr-2" size={20} />
            Social Media Pack
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Generate social assets</p>
                <p className="text-sm text-muted-foreground">
                  4 lifestyle shots in 1:1 and 9:16 aspect ratios.
                </p>
              </div>
              <Switch />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="asset-pack">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <Layers className="mr-2" size={20} />
            Complete Asset Pack
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Generate full asset pack</p>
                <p className="text-sm text-muted-foreground">
                  8 e-commerce and social media assets in one click.
                </p>
              </div>
              <Switch />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="looks">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <Eye className="mr-2" size={20} />
            Looks
          </AccordionTrigger>
          <AccordionContent className="pt-2 text-muted-foreground text-sm">Coming soon.</AccordionContent>
        </AccordionItem>

        <AccordionItem value="creative-controls" className="border-b-0">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <Settings2 className="mr-2" size={20} />
            Creative Controls
          </AccordionTrigger>
          <AccordionContent className="pt-2 text-muted-foreground text-sm">Coming soon.</AccordionContent>
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
  const [scenePrompt, setScenePrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("Portrait");
  const [numImages, setNumImages] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedImages([]);
    try {
      const input: GenerateVirtualShootInput = {
        modelPrompt,
        apparelPrompt,
        scenePrompt,
        numImages,
      };

      if (modelImage) {
        input.modelImage = await fileToDataURI(modelImage);
      }
      if (apparelImage) {
        input.apparelImage = await fileToDataURI(apparelImage);
      }
      
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
      <StudioHeader onGenerate={handleGenerate} isGenerating={isGenerating} />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[380px,1fr,380px] gap-4 p-4 overflow-hidden">
        <InputsPanel
          modelImage={modelImage}
          apparelImage={apparelImage}
          modelPrompt={modelPrompt}
          apparelPrompt={apparelPrompt}
          setModelImage={setModelImage}
          setApparelImage={setApparelImage}
          setModelPrompt={setModelPrompt}
          setApparelPrompt={setApparelPrompt}
        />
        <CanvasPanel generatedImages={generatedImages} isGenerating={isGenerating} />
        <SettingsPanel
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          numImages={numImages}
          setNumImages={setNumImages}
          scenePrompt={scenePrompt}
          setScenePrompt={setScenePrompt}
        />
      </div>
    </div>
  );
}

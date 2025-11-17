"use client";

import React, { useState } from "react";
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
  Image as ImageIcon
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
import Logo from "@/components/logo";

const StudioHeader = () => (
  <header className="flex flex-col md:flex-row items-center justify-between p-4 border-b border-white/10 bg-[#171A24]">
    <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
      <h1 className="text-xl font-bold">Virtual Studio</h1>
      <div className="hidden md:flex items-center gap-1 rounded-lg bg-[#0E1019] p-1 border border-white/10">
        {[
          { icon: <Shirt size={16} />, label: "Apparel" },
          { icon: <ImageIcon size={16}/>, label: "Product" },
          { icon: <WandSparkles size={16}/>, label: "Design" },
          { icon: <BrainCircuit size={16}/>, label: "Re-imagine" },
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
      <Button className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2">
        <Sparkles className="h-4 w-4" />
        Generate
      </Button>
      <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
        <User size={16}/>
        <span>premium.user@virtualstudio.ai</span>
        <ChevronDown size={16} />
      </div>
    </div>
  </header>
);

const InputsPanel = () => {
  const [inputType, setInputType] = useState("Model");
  const [modelInputType, setModelInputType] = useState("Upload");

  return (
    <aside className="bg-[#171A24] rounded-lg p-4 flex flex-col gap-4 overflow-y-auto">
      <h2 className="text-lg font-semibold">Inputs</h2>
      <div className="flex gap-2 p-1 bg-[#0E1019] rounded-md border border-white/10">
        <Button
          onClick={() => setInputType("Model")}
          variant={inputType === "Model" ? "secondary" : "ghost"}
          className={cn( "flex-1", inputType === "Model" && "bg-white/10 text-white" )}
        >
          <Users className="mr-2" size={16} />
          Model
        </Button>
        <Button
          onClick={() => setInputType("Apparel")}
          variant={inputType === "Apparel" ? "secondary" : "ghost"}
          className={cn( "flex-1 text-muted-foreground", inputType === "Apparel" && "bg-white/10 text-white" )}
        >
          <Shirt className="mr-2" size={16} />
          Apparel
        </Button>
      </div>

      {inputType === "Model" && (
        <>
          <div className="flex gap-2 p-1 bg-[#0E1019] rounded-md border border-white/10">
            <Button onClick={() => setModelInputType('Upload')} variant={modelInputType === 'Upload' ? 'secondary' : 'ghost'} className={cn('flex-1 text-xs', modelInputType === 'Upload' && 'bg-white/5 text-white' )}>
              <Upload className="mr-1.5" size={14}/>
              Upload
            </Button>
            <Button onClick={() => setModelInputType('Prompt')} variant={modelInputType === 'Prompt' ? 'secondary' : 'ghost'} className={cn('flex-1 text-xs text-muted-foreground', modelInputType === 'Prompt' && 'bg-white/5 text-white' )}>
              <MessageSquare className="mr-1.5" size={14}/>
              Prompt
            </Button>
            <Button onClick={() => setModelInputType('Models')} variant={modelInputType === 'Models' ? 'secondary' : 'ghost'} className={cn('flex-1 text-xs text-muted-foreground', modelInputType === 'Models' && 'bg-white/5 text-white')}>
              <Library className="mr-1.5" size={14}/>
              Models
            </Button>
          </div>
          <div className="border-2 border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center justify-center text-center flex-grow bg-[#0E1019]">
            <User className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-semibold">Upload Your Model</h3>
            <p className="text-sm text-muted-foreground">
              Drag 'n' drop or click to browse
            </p>
          </div>
        </>
      )}

      {inputType === "Apparel" && (
         <div className="border-2 border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center justify-center text-center flex-grow bg-[#0E1019]">
            <Shirt className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-semibold">Upload Your Apparel</h3>
            <p className="text-sm text-muted-foreground">
              Drag 'n' drop or click to browse
            </p>
          </div>
      )}
    </aside>
  );
};

const CanvasPanel = () => (
  <main className="bg-[#171A24] rounded-lg flex flex-col items-center justify-center p-8 text-center">
    <div className="p-4 bg-purple-600/10 rounded-full mb-4 border border-purple-500/20">
      <Sparkles className="h-8 w-8 text-purple-400" />
    </div>
    <h2 className="text-xl font-semibold">Virtual Studio Canvas</h2>
    <p className="text-muted-foreground mt-2 max-w-xs">
      Your generated images and videos will appear here. Begin by adding a model
      and apparel in the left panel.
    </p>
  </main>
);

const SettingsPanel = () => {
  const [aspectRatio, setAspectRatio] = useState("Portrait");
  const [numImages, setNumImages] = useState(1);
  const [ecommercePack, setEcommercePack] = useState("Off");

  return (
    <aside className="bg-[#171A24] rounded-lg p-4 flex flex-col gap-4 overflow-y-auto">
      <h2 className="text-lg font-semibold">Settings</h2>
      <Accordion
        type="multiple"
        defaultValue={["output", "e-commerce", "social", "asset-pack", "looks", "creative-controls", "scene-style"]}
        className="w-full"
      >
        <AccordionItem value="output">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <Camera className="mr-2" size={20}/> Output
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div>
              <h4 className="font-medium text-sm mb-2 text-muted-foreground">Aspect Ratio</h4>
              <div className="grid grid-cols-4 gap-2">
                {[
                  {label: 'Portrait', icon: <RectangleVertical size={16}/>}, 
                  {label: 'Square', icon: <Square size={16}/>}, 
                  {label: 'Landscape', icon: <RectangleHorizontal size={16}/>}, 
                  {label: 'Stories', icon: <GalleryVertical size={16}/>}
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

        <AccordionItem value="e-commerce">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <LayoutGrid className="mr-2" size={20} />
            E-commerce Pack
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Automatically generate a standard set of shots for your product
              page.
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
            <LinkIcon className="mr-2" size={20}/>
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
            <Layers className="mr-2" size={20}/>
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
            <Eye className="mr-2" size={20}/>
            Looks
          </AccordionTrigger>
          <AccordionContent className="pt-2 text-muted-foreground text-sm">Coming soon.</AccordionContent>
        </AccordionItem>

        <AccordionItem value="creative-controls">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <Settings2 className="mr-2" size={20}/>
            Creative Controls
          </AccordionTrigger>
          <AccordionContent className="pt-2 text-muted-foreground text-sm">Coming soon.</AccordionContent>
        </AccordionItem>

         <AccordionItem value="scene-style" className="border-b-0">
          <AccordionTrigger className="font-semibold text-base hover:no-underline">
            <Palette className="mr-2" size={20}/>
            Scene & Style
          </AccordionTrigger>
          <AccordionContent className="pt-2 text-muted-foreground text-sm">Coming soon.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
};

export default function VirtualStudioPage() {
  return (
    <div className="flex flex-col h-screen bg-[#0E1019] text-white font-body">
      <StudioHeader />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[380px,1fr,380px] gap-4 p-4 overflow-hidden">
        <InputsPanel />
        <CanvasPanel />
        <SettingsPanel />
      </div>
    </div>
  );
}

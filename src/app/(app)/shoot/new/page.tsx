"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Sparkles,
  Tally1,
  Tally2,
  Tally4,
  LayoutGrid,
  ChevronDown,
  Camera,
  Shirt,
  Users,
  Eye,
  Settings,
  Flame,
  Image,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Logo from "@/components/logo";

const StudioHeader = () => (
    <header className="flex items-center justify-between p-4 border-b border-white/10 bg-background">
        <div className="flex items-center gap-4">
            <Logo className="text-white"/>
            <div className="flex items-center gap-2 rounded-lg bg-card p-1 border border-border">
                {['Apparel', 'Product', 'Design', 'Re-imagine'].map((item, index) => (
                    <Button key={item} variant={index === 0 ? "secondary": "ghost"} className={cn("text-sm h-8", index === 0 && "bg-primary/10 text-primary")}>
                       {item}
                    </Button>
                ))}
            </div>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Generate
        </Button>
    </header>
);

const InputsPanel = () => {
    const [inputType, setInputType] = useState('Apparel');

    return (
        <aside className="bg-card rounded-lg p-4 flex flex-col gap-4 overflow-y-auto">
            <h2 className="text-lg font-semibold">Inputs</h2>
            <div className="flex gap-2 p-1 bg-background rounded-md border border-border">
                <Button onClick={() => setInputType('Model')} variant={inputType === 'Model' ? "secondary" : "ghost"} className="flex-1">
                    <Users className="mr-2"/>Model
                </Button>
                <Button onClick={() => setInputType('Apparel')} variant={inputType === 'Apparel' ? "secondary" : "ghost"} className="flex-1">
                    <Shirt className="mr-2"/>Apparel
                </Button>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center">
                <Shirt className="h-8 w-8 text-muted-foreground mb-2"/>
                <h3 className="font-semibold">Add apparel images</h3>
                <p className="text-sm text-muted-foreground">Drop one or more items</p>
            </div>
            
            <p className="text-xs text-muted-foreground">Drag to reorder layers (inner to outer).</p>

            <div className="bg-background rounded-md p-3 border border-border">
                <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400" alt="apparel" className="object-cover w-full h-full"/>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium">Apparel Details</p>
                        <input type="text" placeholder="e.g., Blue oversized t-shirt" className="w-full bg-background border-border border rounded-md p-2 mt-1 text-sm"/>
                    </div>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Layers className="w-4 h-4"/></Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Add other views for better accuracy on complex shots:</p>
                 <div className="flex gap-2 mt-2">
                    <Button variant="outline" className="flex-1 text-xs h-8"><Image className="mr-1"/>Add Back</Button>
                    <Button variant="outline" className="flex-1 text-xs h-8"><Image className="mr-1"/>Add Detail</Button>
                 </div>
            </div>

            <Card className="bg-background border-border">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2"><Sparkles className="text-primary"/>AI Art Director Concepts</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Here are a few creative directions. Choose one to apply settings.</p>
                    <div className="bg-card p-3 rounded-md border border-border">
                        <h4 className="font-semibold text-primary">Modern Lines</h4>
                        <p className="text-sm text-muted-foreground mt-1">The contemporary cut and bold color would stand out strikingly against the clean lines and geometric forms of modern architecture.</p>
                    </div>
                </CardContent>
            </Card>
        </aside>
    );
}

const CanvasPanel = () => (
    <main className="bg-card rounded-lg flex flex-col items-center justify-center p-8 text-center">
        <div className="p-4 bg-purple-600/10 rounded-full mb-4">
          <Sparkles className="h-8 w-8 text-purple-400" />
        </div>
        <h2 className="text-xl font-semibold">Virtual Studio Canvas</h2>
        <p className="text-muted-foreground mt-2 max-w-xs">Your generated images and videos will appear here. Begin by adding a model and apparel in the left panel.</p>
    </main>
);

const SettingsPanel = () => {
    const [aspectRatio, setAspectRatio] = useState('Square');
    const [numImages, setNumImages] = useState(1);
    const [ecommercePack, setEcommercePack] = useState('Off');
    
    return (
        <aside className="bg-card rounded-lg p-4 flex flex-col gap-4 overflow-y-auto">
             <h2 className="text-lg font-semibold">Settings</h2>
             <Accordion type="multiple" defaultValue={['output', 'e-commerce', 'looks', 'creative-controls']} className="w-full">
                <AccordionItem value="output">
                    <AccordionTrigger className="font-semibold"><Camera className="mr-2"/>Output</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <div>
                            <h4 className="font-medium text-sm mb-2">Aspect Ratio</h4>
                            <div className="grid grid-cols-4 gap-2">
                                {['Portrait', 'Square', 'Landscape', 'Stories'].map(ratio => (
                                    <Button key={ratio} variant={aspectRatio === ratio ? "secondary" : "outline"} onClick={() => setAspectRatio(ratio)} className="text-xs h-9">
                                        {ratio}
                                    </Button>
                                ))}
                            </div>
                        </div>
                         <div>
                            <h4 className="font-medium text-sm mb-2">Number of Images</h4>
                            <div className="grid grid-cols-3 gap-2">
                                {[1, 2, 4].map(num => (
                                    <Button key={num} variant={numImages === num ? "secondary" : "outline"} onClick={() => setNumImages(num)} className="h-9">
                                        {num}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="e-commerce">
                    <AccordionTrigger className="font-semibold"><LayoutGrid className="mr-2"/>E-commerce Pack</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <p className="text-sm text-muted-foreground">Automatically generate a standard set of shots for your product page.</p>
                        <div className="flex flex-wrap gap-2">
                           {['Off', 'Essential', 'Plus', 'Dynamic', 'Editorial', 'POV'].map(pack => (
                                <Button key={pack} variant={ecommercePack === pack ? 'secondary' : 'outline'} size="sm" onClick={() => setEcommercePack(pack)}>
                                    {pack}
                                </Button>
                           ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                
                 <AccordionItem value="social">
                    <AccordionTrigger className="font-semibold"><Sparkles className="mr-2"/>Social Media Pack</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                       <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Generate social assets</p>
                                <p className="text-sm text-muted-foreground">4 lifestyle shots in 1:1 and 9:16.</p>
                            </div>
                            <Switch/>
                       </div>
                    </AccordionContent>
                </AccordionItem>
                
                 <AccordionItem value="asset-pack">
                    <AccordionTrigger className="font-semibold"><Layers className="mr-2"/>Complete Asset Pack</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Generate full asset pack</p>
                                <p className="text-sm text-muted-foreground">8 e-commerce and social media assets.</p>
                            </div>
                            <Switch/>
                       </div>
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="looks">
                    <AccordionTrigger className="font-semibold"><Eye className="mr-2"/>Looks</AccordionTrigger>
                    <AccordionContent>Coming soon.</AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="creative-controls">
                    <AccordionTrigger className="font-semibold"><Settings className="mr-2"/>Creative Controls</AccordionTrigger>
                    <AccordionContent>Coming soon.</AccordionContent>
                </AccordionItem>

            </Accordion>
        </aside>
    );
}

export default function VirtualStudioPage() {
  return (
    <div className="flex flex-col h-screen bg-background text-white font-body">
      <StudioHeader />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[380px,1fr,380px] gap-4 p-4 overflow-hidden">
        <InputsPanel />
        <CanvasPanel />
        <SettingsPanel />
      </div>
    </div>
  );
}

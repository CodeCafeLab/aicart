
"use client";

import { useState } from "react";
import {
  CheckCircle,
  UploadCloud,
  ChevronRight,
  Shirt,
  Sparkles,
  Camera,
  Lightbulb,
  Palette,
  Users,
  Footprints,
  Gem,
  Blend,
  Lamp,
  Home,
  Utensils,
  Computer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: 1,
    title: "Product",
    icon: <Shirt className="h-6 w-6" />,
  },
  {
    id: 2,
    title: "Avatar",
    icon: <Users className="h-6 w-6" />,
  },
  {
    id: 3,
    title: "Scene",
    icon: <Palette className="h-6 w-6" />,
  },
  {
    id: 4,
    title: "Lighting",
    icon: <Lightbulb className="h-6 w-6" />,
  },
  {
    id: 5,
    title: "Generate",
    icon: <Sparkles className="h-6 w-6" />,
  },
];

const productTypes = [
    { name: "Apparel", icon: <Shirt /> },
    { name: "Jewelry", icon: <Gem /> },
    { name: "Footwear", icon: <Footprints /> },
    { name: "Cosmetics", icon: <Blend /> },
    { name: "Tech Gadgets", icon: <Computer /> },
    { name: "Home Decor", icon: <Lamp /> },
    { name: "Food & Beverage", icon: <Utensils /> },
]

export default function NewShootPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProductType, setSelectedProductType] = useState<string | null>(null);

  const Step1Product = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div>
            <h2 className="text-3xl font-bold font-headline">Upload Your Product</h2>
            <p className="text-muted-foreground mt-2">StudioForge will auto-remove backgrounds & prepare your product for the shoot.</p>
        </div>

        <Card className="border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent/20 transition-all duration-300 group bg-transparent">
            <CardContent className="p-6 text-center flex flex-col items-center justify-center h-64">
                <UploadCloud className="h-16 w-16 text-muted-foreground group-hover:text-primary transition-colors mb-4"/>
                <Button variant="outline" className="mb-2">Upload Product Image</Button>
                <p className="text-sm text-muted-foreground">or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-2">Supports PNG, JPG up to 50MB</p>
            </CardContent>
        </Card>

        <div>
            <h3 className="text-lg font-semibold mb-4">Select Product Type (Optional)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {productTypes.map((type) => (
                     <Card 
                        key={type.name} 
                        className={cn(
                            "p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all border-2",
                            selectedProductType === type.name 
                                ? "border-primary/80 bg-primary/10 shadow-lg shadow-primary/10" 
                                : "border-border hover:border-primary/50 hover:bg-accent/20"
                        )}
                        onClick={() => setSelectedProductType(type.name)}
                    >
                        {type.icon}
                        <span className="text-sm font-medium text-center">{type.name}</span>
                    </Card>
                ))}
            </div>
        </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1Product />;
      // Future steps will be added here
      default:
        return <Step1Product />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-full">
       <aside className="w-full lg:w-64">
            <div className="sticky top-20">
                <h1 className="font-headline text-2xl font-bold tracking-tight mb-2">Start New Shoot</h1>
                <p className="text-muted-foreground text-sm mb-6">Create a professional shoot in minutes.</p>
                <div className="flex lg:flex-col gap-2">
                    {steps.map((step) => (
                        <div
                        key={step.id}
                        className={cn(
                            "flex items-center gap-4 p-3 rounded-lg transition-all w-full",
                            currentStep === step.id && "bg-primary/10",
                            currentStep > step.id && "text-muted-foreground"
                        )}
                        >
                        <div
                            className={cn(
                                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                                currentStep === step.id && "bg-primary text-primary-foreground border-primary",
                                currentStep > step.id && "bg-green-500/20 border-green-500/50 text-green-400",
                                currentStep < step.id && "bg-card border-border"
                            )}
                        >
                            {currentStep > step.id ? <CheckCircle className="h-6 w-6" /> : step.icon}
                        </div>
                        <span className="font-semibold hidden md:inline">{step.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        </aside>

      <main className="flex-1">
        {renderStepContent()}
      </main>

      <div className="w-full lg:w-1/3">
        {/* Preview Panel will go here */}
      </div>

       <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t lg:hidden">
            <Button className="w-full" size="lg" onClick={() => setCurrentStep(s => Math.min(s + 1, 5))}>
                Continue <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
       </div>
       <div className="hidden lg:block sticky bottom-8 ml-auto mt-auto">
            <Button size="lg" onClick={() => setCurrentStep(s => Math.min(s + 1, 5))}>
                Continue <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
        </div>
    </div>
  );
}

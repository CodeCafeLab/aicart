"use client";

import React, { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Product', icon: <Shirt className="h-5 w-5" /> },
  { id: 2, title: 'Avatar', icon: <Users className="h-5 w-5" /> },
  { id: 3, title: 'Scene', icon: <Palette className="h-5 w-5" /> },
  { id: 4, title: 'Lighting', icon: <Lightbulb className="h-5 w-5" /> },
  { id: 5, title: 'Generate', icon: <Sparkles className="h-5 w-5" /> },
];

const productTypes = [
  { name: 'Apparel', icon: <Shirt className="h-5 w-5" /> },
  { name: 'Jewelry', icon: <Gem className="h-5 w-5" /> },
  { name: 'Footwear', icon: <Footprints className="h-5 w-5" /> },
  { name: 'Cosmetics', icon: <Blend className="h-5 w-5" /> },
  { name: 'Tech Gadgets', icon: <Computer className="h-5 w-5" /> },
  { name: 'Home Decor', icon: <Lamp className="h-5 w-5" /> },
  { name: 'Food & Beverage', icon: <Utensils className="h-5 w-5" /> },
];

export default function NewShootPageImproved() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProductType, setSelectedProductType] = useState<string | null>(
    null
  );
  const [productPreviewUrl, setProductPreviewUrl] = useState<string | null>(
    null
  );

  function renderStep() {
    switch (currentStep) {
      case 1:
        return (
          <section className="space-y-8 animate-in fade-in">
             <div>
              <h3 className="text-lg font-semibold mb-3">
                Select Product Type (Optional)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
                {productTypes.map((type) => {
                  const active = selectedProductType === type.name;
                  return (
                    <button
                      aria-pressed={active}
                      key={type.name}
                      onClick={() => setSelectedProductType(type.name)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-3 rounded-xl border transition',
                        active
                          ? 'border-2 border-[#FFB400] bg-[#FFB4000A] shadow-md'
                          : 'border-border hover:border-[#FFB400]/60'
                      )}
                    >
                      <div className="p-2 rounded-md bg-card">{type.icon}</div>
                      <span className="text-sm font-medium">{type.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed rounded-xl p-4 bg-transparent transition hover:border-[#FFB400]/60"
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 w-full">
                  <label
                    htmlFor="file-input"
                    className="flex flex-col items-center justify-center gap-4 p-6 rounded-lg cursor-pointer text-center"
                  >
                    <UploadCloud className="h-12 w-12 text-muted-foreground" />
                    <Button variant="outline" asChild>
                      <span className="flex items-center gap-2">
                        Upload Product Image
                      </span>
                    </Button>
                    <input id="file-input" type="file" className="sr-only" />
                    <p className="text-sm text-muted-foreground mt-1">
                      or drag & drop image here (PNG, JPG, up to 50MB)
                    </p>
                  </label>
                </div>

                <div className="w-full md:w-64 flex-shrink-0">
                  <p className="text-sm font-medium text-center md:text-left mb-2">Preview</p>
                  <Card className="h-48 w-full bg-muted/10 flex items-center justify-center overflow-hidden">
                    {productPreviewUrl ? (
                      <img
                        src={productPreviewUrl}
                        alt="Product preview"
                        className="object-contain h-full w-full"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground p-4">
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
      default:
        return <div>Step {currentStep}</div>;
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Stepper Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div>
              <h1 className="text-2xl font-bold">Start New Shoot</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Create a professional shoot in minutes.
              </p>
            </div>

            <div className="space-y-2">
              {steps.map((s) => {
                const active = currentStep === s.id;
                const completed = currentStep > s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setCurrentStep(s.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-lg transition text-left',
                      active
                        ? 'bg-white/5 border border-[#FFB400] shadow'
                        : 'hover:bg-white/5'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                        active ? 'bg-[#FFB400] text-[#071029]' : 'bg-card'
                      )}
                    >
                      {completed ? (
                        <CheckCircle className="h-5 w-5 text-[#28A92B]" />
                      ) : (
                        s.icon
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{s.title}</div>
                      <div className="text-xs text-muted-foreground">
                        Step {s.id}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="bg-white/5 p-4 sm:p-6 rounded-xl min-w-0">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold">
                Step {currentStep} — {steps.find((s) => s.id === currentStep)?.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Follow the guided steps to configure your shoot.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="text-xs text-muted-foreground">Auto-save</div>
              <div className="w-3 h-3 rounded-full bg-[#28A92B]" aria-hidden />
            </div>
          </div>

          {renderStep()}

          {/* Stepper Actions */}
          <div className="mt-8 border-t border-white/10 pt-4 flex items-center justify-between">
            <Button
                variant="ghost"
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                disabled={currentStep === 1}
              >
                Back
              </Button>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground hidden sm:block">
                Step {currentStep} of {steps.length}
              </div>
              <Button onClick={() => setCurrentStep(s => Math.min(steps.length, s + 1))}>
                Continue <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

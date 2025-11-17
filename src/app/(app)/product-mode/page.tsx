"use client";

import { useState, useRef } from "react";
import {
  UploadCloud,
  ImageIcon,
  CheckCircle,
  Sparkles,
  Settings,
  ChevronRight,
  Loader2,
  Download,
  X,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProductModePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [productFiles, setProductFiles] = useState<File[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  const [shadowValue, setShadowValue] = useState(40);
  const [reflectionValue, setReflectionValue] = useState(20);

  const [aspectRatio, setAspectRatio] = useState("1:1");

  const ratios = ["1:1", "4:5", "16:9", "3:4", "9:16"];

  const handleUpload = (fileList: FileList) => {
    const files = Array.from(fileList);
    setProductFiles((prev) => [...prev, ...files]);

    if (!selectedImage) {
      const url = URL.createObjectURL(files[0]);
      setSelectedImage(url);
    }
  };

  const handleProcess = () => {
    if (!selectedImage) return;

    setIsProcessing(true);

    setTimeout(() => {
      setProcessedImage(selectedImage);
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white">
      {/* Page Header */}
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Product Mode</h1>
        <p className="text-muted-foreground mt-1">
          Create clean product images & lifestyle variations instantly.
        </p>
      </div>

      {/* -------------- Main Grid Layout -------------- */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[340px,1fr,360px] gap-6">
        {/* ---------------- LEFT PANEL (UPLOAD & FILES) ---------------- */}
        <aside className="space-y-6">
          {/* Upload */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Upload Product</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer transition hover:border-[#FFB400]"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="mx-auto h-12 w-12 opacity-60" />
                <p className="mt-3">Click to upload product images</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports PNG, JPG, WEBP
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files!)}
                />
              </div>

              {productFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {productFiles.map((f, i) => {
                    const url = URL.createObjectURL(f);
                    return (
                      <button
                        key={i}
                        className={cn(
                          "rounded-xl overflow-hidden border transition",
                          selectedImage === url
                            ? "border-[#FFB400] shadow-lg"
                            : "border-white/10 hover:border-white/30"
                        )}
                        onClick={() => setSelectedImage(url)}
                      >
                        <img
                          src={url}
                          alt={f.name}
                          className="h-24 w-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Aspect Ratio */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Aspect Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {ratios.map((r) => (
                  <button
                    key={r}
                    className={cn(
                      "px-3 py-1 rounded-lg border text-sm",
                      aspectRatio === r
                        ? "border-[#FFB400] bg-[#FFB4000A]"
                        : "border-white/10 hover:border-white/30"
                    )}
                    onClick={() => setAspectRatio(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* ---------------- MIDDLE CANVAS ---------------- */}
        <main className="flex flex-col gap-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Canvas</CardTitle>
                <span className="text-xs text-muted-foreground">{aspectRatio}</span>
              </div>
            </CardHeader>

            <CardContent className="h-[70vh] flex items-center justify-center overflow-hidden">
              {!selectedImage && (
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="mx-auto h-12 w-12 mb-3 opacity-60" />
                  <p>No product selected</p>
                </div>
              )}

              {selectedImage && !isProcessing && (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Product"
                    className="max-h-[65vh] max-w-full object-contain rounded-xl"
                  />

                  {processedImage && (
                    <div className="absolute inset-0 border-2 border-[#FFB400] rounded-xl"></div>
                  )}
                </div>
              )}

              {isProcessing && (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p>Removing background…</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        {/* ---------------- RIGHT PANEL (EDITING TOOLS) ---------------- */}
        <aside className="space-y-6">
          {/* Editing Controls */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Editing Tools</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <label className="text-sm">Shadow</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={shadowValue}
                  onChange={(e) => setShadowValue(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  {shadowValue}%
                </div>
              </div>

              <div>
                <label className="text-sm">Reflection</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={reflectionValue}
                  onChange={(e) => setReflectionValue(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  {reflectionValue}%
                </div>
              </div>

              <Button
                className="w-full mt-3"
                disabled={!selectedImage || isProcessing}
                onClick={handleProcess}
              >
                {isProcessing ? "Processing…" : "Remove Background"}
              </Button>
            </CardContent>
          </Card>

          {/* Generate / Download */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Output</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {processedImage ? (
                <Button
                  variant="default"
                  className="w-full flex items-center gap-2"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = processedImage;
                    a.download = "clean-product.png";
                    a.click();
                  }}
                >
                  <Download className="w-4 h-4" /> Download Clean Image
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Process an image to enable download.
                </p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

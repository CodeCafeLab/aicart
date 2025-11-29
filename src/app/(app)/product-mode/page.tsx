"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  UploadCloud,
  ImageIcon,
  Loader2,
  Download,
  X,
  AlertCircle,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { useFeatureEnabled, useSetting } from "@/hooks/use-settings";
import { useToast } from "@/hooks/use-toast";

type ProcessedImage = {
  id?: string;
  url: string;
  metadata?: {
    shadowValue: number;
    reflectionValue: number;
    aspectRatio: string;
  };
};

export default function ProductModePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  // Feature check
  const { enabled: productModeEnabled, loading: featureLoading } = useFeatureEnabled("product_mode");
  
  // Dynamic settings
  const { value: aspectRatios } = useSetting("product_mode.default_aspect_ratios", ["1:1", "4:5", "16:9", "3:4", "9:16"]);
  const { value: defaultShadow } = useSetting("product_mode.default_shadow", 40);
  const { value: defaultReflection } = useSetting("product_mode.default_reflection", 20);
  const { value: allowedFileTypes } = useSetting("product_mode.allowed_file_types", ["image/png", "image/jpeg", "image/jpg", "image/webp"]);
  const { value: maxFileSizeMB } = useSetting("product_mode.max_file_size_mb", 10);

  // State
  const [productFiles, setProductFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [shadowValue, setShadowValue] = useState(defaultShadow || 40);
  const [reflectionValue, setReflectionValue] = useState(defaultReflection || 20);
  const [aspectRatio, setAspectRatio] = useState<string>("1:1");

  // Update defaults when settings change
  useEffect(() => {
    if (defaultShadow !== undefined) setShadowValue(defaultShadow);
    if (defaultReflection !== undefined) setReflectionValue(defaultReflection);
    if (aspectRatios && Array.isArray(aspectRatios) && aspectRatios.length > 0) {
      setAspectRatio(aspectRatios[0]);
    }
  }, [defaultShadow, defaultReflection, aspectRatios]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (selectedImageUrl && selectedImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(selectedImageUrl);
      }
    };
  }, [selectedImageUrl]);

  // File validation
  const validateFile = (file: File): string | null => {
    // Check file type
    if (!allowedFileTypes || !Array.isArray(allowedFileTypes)) {
      return "File type validation not configured";
    }
    
    const isValidType = allowedFileTypes.some(type => {
      if (type.includes("/")) {
        return file.type === type;
      }
      // Support extensions like "png", "jpg"
      const ext = file.name.split(".").pop()?.toLowerCase();
      return type.toLowerCase().includes(ext || "");
    });

    if (!isValidType) {
      return `File type not allowed. Allowed types: ${allowedFileTypes.join(", ")}`;
    }

    // Check file size
    const maxSizeBytes = (maxFileSizeMB || 10) * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxFileSizeMB || 10}MB limit`;
    }

    return null;
  };

  const handleUpload = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setError(null);
    const files = Array.from(fileList);
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setError(errors.join("\n"));
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: errors[0],
      });
    }

    if (validFiles.length > 0) {
      setProductFiles((prev) => [...prev, ...validFiles]);
      
      // Select first valid file if none selected
      if (!selectedFile && validFiles.length > 0) {
        const file = validFiles[0];
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setSelectedImageUrl(url);
      }

      toast({
        title: "Files Uploaded",
        description: `${validFiles.length} file(s) uploaded successfully`,
      });
    }
  };

  const handleFileSelect = (file: File, index: number) => {
    // Revoke previous URL
    if (selectedImageUrl && selectedImageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(selectedImageUrl);
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setSelectedImageUrl(url);
    setProcessedImage(null); // Reset processed image when selecting new file
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleProcess = async () => {
    if (!selectedFile || !selectedImageUrl) {
      toast({
        variant: "destructive",
        title: "No Image Selected",
        description: "Please select an image to process",
      });
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProcessedImage(null);

    try {
      // Convert file to base64
      const imageData = await fileToBase64(selectedFile);

      // Call API
      const response = await apiFetch("/api/product/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData,
          shadowValue,
          reflectionValue,
          aspectRatio,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Processing failed" }));
        throw new Error(errorData.message || errorData.error || "Failed to process image");
      }

      const data = await response.json();
      
      setProcessedImage({
        url: data.processedImage,
        metadata: data.metadata,
      });

      toast({
        title: "Processing Complete",
        description: "Image processed successfully",
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to process image";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Processing Error",
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const a = document.createElement("a");
    a.href = processedImage.url;
    a.download = `product-${aspectRatio.replace(":", "x")}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: "Download Started",
      description: "Image download started",
    });
  };

  const handleRemoveFile = (index: number) => {
    const file = productFiles[index];
    setProductFiles((prev) => prev.filter((_, i) => i !== index));
    
    // If removing selected file, select another or clear
    if (selectedFile === file) {
      const remainingFiles = productFiles.filter((_, i) => i !== index);
      if (remainingFiles.length > 0) {
        handleFileSelect(remainingFiles[0], 0);
      } else {
        setSelectedFile(null);
        if (selectedImageUrl && selectedImageUrl.startsWith("blob:")) {
          URL.revokeObjectURL(selectedImageUrl);
        }
        setSelectedImageUrl(null);
        setProcessedImage(null);
      }
    }
  };

  // Calculate aspect ratio dimensions for canvas
  const aspectRatioDimensions = useMemo(() => {
    const [width, height] = aspectRatio.split(":").map(Number);
    const ratio = width / height;
    return { width, height, ratio };
  }, [aspectRatio]);

  // Show feature disabled message
  if (!featureLoading && !productModeEnabled) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Feature Disabled</CardTitle>
            <CardDescription>
              Product Mode is currently disabled. Please contact an administrator.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white">
      {/* Page Header */}
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Product Mode</h1>
        <p className="text-muted-foreground mt-1">
          Create clean product images & lifestyle variations instantly.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Grid Layout */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[340px,1fr,360px] gap-6">
        {/* LEFT PANEL (UPLOAD & FILES) */}
        <aside className="space-y-6">
          {/* Upload */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Upload Product</CardTitle>
              <CardDescription>
                Max size: {maxFileSizeMB || 10}MB
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer transition hover:border-[#FFB400]"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="mx-auto h-12 w-12 opacity-60" />
                <p className="mt-3">Click to upload product images</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {allowedFileTypes && Array.isArray(allowedFileTypes)
                    ? `Supports: ${allowedFileTypes.map(t => t.split("/")[1]?.toUpperCase() || t).join(", ")}`
                    : "Supports PNG, JPG, WEBP"}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={allowedFileTypes && Array.isArray(allowedFileTypes) ? allowedFileTypes.join(",") : "image/*"}
                  multiple
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files)}
                />
              </div>

              {productFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {productFiles.map((f, i) => {
                    const url = URL.createObjectURL(f);
                    const isSelected = selectedFile === f;
                    return (
                      <div key={i} className="relative group">
                        <button
                          className={cn(
                            "rounded-xl overflow-hidden border transition w-full",
                            isSelected
                              ? "border-[#FFB400] shadow-lg"
                              : "border-white/10 hover:border-white/30"
                          )}
                          onClick={() => handleFileSelect(f, i)}
                        >
                          <img
                            src={url}
                            alt={f.name}
                            className="h-24 w-full object-cover"
                          />
                        </button>
                        <button
                          className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(i);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
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
                {aspectRatios && Array.isArray(aspectRatios) && aspectRatios.length > 0 ? (
                  aspectRatios.map((r) => (
                    <button
                      key={r}
                      className={cn(
                        "px-3 py-1 rounded-lg border text-sm transition",
                        aspectRatio === r
                          ? "border-[#FFB400] bg-[#FFB4000A]"
                          : "border-white/10 hover:border-white/30"
                      )}
                      onClick={() => setAspectRatio(r)}
                    >
                      {r}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No aspect ratios configured</p>
                )}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* MIDDLE CANVAS */}
        <main className="flex flex-col gap-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Canvas</CardTitle>
                <span className="text-xs text-muted-foreground">{aspectRatio}</span>
              </div>
            </CardHeader>

            <CardContent className="h-[70vh] flex items-center justify-center overflow-hidden">
              {!selectedImageUrl && (
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="mx-auto h-12 w-12 mb-3 opacity-60" />
                  <p>No product selected</p>
                </div>
              )}

              {selectedImageUrl && !isProcessing && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div
                    className="relative"
                    style={{
                      aspectRatio: `${aspectRatioDimensions.width}/${aspectRatioDimensions.height}`,
                      maxWidth: "100%",
                      maxHeight: "100%",
                    }}
                  >
                    <img
                      src={processedImage?.url || selectedImageUrl}
                      alt="Product"
                      className="max-h-[65vh] max-w-full object-contain rounded-xl"
                      style={{
                        filter: processedImage
                          ? `drop-shadow(0 ${shadowValue / 10}px ${shadowValue / 5}px rgba(0,0,0,${shadowValue / 100}))`
                          : undefined,
                      }}
                    />
                    {processedImage && (
                      <div className="absolute inset-0 border-2 border-[#FFB400] rounded-xl pointer-events-none"></div>
                    )}
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p>Processing image…</p>
                  <p className="text-xs text-muted-foreground">Removing background and applying effects</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        {/* RIGHT PANEL (EDITING TOOLS) */}
        <aside className="space-y-6">
          {/* Editing Controls */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Editing Tools</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Shadow</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={shadowValue}
                  onChange={(e) => setShadowValue(Number(e.target.value))}
                  className="w-full mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {shadowValue}%
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Reflection</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={reflectionValue}
                  onChange={(e) => setReflectionValue(Number(e.target.value))}
                  className="w-full mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {reflectionValue}%
                </div>
              </div>

              <Button
                className="w-full mt-3"
                disabled={!selectedFile || isProcessing}
                onClick={handleProcess}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing…
                  </>
                ) : (
                  "Remove Background & Process"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Output</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {processedImage ? (
                <>
                  <Button
                    variant="default"
                    className="w-full flex items-center gap-2"
                    onClick={handleDownload}
                  >
                    <Download className="w-4 h-4" />
                    Download Clean Image
                  </Button>
                  {processedImage.metadata && (
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Shadow: {processedImage.metadata.shadowValue}%</p>
                      <p>Reflection: {processedImage.metadata.reflectionValue}%</p>
                      <p>Aspect Ratio: {processedImage.metadata.aspectRatio}</p>
                    </div>
                  )}
                </>
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

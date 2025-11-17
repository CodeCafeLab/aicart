"use client";

import { useState, useRef } from "react";
import {
  UploadCloud,
  Check,
  X,
  Settings,
  Palette,
  Type,
  Wand2,
  Loader2,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BrandSettingsPage() {
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const faviconInputRef = useRef<HTMLInputElement | null>(null);

  const [logo, setLogo] = useState<string | null>(null);
  const [favicon, setFavicon] = useState<string | null>(null);

  const [primaryColor, setPrimaryColor] = useState("#FFB400");
  const [secondaryColor, setSecondaryColor] = useState("#FFFFFF");
  const [accentColor, setAccentColor] = useState("#0E152E");

  const [fontFamily, setFontFamily] = useState("Inter");
  const [tone, setTone] = useState("Professional");

  const [autoApply, setAutoApply] = useState(true);

  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const saveBrand = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setPreviewOpen(true);
    }, 1500);
  };

  const handleUpload = (file: File, setter: (url: string) => void) => {
    const url = URL.createObjectURL(file);
    setter(url);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white">
      {/* HEADER */}
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Brand Settings
      </h1>
      <p className="text-muted-foreground mt-1">
        Manage your brand identity across shoots, campaigns & AI generations.
      </p>

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-[500px,1fr] gap-6">

        {/* LEFT: FORM SECTIONS */}
        <div className="space-y-6">
          {/* Brand Logos */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Logo & Brand Icons</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div>
                <p className="font-medium mb-2">Brand Logo</p>

                <div
                  className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-[#FFB400] transition"
                  onClick={() => logoInputRef.current?.click()}
                >
                  {!logo ? (
                    <>
                      <UploadCloud className="mx-auto h-12 w-12 opacity-60" />
                      <p className="mt-2">Upload logo</p>
                    </>
                  ) : (
                    <img
                      src={logo}
                      className="mx-auto h-20 object-contain"
                    />
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    ref={logoInputRef}
                    className="hidden"
                    onChange={(e) =>
                      e.target.files &&
                      handleUpload(e.target.files[0], (url) => setLogo(url))
                    }
                  />
                </div>
              </div>

              {/* Favicon Upload */}
              <div>
                <p className="font-medium mb-2">Favicon</p>

                <div
                  className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-[#FFB400] transition"
                  onClick={() => faviconInputRef.current?.click()}
                >
                  {!favicon ? (
                    <>
                      <UploadCloud className="mx-auto h-12 w-12 opacity-60" />
                      <p className="mt-2">Upload favicon</p>
                    </>
                  ) : (
                    <img
                      src={favicon}
                      className="mx-auto h-14 object-contain"
                    />
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    ref={faviconInputRef}
                    className="hidden"
                    onChange={(e) =>
                      e.target.files &&
                      handleUpload(e.target.files[0], (url) =>
                        setFavicon(url)
                      )
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Brand Colors */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-sm mb-2">Primary</p>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-12 w-full rounded cursor-pointer"
                />
              </div>

              <div>
                <p className="text-sm mb-2">Secondary</p>
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="h-12 w-full rounded cursor-pointer"
                />
              </div>

              <div>
                <p className="text-sm mb-2">Accent</p>
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-12 w-full rounded cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Typography</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <label className="text-sm">Font Family</label>
              <select
                className="w-full p-3 rounded-xl bg-black/20 border border-white/10"
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
              >
                <option>Inter</option>
                <option>Poppins</option>
                <option>Montserrat</option>
                <option>Roboto</option>
                <option>Lato</option>
              </select>
            </CardContent>
          </Card>

          {/* Brand Tone */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Brand Voice</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <label className="text-sm">Tone</label>
              <select
                className="w-full p-3 rounded-xl bg-black/20 border border-white/10"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option>Professional</option>
                <option>Friendly</option>
                <option>Minimal & Clean</option>
                <option>Premium & Luxury</option>
                <option>Bold & Energetic</option>
              </select>

              {/* Toggle */}
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm">Auto-Apply Brand Style</span>

                <button
                  onClick={() => setAutoApply(!autoApply)}
                  className={cn(
                    "px-4 py-1 rounded-full border text-sm",
                    autoApply
                      ? "border-[#FFB400] bg-[#FFB4000A]"
                      : "border-white/10"
                  )}
                >
                  {autoApply ? "On" : "Off"}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Save */}
          <div className="flex gap-3">
            <Button
              className="flex-1 flex items-center gap-2"
              onClick={saveBrand}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Save Brand Settings
            </Button>

            <Button variant="outline" className="flex-1">
              Reset to Default
            </Button>
          </div>
        </div>

        {/* RIGHT — BRAND PREVIEW PANEL */}
        <div>
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Live Brand Preview</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="p-6 bg-black/20 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 rounded-xl border"
                    style={{ borderColor: primaryColor }}
                  ></div>

                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: primaryColor }}>
                      StudioForge Brand
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Preview of brand styling
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <div
                    className="h-8 w-8 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  <div
                    className="h-8 w-8 rounded-full"
                    style={{ backgroundColor: secondaryColor }}
                  ></div>
                  <div
                    className="h-8 w-8 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                </div>

                <p className="mt-6 text-sm" style={{ fontFamily }}>
                  This is a sample text using your selected font and tone settings.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ------------------- PREVIEW DRAWER ---------------------- */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-xl bg-[#0E152E] h-full border-l border-white/10 p-6 overflow-auto">

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Brand Saved!</h2>
              <button className="p-2 rounded hover:bg-white/10" onClick={() => setPreviewOpen(false)}>
                <X />
              </button>
            </div>

            <p className="text-muted-foreground">
              Your brand preferences have been successfully saved.
              They will be automatically applied across all shoots.
            </p>

            <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-xl">
              <p className="font-bold mb-3">Brand Colors:</p>

              <div className="flex gap-3">
                <div
                  className="h-10 w-10 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />
                <div
                  className="h-10 w-10 rounded-full"
                  style={{ backgroundColor: secondaryColor }}
                />
                <div
                  className="h-10 w-10 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
              </div>

              <p className="font-bold mt-6 mb-3">Font Family:</p>
              <p style={{ fontFamily }}>{fontFamily}</p>

              <p className="font-bold mt-6 mb-3">Tone:</p>
              <p>{tone}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

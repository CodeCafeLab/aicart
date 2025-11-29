"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Wand2, Filter, Sparkles, Trash2, Search, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { useFeatureEnabled, useSetting } from "@/hooks/use-settings";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type AvatarCategory = {
  id: string;
  name: string;
  category_group: string;
};

type AvatarItem = {
  id: string;
  name: string;
  gender?: string;
  style?: string;
  color?: string;
  image_url?: string;
  categories?: AvatarCategory[];
};

export default function AvatarsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { enabled: avatarsEnabled, loading: featuresLoading } = useFeatureEnabled("avatars");
  const { value: defaultGenderOptions } = useSetting("avatars.default_gender_options", ["Female", "Male", "Neutral"]);
  const { value: defaultStyleOptions } = useSetting("avatars.default_style_options", ["Casual", "Formal", "Urban", "Sporty"]);
  const { value: defaultColorOptions } = useSetting("avatars.default_color_options", []);
  const { value: defaultAccentColor } = useSetting("avatars.default_accent_color", "#FFB400");
  
  const [avatars, setAvatars] = useState<AvatarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({ gender: "All", style: "All" });
  const [genderOptions, setGenderOptions] = useState<string[]>(defaultGenderOptions || []);
  const [styleOptions, setStyleOptions] = useState<string[]>(defaultStyleOptions || []);
  const [filterGenderOptions, setFilterGenderOptions] = useState<string[]>([
    "All",
    ...(defaultGenderOptions || []),
  ]);
  const [filterStyleOptions, setFilterStyleOptions] = useState<string[]>([
    "All",
    ...(defaultStyleOptions || []),
  ]);

  // Update options when settings change
  useEffect(() => {
    if (defaultGenderOptions && Array.isArray(defaultGenderOptions)) {
      setGenderOptions(defaultGenderOptions);
      setFilterGenderOptions(["All", ...defaultGenderOptions]);
    }
  }, [defaultGenderOptions]);

  useEffect(() => {
    if (defaultStyleOptions && Array.isArray(defaultStyleOptions)) {
      setStyleOptions(defaultStyleOptions);
      setFilterStyleOptions(["All", ...defaultStyleOptions]);
    }
  }, [defaultStyleOptions]);

  // Fetch avatars
  const fetchAvatars = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch("/api/avatars");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to fetch avatars" }));
        throw new Error(errorData.message || errorData.error || "Failed to fetch avatars");
      }
      const data = await response.json();
      const items: AvatarItem[] = (data?.items || []).map((a: any) => ({
        id: a.id,
        name: a.name,
        gender: a.gender,
        style: a.style,
        color: a.color,
        image_url: a.image_url,
        categories: a.categories || [],
      }));
      setAvatars(items);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to load avatars";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvatars();
  }, []);

  // Fetch categories
  useEffect(() => {
    let isMounted = true;
    apiFetch("/api/avatars/categories?scope=avatar")
      .then(async (r) => {
        if (!r.ok) return;
        const data = await r.json();
        if (!isMounted) return;
        const items: AvatarCategory[] = data?.items || [];
        const genders = Array.from(
          new Set(
            items
              .filter((item) => item.category_group === "gender" && item.name)
              .map((item) => item.name)
          )
        );
        const styles = Array.from(
          new Set(
            items
              .filter((item) => item.category_group === "style" && item.name)
              .map((item) => item.name)
          )
        );
        if (genders.length) {
          setGenderOptions(genders);
          setFilterGenderOptions(["All", ...genders]);
          setFilters((prev) => ({
            ...prev,
            gender: prev.gender === "All" || genders.includes(prev.gender) ? prev.gender : "All",
          }));
        }
        if (styles.length) {
          setStyleOptions(styles);
          setFilterStyleOptions(["All", ...styles]);
          setFilters((prev) => ({
            ...prev,
            style: prev.style === "All" || styles.includes(prev.style) ? prev.style : "All",
          }));
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredAvatars = useMemo(() => {
    let filtered = avatars.filter((a) => {
      const genderMatch =
        filters.gender === "All" || a.gender === filters.gender;
      const styleMatch = filters.style === "All" || a.style === filters.style;
      const searchMatch =
        !searchQuery ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.gender?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.style?.toLowerCase().includes(searchQuery.toLowerCase());
      return genderMatch && styleMatch && searchMatch;
    });
    return filtered;
  }, [avatars, filters, searchQuery]);

  const createGenderOptions =
    genderOptions.length > 0 ? genderOptions : (defaultGenderOptions || []);
  const createStyleOptions =
    styleOptions.length > 0 ? styleOptions : (defaultStyleOptions || []);

  // Get accent color for avatar
  const getAccentColor = (avatar: AvatarItem): string => {
    if (avatar.color) return avatar.color;
    if (defaultColorOptions && Array.isArray(defaultColorOptions) && defaultColorOptions.length > 0) {
      // Use color from settings based on style
      const styleIndex = styleOptions.indexOf(avatar.style || "");
      if (styleIndex >= 0 && styleIndex < defaultColorOptions.length) {
        return defaultColorOptions[styleIndex];
      }
    }
    // Fallback to style-based colors
    if (avatar.style === "Sporty") return "#22c55e";
    if (avatar.style === "Formal") return "#3b82f6";
    if (avatar.style === "Urban") return "#f59e0b";
    return defaultAccentColor || "#a855f7";
  };

  const handleDelete = async (avatarId: string) => {
    if (!confirm("Are you sure you want to delete this avatar?")) return;

    try {
      const response = await apiFetch(`/api/avatars/${avatarId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to delete avatar" }));
        throw new Error(errorData.message || errorData.error || "Failed to delete avatar");
      }

      setAvatars((prev) => prev.filter((x) => x.id !== avatarId));
      setSelectedAvatar(null);
      toast({
        title: "Success",
        description: "Avatar deleted successfully",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to delete avatar",
      });
    }
  };

  // Check if feature is enabled
  if (!featuresLoading && !avatarsEnabled) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Feature Disabled</CardTitle>
            <CardDescription>
              The Avatars feature is currently disabled. Please contact an administrator.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            AI Models / Avatars
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage AI-generated models & create new avatars.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAvatars}
            disabled={loading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4" /> Create Avatar
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* SEARCH AND FILTERS */}
      <Card className="mb-6 bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" /> Search & Filters
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search avatars by name, gender, or style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/20 border-white/10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Gender */}
            <div>
              <label className="text-sm font-medium">Gender</label>
              <select
                className="w-full mt-1 p-2 rounded bg-black/20 border border-white/10"
                value={filters.gender}
                onChange={(e) =>
                  setFilters({ ...filters, gender: e.target.value })
                }
              >
                {filterGenderOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Style */}
            <div>
              <label className="text-sm font-medium">Style</label>
              <select
                className="w-full mt-1 p-2 rounded bg-black/20 border border-white/10"
                value={filters.style}
                onChange={(e) =>
                  setFilters({ ...filters, style: e.target.value })
                }
              >
                {filterStyleOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AVATAR GRID */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading avatars...</p>
          </div>
        </div>
      ) : filteredAvatars.length === 0 ? (
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardContent className="py-20 text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No avatars found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filters.gender !== "All" || filters.style !== "All"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first avatar"}
            </p>
            {(!searchQuery && filters.gender === "All" && filters.style === "All") && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" /> Create Avatar
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAvatars.map((avatar) => {
            const accent = getAccentColor(avatar);
            return (
              <button
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar)}
                className="rounded-xl bg-white/5 overflow-hidden transition shadow-lg hover:scale-105"
                style={{ border: `2px solid ${accent}40` }}
              >
                {avatar.image_url && (
                  <img
                    src={avatar.image_url}
                    alt={avatar.name}
                    className="h-48 w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                {!avatar.image_url && (
                  <div
                    className="h-48 w-full flex items-center justify-center"
                    style={{ background: `${accent}20` }}
                  >
                    <Sparkles className="h-8 w-8" style={{ color: accent }} />
                  </div>
                )}
                <div className="p-3 text-left">
                  <div className="font-semibold" style={{ color: accent }}>
                    {avatar.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(avatar.gender || "").toString()}{" "}
                    {avatar.gender && avatar.style ? "•" : ""}{" "}
                    {(avatar.style || "").toString()}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Create Avatar Card */}
          <button
            className="rounded-xl border-dashed border-2 border-white/20 bg-white/5 hover:border-[#FFB400] transition flex flex-col items-center justify-center p-6 min-h-[200px]"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-10 w-10 mb-3" />
            <div className="font-semibold">Create New Avatar</div>
            <div className="text-xs text-muted-foreground mt-1">
              Start from scratch
            </div>
          </button>
        </div>
      )}

      {/* AVATAR DETAIL DRAWER */}
      {selectedAvatar && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-md bg-[#0E152E] border-l border-white/10 h-full p-6 overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{selectedAvatar.name}</h2>
              <button
                onClick={() => setSelectedAvatar(null)}
                className="p-2 rounded hover:bg-white/10"
              >
                <X />
              </button>
            </div>

            {/* Avatar Image */}
            <div className="mt-4 rounded-xl overflow-hidden">
              {selectedAvatar.image_url && (
                <img
                  src={selectedAvatar.image_url}
                  alt="avatar"
                  className="w-full h-60 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              {!selectedAvatar.image_url && (
                <div
                  className="w-full h-60 flex items-center justify-center"
                  style={{ background: `${getAccentColor(selectedAvatar)}20` }}
                >
                  <Sparkles className="h-16 w-16" style={{ color: getAccentColor(selectedAvatar) }} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="mt-6 space-y-2 text-sm">
              <div>
                <strong>Gender:</strong> {selectedAvatar.gender || "Not specified"}
              </div>
              <div>
                <strong>Style:</strong> {selectedAvatar.style || "Not specified"}
              </div>
              <div>
                <strong>Accent Color:</strong>{" "}
                <span
                  className="inline-block w-4 h-4 rounded border border-white/20 ml-2 align-middle"
                  style={{ backgroundColor: selectedAvatar.color || getAccentColor(selectedAvatar) }}
                />
                {selectedAvatar.color || getAccentColor(selectedAvatar)}
              </div>
              {selectedAvatar.categories && selectedAvatar.categories.length > 0 && (
                <div>
                  <strong>Categories:</strong>{" "}
                  {selectedAvatar.categories.map((c) => c.name).join(", ")}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-2">
              <Button
                className="w-full flex items-center justify-center gap-2"
                onClick={() => {
                  if (selectedAvatar?.image_url) {
                    try {
                      localStorage.setItem(
                        "selectedAvatarImageUrl",
                        selectedAvatar.image_url
                      );
                      toast({
                        title: "Avatar Selected",
                        description: "Redirecting to shoot studio...",
                      });
                    } catch {}
                  }
                  router.push("/shoot/new");
                }}
              >
                <Sparkles className="h-4 w-4" /> Use in Shoot
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={() => {
                    setShowCreateModal(true);
                    setSelectedAvatar(null);
                  }}
                >
                  <Wand2 className="h-4 w-4" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={() => handleDelete(selectedAvatar.id)}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE AVATAR MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0E152E] border border-white/10 rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Create New Avatar</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded hover:bg-white/10"
              >
                <X />
              </button>
            </div>

            <Tabs defaultValue="upload">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="ai">Generate with AI</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-4 space-y-4">
                <CreateForm
                  mode="upload"
                  genderOptions={createGenderOptions}
                  styleOptions={createStyleOptions}
                  defaultAccentColor={defaultAccentColor}
                  onDone={(item) => {
                    setAvatars((prev) => [item, ...prev]);
                    setShowCreateModal(false);
                    toast({
                      title: "Success",
                      description: "Avatar created successfully",
                    });
                  }}
                />
              </TabsContent>

              <TabsContent value="ai" className="mt-4 space-y-4">
                <CreateForm
                  mode="ai"
                  genderOptions={createGenderOptions}
                  styleOptions={createStyleOptions}
                  defaultAccentColor={defaultAccentColor}
                  onDone={(item) => {
                    setAvatars((prev) => [item, ...prev]);
                    setShowCreateModal(false);
                    toast({
                      title: "Success",
                      description: "Avatar generated successfully",
                    });
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}

function CreateForm({
  mode,
  onDone,
  genderOptions,
  styleOptions,
  defaultAccentColor,
}: {
  mode: "upload" | "ai";
  onDone: (item: AvatarItem) => void;
  genderOptions: string[];
  styleOptions: string[];
  defaultAccentColor?: string;
}) {
  const { enabled: aiEnabled, loading: aiLoading } = useFeatureEnabled("avatars.ai_generation");
  const { value: defaultGenderOptions } = useSetting("avatars.default_gender_options", ["Female", "Male", "Neutral"]);
  const { value: defaultStyleOptions } = useSetting("avatars.default_style_options", ["Casual", "Formal", "Urban", "Sporty"]);
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [gender, setGender] = useState(
    genderOptions[0] || (defaultGenderOptions?.[0] || "")
  );
  const [style, setStyle] = useState(
    styleOptions[0] || (defaultStyleOptions?.[0] || "")
  );
  const [color, setColor] = useState(defaultAccentColor || "#FFB400");
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const preferred = genderOptions[0] || (defaultGenderOptions?.[0] || "");
    if (!preferred) return;
    if (genderOptions.includes(gender)) return;
    setGender(preferred);
  }, [genderOptions, gender, defaultGenderOptions]);

  useEffect(() => {
    const preferred = styleOptions[0] || (defaultStyleOptions?.[0] || "");
    if (!preferred) return;
    if (styleOptions.includes(style)) return;
    setStyle(preferred);
  }, [styleOptions, style, defaultStyleOptions]);

  async function handleSubmit() {
    setError(null);
    
    // Validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (mode === "upload" && !file) {
      setError("Please upload an image");
      return;
    }

    if (mode === "ai" && !prompt.trim()) {
      setError("Please enter a prompt for AI generation");
      return;
    }

    // Check if AI generation is enabled for AI mode
    if (mode === "ai" && !aiEnabled && !aiLoading) {
      setError("AI generation is currently disabled");
      toast({
        variant: "destructive",
        title: "Feature Disabled",
        description: "AI avatar generation is currently disabled. Please contact an administrator.",
      });
      return;
    }
    
    setSaving(true);
    try {
      if (mode === "upload") {
        let imageData: string | undefined;
        if (file) {
          imageData = await readFile(file);
        }
        const r = await apiFetch("/api/avatars", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            gender,
            style,
            color,
            source_type: "upload",
            imageData,
          }),
        });
        if (!r.ok) {
          const error = await r.json().catch(() => ({ error: "Failed to create avatar" }));
          throw new Error(error.message || error.error || "Failed to create avatar");
        }
        const data = await r.json();
        onDone({
          id: data.item.id,
          name: data.item.name,
          gender: data.item.gender,
          style: data.item.style,
          color: data.item.color,
          image_url: data.item.image_url,
          categories: data.item.categories || [],
        });
      } else {
        const r = await apiFetch("/api/avatars/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            prompt: prompt.trim(),
            gender,
            style,
            color,
          }),
        });
        if (!r.ok) {
          const error = await r.json().catch(() => ({ error: "Failed to generate avatar" }));
          throw new Error(error.message || error.error || "Failed to generate avatar");
        }
        const data = await r.json();
        onDone({
          id: data.item.id,
          name: data.item.name,
          gender: data.item.gender,
          style: data.item.style,
          color: data.item.color,
          image_url: data.item.image_url,
          categories: data.item.categories || [],
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to create avatar";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {mode === "ai" && !aiEnabled && !aiLoading && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            AI generation is currently disabled. Please use the Upload tab instead.
          </AlertDescription>
        </Alert>
      )}

      <div>
        <label className="text-sm font-medium">Name *</label>
        <input
          className="w-full mt-1 p-2 rounded bg-black/20 border border-white/10"
          placeholder="e.g. Zara Malik"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Gender</label>
          <select
            className="w-full mt-1 p-2 rounded bg-black/20 border border-white/10"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            {genderOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Style</label>
          <select
            className="w-full mt-1 p-2 rounded bg-black/20 border border-white/10"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            {styleOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 items-center">
        <div>
          <label className="text-sm font-medium">Accent Color</label>
          <input
            type="color"
            className="mt-1 h-10 w-16 p-1 rounded bg-black/20 border border-white/10"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Cards use this color
        </div>
      </div>
      {mode === "upload" ? (
        <div>
          <label className="text-sm font-medium">Upload Image *</label>
          <input
            type="file"
            accept="image/*"
            className="w-full mt-1 p-2 rounded bg-black/20 border border-white/10"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
          {file && (
            <p className="text-xs text-muted-foreground mt-1">
              Selected: {file.name}
            </p>
          )}
        </div>
      ) : (
        <div>
          <label className="text-sm font-medium">Prompt *</label>
          <textarea
            className="w-full mt-1 p-2 rounded bg-black/20 border border-white/10"
            rows={3}
            placeholder="Describe the avatar you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </div>
      )}
      <Button className="w-full" disabled={saving || (mode === "ai" && (!aiEnabled || aiLoading))} onClick={handleSubmit}>
        {saving ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Processing...
          </>
        ) : mode === "upload" ? (
          <>
            <Plus className="h-4 w-4 mr-2" /> Create Avatar
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" /> Generate Avatar
          </>
        )}
      </Button>
    </div>
  );
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


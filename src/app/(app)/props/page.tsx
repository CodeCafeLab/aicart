"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Filter,
  Search,
  X,
  Plus,
  Sofa,
  TreePine,
  Lamp,
  Cpu,
  Sparkles,
  Loader2,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type BackgroundRecord = {
  id: string;
  name: string;
  category: string;
  image_url?: string | null;
};

type PropRecord = {
  id: string;
  name: string;
  category?: string | null;
  type?: string | null;
};

const FALLBACK_BG =
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900&q=80&auto=format&fit=crop";

export default function PropsPage() {
  const [selectedBg, setSelectedBg] = useState<BackgroundRecord | null>(null);
  const [selectedProp, setSelectedProp] = useState<PropRecord | null>(null);
  const [category, setCategory] = useState("All");
  const [propFilter, setPropFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const [bgCategories, setBgCategories] = useState<string[]>(["All"]);
  const [propCategories, setPropCategories] = useState<string[]>(["All"]);
  const [backgrounds, setBackgrounds] = useState<BackgroundRecord[]>([]);
  const [props, setProps] = useState<PropRecord[]>([]);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingBackgrounds, setLoadingBackgrounds] = useState(true);
  const [loadingProps, setLoadingProps] = useState(true);
  const [bgError, setBgError] = useState<string | null>(null);
  const [propError, setPropError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handle);
  }, [search]);

  const parseCategoryNames = useCallback((items: any[]) => {
    return Array.from(
      new Set(
        (items || [])
          .map((item: any) => item?.name)
          .filter((name: string | null | undefined) => Boolean(name))
      )
    );
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const [bgRes, propRes] = await Promise.all([
        apiFetch("/api/library/categories?type=backgrounds"),
        apiFetch("/api/library/categories?type=props"),
      ]);

      if (!bgRes.ok || !propRes.ok) {
        throw new Error("Failed to load categories");
      }

      const [bgData, propData] = await Promise.all([bgRes.json(), propRes.json()]);
      const bgNames = parseCategoryNames(bgData.items || []);
      const propNames = parseCategoryNames(propData.items || []);

      setBgCategories(["All", ...bgNames]);
      setPropCategories(["All", ...propNames]);
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to load categories",
        description: "Please refresh to try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingCategories(false);
    }
  }, [parseCategoryNames, toast]);

  // Reset selections if current category is no longer available
  useEffect(() => {
    if (bgCategories.length > 0 && category !== "All" && !bgCategories.includes(category)) {
      setCategory("All");
    }
  }, [bgCategories, category]);

  useEffect(() => {
    if (propCategories.length > 0 && propFilter !== "All" && !propCategories.includes(propFilter)) {
      setPropFilter("All");
    }
  }, [propCategories, propFilter]);

  const fetchBackgrounds = useCallback(
    async (categoryValue: string, searchValue: string) => {
      setLoadingBackgrounds(true);
      setBgError(null);
      const params = new URLSearchParams();
      if (categoryValue && categoryValue !== "All") {
        params.set("category", categoryValue);
      }
      if (searchValue) {
        params.set("search", searchValue);
      }
      const query = params.toString();
      const endpoint = query ? `/api/library/backgrounds?${query}` : "/api/library/backgrounds";

      try {
        const res = await apiFetch(endpoint);
        if (!res.ok) {
          throw new Error("Failed to fetch backgrounds");
        }
        const data = await res.json();
        setBackgrounds(data.items || []);
      } catch (error) {
        console.error(error);
        setBgError("Unable to load backgrounds. Please try again.");
        setBackgrounds([]);
      } finally {
        setLoadingBackgrounds(false);
      }
    },
    []
  );

  const fetchProps = useCallback(
    async (categoryValue: string, searchValue: string) => {
      setLoadingProps(true);
      setPropError(null);
      const params = new URLSearchParams();
      if (categoryValue && categoryValue !== "All") {
        params.set("category", categoryValue);
      }
      if (searchValue) {
        params.set("search", searchValue);
      }
      const query = params.toString();
      const endpoint = query ? `/api/library/props?${query}` : "/api/library/props";

      try {
        const res = await apiFetch(endpoint);
        if (!res.ok) {
          throw new Error("Failed to fetch props");
        }
        const data = await res.json();
        setProps(data.items || []);
      } catch (error) {
        console.error(error);
        setPropError("Unable to load props. Please try again.");
        setProps([]);
      } finally {
        setLoadingProps(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchBackgrounds(category, debouncedSearch);
  }, [fetchBackgrounds, category, debouncedSearch]);

  useEffect(() => {
    fetchProps(propFilter, debouncedSearch);
  }, [fetchProps, propFilter, debouncedSearch]);

  function applyItem() {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      toast({
        title: "Added to scene",
        description: "The item was applied successfully.",
      });
    }, 800);
  }

  const displayBackgrounds = useMemo(() => backgrounds, [backgrounds]);
  const displayProps = useMemo(() => props, [props]);

  const getPropTypeLabel = (item: PropRecord) => item.type || item.category || "Prop";

  const renderPropIcon = (type?: string | null) => {
    const normalized = (type || "").toLowerCase();
    if (normalized.includes("furniture")) return <Sofa className="h-6 w-6" />;
    if (normalized.includes("plant") || normalized.includes("green")) return <TreePine className="h-6 w-6" />;
    if (normalized.includes("light")) return <Lamp className="h-6 w-6" />;
    if (normalized.includes("tech") || normalized.includes("digit")) return <Cpu className="h-6 w-6" />;
    return <Sparkles className="h-6 w-6" />;
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white">
      {/* HEADER */}
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Backgrounds & Props</h1>
        <p className="text-muted-foreground mt-1">Add backgrounds & props to enhance your AI scenes.</p>
      </div>

      {/* SEARCH & FILTERS */}
      <Card className="mt-6 bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" /> Filters & Search
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-60" />
            <Input
              type="text"
              placeholder="Search backgrounds or props..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 bg-black/20 border-white/10 text-white placeholder:text-white/50"
            />
          </div>

          {/* Background Category Filter */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Background Categories</h3>
            <div className="flex flex-wrap gap-2">
              {(loadingCategories ? Array.from({ length: 5 }) : bgCategories).map((cat, idx) =>
                loadingCategories ? (
                  <Skeleton key={idx} className="h-9 w-20 rounded-full bg-white/10" />
                ) : (
                  <button
                    key={cat}
                    className={cn(
                      "px-4 py-1.5 rounded-full border text-sm transition",
                      category === cat ? "border-[#FFB400] bg-[#FFB4000A]" : "border-white/10 hover:border-white/20"
                    )}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Props Filter */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Prop Types</h3>
            <div className="flex flex-wrap gap-2">
              {(loadingCategories ? Array.from({ length: 5 }) : propCategories).map((type, idx) =>
                loadingCategories ? (
                  <Skeleton key={idx} className="h-9 w-20 rounded-full bg-white/10" />
                ) : (
                  <button
                    key={type}
                    className={cn(
                      "px-4 py-1.5 rounded-full border text-sm transition",
                      propFilter === type ? "border-[#FFB400] bg-[#FFB4000A]" : "border-white/10 hover:border-white/20"
                    )}
                    onClick={() => setPropFilter(type)}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* -------- BACKGROUNDS GRID -------- */}
      <h2 className="mt-10 mb-3 font-bold text-xl">Backgrounds</h2>
      {bgError && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">{bgError}</div>
      )}
      {loadingBackgrounds ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Skeleton key={idx} className="h-72 w-full rounded-2xl bg-white/10" />
          ))}
        </div>
      ) : displayBackgrounds.length === 0 ? (
        <div className="border border-dashed border-white/20 rounded-3xl py-16 text-center text-muted-foreground">
          No backgrounds found. Try another filter or search term.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayBackgrounds.map((bg) => (
            <button
              key={bg.id}
              className="rounded-xl bg-white/5 border border-white/10 hover:border-[#FFB400] overflow-hidden transition text-left shadow-lg hover:shadow-yellow-500/10"
              onClick={() => setSelectedBg(bg)}
            >
              <img src={bg.image_url || FALLBACK_BG} alt={bg.name} className="h-52 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{bg.name}</h3>
                <p className="text-xs text-[#FFB400] uppercase tracking-wide mt-1">{bg.category}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* -------- PROPS GRID -------- */}
      <h2 className="mt-10 mb-3 font-bold text-xl">Props</h2>
      {propError && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
          {propError}
        </div>
      )}
      {loadingProps ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, idx) => (
            <Skeleton key={idx} className="h-40 w-full rounded-2xl bg-white/10" />
          ))}
        </div>
      ) : displayProps.length === 0 ? (
        <div className="border border-dashed border-white/20 rounded-3xl py-16 text-center text-muted-foreground">
          No props found. Try another filter or search term.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {displayProps.map((prop) => (
            <button
              key={prop.id}
              className="rounded-xl bg-white/5 border border-white/10 hover:border-[#FFB400] p-6 transition text-center shadow hover:shadow-yellow-500/10 flex flex-col items-center gap-3"
              onClick={() => setSelectedProp(prop)}
            >
              <div className="p-4 bg-black/20 border border-white/10 rounded-xl">
                {renderPropIcon(prop.type || prop.category)}
              </div>
              <div className="font-medium">{prop.name}</div>
              <div className="text-xs text-muted-foreground">{getPropTypeLabel(prop)}</div>
            </button>
          ))}
        </div>
      )}

      {/* -------------------- BACKGROUND PREVIEW DRAWER -------------------- */}
      {selectedBg && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
          <div className="w-full max-w-xl bg-[#0E152E] border-l border-white/10 h-full p-6 overflow-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{selectedBg.name}</h2>
              <button onClick={() => setSelectedBg(null)} className="p-2 rounded hover:bg-white/10">
                <X />
              </button>
            </div>

            <div className="mt-4 rounded-xl overflow-hidden">
              <img
                src={selectedBg.image_url || FALLBACK_BG}
                alt="Background Preview"
                className="w-full h-64 object-cover"
              />
            </div>

            {/* Apply */}
            <Button className="mt-6 flex items-center gap-2" onClick={applyItem} disabled={isApplying}>
              {isApplying ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />}
              Add Background to Scene
            </Button>
          </div>
        </div>
      )}

      {/* -------------------- PROP PREVIEW DRAWER -------------------- */}
      {selectedProp && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
          <div className="w-full max-w-md bg-[#0E152E] border-l border-white/10 h-full p-6 overflow-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedProp.name}</h2>
              <button onClick={() => setSelectedProp(null)} className="p-2 rounded hover:bg-white/10">
                <X />
              </button>
            </div>

            <div className="mt-6 p-6 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center">
              <div className="p-6 bg-black/20 border border-white/10 rounded-xl mb-4">
                {renderPropIcon(selectedProp.type || selectedProp.category)}
              </div>

              <p className="text-muted-foreground text-sm">Type: {getPropTypeLabel(selectedProp)}</p>

              {/* Apply */}
              <Button className="mt-6 w-full flex items-center gap-2" onClick={applyItem} disabled={isApplying}>
                {isApplying ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />}
                Add Prop to Scene
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


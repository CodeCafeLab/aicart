"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";

type CategoryRow = {
  id: string | null;
  type: string;
  name: string;
  bg_color?: string | null;
  accent_color?: string | null;
  source?: "default" | "database";
};

const CATEGORY_TYPES = [
  { value: "scenes", label: "Scene Categories" },
  { value: "backgrounds", label: "Background Categories" },
  { value: "props", label: "Prop Categories" },
];

export default function CategoryManagerPage() {
  const [type, setType] = useState("scenes");
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [formValues, setFormValues] = useState({
    name: "",
    bg_color: "",
    accent_color: "",
  });
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<CategoryRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const fetchCategories = useCallback(
    async (categoryType: string) => {
      setLoading(true);
      try {
        const res = await apiFetch(`/api/library/categories?type=${categoryType}`);
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json();
        setCategories(data.items || []);
      } catch (err) {
        console.error(err);
        toast({
          title: "Unable to load categories",
          description: "Check the API connection or try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    fetchCategories(type);
  }, [fetchCategories, type]);

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  function openCreateDialog() {
    setEditing(null);
    setFormValues({ name: "", bg_color: "", accent_color: "" });
    setDialogOpen(true);
  }

  function openEditDialog(category: CategoryRow) {
    setEditing(category);
    setFormValues({
      name: category.name,
      bg_color: category.bg_color || "",
      accent_color: category.accent_color || "",
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditing(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formValues.name.trim()) {
      toast({
        title: "Name is required",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        type,
        name: formValues.name.trim(),
        bg_color: formValues.bg_color.trim() || undefined,
        accent_color: formValues.accent_color.trim() || undefined,
      };
      const endpoint = editing?.id ? `/api/library/categories/${editing.id}` : "/api/library/categories";
      const method = editing?.id ? "PUT" : "POST";
      const res = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save category");
      await fetchCategories(type);
      toast({
        title: editing ? "Category updated" : "Category created",
        description: `${payload.name} is now available.`,
      });
      closeDialog();
    } catch (err) {
      console.error(err);
      toast({
        title: "Unable to save category",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete?.id) {
      toast({
        title: "Default categories can't be deleted",
        variant: "destructive",
      });
      setPendingDelete(null);
      return;
    }
    setDeleting(true);
    try {
      const res = await apiFetch(`/api/library/categories/${pendingDelete.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      toast({
        title: "Category deleted",
        description: `${pendingDelete.name} removed`,
      });
      setPendingDelete(null);
      await fetchCategories(type);
    } catch (err) {
      console.error(err);
      toast({
        title: "Unable to delete category",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Category Manager</h1>
        <p className="text-muted-foreground">
          Keep your scene, background, and prop filters in sync for everyone on the team.
        </p>
      </div>

      <Card className="mt-6 bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            Manage Category Groups
          </CardTitle>
          <Button onClick={openCreateDialog} className="self-start">
            <Plus className="h-4 w-4 mr-1" />
            Add Category
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={type} onValueChange={setType}>
            <TabsList className="bg-black/30 border border-white/10">
              {CATEGORY_TYPES.map((group) => (
                <TabsTrigger key={group.value} value={group.value}>
                  {group.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5">
                  <TableHead className="text-white/80">Name</TableHead>
                  <TableHead className="text-white/80">Colors</TableHead>
                  <TableHead className="text-white/80">Source</TableHead>
                  <TableHead className="text-right text-white/80">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10">
                      <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
                      Loading categories...
                    </TableCell>
                  </TableRow>
                ) : sortedCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                      No categories found. Create one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedCategories.map((category) => (
                    <TableRow key={`${category.id ?? "default"}-${category.name}`} className="border-white/5">
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {category.bg_color && (
                            <span className="flex items-center gap-1 text-xs">
                              <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: category.bg_color }} />
                              {category.bg_color}
                            </span>
                          )}
                          {category.accent_color && (
                            <span className="flex items-center gap-1 text-xs">
                              <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: category.accent_color }} />
                              {category.accent_color}
                            </span>
                          )}
                          {!category.bg_color && !category.accent_color && (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {category.source === "default" ? (
                          <Badge variant="outline" className="border-white/20 text-white">Default</Badge>
                        ) : (
                          <Badge className="bg-emerald-500/20 text-emerald-200 border border-emerald-500/40">Custom</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/70 hover:text-white"
                            disabled={!category.id}
                            onClick={() => category.id && openEditDialog(category)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-300 hover:text-red-200"
                            disabled={!category.id}
                            onClick={() => setPendingDelete(category)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <p className="text-xs text-muted-foreground">
            Default categories come from workspace settings and cannot be edited. Add custom ones to create more granular filters for your team.
          </p>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => (open ? setDialogOpen(true) : closeDialog())}>
        <DialogContent className="bg-[#0E152E] text-white border-white/10">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit category" : "Create category"}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formValues.name}
                onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
                className="bg-black/40 border-white/10 text-white"
                placeholder="e.g., Luxury"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bg_color">Background color</Label>
                <Input
                  id="bg_color"
                  value={formValues.bg_color}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, bg_color: e.target.value }))}
                  className="bg-black/40 border-white/10 text-white"
                  placeholder="#0E1019"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accent_color">Accent color</Label>
                <Input
                  id="accent_color"
                  value={formValues.accent_color}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, accent_color: e.target.value }))}
                  className="bg-black/40 border-white/10 text-white"
                  placeholder="#FFB400"
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="ghost" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {editing ? "Save changes" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => (!open ? setPendingDelete(null) : null)}>
        <AlertDialogContent className="bg-[#0E152E] text-white border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">
            This will remove{" "}
            <span className="text-white font-medium">{pendingDelete?.name}</span> from the {type} filters. Scenes that already use it keep the text label.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-white border-white/20" onClick={() => setPendingDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-400 text-white"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


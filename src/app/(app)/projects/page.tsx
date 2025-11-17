"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  X,
  Share,
  Copy,
  Trash2,
  CalendarDays,
  FolderOpen,
  Download,
  Sparkles,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock project data
const mockProjects = [
  {
    id: "p1",
    name: "Luxury Product Shoot",
    type: "Product Shoot",
    date: "Jan 14, 2025",
    thumb:
      "https://images.unsplash.com/photo-1616627981468-22e9c5bcacae?w=800&q=80",
    tags: ["Luxury", "Studio", "Premium"],
  },
  {
    id: "p2",
    name: "Streetwear Lifestyle Campaign",
    type: "Campaign",
    date: "Feb 02, 2025",
    thumb:
      "https://images.unsplash.com/photo-1520975918319-258b6a2139f0?w=900&q=80",
    tags: ["Street", "Urban", "Model"],
  },
  {
    id: "p3",
    name: "Cosmetics Glow Ads",
    type: "Ad Creative",
    date: "Dec 28, 2024",
    thumb:
      "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?w=900&q=80",
    tags: ["Beauty", "Glow", "Cosmetics"],
  },
  {
    id: "p4",
    name: "Tech Rotating Animation",
    type: "Animation",
    date: "Jan 01, 2025",
    thumb:
      "https://images.unsplash.com/photo-1555617117-08e9a0e5a5a5?w=900&q=80",
    tags: ["Tech", "360°", "Animation"],
  },
];

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  const types = ["All", "Product Shoot", "Campaign", "Ad Creative", "Animation"];

  const filteredProjects =
    filterType === "All"
      ? mockProjects.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
      : mockProjects.filter(
          (p) =>
            p.type === filterType &&
            p.name.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            My Projects
          </h1>
          <p className="text-muted-foreground mt-1">
            Access all your shoots, campaigns, and creative projects.
          </p>
        </div>

        <Button className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Start New Project
        </Button>
      </div>

      {/* FILTER BAR */}
      <Card className="mt-6 bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" /> Search & Filter
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 opacity-60" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 p-3 rounded-xl bg-black/20 border border-white/10"
            />
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button
                key={t}
                className={cn(
                  "px-4 py-1.5 rounded-full border text-sm transition",
                  filterType === t
                    ? "border-[#FFB400] bg-[#FFB4000A]"
                    : "border-white/10 hover:border-white/20"
                )}
                onClick={() => setFilterType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PROJECT GRID */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProjects.map((project) => (
          <button
            key={project.id}
            className="rounded-xl bg-white/5 border border-white/10 hover:border-[#FFB400] overflow-hidden transition text-left shadow-lg hover:shadow-yellow-500/10 group"
            onClick={() => setSelectedProject(project)}
          >
            <div className="relative">
              <img
                src={project.thumb}
                alt={project.name}
                className="h-52 w-full object-cover"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <FolderOpen className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg">{project.name}</h3>
              <p className="text-xs text-[#FFB400] uppercase tracking-wide mt-1">
                {project.type}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                <CalendarDays className="h-4 w-4 opacity-60" />
                {project.date}
              </p>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs rounded-full bg-white/10 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* ----------------------- PROJECT DETAIL DRAWER ------------------------ */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-xl bg-[#0E152E] border-l border-white/10 p-6 overflow-auto h-full">

            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedProject.name}</h2>

              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded hover:bg-white/10"
              >
                <X />
              </button>
            </div>

            {/* Image */}
            <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
              <img
                src={selectedProject.thumb}
                alt="preview"
                className="w-full h-64 object-cover"
              />
            </div>

            {/* Details */}
            <div className="mt-6 space-y-3">
              <p>
                <strong>Type:</strong> {selectedProject.type}
              </p>
              <p>
                <strong>Date:</strong> {selectedProject.date}
              </p>

              <div>
                <strong>Tags:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedProject.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded-full bg-white/10 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-2">
              <Button className="w-full flex items-center gap-2">
                <FolderOpen className="h-4 w-4" /> Open Project
              </Button>

              <Button variant="outline" className="w-full flex items-center gap-2">
                <Copy className="h-4 w-4" /> Duplicate Project
              </Button>

              <Button variant="outline" className="w-full flex items-center gap-2">
                <Share className="h-4 w-4" /> Share Project
              </Button>

              <Button variant="outline" className="w-full flex items-center gap-2">
                <Download className="h-4 w-4" /> Export Project
              </Button>

              <Button
                variant="destructive"
                className="w-full flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" /> Delete Project
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

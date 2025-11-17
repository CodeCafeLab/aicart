"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  X,
  Wand2,
  Filter,
  ChevronRight,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mockAvatars = [
  {
    id: "a1",
    name: "Maya Singh",
    gender: "Female",
    style: "Casual",
    img: "https://i.pravatar.cc/380?img=47",
  },
  {
    id: "a2",
    name: "Ravi Kumar",
    gender: "Male",
    style: "Formal",
    img: "https://i.pravatar.cc/380?img=12",
  },
  {
    id: "a3",
    name: "Sara Malik",
    gender: "Female",
    style: "Urban",
    img: "https://i.pravatar.cc/380?img=56",
  },
  {
    id: "a4",
    name: "Ishaan Verma",
    gender: "Male",
    style: "Sporty",
    img: "https://i.pravatar.cc/380?img=33",
  },
];

export default function AvatarsPage() {
  const [avatars, setAvatars] = useState(mockAvatars);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<any>(null);

  const [filters, setFilters] = useState({
    gender: "All",
    style: "All",
  });

  const genderOptions = ["All", "Male", "Female"];
  const styleOptions = ["All", "Casual", "Formal", "Urban", "Sporty"];

  const filteredAvatars = avatars.filter((a) => {
    const genderMatch = filters.gender === "All" || a.gender === filters.gender;
    const styleMatch = filters.style === "All" || a.style === filters.style;
    return genderMatch && styleMatch;
  });

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            AI Models / Avatars
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage AI-generated models & create new avatars.
          </p>
        </div>

        <Button
          className="flex items-center gap-2"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-4 w-4" /> Create Avatar
        </Button>
      </div>

      {/* FILTERS */}
      <Card className="mt-6 bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" /> Filters
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              {genderOptions.map((opt) => (
                <option key={opt}>{opt}</option>
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
              {styleOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* AVATAR GRID */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAvatars.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => setSelectedAvatar(avatar)}
            className="rounded-xl bg-white/5 border border-white/10 hover:border-[#FFB400] overflow-hidden transition shadow-lg hover:shadow-yellow-500/10"
          >
            <img
              src={avatar.img}
              alt={avatar.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-3 text-left">
              <div className="font-semibold">{avatar.name}</div>
              <div className="text-xs text-muted-foreground">
                {avatar.gender} • {avatar.style}
              </div>
            </div>
          </button>
        ))}

        {/* Create Avatar Card */}
        <button
          className="rounded-xl border-dashed border-2 border-white/20 bg-white/5 hover:border-[#FFB400] transition flex flex-col items-center justify-center p-6"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-10 w-10 mb-3" />
          <div className="font-semibold">Create New Avatar</div>
          <div className="text-xs text-muted-foreground mt-1">
            Start from scratch
          </div>
        </button>
      </div>

      {/* ---------------------- AVATAR DETAIL DRAWER ---------------------- */}
      {selectedAvatar && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-md bg-[#0E152E] border-l border-white/10 h-full p-6 overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
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
              <img
                src={selectedAvatar.img}
                alt="avatar"
                className="w-full h-60 object-cover"
              />
            </div>

            {/* Info */}
            <div className="mt-6 space-y-2 text-sm">
              <div>
                <strong>Gender:</strong> {selectedAvatar.gender}
              </div>
              <div>
                <strong>Style:</strong> {selectedAvatar.style}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-2">
              <Button className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Use in Shoot
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" /> Edit
              </Button>
              <Button
                variant="destructive"
                className="flex items-center gap-2 ml-auto"
                onClick={() => {
                  setAvatars((prev) =>
                    prev.filter((x) => x.id !== selectedAvatar.id)
                  );
                  setSelectedAvatar(null);
                }}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------- CREATE AVATAR MODAL ---------------------- */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0E152E] border border-white/10 rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Create New Avatar</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded hover:bg-white/10"
              >
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Avatar Name</label>
                <input
                  className="w-full mt-1 p-2 rounded bg-black/20 border border-white/10"
                  placeholder="e.g. Zara Malik"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Gender</label>
                <select className="w-full mt-1 p-2 rounded bg-black/20 border border-white/10">
                  <option>Female</option>
                  <option>Male</option>
                  <option>Neutral</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Style</label>
                <select className="w-full mt-1 p-2 rounded bg-black/20 border border-white/10">
                  <option>Casual</option>
                  <option>Formal</option>
                  <option>Urban</option>
                  <option>Sporty</option>
                </select>
              </div>

              <Button
                className="w-full mt-2"
                onClick={() => {
                  alert("Avatar created (mock)");
                  setShowCreateModal(false);
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Create Avatar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

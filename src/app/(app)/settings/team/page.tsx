"use client";

import { useState } from "react";
import {
  Plus,
  User,
  Mail,
  X,
  Shield,
  Trash2,
  Check,
  Loader2,
  Users,
  BadgeCheck,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const roles = ["Admin", "Editor", "Viewer", "Billing Manager"];

// Mock members
const initialMembers = [
  {
    id: 1,
    name: "Ariana Gomez",
    email: "ariana@brand.com",
    role: "Admin",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    status: "Active",
  },
  {
    id: 2,
    name: "Mark Henderson",
    email: "mark@brand.com",
    role: "Editor",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    status: "Active",
  },
  {
    id: 3,
    name: "Emily Carter",
    email: "emily@brand.com",
    role: "Viewer",
    avatar: "https://randomuser.me/api/portraits/women/20.jpg",
    status: "Active",
  },
];

export default function TeamSettingsPage() {
  const [members, setMembers] = useState(initialMembers);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");
  const [inviting, setInviting] = useState(false);

  const pendingInvites = [
    { email: "testuser@example.com", role: "Editor" },
    { email: "designer@example.com", role: "Viewer" },
  ];

  const inviteMember = () => {
    if (!inviteEmail.includes("@")) return;

    setInviting(true);

    setTimeout(() => {
      pendingInvites.push({
        email: inviteEmail,
        role: inviteRole,
      });

      setInviting(false);
      setInviteEmail("");
      setInviteRole("Viewer");
    }, 1200);
  };

  const updateMemberRole = (id: number, role: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role } : m))
    );
  };

  const removeMember = (id: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setSelectedMember(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white">
      {/* HEADER */}
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Team Settings
      </h1>
      <p className="text-muted-foreground mt-1">
        Manage team access, roles, and permissions.
      </p>

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr,400px] gap-6">

        {/* LEFT SIDE — TEAM LIST */}
        <div className="space-y-6">
          {/* Team Members */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" /> Team Members
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {members.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMember(m)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FFB400] transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{m.name}</p>
                      <p className="text-sm text-muted-foreground">{m.email}</p>
                    </div>
                  </div>

                  <div className="text-sm text-[#FFB400] font-medium">
                    {m.role}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Pending Invites */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Pending Invites</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {pendingInvites.map((i, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10"
                >
                  <div>
                    <p className="font-medium">{i.email}</p>
                    <p className="text-xs text-[#FFB400]">{i.role}</p>
                  </div>
                  <BadgeCheck className="h-5 w-5 text-green-400" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDE — INVITE FORM */}
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Invite New Member</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <label className="text-sm mb-1 block">Email Address</label>
                <input
                  type="email"
                  placeholder="member@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/20 border border-white/10"
                />
              </div>

              <div>
                <label className="text-sm mb-1 block">Assign Role</label>
                <select
                  className="w-full p-3 rounded-xl bg-black/20 border border-white/10"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                >
                  {roles.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>

              <Button
                className="w-full flex items-center gap-2"
                onClick={inviteMember}
                disabled={inviting}
              >
                {inviting ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Send Invite
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ---------------------- MEMBER DETAIL DRAWER ---------------------- */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-lg bg-[#0E152E] border-l border-white/10 p-6 h-full overflow-auto">

            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Team Member</h2>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-2 rounded hover:bg-white/10"
              >
                <X />
              </button>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-4 mt-6">
              <img
                src={selectedMember.avatar}
                className="h-20 w-20 rounded-full object-cover"
              />
              <div>
                <p className="text-lg font-semibold">{selectedMember.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedMember.email}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="mt-6">
              <label className="text-sm block mb-2">Role</label>
              <select
                className="w-full p-3 rounded-xl bg-black/20 border border-white/10"
                value={selectedMember.role}
                onChange={(e) => {
                  updateMemberRole(selectedMember.id, e.target.value);
                  setSelectedMember((prev: any) => ({
                    ...prev,
                    role: e.target.value,
                  }));
                }}
              >
                {roles.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="mt-6">
              <label className="text-sm block mb-2">Status</label>
              <p className="text-[#FFB400]">{selectedMember.status}</p>
            </div>

            {/* Remove Member */}
            <Button
              variant="destructive"
              className="w-full mt-8 flex items-center gap-2"
              onClick={() => removeMember(selectedMember.id)}
            >
              <Trash2 className="h-4 w-4" /> Remove Member
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

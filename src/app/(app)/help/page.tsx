"use client";

import { useState } from "react";
import {
  Search,
  BookOpen,
  Lightbulb,
  Camera,
  Palette,
  Sparkles,
  Wallet,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Video,
  Mail,
  MessageCircle,
  X,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Help categories
const categories = [
  { id: "start", title: "Getting Started", icon: <Lightbulb className="h-5 w-5" /> },
  { id: "shoots", title: "AI Shoots", icon: <Camera className="h-5 w-5" /> },
  { id: "avatars", title: "Avatars / Models", icon: <Sparkles className="h-5 w-5" /> },
  { id: "scenes", title: "Scenes & Styling", icon: <Palette className="h-5 w-5" /> },
  { id: "billing", title: "Billing & Plans", icon: <Wallet className="h-5 w-5" /> },
  { id: "brand", title: "Brand Settings", icon: <BookOpen className="h-5 w-5" /> },
];

const docs = [
  {
    id: "d1",
    title: "How to Create Your First AI Shoot",
    content:
      "StudioForge allows you to create high-quality AI-powered shoots. To begin, go to 'Start New Shoot' and upload your product...",
  },
  {
    id: "d2",
    title: "Fix Avatar Alignment Issues",
    content:
      "If your avatar appears misaligned, adjust the pose settings or upload a cleaner product image...",
  },
  {
    id: "d3",
    title: "Using Scene Stylist Effectively",
    content:
      "Scene Stylist helps you choose backgrounds, mood, and props instantly. You can filter by category or generate your own scene...",
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const faq = [
    {
      q: "How do I generate an AI shoot?",
      a: "Go to Start New Shoot → Upload product → Choose avatar → Select scene → Generate.",
    },
    {
      q: "Why does my product look distorted?",
      a: "Make sure your image has a clean background and good lighting. PNG works best.",
    },
    {
      q: "How do I change my billing plan?",
      a: "Go to Settings → Billing → Choose new plan or update payment method.",
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white">
      {/* HEADER */}
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Help & Docs
      </h1>
      <p className="text-muted-foreground mt-1">
        Find guides, troubleshooting tips, and documentation.
      </p>

      {/* SEARCH */}
      <div className="mt-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 opacity-60" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search help articles..."
            className="w-full p-3 pl-11 rounded-xl bg-black/20 border border-white/10"
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 xl:grid-cols-[1fr,350px] gap-8">
        
        {/* LEFT SIDE CONTENT */}
        <div className="space-y-10">

          {/* CATEGORIES */}
          <div>
            <h2 className="font-semibold text-xl mb-4">Popular Categories</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map((c) => (
                <button
                  key={c.id}
                  className="rounded-xl bg-white/5 border border-white/10 hover:border-[#FFB400] p-4 flex flex-col items-center gap-3 transition"
                >
                  {c.icon}
                  <span className="text-sm font-medium text-center">{c.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* DOCUMENTATION ARTICLES */}
          <div>
            <h2 className="font-semibold text-xl mb-4">Documentation</h2>

            <div className="grid gap-4">
              {docs
                .filter((d) =>
                  d.title.toLowerCase().includes(search.toLowerCase())
                )
                .map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDoc(d)}
                    className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-[#FFB400] transition text-left"
                  >
                    <h3 className="font-semibold">{d.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {d.content}
                    </p>
                  </button>
                ))}
            </div>
          </div>

          {/* FAQ SECTION */}
          <div>
            <h2 className="font-semibold text-xl mb-4">Frequently Asked Questions</h2>

            <div className="space-y-3">
              {faq.map((item, index) => (
                <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <button
                    className="w-full flex justify-between items-center"
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                  >
                    <span className="font-medium">{item.q}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>

                  {expandedFaq === index && (
                    <p className="text-sm text-muted-foreground mt-3">
                      {item.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* TROUBLESHOOTING SECTION */}
          <div>
            <h2 className="font-semibold text-xl mb-4">Troubleshooting</h2>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardContent className="space-y-3 py-4">
                <div className="p-4 border border-white/10 rounded-xl bg-black/20">
                  <h3 className="font-medium">Product Not Rendering Correctly?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try uploading a high-resolution image with a plain background.
                  </p>
                </div>

                <div className="p-4 border border-white/10 rounded-xl bg-black/20">
                  <h3 className="font-medium">AI Models Look Unnatural?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Adjust avatar selection and lighting presets for better realism.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* VIDEO TUTORIALS */}
          <div>
            <h2 className="font-semibold text-xl mb-4">Video Tutorials</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800",
                "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=800",
              ].map((img, idx) => (
                <div
                  key={idx}
                  className="relative rounded-xl overflow-hidden border border-white/10 hover:border-[#FFB400] cursor-pointer group"
                >
                  <img src={img} className="h-40 w-full object-cover" />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Video className="h-10 w-10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR — CONTACT SUPPORT */}
        <div>
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Need More Help?</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button className="w-full flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email Support
              </Button>

              <Button variant="outline" className="w-full flex items-center gap-2">
                <MessageCircle className="h-4 w-4" /> Live Chat
              </Button>

              <Button variant="outline" className="w-full flex items-center gap-2">
                <HelpCircle className="h-4 w-4" /> Contact Form
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --------------------------- ARTICLE DRAWER ---------------------------- */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-xl bg-[#0E152E] border-l border-white/10 h-full p-6 overflow-auto">

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{selectedDoc.title}</h2>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-2 rounded hover:bg-white/10"
              >
                <X />
              </button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {selectedDoc.content}  
              <br /><br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Phasellus consequat, velit id aliquet varius, orci quam tincidunt 
              tortor, vel pellentesque ex lectus eget nibh. Curabitur nec 
              accumsan lorem. Mauris vitae dapibus nisl.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

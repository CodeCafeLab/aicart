"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Camera,
  Palette,
  Sparkles,
  Users,
  Lightbulb,
  Film,
  CheckCircle,
  ArrowLeft,
  ArrowRightCircle,
  Download,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/logo";
import { PlaceHolderImages } from "@/lib/placeholder-images";

/**
 * Ultra Premium Landing Page — Option A
 *
 * - Animated hero gradient
 * - CTA funnel (Start New Shoot / Sign up)
 * - Feature grid
 * - Live outputs carousel
 * - Pricing cards with highlight
 * - Testimonials
 * - FAQ
 *
 * Tailwind utilities are used heavily — tweak design tokens in your tailwind config.
 */

/* Theme colors (CodeCafeLab-like) are used through utility classes:
   primary: #FFB400 (used as accent)
   brand-purple: a secondary gradient color
*/

const features = [
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "AI Models / Avatars",
    description:
      "Design or pick photoreal avatars that model your apparel and products.",
    href: "/avatars",
  },
  {
    icon: <Palette className="w-8 h-8 text-primary" />,
    title: "Scene Stylist",
    description:
      "Generate or pick high-end scenes and moods with one text prompt.",
    href: "/scenes",
  },
  {
    icon: <Lightbulb className="w-8 h-8 text-primary" />,
    title: "Lighting Studio",
    description:
      "Cinematic lighting controls: intensity, temperature, softness & shadows.",
    href: "/lighting",
  },
  {
    icon: <Film className="w-8 h-8 text-primary" />,
    title: "Animation Studio",
    description:
      "360° spins, catwalk loops, and cinematic product animations for socials.",
    href: "/animation",
  },
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: "Product Mode",
    description:
      "Instant background removal and commercial-ready e-commerce shots.",
    href: "/product-mode",
  },
  {
    icon: <Camera className="w-8 h-8 text-primary" />,
    title: "AI Art Director",
    description:
      "Auto-suggests shot lists, props, lighting, and color direction for shoots.",
    href: "/art-director",
  },
];

const testimonials = [
  {
    name: "Sarah L.",
    role: "E-commerce Manager",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    text:
      "StudioForge turned a weeks-long shoot into minutes. The quality is professional and consistent.",
  },
  {
    name: "Mike T.",
    role: "Fashion Designer",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d",
    text:
      "I prototype collections with realistic models and lighting—no studio needed. A game-changer.",
  },
  {
    name: "Elena R.",
    role: "Marketing Director",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026706d",
    text:
      "Animations and concepts created instantly — our campaigns now outpace competitors.",
  },
];

const pricingTiers = [
  {
    name: "Creator",
    price: "$49",
    period: "/month",
    description: "Ideal for solo creators and indie brands.",
    features: [
      "1,000 credits / month",
      "2 users",
      "AI Model Studio",
      "Basic Props & Scenes",
      "Standard Support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$99",
    period: "/month",
    description: "For teams and agencies scaling creative output.",
    features: [
      "5,000 credits / month",
      "10 users",
      "Advanced AI Models",
      "Full Scenes & Props",
      "Animation Studio",
      "Priority Support",
    ],
    cta: "Choose Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions, security, and SLAs for large orgs.",
    features: [
      "Unlimited credits",
      "SSO & SAML",
      "API & Custom Models",
      "Dedicated Success Manager",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqItems = [
  {
    question: "What is StudioForge?",
    answer:
      "StudioForge is an AI creative studio for producing high-quality product photography and animations without physical shoots. Upload, style, and generate.",
  },
  {
    question: "How do credits work?",
    answer:
      "Credits power image and animation generation. Images are inexpensive; animations and custom model training cost more. Plans include monthly credits.",
  },
  {
    question: "Can I use my own models or faces?",
    answer:
      "For legal & safety reasons we do not accept uploading real faces. The Avatar Studio lets you craft unique, brand-appropriate models.",
  },
  {
    question: "What export formats are available?",
    answer:
      "Export as JPG/PNG (transparent PNG supported) and as MP4/GIF/WebM for animations. High-res exports available in Pro and Enterprise plans.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#060718] to-[#0e152e] text-slate-50">
      {/* Animated gradient hero background styles */}
      <style jsx>{`
        @keyframes floatGradient {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          50% { transform: translateY(-16px) rotate(2deg); opacity: 0.9; }
          100% { transform: translateY(0) rotate(0deg); opacity: 1; }
        }
      `}</style>

      <header className="sticky top-0 z-50 bg-[#071029]/60 backdrop-blur-sm border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Logo />
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-200">
              <a href="#features" className="hover:text-[#FFB400] transition">Features</a>
              <a href="#outputs" className="hover:text-[#FFB400] transition">Outputs</a>
              <a href="#pricing" className="hover:text-[#FFB400] transition">Pricing</a>
              <a href="#faq" className="hover:text-[#FFB400] transition">FAQ</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-[#FFB400] to-[#8B5CF6] text-black shadow-xl hover:scale-105">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            {/* animated floating gradient blobs */}
            <div
              aria-hidden
              className="absolute -left-24 -top-20 w-[560px] h-[560px] rounded-full bg-gradient-to-r from-[#FFB400]/30 to-[#FF8AEE]/20 blur-3xl transform-gpu"
              style={{ animation: "floatGradient 12s ease-in-out infinite" }}
            />
            <div
              aria-hidden
              className="absolute right-[-120px] top-8 w-[420px] h-[420px] rounded-full bg-gradient-to-r from-[#7C3AED]/20 to-[#FFB400]/10 blur-2xl transform-gpu"
              style={{ animation: "floatGradient 10s ease-in-out infinite", animationDelay: "2s" }}
            />
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10 py-24 md:py-36 text-center">
            <Badge className="mx-auto inline-flex items-center gap-2 border border-[#FFB400]/40 text-[#FFB400] bg-[#FFB400]/8 px-3 py-1 rounded-full">
              <Star className="h-4 w-4" /> New: Animation Studio
            </Badge>

            <h1 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
              StudioForge — AI Studio for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB400] to-[#8B5CF6]">Product & Apparel Photography</span>
            </h1>

            <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-200/80">
              Generate studio-quality images, model shots and animations with AI — fast, consistent, and tailored to your brand.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4 flex-col sm:flex-row">
              <Button size="lg" className="flex items-center gap-3 bg-gradient-to-r from-[#FFB400] to-[#8B5CF6] text-black shadow-2xl transform transition hover:-translate-y-0.5">
                <Link href="/dashboard" className="flex items-center gap-3">
                  Start New Shoot <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>

            {/* trust bar */}
            <div className="mt-10 flex items-center justify-center gap-6 text-sm text-slate-300/70 flex-wrap">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://i.pravatar.cc/40?u=1" alt="brand" />
                  <AvatarFallback>CF</AvatarFallback>
                </Avatar>
                <span>Used by brands like</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs px-3 py-1 rounded bg-white/5">ApparelCo</div>
                <div className="text-xs px-3 py-1 rounded bg-white/5 hidden sm:block">ModaLab</div>
                <div className="text-xs px-3 py-1 rounded bg-white/5 hidden md:block">RetailX</div>
              </div>
            </div>
          </div>
        </section>

        {/* Showcase image */}
        <section className="py-8 md:py-14">
          <div className="container mx-auto px-4 md:px-6">
            <div className="rounded-2xl overflow-hidden border border-white/6 shadow-2xl bg-gradient-to-b from-white/3 to-transparent p-1">
              <Image
                src={PlaceHolderImages.find((p) => p.id === "landing-hero-1")?.imageUrl || "https://picsum.photos/1200/600"}
                alt="studioforge showcase"
                width={1600}
                height={800}
                className="w-full h-auto object-cover rounded-xl"
                priority
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold">A full creative suite for product teams</h2>
              <p className="mt-4 text-slate-200/80">Everything you need to design, light, animate and publish product content — all powered by AI.</p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => (
                <Card key={f.title} className="bg-[#071029]/60 border border-white/6 hover:border-[#FFB400]/40 transition">
                  <CardHeader className="flex items-center gap-4">
                    {f.icon}
                    <CardTitle className="text-lg font-semibold">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-200/80">{f.description}</p>
                    <div className="mt-4">
                      <Link href={f.href} className="text-sm text-[#FFB400] hover:underline inline-flex items-center gap-2">
                        Try {f.title} <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Live outputs carousel */}
        <section id="outputs" className="py-12 md:py-20 bg-gradient-to-b from-transparent to-[#071029]/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Real outputs from the community</h3>
            </div>
            
            <Carousel
              opts={{ align: "start", loop: true }}
              className="w-full"
            >
              <div className="hidden sm:flex gap-3 justify-end mb-4">
                <CarouselPrevious className="p-2 rounded bg-white/6 relative -top-8" />
                <CarouselNext className="p-2 rounded bg-white/6 relative -top-8" />
              </div>

              <CarouselContent>
                {PlaceHolderImages.filter((p) => p.id.startsWith("carousel")).map((img, idx) => (
                  <CarouselItem key={img.id} className="sm:basis-1/2 md:basis-1/3 p-2">
                    <Card className="overflow-hidden rounded-xl">
                      <CardContent className="p-0">
                        <Image
                          src={img.imageUrl}
                          alt={img.description}
                          width={800}
                          height={1000}
                          className="aspect-[3/4] w-full object-cover transition-transform hover:scale-105"
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="flex items-center justify-center gap-3 mt-6 sm:hidden">
                <CarouselPrevious className="p-2 rounded bg-white/6" />
                <CarouselNext className="p-2 rounded bg-white/6" />
              </div>
            </Carousel>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Pricing made for creators & teams</h2>
            <p className="mt-3 text-slate-200/80 max-w-2xl mx-auto">Start for free, upgrade when ready. No long-term commitment.</p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {pricingTiers.map((tier) => (
                <Card key={tier.name} className={`relative flex flex-col ${tier.popular ? "border-2 border-[#FFB400] shadow-2xl bg-gradient-to-b from-[#FFFAED]/5 to-transparent" : "bg-[#071029]/60 border border-white/6"}`}>
                  {tier.popular && (
                    <Badge className="absolute left-1/2 -top-3 -translate-x-1/2 bg-[#FFB400] text-black px-3 py-1">Most Popular</Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-4xl md:text-5xl font-extrabold">{tier.price}</span>
                      <span className="text-slate-300">{tier.period}</span>
                    </div>

                    <ul className="mt-6 space-y-3 flex-1">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-slate-200/80">
                          <CheckCircle className="h-5 w-5 text-green-400 mt-1" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6">
                      <Button asChild className={`${tier.popular ? "bg-gradient-to-r from-[#FFB400] to-[#8B5CF6] text-black" : ""} w-full`}>
                        <Link href="/signup">{tier.cta}</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-12 md:py-20 bg-gradient-to-b from-transparent to-[#071029]/30">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center">Loved by creatives worldwide</h2>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <Card key={t.name} className="bg-[#071029]/50 border border-white/6">
                  <CardContent>
                    <p className="text-slate-200/80">“{t.text}”</p>

                    <div className="mt-4 flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={t.avatar} alt={t.name} />
                        <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{t.name}</div>
                        <div className="text-sm text-slate-400">{t.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center">Frequently asked questions</h2>

            <Accordion type="single" collapsible className="mt-8">
              {faqItems.map((item) => (
                <AccordionItem value={item.question} key={item.question}>
                  <AccordionTrigger className="text-lg font-medium">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-slate-200/80">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/6 bg-[#061024]">
        <div className="container mx-auto px-4 md:px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Logo />
            <p className="mt-4 text-slate-300/80 text-sm max-w-sm">StudioForge — Create product photography, model shoots, and animations with AI. Faster, cheaper, and consistent.</p>
            <div className="mt-4 flex items-center gap-3">
              <Link href="#" className="text-slate-300/70 hover:text-[#FFB400]">Terms</Link>
              <Link href="#" className="text-slate-300/70 hover:text-[#FFB400]">Privacy</Link>
            </div>
          </div>

          <div className="flex gap-12 justify-around md:justify-center">
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="text-sm text-slate-300/80 space-y-2">
                <li><Link href="/product-mode">Product Mode</Link></li>
                <li><Link href="/avatars">Avatars</Link></li>
                <li><Link href="/scenes">Scene Stylist</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="text-sm text-slate-300/80 space-y-2">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/careers">Careers</Link></li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Get in touch</h4>
            <p className="text-sm text-slate-300/80">support@studioforge.ai</p>
            <div className="mt-4">
              <Button variant="outline" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/6 py-4">
          <div className="container mx-auto px-4 md:px-6 text-sm text-slate-400 flex items-center justify-between">
            <span>© {new Date().getFullYear()} StudioForge — All rights reserved.</span>
            <span>Built with ♥︎ — CodeCafeLab</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

    
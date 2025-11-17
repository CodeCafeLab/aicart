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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "AI Models / Avatars",
    description: "Create custom AI models or choose from a diverse library of avatars for your shoots.",
  },
  {
    icon: <Palette className="w-8 h-8 text-primary" />,
    title: "Scene Stylist",
    description: "Generate unique scenes from text prompts or select from a gallery of mood presets.",
  },
  {
    icon: <Lightbulb className="w-8 h-8 text-primary" />,
    title: "Lighting Studio",
    description: "Fine-tune every detail with adjustable studio lighting, shadows, and reflections.",
  },
  {
    icon: <Film className="w-8 h-8 text-primary" />,
    title: "Animation Studio",
    description: "Bring your products to life with 360° spins, catwalk loops, and dynamic animations.",
  },
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: "Product Mode",
    description: "Instantly create clean e-commerce shots with automatic background removal.",
  },
  {
    icon: <Camera className="w-8 h-8 text-primary" />,
    title: "AI Art Director",
    description: "Get AI-powered suggestions for concepts, angles, and complete shoot plans.",
  },
];

const testimonials = [
  {
    name: "Sarah L.",
    role: "E-commerce Manager",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    text: "StudioForge has revolutionized our product photography. We're creating stunning visuals in minutes that used to take days and a full team. The quality is simply breathtaking.",
  },
  {
    name: "Mike T.",
    role: "Fashion Designer",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d",
    text: "As a small brand, professional photoshoots were our biggest bottleneck. StudioForge leveled the playing field. I can now visualize my designs on models instantly.",
  },
  {
    name: "Elena R.",
    role: "Marketing Director",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026706d",
    text: "The creative freedom is unparalleled. The AI Art Director provides endless inspiration, and the animation tools have made our social media campaigns pop. A must-have for any creative team.",
  },
];

const pricingTiers = [
    {
        name: "Creator",
        price: "$49",
        period: "/ month",
        description: "For individuals and small teams getting started with AI photography.",
        features: ["1,000 credits/month", "2 users included", "AI Model Studio", "Basic Prop Library", "Standard Support"],
        cta: "Get Started",
        popular: false,
    },
    {
        name: "Pro",
        price: "$99",
        period: "/ month",
        description: "For professionals and growing businesses requiring more power.",
        features: ["5,000 credits/month", "10 users included", "Advanced AI Model Studio", "Full Prop & Scene Library", "Animation Studio", "Priority Support"],
        cta: "Choose Pro",
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        description: "For large organizations needing tailored solutions and security.",
        features: ["Unlimited credits", "Unlimited users", "Custom Model Training", "API Access", "Dedicated Support Manager", "SSO & Advanced Security"],
        cta: "Contact Sales",
        popular: false,
    }
];

const faqItems = [
    {
        question: "What is StudioForge?",
        answer: "StudioForge is an AI-powered creative studio that allows you to generate high-quality, professional product and apparel photography without the need for physical studios, cameras, or models. Simply upload your product, style your scene, and let our AI generate stunning visuals."
    },
    {
        question: "How do credits work?",
        answer: "Credits are used for generating images and animations. A standard image generation costs 1 credit, while more complex tasks like animations or high-resolution renders may cost more. Your monthly plan includes a set number of credits, and you can purchase more if needed."
    },
    {
        question: "Can I use my own models or faces?",
        answer: "While you can't upload specific faces for legal and ethical reasons, our AI Avatar designer allows for deep customization. You can adjust facial features, hairstyles, skin tones, and more to create unique models that align with your brand's identity."
    },
    {
        question: "What are the export formats?",
        answer: "You can export your creations in various formats, including high-resolution JPEG, PNG (with transparent backgrounds), and video formats like MP4, GIF, and WebM for animations."
    }
];


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href="#features" className="text-muted-foreground transition-colors hover:text-primary">Features</Link>
            <Link href="#pricing" className="text-muted-foreground transition-colors hover:text-primary">Pricing</Link>
            <Link href="#testimonials" className="text-muted-foreground transition-colors hover:text-primary">Testimonials</Link>
            <Link href="#faq" className="text-muted-foreground transition-colors hover:text-primary">FAQ</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
                <Link href="/dashboard">Login</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-primary to-brand-purple text-primary-foreground shadow-[0_0_20px_theme(colors.primary/50%)] transition-shadow hover:shadow-[0_0_30px_theme(colors.primary/70%)]">
                <Link href="/dashboard">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,180,0,0.2),rgba(255,255,255,0))]"></div>
            <div className="container mx-auto px-4 md:px-6 text-center">
                <Badge variant="outline" className="mb-4 border-primary/50 text-primary bg-primary/10 py-1 px-3">Now with Animation Studio</Badge>
                <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight">
                StudioForge — AI Studio for <br /> Product & Apparel Photography
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Generate studio-quality product images & model shoots with AI. No camera, no studio, no limits. Your imagination is your new art director.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button size="lg" asChild className="bg-gradient-to-r from-primary to-brand-purple text-primary-foreground shadow-[0_0_20px_theme(colors.primary/50%)] transition-all duration-300 hover:shadow-[0_0_35px_theme(colors.primary/70%)] hover:scale-105">
                        <Link href="/dashboard">Start New Shoot <ArrowRight className="ml-2 h-5 w-5" /></Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="#features">Learn More</Link>
                    </Button>
                </div>
            </div>
        </section>

        {/* Product Demo Section */}
        <section className="py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative rounded-lg border-2 border-primary/20 bg-card p-2 shadow-2xl shadow-primary/10">
                    <Image
                        src={PlaceHolderImages.find(p => p.id === 'landing-hero-1')?.imageUrl || "https://picsum.photos/seed/1/1200/600"}
                        alt="AI generated product shoot"
                        width={1200}
                        height={600}
                        data-ai-hint="product shoot"
                        className="rounded-md w-full"
                    />
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 md:py-24 bg-card/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <h2 className="font-headline text-4xl md:text-5xl font-bold">A Full Creative Suite</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                From simple product shots to complex animated scenes, StudioForge provides all the tools you need.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-card border-border hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center gap-4">
                        {feature.icon}
                        <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Real Outputs Carousel */}
        <section id="outputs" className="py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center">
                    <h2 className="font-headline text-4xl md:text-5xl font-bold">Infinite Creativity, Real Results</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        See what our users are creating with StudioForge. The possibilities are endless.
                    </p>
                </div>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full mt-12"
                >
                    <CarouselContent>
                        {PlaceHolderImages.filter(p => p.id.startsWith('carousel')).map((image, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-1">
                                    <Card className="overflow-hidden">
                                        <CardContent className="p-0">
                                            <Image
                                                src={image.imageUrl}
                                                alt={image.description}
                                                width={600}
                                                height={800}
                                                data-ai-hint={image.imageHint}
                                                className="aspect-[3/4] w-full object-cover transition-transform hover:scale-105"
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="ml-12" />
                    <CarouselNext className="mr-12" />
                </Carousel>
            </div>
        </section>
        
        {/* Pricing Section */}
        <section id="pricing" className="py-12 md:py-24 bg-card/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center">
                    <h2 className="font-headline text-4xl md:text-5xl font-bold">Find Your Perfect Plan</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Start for free and scale as you grow. Cancel anytime.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {pricingTiers.map(tier => (
                        <Card key={tier.name} className={`flex flex-col ${tier.popular ? 'border-2 border-primary shadow-2xl shadow-primary/20' : ''}`}>
                            {tier.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">Most Popular</Badge>}
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">{tier.name}</CardTitle>
                                <CardDescription>{tier.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                                <div className="flex items-baseline">
                                    <span className="text-5xl font-bold">{tier.price}</span>
                                    {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                                </div>
                                <ul className="mt-6 space-y-3 flex-1">
                                    {tier.features.map(feature => (
                                        <li key={feature} className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button className={`w-full mt-8 ${tier.popular ? 'bg-gradient-to-r from-primary to-brand-purple text-primary-foreground shadow-[0_0_20px_theme(colors.primary/50%)]' : ''}`} variant={tier.popular ? 'default' : 'outline'}>{tier.cta}</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center">
                    <h2 className="font-headline text-4xl md:text-5xl font-bold">Loved by Creatives Worldwide</h2>
                </div>
                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <Card key={testimonial.name} className="bg-card">
                            <CardContent className="pt-6">
                                <p className="text-muted-foreground">"{testimonial.text}"</p>
                                <div className="mt-4 flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-12 md:py-24 bg-card/50">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                 <div className="text-center">
                    <h2 className="font-headline text-4xl md:text-5xl font-bold">Frequently Asked Questions</h2>
                </div>
                <Accordion type="single" collapsible className="w-full mt-12">
                    {faqItems.map(item => (
                        <AccordionItem value={item.question} key={item.question}>
                            <AccordionTrigger className="text-lg font-semibold">{item.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo />
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} StudioForge. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6 text-sm">
             <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">Terms of Service</Link>
             <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

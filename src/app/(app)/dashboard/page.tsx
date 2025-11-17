import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  PlusCircle,
  Users,
  Film,
  Sparkles,
  Package,
  Clock,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
  ChartStyle
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

const quickAccessItems = [
  {
    title: "Product Mode",
    icon: <Sparkles className="h-6 w-6 text-primary" />,
    description: "Clean e-commerce shots",
    href: "/product-mode",
  },
  {
    title: "Create Avatar",
    icon: <Users className="h-6 w-6 text-primary" />,
    description: "Design a new AI model",
    href: "/avatars",
  },
  {
    title: "Generate Animation",
    icon: <Film className="h-6 w-6 text-primary" />,
    description: "Animate your products",
    href: "/animation-studio",
  },
  {
    title: "Creative Packs",
    icon: <Package className="h-6 w-6 text-primary" />,
    description: "Explore new styles",
    href: "/creative-packs",
  },
];

const recentProjects = PlaceHolderImages.filter(p => p.id.startsWith('project-')).slice(0, 6);

const chartData = [
  { month: "January", credits: 186 },
  { month: "February", credits: 305 },
  { month: "March", credits: 237 },
  { month: "April", credits: 173 },
  { month: "May", credits: 209 },
  { month: "June", credits: 250 },
];

const chartConfig = {
  credits: {
    label: "Credits",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Let's create something amazing today.</p>
        </div>
        <Button size="lg" asChild className="bg-gradient-to-r from-primary to-brand-purple text-primary-foreground shadow-[0_0_20px_theme(colors.primary/50%)] transition-all duration-300 hover:shadow-[0_0_35px_theme(colors.primary/70%)] hover:scale-105">
          <Link href="/new-shoot">
            <PlusCircle className="mr-2 h-5 w-5" /> Start New Shoot
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {quickAccessItems.map((item) => (
          <Link href={item.href} key={item.title}>
            <Card className="group transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                {item.icon}
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold font-headline mb-4">Recent Projects</h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {recentProjects.map((project, index) => (
              <Card key={index} className="overflow-hidden group">
                <div className="relative">
                  <Image
                    src={project.imageUrl}
                    alt={project.description}
                    width={400}
                    height={300}
                    data-ai-hint={project.imageHint}
                    className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold truncate">{project.description}</h3>
                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    <Clock className="h-3 w-3 mr-1.5" />
                    <span>Edited 2 hours ago</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold font-headline mb-4">Usage Analytics</h2>
          <Card>
            <CardHeader>
              <CardTitle>Credit Usage</CardTitle>
              <CardDescription>You've used 750 of 1,000 credits this month.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Progress value={75} aria-label="75% of credits used" />
                <div className="h-[200px] w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                     <YAxis hide={true} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="credits" fill="var(--color-credits)" radius={4} />
                    </BarChart>
                </ChartContainer>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

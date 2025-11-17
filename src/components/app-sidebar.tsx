"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator
} from "@/components/ui/sidebar";
import Logo from "@/components/logo";
import {
  LayoutDashboard,
  PlusCircle,
  Camera,
  ShoppingBag,
  Users,
  Package,
  Palette,
  Lightbulb,
  Film,
  Wand2,
  Folder,
  History,
  Cog,
  CreditCard,
  HelpCircle,
  LogOut,
  Theater,
} from "lucide-react";

const mainNav = [
  { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
  { href: "/new-shoot", icon: <PlusCircle />, label: "Start New Shoot" },
];

const workspaceNav = [
  { href: "/ai-shoots", icon: <Camera />, label: "AI Shoots" },
  { href: "/product-mode", icon: <ShoppingBag />, label: "Product Mode" },
  { href: "/avatars", icon: <Users />, label: "AI Models / Avatars" },
  { href: "/creative-packs", icon: <Package />, label: "Creative Packs" },
];

const toolsNav = [
  { href: "/scene-stylist", icon: <Palette />, label: "Scene Stylist" },
  { href: "/backgrounds", icon: <Theater />, label: "Backgrounds & Props" },
  { href: "/lighting-studio", icon: <Lightbulb />, label: "Lighting Studio" },
  { href: "/animation-studio", icon: <Film />, label: "Animation Studio" },
  { href: "/ai-art-director", icon: <Wand2 />, label: "AI Art Director" },
];

const managementNav = [
  { href: "/projects", icon: <Folder />, label: "My Projects" },
  { href: "/history", icon: <History />, label: "History / Versions" },
];

const settingsNav = [
  { href: "/settings", icon: <Cog />, label: "Brand Settings" },
  { href: "/billing", icon: <CreditCard />, label: "Billing & Subscription" },
  { href: "/help", icon: <HelpCircle />, label: "Help Center & FAQ" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
            <SidebarMenu>
                {mainNav.map((item) => (
                <SidebarMenuItem key={item.label}>
                    <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton isActive={isActive(item.href)} tooltip={item.label}>
                        {item.icon}
                        <span>{item.label}</span>
                    </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarMenu>
                {workspaceNav.map((item) => (
                <SidebarMenuItem key={item.label}>
                    <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton isActive={isActive(item.href)} tooltip={item.label}>
                        {item.icon}
                        <span>{item.label}</span>
                    </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
            <SidebarGroupLabel>Creative Tools</SidebarGroupLabel>
            <SidebarMenu>
                {toolsNav.map((item) => (
                <SidebarMenuItem key={item.label}>
                    <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton isActive={isActive(item.href)} tooltip={item.label}>
                        {item.icon}
                        <span>{item.label}</span>
                    </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarMenu>
                {managementNav.map((item) => (
                <SidebarMenuItem key={item.label}>
                    <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton isActive={isActive(item.href)} tooltip={item.label}>
                        {item.icon}
                        <span>{item.label}</span>
                    </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
         <SidebarGroup>
            <SidebarMenu>
                {settingsNav.map((item) => (
                <SidebarMenuItem key={item.label}>
                    <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton isActive={isActive(item.href)} tooltip={item.label}>
                        {item.icon}
                        <span>{item.label}</span>
                    </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                    <Link href="/" passHref legacyBehavior>
                        <SidebarMenuButton tooltip="Log Out">
                            <LogOut />
                            <span>Log Out</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
         </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}

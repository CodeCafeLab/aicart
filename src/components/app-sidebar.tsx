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
  SidebarSeparator,
  useSidebar
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
  { href: "/shoot/new", icon: <PlusCircle />, label: "Start New Shoot" },
];

const workspaceNav = [
  { href: "/shoots", icon: <Camera />, label: "AI Shoots" },
  { href: "/product-mode", icon: <ShoppingBag />, label: "Product Mode" },
  { href: "/avatars", icon: <Users />, label: "AI Models / Avatars" },
  { href: "/packs", icon: <Package />, label: "Creative Packs" },
];

const toolsNav = [
  { href: "/scenes", icon: <Palette />, label: "Scene Stylist" },
  { href: "/props", icon: <Theater />, label: "Backgrounds & Props" },
  { href: "/lighting", icon: <Lightbulb />, label: "Lighting Studio" },
  { href: "/animation", icon: <Film />, label: "Animation Studio" },
  { href: "/art-director", icon: <Wand2 />, label: "AI Art Director" },
];

const managementNav = [
  { href: "/projects", icon: <Folder />, label: "My Projects" },
];

const settingsNav = [
  { href: "/settings/brand", icon: <Cog />, label: "Brand Settings" },
  { href: "/settings/team", icon: <Users />, label: "Team Settings" },
  { href: "/billing", icon: <CreditCard />, label: "Billing & Subscription" },
  { href: "/help", icon: <HelpCircle />, label: "Help Center & FAQ" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  const isActive = (href: string) => {
    if (href === '/projects') {
      return pathname.startsWith('/projects');
    }
    if (href === '/settings/brand' || href === '/settings/team') {
      return pathname.startsWith('/settings');
    }
    return pathname === href;
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
            <SidebarMenu>
                {mainNav.map((item) => (
                <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.label}>
                        <Link href={item.href}>
                        {item.icon}
                        <span className={state === 'collapsed' ? 'hidden' : 'inline'}>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
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
                    <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.label}>
                        <Link href={item.href}>
                        {item.icon}
                        <span className={state === 'collapsed' ? 'hidden' : 'inline'}>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
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
                    <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.label}>
                        <Link href={item.href}>
                        {item.icon}
                        <span className={state === 'collapsed' ? 'hidden' : 'inline'}>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
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
                    <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.label}>
                        <Link href={item.href}>
                        {item.icon}
                        <span className={state === 'collapsed' ? 'hidden' : 'inline'}>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
         <SidebarGroup>
            <SidebarMenu>
                {settingsNav.map((item) => (
                <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.label}>
                        <Link href={item.href}>
                        {item.icon}
                        <span className={state === 'collapsed' ? 'hidden' : 'inline'}>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Log Out">
                        <Link href="/login">
                        <LogOut />
                        <span className={state === 'collapsed' ? 'hidden' : 'inline'}>Log Out</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
         </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}

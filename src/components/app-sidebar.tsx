"use client";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mainNav = [
  {
    href: "/dashboard",
    icon: <LayoutDashboard size={18} />,
    label: "Dashboard",
  },
  {
    href: "/shoot/new",
    icon: <PlusCircle size={18} />,
    label: "Start New Shoot",
  },
];

const workspaceNav = [
  { href: "/shoots", icon: <Camera size={18} />, label: "AI Shoots" },
  {
    href: "/product-mode",
    icon: <ShoppingBag size={18} />,
    label: "Product Mode",
  },
  { href: "/avatars", icon: <Users size={18} />, label: "AI Models / Avatars" },
  { href: "/packs", icon: <Package size={18} />, label: "Creative Packs" },
];

const toolsNav = [
  { href: "/scenes", icon: <Palette size={18} />, label: "Scene Stylist" },
  { href: "/props", icon: <Theater size={18} />, label: "Backgrounds & Props" },
  {
    href: "/lighting",
    icon: <Lightbulb size={18} />,
    label: "Lighting Studio",
  },
  { href: "/animation", icon: <Film size={18} />, label: "Animation Studio" },
  {
    href: "/art-director",
    icon: <Wand2 size={18} />,
    label: "AI Art Director",
  },
];

const managementNav = [
  { href: "/projects", icon: <Folder size={18} />, label: "My Projects" },
];

const settingsNav = [
  { href: "/settings/brand", icon: <Cog size={18} />, label: "Brand Settings" },
  { href: "/settings/team", icon: <Users size={18} />, label: "Team Settings" },
  {
    href: "/billing",
    icon: <CreditCard size={18} />,
    label: "Billing & Subscription",
  },
  { href: "/help", icon: <HelpCircle size={18} />, label: "Help Center & FAQ" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const role =
    typeof window !== "undefined"
      ? localStorage.getItem("role") || "user"
      : "user";

  if (pathname === "/shoot/new") {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/projects") {
      return pathname.startsWith("/projects");
    }
    if (href === "/settings/brand" || href === "/settings/team") {
      return pathname.startsWith("/settings");
    }
    return pathname === href;
  };

  return (
    <Sidebar>
      <SidebarHeader className="bg-gradient-to-b from-background to-sidebar/60 rounded-md">
        <Logo showText={state === "expanded"} />
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <SidebarGroup>
          <SidebarMenu>
            {mainNav.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.href)}
                  tooltip={item.label}
                  className={
                    collapsed ? "justify-center px-2" : "justify-start px-2"
                  }
                >
                  <Link
                    href={item.href}
                    className={
                      collapsed
                        ? "flex items-center justify-center w-full"
                        : "flex items-center justify-start w-full"
                    }
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span
                      className={cn(
                        state === "collapsed" ? "hidden" : "inline",
                        "ml-2 text-sm whitespace-nowrap truncate max-w-[140px]"
                      )}
                    >
                      {item.label}
                    </span>
                    {state !== "collapsed" && item.href === "/shoot/new" && (
                      <span className="ml-2 rounded bg-purple-600/20 text-purple-400 text-[10px] px-1 py-0.5">
                        NEW
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        {role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarMenu>
              {workspaceNav.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.label}
                    className={
                      collapsed ? "justify-center px-2" : "justify-start px-2"
                    }
                  >
                    <Link
                      href={item.href}
                      className={
                        collapsed
                          ? "flex items-center justify-center w-full"
                          : "flex items-center justify-start w-full"
                      }
                    >
                      <span className="shrink-0">{item.icon}</span>
                      <span
                        className={cn(
                          state === "collapsed" ? "hidden" : "inline",
                          "ml-2 text-sm whitespace-nowrap truncate max-w-[140px]"
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}

        <SidebarSeparator />

        {role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Creative Tools</SidebarGroupLabel>
            <SidebarMenu>
              {toolsNav.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.label}
                    className={
                      collapsed ? "justify-center px-2" : "justify-start px-2"
                    }
                  >
                    <Link
                      href={item.href}
                      className={
                        collapsed
                          ? "flex items-center justify-center w-full"
                          : "flex items-center justify-start w-full"
                      }
                    >
                      <span className="shrink-0">{item.icon}</span>
                      <span
                        className={cn(
                          state === "collapsed" ? "hidden" : "inline",
                          "ml-2 text-sm whitespace-nowrap truncate max-w-[140px]"
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>
            {role === "admin" ? "Management" : "My Space"}
          </SidebarGroupLabel>
          <SidebarMenu>
            {(role === "admin"
              ? managementNav
              : [
                  {
                    href: "/projects",
                    icon: <Folder size={18} />,
                    label: "My Projects",
                  },
                ]
            ).map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.href)}
                  tooltip={item.label}
                  className={
                    collapsed ? "justify-center px-2" : "justify-start px-2"
                  }
                >
                  <Link
                    href={item.href}
                    className={
                      collapsed
                        ? "flex items-center justify-center w-full"
                        : "flex items-center justify-start w-full"
                    }
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span
                      className={cn(
                        state === "collapsed" ? "hidden" : "inline",
                        "ml-2 text-sm whitespace-nowrap truncate max-w-[140px]"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      {role === "admin" && (
        <SidebarFooter>
          <SidebarGroup>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className={collapsed ? "justify-center px-2" : "justify-start px-2"}>
                  <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/150?u=aicart-admin" alt="Admin" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <span className={cn(state === "collapsed" ? "hidden" : "inline", "ml-2 text-sm")}>Profile</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="right">
                <DropdownMenuLabel>Admin</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/settings/brand">Brand Settings</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/settings/team">Team Settings</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/billing">Billing & Subscription</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/help">Help Center & FAQ</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/login">Log out</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarGroup>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}

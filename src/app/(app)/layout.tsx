"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AppSidebar from "@/components/app-sidebar";
import AppHeader from "@/components/app-header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Use state to avoid hydration mismatch - start with null (matches server)
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Read from localStorage only on client after mount
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    
    if (!storedRole) {
      router.replace("/login");
      return;
    }
    if (storedRole === "user") {
      const allowed = [
        "/dashboard",
        "/shoot/new",
        "/shoots",
        "/projects",
      ];
      const allowedPrefixes = [
        "/projects/",
      ];
      const ok = allowed.includes(pathname) || allowedPrefixes.some((p) => pathname.startsWith(p));
      if (!ok) {
        router.replace("/dashboard");
      }
    }
  }, [pathname, router]);
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1 flex flex-col md:ml-[var(--sidebar-width-icon)] group-data-[sidebar-state=expanded]/sidebar-wrapper:md:ml-[var(--sidebar-width)] transition-all duration-300 ease-in-out">
          <AppHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

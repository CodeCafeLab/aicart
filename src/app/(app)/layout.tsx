import AppSidebar from "@/components/app-sidebar";
import AppHeader from "@/components/app-header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

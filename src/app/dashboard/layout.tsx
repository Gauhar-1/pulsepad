'use client';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { PanelLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from '@/lib/definitions';
import { cn } from '@/lib/utils';

// Mock user hook
const useMockUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('mockUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  return { user, loading };
};


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useMockUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  const isAdminReportPage = user?.role === 'admin' && pathname === '/dashboard/reports';


  if (loading || !user) {
    // You can show a loading spinner here
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (isAdminReportPage) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen lg:flex">
        <AppSidebar user={user} />
        <div className="flex-1">
          <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <AppSidebar user={user} />
              </SheetContent>
            </Sheet>
          </header>
          <SidebarInset>{children}</SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}

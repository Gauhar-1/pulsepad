'use client';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';
import { LogOut } from 'lucide-react';

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
  
  const handleSignOut = () => {
    sessionStorage.removeItem('mockUser');
    router.push('/login');
  };
  
  const isAdminReportPage = user?.role === 'admin' && pathname === '/dashboard/reports';


  if (loading || !user) {
    // You can show a loading spinner here
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (isAdminReportPage) {
    return <>{children}</>
  }

  return (
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] items-center justify-between border-b bg-background px-4">
            <Logo />
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
            </Button>
        </header>
        <main className="flex-1">{children}</main>
      </div>
  );
}

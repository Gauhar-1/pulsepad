'use client';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from '@/lib/definitions';
import { Logo } from '@/components/logo';
import { LogOut } from 'lucide-react';
import Link from 'next/link';

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
  
  if (loading || !user) {
    // You can show a loading spinner here
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  return (
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] items-center justify-between border-b bg-background px-4">
            <Logo />
            <div className="flex items-center gap-4">
              {user?.role === 'admin' && (
                <Button asChild variant="ghost">
                  <Link href="/admin/leaderboard">Admin Leaderboard</Link>
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
              </Button>
            </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
  );
}

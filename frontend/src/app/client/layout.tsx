
'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Logo } from '@/components/logo';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { QueryProvider } from '@/components/providers/query-provider';
import { useAuth } from '@/context/auth-context';
import { rolePaths } from '@/constants/roles';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role !== 'client') {
      router.replace(rolePaths[user.role]);
    }
  }, [user, loading, router]);

  const handleSignOut = () => {
    logout();
    router.replace('/login');
  };

  if (loading || !user || user.role !== 'client') {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  const displayName = user.name ?? user.email ?? 'Client';
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <QueryProvider>
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Logo />
          </nav>
          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
              <div className='ml-auto flex-1 sm:flex-initial' />
              <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatarUrl ?? user.picture} />
                  <AvatarFallback>
                      {avatarInitial}
                  </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium">{displayName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                  </p>
                  </div>
              </div>
            <Button variant="outline" size="icon" onClick={handleSignOut} className="shrink-0">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {children}
        </main>
      </div>
    </QueryProvider>
  );
}

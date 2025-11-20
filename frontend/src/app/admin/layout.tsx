
'use client';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Logo } from '@/components/logo';
import { LogOut, FolderKanban, Users, UserPlus, Bot, History, BookOpen, CheckCheck, BarChart } from 'lucide-react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { QueryProvider } from '@/components/providers/query-provider';
import { useAuth } from '@/context/auth-context';
import { rolePaths } from '@/constants/roles';

const adminNavItems = [
  { href: '/admin/projects', icon: FolderKanban, label: 'Projects' },
  { href: '/admin/employees', icon: Users, label: 'Employees' },
  { href: '/admin/candidates', icon: UserPlus, label: 'Candidates' },
  { href: '/admin/training', icon: BookOpen, label: 'Training' },
  { href: '/admin/assessments', icon: CheckCheck, label: 'Assessments' },
  { href: '/admin/performance', icon: BarChart, label: 'Performance' },
  { href: '/admin/automation', icon: Bot, label: 'Automation' },
  { href: '/admin/audit-logs', icon: History, label: 'Audit Logs' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.replace(rolePaths[user.role]);
    }
  }, [user, loading, router]);

  const handleSignOut = () => {
    logout();
    router.replace('/login');
  };

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  const displayName = user.name ?? user.email ?? 'Admin';
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <QueryProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-3 p-2">
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
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="shrink-0"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-[57px] items-center justify-between border-b bg-background px-4 md:hidden">
            <Logo />
            <SidebarTrigger />
          </header>
          <main className="flex-1">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </QueryProvider>
  );
}

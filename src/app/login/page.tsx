'use client';
import { Shield, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { User as UserType } from '@/lib/definitions';

const mockUsers: Record<string, UserType> = {
    employee: { id: 'user-employee', name: 'John Doe', email: 'john.doe@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=employee', role: 'employee' },
    admin: { id: 'user-admin', name: 'Jane Smith', email: 'jane.smith@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=admin', role: 'admin' },
    client: { id: 'user-client', name: 'Peter Jones', email: 'peter.jones@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=client', role: 'client' },
    applicant: { id: 'user-applicant', name: 'Mary Brown', email: 'mary.brown@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=applicant', role: 'applicant' },
}

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // If an admin user is already stored, redirect to admin leaderboard
    const storedUser = sessionStorage.getItem('mockUser');
    if (storedUser) {
        const user: UserType = JSON.parse(storedUser);
        if (user.role === 'admin') {
            router.push('/admin/leaderboard');
        } else {
            router.push('/dashboard');
        }
    }
  }, [router]);

  const handleSignIn = () => {
    const user = mockUsers['admin'];
    sessionStorage.setItem('mockUser', JSON.stringify(user));
    router.push('/admin/leaderboard');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Admin Portal</CardTitle>
          <CardDescription>Please sign in to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-md border-2 border-primary bg-popover p-4">
              <Shield className="mb-3 h-8 w-8 text-primary" />
              <span className="font-medium">Administrator</span>
          </div>
          <Button className="mt-6 w-full" onClick={handleSignIn}>
            Sign In as Admin <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        PulsePad © {new Date().getFullYear()}
      </p>
    </div>
  );
}

'use client';
import { Shield, User, Briefcase, UserCheck, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User as UserType } from '@/lib/definitions';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const mockUsers: Record<string, UserType> = {
    employee: { id: 'user-employee-1', name: 'Alex Doe', email: 'alex.doe@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=employee1', role: 'employee' },
    admin: { id: 'user-admin', name: 'Jane Smith', email: 'jane.smith@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=admin', role: 'admin' },
    client: { id: 'user-client', name: 'Peter Jones', email: 'peter.jones@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=client', role: 'client' },
    applicant: { id: 'user-applicant', name: 'Mary Brown', email: 'mary.brown@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=applicant', role: 'applicant' },
}

const roles = [
    { id: 'employee', name: 'Employee', icon: User },
    { id: 'client', name: 'Client', icon: Briefcase },
    { id: 'applicant', name: 'Applicant', icon: UserCheck },
    { id: 'admin', name: 'Admin', icon: Shield },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('employee');

  useEffect(() => {
    // If a user is already stored, redirect them
    const storedUser = sessionStorage.getItem('mockUser');
    if (storedUser) {
        const user: UserType = JSON.parse(storedUser);
        if (user.role === 'admin') {
            router.push('/admin/projects');
        } else if (user.role === 'client') {
            router.push('/client');
        } else {
            router.push('/dashboard');
        }
    }
  }, [router]);

  const handleSignIn = () => {
    const user = mockUsers[selectedRole as keyof typeof mockUsers];
    if (user) {
        sessionStorage.setItem('mockUser', JSON.stringify(user));
        if (user.role === 'admin') {
            router.push('/admin/projects');
        } else if (user.role === 'client') {
            router.push('/client');
        } else {
            router.push('/dashboard');
        }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome to PulsePad</CardTitle>
          <CardDescription>Select your role to sign in.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedRole} 
            onValueChange={setSelectedRole} 
            className="grid grid-cols-2 gap-4"
          >
            {roles.map((role) => (
                 <div key={role.id}>
                    <RadioGroupItem value={role.id} id={role.id} className="peer sr-only" />
                    <Label
                      htmlFor={role.id}
                      className={cn(
                          "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                          "peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      )}
                    >
                        <role.icon className="mb-3 h-6 w-6" />
                        {role.name}
                    </Label>
                </div>
            ))}
          </RadioGroup>
          <Button className="mt-6 w-full" onClick={handleSignIn}>
            Sign In as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        PulsePad © {new Date().getFullYear()}
      </p>
    </div>
  );
}

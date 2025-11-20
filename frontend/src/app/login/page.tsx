'use client';

import { Shield, User, Briefcase, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuth } from '@/context/auth-context';
import { rolePaths, type Role } from '@/constants/roles';
import { useToast } from '@/hooks/use-toast';
import { getApiUrl } from '@/lib/api';

const roles = [
  { id: 'employee', name: 'Employee', icon: User },
  { id: 'client', name: 'Client', icon: Briefcase },
  { id: 'admin', name: 'Admin', icon: Shield },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const [selectedRole, setSelectedRole] = useState<Role>('employee');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, login, loading } = useAuth();
  const { toast } = useToast();

  const destination = useMemo(() => {
    if (redirectTo) return redirectTo;
    if (user) return rolePaths[user.role];
    return rolePaths[selectedRole];
  }, [redirectTo, selectedRole, user]);

  useEffect(() => {
    if (!loading && user) {
      router.replace(rolePaths[user.role]);
    }
  }, [user, loading, router]);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast({
        title: 'Google Sign-In Failed',
        description: 'No credential received. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(getApiUrl('/auth/google'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
          role: selectedRole,
        }),
      });

      if (!res.ok) {
        throw new Error('Unable to sign in with Google.');
      }

      const data = await res.json();
      login(
        {
          ...data.user,
          avatarUrl: data.user.avatarUrl ?? data.user.picture,
        },
        data.token,
      );

      router.replace(destination);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Sign-In Failed',
        description: error instanceof Error ? error.message : 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    toast({
      title: 'Google Sign-In Failed',
      description: 'Please try again later.',
      variant: 'destructive',
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome to PulsePad</CardTitle>
          <CardDescription>Select your role and authenticate with Google.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedRole}
            onValueChange={(value) => setSelectedRole(value as Role)}
            className="grid grid-cols-3 gap-4"
          >
            {roles.map((role) => (
              <div key={role.id}>
                <RadioGroupItem value={role.id} id={role.id} className="peer sr-only" />
                <Label
                  htmlFor={role.id}
                  className={cn(
                    'flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground',
                    'peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary',
                  )}
                >
                  <role.icon className="mb-3 h-6 w-6" />
                  {role.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <div className="mt-6 flex items-center justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              text="continue_with"
              shape="pill"
              context="signup"
            />
          </div>
          {isSubmitting && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Completing sign-in&hellip;
            </p>
          )}
        </CardContent>
      </Card>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        PulsePad © {new Date().getFullYear()}
      </p>
    </div>
  );
}

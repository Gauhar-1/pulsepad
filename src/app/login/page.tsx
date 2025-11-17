'use client';
import { Shield, User, Briefcase, UserCheck, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useFirebaseApp, useFirestore, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const roles = [
  { id: 'employee', name: 'Employee', icon: User },
  { id: 'admin', name: 'Admin', icon: Shield },
  { id: 'client', name: 'Client', icon: Briefcase },
  { id: 'applicant', name: 'Applicant', icon: UserCheck },
];

export default function LoginPage() {
  const app = useFirebaseApp();
  const firestore = useFirestore();
  const { user, loading } = useUser();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('employee');

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    if (!app || !firestore) return;
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: selectedRole, // Set role on first sign-in
          });
        }
        // If user exists, their role is already set, we don't update it here.
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome to PulsePad</CardTitle>
          <CardDescription>Please select your role and sign in.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="employee" className="grid grid-cols-2 gap-4" onValueChange={setSelectedRole}>
            {roles.map((role) => (
              <div key={role.id}>
                <RadioGroupItem value={role.id} id={role.id} className="peer sr-only" />
                <Label
                  htmlFor={role.id}
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <role.icon className="mb-3 h-6 w-6" />
                  {role.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <Button className="mt-6 w-full" onClick={handleSignIn}>
            Sign In with Google <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        PulsePad © {new Date().getFullYear()}
      </p>
    </div>
  );
}

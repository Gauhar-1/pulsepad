import Link from 'next/link';
import { Shield, User, Briefcase, UserCheck, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const roles = [
  { id: 'employee', name: 'Employee', icon: User },
  { id: 'admin', name: 'Admin', icon: Shield },
  { id: 'client', name: 'Client', icon: Briefcase },
  { id: 'applicant', name: 'Applicant', icon: UserCheck },
];

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription>Please select your role to sign in.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="employee" className="grid grid-cols-2 gap-4">
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
          <Link href="/dashboard" className="mt-6 block">
            <Button className="w-full" type="submit">
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        PulsePad © {new Date().getFullYear()}
      </p>
    </div>
  );
}

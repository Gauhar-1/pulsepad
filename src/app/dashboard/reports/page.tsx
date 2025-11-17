'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  FileText,
  ListChecks,
  TrendingUp,
} from 'lucide-react';
import type { User as UserType, Update } from '@/lib/definitions';
import { useEffect, useState } from 'react';
import {
  getTodaysUpdates,
} from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';

const EmployeeReport = () => {
  const [updates, setUpdates] = useState<Update[]>([]);

  useEffect(() => {
    async function fetchData() {
      const todaysUpdates = await getTodaysUpdates();
      setUpdates(todaysUpdates);
    }
    fetchData();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp /> Your Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <p className="font-medium">Updates Submitted Today</p>
            <p className="text-2xl font-bold">{updates.length}</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <p className="font-medium">Tasks Completed This Week</p>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <p className="font-medium">Active Projects</p>
            <p className="text-2xl font-bold">3</p>
          </div>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks /> Recent Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your recent daily updates will be listed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};


export default function ReportsPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('mockUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.role === 'admin') {
        router.replace('/admin/leaderboard');
      } else if (parsedUser.role === 'client') {
        router.replace('/client');
      }
    } else {
        router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const renderReport = () => {
    if (loading || !user || user.role === 'admin' || user.role === 'client') {
      return (
        <div className="flex justify-center items-center h-64">
            <p>Loading reports...</p>
        </div>
      )
    }
   
    switch (user.role) {
      case 'employee':
        return <EmployeeReport />;
      default:
        return (
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertTitle>No Report Available</AlertTitle>
            <AlertDescription>
              Reports are not available for your role at this time.
            </AlertDescription>
          </Alert>
        );
    }
  };
  
  const getPageTitle = () => {
    if (!user) return 'Reports';
    switch (user.role) {
        case 'employee':
            return 'My Reports';
        default:
            return 'Reports'
    }
  }


  if (user?.role === 'admin' || user?.role === 'client') {
      return (
         <div className="flex justify-center items-center h-screen">
            <p>Redirecting...</p>
        </div>
      )
  }
  
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {getPageTitle()}
        </h1>
      </div>
      {renderReport()}
    </main>
  );
}

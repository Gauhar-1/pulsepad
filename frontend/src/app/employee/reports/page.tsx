
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
import type { Update } from '@/lib/definitions';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const fetchTodaysUpdates = async (): Promise<Update[]> => {
    const res = await apiFetch('/updates/today');
    if (!res.ok) throw new Error('Failed to fetch todays updates');
    return res.json();
}

const EmployeeReportSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-3">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp /> Your Performance
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </CardContent>
        </Card>
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ListChecks /> Recent Updates
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
    </div>
);


const EmployeeReport = () => {
  const { data: updates, isLoading } = useQuery<Update[]>({
    queryKey: ['todaysUpdates'],
    queryFn: fetchTodaysUpdates,
  });

  if (isLoading) return <EmployeeReportSkeleton />;

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
            <p className="text-2xl font-bold">{updates?.length || 0}</p>
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
          <CardDescription>
            Your recent daily updates will be listed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {updates && updates.length > 0 ? (
                <ul className="space-y-4">
                    {updates.map(update => (
                        <li key={update.id} className="p-3 bg-muted/50 rounded-lg">
                            <p className="font-medium">{update.content}</p>
                            <p className="text-xs text-muted-foreground">Project ID: {update.projectId}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground">No updates submitted today.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
};


export default function ReportsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role === 'admin') {
      router.replace('/admin/projects');
    } else if (user.role === 'client') {
      router.replace('/client');
    }
  }, [user, loading, router]);

  const renderReport = () => {
    if (loading || !user || user.role !== 'employee') {
      return (
        <div className="flex justify-center items-center h-64">
            <p>Loading reports...</p>
        </div>
      )
    }
   
    return <EmployeeReport />;
  };
  
  const getPageTitle = () => {
    if (!user) return 'Reports';
    return user.role === 'employee' ? 'My Reports' : 'Reports';
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

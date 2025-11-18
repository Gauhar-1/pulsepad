
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
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

const fetchTodaysUpdates = async (): Promise<Update[]> => {
    const res = await fetch('/api/updates/today');
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
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('mockUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.role === 'admin') {
        router.replace('/admin/projects');
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

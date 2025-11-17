'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Shield,
  User,
  Briefcase,
  Trophy,
  Filter,
  CheckCircle,
  Clock,
  ListChecks,
  TrendingUp,
  Star,
  Users,
  BarChart,
  ArrowLeft,
  Search,
  Download,
  Puzzle,
  Box,
  Droplets,
  LogOut,
} from 'lucide-react';
import type { User as UserType, Project, Update } from '@/lib/definitions';
import { useEffect, useState } from 'react';
import {
  getAllProjects,
  getAllUpdates,
  getTodaysUpdates,
  getUsers,
} from '@/lib/api';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

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

const ClientReport = () => {
  const milestones = [
    { id: 1, name: 'Project Kick-off', date: '2024-07-01', status: 'completed' },
    {
      id: 2,
      name: 'Design Phase Complete',
      date: '2024-07-15',
      status: 'completed',
    },
    {
      id: 3,
      name: 'Development Sprint 1',
      date: '2024-07-30',
      status: 'in-progress',
    },
    { id: 4, name: 'User Testing', date: '2024-08-15', status: 'upcoming' },
    { id: 5, name: 'Project Launch', date: '2024-09-01', status: 'upcoming' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock /> Project Timeline & Milestones
        </CardTitle>
        <CardDescription>
          An overview of your project's progress and key dates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6">
          <div className="absolute left-[30px] h-full w-0.5 bg-border -translate-x-1/2"></div>
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="mb-8 flex items-center gap-6">
              <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background">
                {milestone.status === 'completed' ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <Clock
                    className={`h-6 w-6 ${
                      milestone.status === 'in-progress'
                        ? 'text-blue-500 animate-spin'
                        : 'text-muted-foreground'
                    }`}
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{milestone.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(milestone.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
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
      }
    } else {
        router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const renderReport = () => {
    if (loading || user?.role === 'admin') {
      return (
        <div className="flex justify-center items-center h-64">
            <p>Loading reports...</p>
        </div>
      )
    }
    if (!user) {
         return (
             <div className="flex justify-center items-center h-64">
                <Alert className="max-w-md">
                    <FileText className="h-4 w-4" />
                    <AlertTitle>Not Logged In</AlertTitle>
                    <AlertDescription>
                    Please log in to view reports.
                    </AlertDescription>
                </Alert>
             </div>
         )
    }
    switch (user.role) {
      case 'employee':
        if (pathname === '/dashboard/reports') {
            return <EmployeeReport />;
        }
        // Employee dashboard is on a different page
        return null; 
      case 'client':
        return <ClientReport />;
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
        case 'client':
            return 'Project Overview';
        case 'employee':
            return 'My Reports';
        default:
            return 'Reports'
    }
  }


  if (user?.role === 'admin') {
      // Admin is redirected, so we can just show a loading or empty state here
      return (
         <div className="flex justify-center items-center h-screen">
            <p>Redirecting to admin leaderboard...</p>
        </div>
      )
  }

  // For clients, this page acts as their main dashboard.
  // For employees, it's just one of the tabs.
  if (user?.role === 'employee' && pathname !== '/dashboard/reports') {
      return null;
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

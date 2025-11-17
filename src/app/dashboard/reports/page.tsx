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
} from 'lucide-react';
import type { User as UserType, Project, Update } from '@/lib/definitions';
import { useEffect, useState } from 'react';
import { getActiveProjects, getTodaysUpdates } from '@/lib/api';

const AdminReport = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [statusFilter, setStatusFilter] = useState('active');

  useEffect(() => {
    async function fetchData() {
      const allProjects = await getActiveProjects(); // Mock API returns more than just active
      const allProjectsWithRandomStatus = allProjects.map((p, i) => ({
        ...p,
        // assign more statuses for filtering demo
        status: (['active', 'on-hold', 'completed'] as const)[i % 3], 
      }));
      setProjects(allProjectsWithRandomStatus);
      setFilteredProjects(allProjectsWithRandomStatus.filter(p => p.status === 'active'));
    }
    fetchData();
  }, []);

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    if (value === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((p) => p.status === value));
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Briefcase /> Project Analysis
              </CardTitle>
              <CardDescription>
                View and filter project statuses.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {project.client}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        project.status === 'active'
                          ? 'default'
                          : project.status === 'completed'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {project.status.charAt(0).toUpperCase() +
                        project.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy /> Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Employee performance leaderboard will be displayed here.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User /> Employee Scorecards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Drill-down employee scorecards will be available here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

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
          <CardTitle className="flex items-center gap-2"><User /> Your Performance</CardTitle>
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
          <CardTitle className="flex items-center gap-2"><ListChecks /> Recent Updates</CardTitle>
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
    { id: 2, name: 'Design Phase Complete', date: '2024-07-15', status: 'completed' },
    { id: 3, name: 'Development Sprint 1', date: '2024-07-30', status: 'in-progress' },
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
          {/* Timeline line */}
          <div className="absolute left-[30px] h-full w-0.5 bg-border -translate-x-1/2"></div>
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="mb-8 flex items-center gap-6">
              <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background">
                 {milestone.status === 'completed' ? (
                   <CheckCircle className="h-8 w-8 text-green-500" />
                 ) : (
                   <Clock className={`h-6 w-6 ${milestone.status === 'in-progress' ? 'text-blue-500 animate-spin' : 'text-muted-foreground'}`} />
                 )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{milestone.name}</p>
                <p className="text-sm text-muted-foreground">{new Date(milestone.date).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</p>
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

  useEffect(() => {
    const storedUser = sessionStorage.getItem('mockUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const renderReport = () => {
    if (!user) {
      return null;
    }
    switch (user.role) {
      case 'admin':
        return <AdminReport />;
      case 'employee':
        return <EmployeeReport />;
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

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Reports
        </h1>
      </div>
      {renderReport()}
    </main>
  );
}


'use client';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import { TrendingUp, ListChecks, Activity, Users, Clock, CheckCircle, BarChartHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ProjectSheetItem, Update, Employee } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

const fetchProjects = async (): Promise<ProjectSheetItem[]> => {
    const res = await fetch('/api/admin/projects');
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
}
const fetchUpdates = async (): Promise<Update[]> => {
    const res = await fetch('/api/admin/updates');
    if (!res.ok) throw new Error('Failed to fetch updates');
    return res.json();
}
const fetchEmployees = async (): Promise<Employee[]> => {
    const res = await fetch('/api/admin/employees');
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
}

interface CombinedData {
    projects: ProjectSheetItem[];
    updates: Update[];
    employees: Employee[];
}

const StatCard = ({ title, value, icon: Icon, isLoading }: { title: string, value: string | number, icon: React.ElementType, isLoading: boolean }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            {isLoading ? (
                 <Skeleton className="h-8 w-1/2" />
            ) : (
                <div className="text-2xl font-bold">{value}</div>
            )}
        </CardContent>
    </Card>
);

const chartConfig = {
  count: {
    label: 'Projects',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export default function AdminPerformancePage() {

    const { data, isLoading } = useQuery<CombinedData>({
        queryKey: ['admin-performance'],
        queryFn: async () => {
            const [projects, updates, employees] = await Promise.all([
                fetchProjects(),
                fetchUpdates(),
                fetchEmployees()
            ]);
            return { projects, updates, employees };
        }
    });

    const { projects = [], updates = [], employees = [] } = data || {};

    const activeProjects = projects.filter(p => p.status === 'Active').length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const overdueProjects = projects.filter(p => new Date(p.endDate) < new Date() && p.status !== 'Completed').length;
    const activeEmployees = employees.filter(e => e.active).length;

    const projectStatusData = projects.reduce((acc, project) => {
        const status = project.status;
        const existing = acc.find(item => item.status === status);
        if (existing) {
            existing.count++;
        } else {
            acc.push({ status, count: 1 });
        }
        return acc;
    }, [] as { status: string, count: number }[]);

     const recentUpdates = updates
        .slice(0, 5)
        .map(update => {
            const author = employees.find(e => `user-${e.id.split('-')[1]}` === update.userId);
            const project = projects.find(p => p.id === update.projectId);
            return {
                ...update,
                authorName: author?.name || 'N/A',
                authorAvatar: `https://i.pravatar.cc/150?u=${author?.id}`,
                projectName: project?.projectTitle || 'N/A',
            };
        });

    return (
        <div className="admin-dashboard-gradient min-h-screen p-4 sm:p-8">
            <header className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-primary"/>
                    <div>
                        <h1 className="text-2xl font-bold">Performance Dashboard</h1>
                        <p className="text-muted-foreground">An overview of project and team performance.</p>
                    </div>
                </div>
            </header>

            <main className="grid gap-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Active Projects" value={activeProjects} icon={Activity} isLoading={isLoading} />
                    <StatCard title="Completed This Month" value={completedProjects} icon={CheckCircle} isLoading={isLoading} />
                    <StatCard title="Overdue Projects" value={overdueProjects} icon={Clock} isLoading={isLoading} />
                    <StatCard title="Active Employees" value={activeEmployees} icon={Users} isLoading={isLoading} />
                </div>
                
                <div className="grid gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BarChartHorizontal /> Project Status Distribution</CardTitle>
                            <CardDescription>A look at the current status of all projects.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           {isLoading ? <Skeleton className="h-[300px] w-full" /> : (
                               <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={projectStatusData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis dataKey="status" type="category" width={150} tick={{ fontSize: 12 }} />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                           )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ListChecks /> Recent Activity</CardTitle>
                            <CardDescription>Latest updates submitted by the team.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-4">
                                    {Array.from({length: 5}).map((_, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="space-y-1">
                                                <Skeleton className="h-4 w-48" />
                                                <Skeleton className="h-3 w-32" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <ul className="space-y-4">
                                {recentUpdates.map(update => (
                                    <li key={update.id} className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={update.authorAvatar} />
                                            <AvatarFallback>{update.authorName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium leading-none">{update.content}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {update.authorName} on {update.projectName} - {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </main>
        </div>
    );
}


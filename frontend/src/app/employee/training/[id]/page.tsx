
'use client';
import { useParams, notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle, Clock, ArrowLeft, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { TrainingTask } from '@/lib/definitions';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { apiFetch } from '@/lib/api';

const fetchTrainingTask = async (id: string): Promise<TrainingTask> => {
    const res = await apiFetch(`/employee/training?id=${id}`);
    if (!res.ok) {
        throw new Error('Failed to fetch training task');
    }
    return res.json();
};

const TrainingDetailSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                             <Skeleton className="h-6 w-24 mb-2" />
                             <Skeleton className="h-8 w-64" />
                        </div>
                        <Skeleton className="h-10 w-32" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-6" />
                    <div className="mb-2 flex justify-between items-center">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-12" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Log Your Progress</CardTitle>
                    <CardDescription>Submit a quick update on what you've learned or completed.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="progress-update">Update Details</Label>
                            <Textarea id="progress-update" placeholder="e.g., 'Completed Chapter 3 on Server Actions and deployed a test case.'" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="ml-auto">Submit Progress</Button>
                </CardFooter>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare /> Progress Log
                    </CardTitle>
                    <CardDescription>A history of your updates for this task.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="relative pl-6 space-y-8">
                        <div className="absolute left-[22px] top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
                        {Array.from({length: 2}).map((_, i) => (
                             <div key={i} className="flex items-start gap-4">
                                <Skeleton className="z-10 h-10 w-10 rounded-full" />
                                <div className="flex-1 pt-1 space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-3 w-1/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
);


export default function TrainingDetailPage() {
    const { id } = useParams();
    
    const { data: task, isLoading, isError } = useQuery<TrainingTask>({
        queryKey: ['trainingTask', id],
        queryFn: () => fetchTrainingTask(id as string),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                 <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/employee/training">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back to Training</span>
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Training Details</h1>
                </div>
                <TrainingDetailSkeleton />
            </main>
        )
    }

    if (isError || !task) {
        return notFound();
    }

    const StatusIcon = task.status === 'completed' ? CheckCircle : task.status === 'in-progress' ? Clock : BookOpen;
    const statusColor = task.status === 'completed' ? 'text-green-500' : task.status === 'in-progress' ? 'text-blue-500' : 'text-muted-foreground';

    const sortedLogs = (task.progressLogs || []).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/employee/training">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back to Training</span>
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Training Details</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge variant="secondary" className="mb-2">{task.category}</Badge>
                                    <CardTitle className="text-2xl">{task.title}</CardTitle>
                                </div>
                                <div className="flex items-center space-x-2 rounded-md bg-secondary text-secondary-foreground p-2">
                                    <StatusIcon className={`h-5 w-5 ${statusColor} ${task.status === 'in-progress' ? 'animate-spin' : ''}`} />
                                    <span className="font-medium">
                                        {task.status === 'completed' && 'Completed'}
                                        {task.status === 'in-progress' && 'In Progress'}
                                        {task.status === 'not-started' && 'Not Started'}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="mb-6 text-base">
                                {task.description}
                            </CardDescription>

                            <div>
                                <div className="mb-2 flex justify-between items-center">
                                    <p className="text-sm font-medium">Your Progress</p>
                                    <p className="text-sm font-bold">{task.progress}%</p>
                                </div>
                                <Progress value={task.progress} className="w-full" />
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Log Your Progress</CardTitle>
                            <CardDescription>Submit a quick update on what you've learned or completed.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="progress-update">Update Details</Label>
                                    <Textarea id="progress-update" placeholder="e.g., 'Completed Chapter 3 on Server Actions and deployed a test case.'" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="ml-auto">Submit Progress</Button>
                        </CardFooter>
                    </Card>
                </div>
                <div>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare /> Progress Log
                            </CardTitle>
                            <CardDescription>A history of your updates for this task.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="relative pl-6">
                                <div className="absolute left-[22px] top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
                                {sortedLogs.length > 0 ? sortedLogs.map((log) => (
                                <div key={log.id} className="mb-8 flex items-start gap-4">
                                    <Avatar className="z-10 h-10 w-10 border-2 border-primary">
                                        {/* In a real app, this would be the logged in user's avatar */}
                                        <AvatarImage src={'https://i.pravatar.cc/150?u=employee1'} />
                                        <AvatarFallback>{'A'}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 -mt-1 pt-1">
                                        <p className="font-medium">{log.notes}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(log.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                )) : (
                                <p className="text-sm text-muted-foreground">No progress logged yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}

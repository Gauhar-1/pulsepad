
'use client';
import { useParams, notFound } from 'next/navigation';
import { mockTrainingTasks } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TrainingDetailPage() {
    const { id } = useParams();
    const task = mockTrainingTasks.find(t => t.id === Number(id));

    if (!task) {
        return notFound();
    }

    const StatusIcon = task.status === 'completed' ? CheckCircle : task.status === 'in-progress' ? Clock : BookOpen;
    const statusColor = task.status === 'completed' ? 'text-green-500' : task.status === 'in-progress' ? 'text-blue-500' : 'text-muted-foreground';

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/training">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back to Training</span>
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Training Details</h1>
            </div>

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
        </main>
    )
}

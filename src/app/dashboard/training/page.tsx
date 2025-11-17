
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, CheckCircle, Clock, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockTrainingTasks } from '@/lib/mock-data';
import Link from 'next/link';

export default function TrainingPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">My Training</h1>
      </div>
      <div className="grid gap-6">
        {mockTrainingTasks.map((task) => (
          <Card key={task.id}>
            <CardHeader className="grid grid-cols-[1fr_auto] items-start gap-4 space-y-0">
              <div className="space-y-1">
                <CardTitle>{task.title}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary">{task.category}</Badge>
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                 <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground p-1 pl-2 pr-2">
                    {task.status === 'completed' && <CheckCircle className="mr-2 h-4 w-4 text-green-500" />}
                    {task.status === 'in-progress' && <Clock className="mr-2 h-4 w-4 text-blue-500 animate-spin" />}
                    {task.status === 'not-started' && <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />}
                    <span className="text-sm font-medium">
                        {task.status === 'completed' && 'Completed'}
                        {task.status === 'in-progress' && 'In Progress'}
                        {task.status === 'not-started' && 'Not Started'}
                    </span>
                </div>
                 <Button asChild variant="outline" size="icon">
                    <Link href={`/dashboard/training/${task.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                    </Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </main>
  );
}

'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const mockTrainingTasks = [
  { id: 1, title: 'Advanced React Hooks', status: 'completed', category: 'Frontend' },
  { id: 2, title: 'Next.js 14 Deep Dive', status: 'in-progress', category: 'Framework' },
  { id: 3, title: 'Introduction to Tailwind CSS', status: 'not-started', category: 'Styling' },
  { id: 4, title: 'Mastering TypeScript', status: 'not-started', category: 'Language' },
  { id: 5, title: 'Server Actions in Next.js', status: 'completed', category: 'Framework' },
];

export default function TrainingPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">My Training</h1>
      </div>
      <div className="grid gap-6">
        {mockTrainingTasks.map((task) => (
          <Card key={task.id}>
            <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
              <div className="space-y-1">
                <CardTitle>{task.title}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary">{task.category}</Badge>
                </CardDescription>
              </div>
              <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
                <Button variant="secondary" className="w-full justify-start">
                    {task.status === 'completed' && <CheckCircle className="mr-2 h-4 w-4 text-green-500" />}
                    {task.status === 'in-progress' && <Clock className="mr-2 h-4 w-4 text-blue-500 animate-spin" />}
                    {task.status === 'not-started' && <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />}
                    {task.status === 'completed' && 'Completed'}
                    {task.status === 'in-progress' && 'In Progress'}
                    {task.status === 'not-started' && 'Start Now'}
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </main>
  );
}

'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle, Clock } from 'lucide-react';

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

export default function ClientPage() {
    return (
      <>
        <div className="flex items-center">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Project Overview
            </h1>
        </div>
        <ClientReport />
      </>
    );
}

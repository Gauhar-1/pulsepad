
'use client';
import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ClipboardCheck } from 'lucide-react';
import { DailyAssessment, AssessmentTemplate } from '@/lib/definitions';
import { motion } from 'framer-motion';
import { isToday, parseISO } from 'date-fns';

const fetchTasks = async (): Promise<{
  assessments: DailyAssessment[];
  templates: AssessmentTemplate[];
}> => {
  const res = await fetch('/api/employee/assessments');
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
};

type TaskItem = {
  id: string;
  text: string;
  isCompleted: boolean;
};

const TaskSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-6 w-6 rounded" />
      <Skeleton className="h-6 flex-1" />
    </div>
    <div className="flex items-center space-x-4">
      <Skeleton className="h-6 w-6 rounded" />
      <Skeleton className="h-6 flex-1" />
    </div>
    <div className="flex items-center space-x-4">
      <Skeleton className="h-6 w-6 rounded" />
      <Skeleton className="h-6 flex-1" />
    </div>
     <div className="flex items-center space-x-4">
      <Skeleton className="h-6 w-6 rounded" />
      <Skeleton className="h-6 flex-1" />
    </div>
     <div className="flex items-center space-x-4">
      <Skeleton className="h-6 w-6 rounded" />
      <Skeleton className="h-6 flex-1" />
    </div>
  </div>
);

export default function EmployeeTasksPage() {
  const queryClient = useQueryClient();

  // In a real app, get this from auth context
  const currentUserId = 'emp-001';

  const { data, isLoading } = useQuery({
    queryKey: ['employeeTasks'],
    queryFn: fetchTasks,
  });

  const { assessments = [], templates = [] } = data || {};
  
  const todaysAssessment = useMemo(() => {
    // Find an assessment for the current user that is for today
    return assessments.find((a) => a.employeeId === currentUserId && isToday(parseISO(a.date)));
  }, [assessments, currentUserId]);

  const template = useMemo(() => {
     if (!todaysAssessment) return undefined;
     return templates.find((t) => t.id === todaysAssessment.templateId);
  }, [templates, todaysAssessment]);

  const initialTasks = useMemo(() => {
    if (!template || !todaysAssessment) return [];
    return template.checklist.map((item) => ({
      id: item.id,
      text: item.text,
      isCompleted:
        todaysAssessment.responses.find((r) => r.checklistItemId === item.id)
          ?.answer || false,
    }));
  }, [template, todaysAssessment]);

  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const updateMutation = useMutation({
    mutationFn: async (updatedAssessment: DailyAssessment) => {
      // In a real app, this would be a POST to an API
      // For optimistic update, we can just update the cache
      return updatedAssessment;
    },
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['employeeTasks'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          assessments: oldData.assessments.map((a: DailyAssessment) =>
            a.id === updatedData.id ? updatedData : a
          ),
        };
      });
    },
  });

  const handleTaskToggle = (taskId: string) => {
    const newTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    );
    setTasks(newTasks);

    if (todaysAssessment) {
      const updatedResponses = newTasks.map((task) => ({
        checklistItemId: task.id,
        answer: task.isCompleted,
      }));

      const updatedAssessment: DailyAssessment = {
        ...todaysAssessment,
        status: 'SUBMITTED',
        responses: updatedResponses,
      };
      updateMutation.mutate(updatedAssessment);
    }
  };

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Daily Tasks
        </h1>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck /> Today's Checklist
            </CardTitle>
            <CardDescription>
              Complete these tasks to log your daily progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <TaskSkeleton />
            ) : tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center space-x-4 rounded-md border p-4"
                  >
                    <Checkbox
                      id={task.id}
                      checked={task.isCompleted}
                      onCheckedChange={() => handleTaskToggle(task.id)}
                    />
                    <label
                      htmlFor={task.id}
                      className={`flex-1 text-sm font-medium leading-none ${
                        task.isCompleted
                          ? 'text-muted-foreground line-through'
                          : ''
                      }`}
                    >
                      {task.text}
                    </label>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Alert>
                <ClipboardCheck className="h-4 w-4" />
                <AlertTitle>No Tasks Assigned</AlertTitle>
                <AlertDescription>
                  There are no tasks assigned to you for today. Great job!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          {tasks.length > 0 && (
            <CardFooter>
                <div className="w-full">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>
                    {completedCount} / {tasks.length}
                    </span>
                </div>
                <Progress value={progress} />
                </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </main>
  );
}

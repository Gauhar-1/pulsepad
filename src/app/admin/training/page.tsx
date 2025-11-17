
'use client';
import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen } from 'lucide-react';
import { mockEmployeeData, mockTrainingTasks } from '@/lib/mock-data';

export default function AdminTrainingPage() {
  const trainingAssignments = useMemo(() => {
    const assignments: any[] = [];
    mockTrainingTasks.forEach(task => {
      task.assignedTo.forEach(employeeId => {
        const employee = mockEmployeeData.find(e => e.id === employeeId);
        if (employee) {
          assignments.push({
            employee: {
              id: employee.id,
              name: employee.name,
              avatarUrl: `https://i.pravatar.cc/150?u=${employee.id}`
            },
            task: {
              title: task.title,
              category: task.category,
              status: task.status
            }
          });
        }
      });
    });
    return assignments;
  }, []);

  return (
    <div className="admin-dashboard-gradient min-h-screen p-4 sm:p-8">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary"/>
            <div>
                <h1 className="text-2xl font-bold">Training Overview</h1>
                <p className="text-muted-foreground">Monitor employee training progress.</p>
            </div>
        </div>
      </header>

      <main>
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Active Training Assignments</CardTitle>
            <CardDescription>Showing all employees currently assigned to a training module.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainingAssignments.map((assignment, index) => (
                <Card key={`${assignment.employee.id}-${index}`} className="flex flex-col">
                  <CardHeader className="flex-row items-center gap-4">
                     <Avatar className="h-12 w-12">
                        <AvatarImage src={assignment.employee.avatarUrl} />
                        <AvatarFallback>{assignment.employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{assignment.employee.name}</h3>
                      <p className="text-sm text-muted-foreground">Is training in</p>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                      <p className="font-medium">{assignment.task.title}</p>
                      <Badge variant="secondary" className="mt-1">{assignment.task.category}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

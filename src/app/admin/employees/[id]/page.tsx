
'use client';

import { useParams, notFound } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { mockEmployeeData, mockProjectData, mockTrainingTasks } from '@/lib/mock-data';
import type { Employee, Update, ProjectSheetItem, TrainingTask } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Mail,
  Briefcase,
  Wrench,
  User,
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { getAllUpdates } from '@/lib/api';

const DetailItem = ({
  icon: Icon,
  label,
  value,
  children,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | number | string[] | null;
  children?: React.ReactNode;
}) => {
  if ((!value || (Array.isArray(value) && value.length === 0)) && !children)
    return null;

  return (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="text-sm">{children || value}</div>
      </div>
    </div>
  );
};

interface UpdateWithProject extends Update {
    projectName: string;
}

interface AssignedTraining extends TrainingTask {
    trainerName: string;
}

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [updates, setUpdates] = useState<UpdateWithProject[]>([]);
  const [projects, setProjects] = useState<ProjectSheetItem[]>([]);
  const [assignedTrainings, setAssignedTrainings] = useState<AssignedTraining[]>([]);

  useEffect(() => {
    const foundEmployee = mockEmployeeData.find((p) => p.id === id);
    if (foundEmployee) {
      setEmployee(foundEmployee);
      setProjects(mockProjectData.filter(p => foundEmployee.projects.includes(p.projectTitle)));

       const trainings = mockTrainingTasks
        .filter(task => task.assignedTo.includes(foundEmployee.id))
        .map(task => {
            const trainer = mockEmployeeData.find(e => e.id === task.trainerId);
            return {
                ...task,
                trainerName: trainer?.name || 'N/A'
            }
        });
       setAssignedTrainings(trainings);
    }

    async function fetchUpdates() {
        const allUpdates = await getAllUpdates();
        const employeeUpdates = allUpdates
            .filter(u => u.userId === `user-${(id as string).split('-')[1]}`)
            .map(u => {
                const project = mockProjectData.find(p => p.id === u.projectId);
                return {
                    ...u,
                    projectName: project?.projectTitle || 'Unknown Project'
                }
            })
            .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setUpdates(employeeUpdates);
    }
    
    if (id) {
        fetchUpdates();
    }

  }, [id]);

  const memoizedProjects = useMemo(() => {
    if (!employee) return [];
    return mockProjectData.filter(p => employee.projects.includes(p.projectTitle));
  }, [employee]);

  if (!employee) {
    if (employee === null) {
      return <div className="p-8">Loading employee details...</div>;
    }
    return notFound();
  }

  return (
    <div className="p-4 sm:p-8">
      <header className="mb-8 flex items-center gap-4">
        <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${employee.id}`} />
            <AvatarFallback className="text-2xl">{employee.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">
            {employee.name}
            </h1>
            <p className="text-lg text-muted-foreground">
            {employee.email}
            </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
           <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar /> Daily Updates
                    </CardTitle>
                    <CardDescription>A log of daily updates submitted by {employee.name}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative pl-6">
                        <div className="absolute left-6 top-0 h-full w-0.5 bg-border"></div>
                        {updates.length > 0 ? updates.map((item, index) => (
                           <div key={index} className="mb-8 flex items-start gap-4">
                                <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-primary">
                                    <MessageSquare className="h-4 w-4 text-primary"/>
                                </div>
                                <div className="flex-1 -mt-1">
                                    <p className="font-medium">{item.content}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        {' - '} 
                                        <span className="font-semibold">{item.projectName}</span>
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-muted-foreground text-sm">No updates submitted yet.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Employee Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <DetailItem icon={User} label="Name" value={employee.name} />
                <DetailItem icon={Mail} label="Email" value={employee.email} />
                <DetailItem icon={employee.active ? CheckCircle : XCircle} label="Status">
                        <Badge
                        variant={
                            employee.active ? 'default' : 'outline'
                        }
                        className={employee.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    >
                        {employee.active ? 'Active' : 'Inactive'}
                    </Badge>
                </DetailItem>
                <DetailItem icon={Wrench} label="Skills">
                    <div className="flex flex-wrap gap-1">
                        {employee.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                    </div>
                </DetailItem>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assigned Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {memoizedProjects.length > 0 ? (
                <ul className="space-y-2">
                    {memoizedProjects.map(project => (
                        <li key={project.id}>
                            <Badge variant="outline">{project.projectTitle}</Badge>
                        </li>
                    ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No projects assigned.</p>
              )}
            </CardContent>
          </Card>
           <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen /> Training Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {assignedTrainings.length > 0 ? (
                    <ul className="space-y-4">
                      {assignedTrainings.map(training => (
                        <li key={training.id} className="text-sm">
                           <p className="font-medium">{training.title}</p>
                           <p className="text-muted-foreground">
                             Trainer: <span className="font-semibold">{training.trainerName}</span>
                           </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No training assigned.</p>
                  )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

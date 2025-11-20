'use client';
import { ProjectCard } from '@/components/employee/project-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FileText, Filter } from 'lucide-react';
import type { ProjectSheetItem, Update } from '@/lib/definitions';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { apiFetch } from '@/lib/api';

const filterOptions = [
  { value: 'all', label: 'All Projects' },
  { value: 'active', label: 'Active' },
  { value: 'high-priority', label: 'High Priority' },
];

const fetchProjects = async (): Promise<ProjectSheetItem[]> => {
    const res = await apiFetch('/projects');
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
}

const fetchTodaysUpdates = async (): Promise<Update[]> => {
    const res = await apiFetch('/updates/today');
    if (!res.ok) throw new Error('Failed to fetch todays updates');
    return res.json();
}

const ProjectCardSkeleton = () => (
    <Card className="flex h-full flex-col">
        <CardHeader>
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-6 w-20 rounded-full" />
        </CardContent>
        <CardFooter className="flex items-center justify-between rounded-b-lg bg-muted/50 p-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-9 w-28" />
        </CardFooter>
    </Card>
);

export default function EmployeeProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const { data: projects = [], isLoading: isLoadingProjects } = useQuery<ProjectSheetItem[]>({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });

  const { data: todaysUpdates = [], isLoading: isLoadingUpdates } = useQuery<Update[]>({
    queryKey: ['todaysUpdates'],
    queryFn: fetchTodaysUpdates
  });

  const filteredProjects = useMemo(() => {
    let filtered = projects;
    if (activeFilter === 'active') {
      filtered = filtered.filter(p => p.status === 'Active');
    } else if (activeFilter === 'high-priority') {
      filtered = filtered.filter(p => p.priority === 'High');
    }

    return filtered.map((project) => {
        const update = todaysUpdates.find((u) => u.projectId === project.id);
        const cardProject = {
          id: project.id,
          name: project.projectTitle,
          client: project.clientName,
          status: project.status.toLowerCase().replace(/\s/g, '-') as any,
          todaysUpdate: update,
        };
        return cardProject;
      });
  }, [projects, todaysUpdates, activeFilter]);
  
  const isLoading = isLoadingProjects || isLoadingUpdates;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">My Projects</h1>
          <p className="text-muted-foreground">
            Here's a look at your projects. Submit your updates for today.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            {filterOptions.map(option => (
                <Button 
                    key={option.value} 
                    variant={activeFilter === option.value ? 'default' : 'outline'}
                    onClick={() => setActiveFilter(option.value)}
                >
                    {option.label}
                </Button>
            ))}
        </div>
      </div>
      {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({length: 4}).map((_, i) => <ProjectCardSkeleton key={i} />)}
          </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <Alert className="max-w-lg">
          <FileText className="h-4 w-4" />
          <AlertTitle>No Projects Found</AlertTitle>
          <AlertDescription>
            No projects match the current filter.
          </AlertDescription>
        </Alert>
      )}
    </main>
  );
}

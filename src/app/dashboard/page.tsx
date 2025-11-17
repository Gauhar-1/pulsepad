'use client';
import { ProjectCard } from '@/components/dashboard/project-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText } from 'lucide-react';
import { useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import type { Project, Update } from '@/lib/definitions';
import { useMemo } from 'react';

export default function DashboardPage() {
  const firestore = useFirestore();
  const { user } = useUser();

  const projectsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'projects'), where('status', '==', 'active'));
  }, [firestore, user]);

  const { data: projects, loading: projectsLoading } = useCollection<Project>(projectsQuery);

  const updatesQuery = useMemo(() => {
    if (!firestore || !user) return null;
    // Simple query for all updates for now. Can be optimized.
    return collection(firestore, 'updates');
  }, [firestore, user]);

  const { data: allUpdates, loading: updatesLoading } = useCollection<Update>(updatesQuery);

  const projectsWithUpdates = useMemo(() => {
    if (!projects || !allUpdates) return [];
    
    const todaysUpdates = allUpdates.filter(u => {
        const updateDate = new Date(u.createdAt);
        const today = new Date();
        return updateDate.getDate() === today.getDate() &&
               updateDate.getMonth() === today.getMonth() &&
               updateDate.getFullYear() === today.getFullYear();
    });

    return projects.map((project) => {
      const update = todaysUpdates.find((u) => u.projectId === project.id);
      return { ...project, todaysUpdate: update };
    });
  }, [projects, allUpdates]);


  if (projectsLoading || updatesLoading) {
    return <div>Loading projects...</div>
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Today's Pulse</h1>
          <p className="text-muted-foreground">
            Here's a look at your active projects. Submit your updates for today.
          </p>
        </div>
      </div>
      {projectsWithUpdates.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projectsWithUpdates.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <Alert className="max-w-lg">
          <FileText className="h-4 w-4" />
          <AlertTitle>No Active Projects</AlertTitle>
          <AlertDescription>
            You don't have any active projects assigned to you at the moment.
          </AlertDescription>
        </Alert>
      )}
    </main>
  );
}

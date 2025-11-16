import { getActiveProjects, getTodaysUpdates } from '@/lib/api';
import { ProjectCard } from '@/components/dashboard/project-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText } from 'lucide-react';

export default async function DashboardPage() {
  const projects = await getActiveProjects();
  const todaysUpdates = await getTodaysUpdates();

  const projectsWithUpdates = projects.map((project) => {
    const update = todaysUpdates.find((u) => u.projectId === project.id);
    return { ...project, todaysUpdate: update };
  });

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

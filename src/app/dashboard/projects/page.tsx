'use client';
import { ProjectCard } from '@/components/dashboard/project-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FileText, Filter } from 'lucide-react';
import type { ProjectSheetItem, Update } from '@/lib/definitions';
import { useEffect, useState, useMemo } from 'react';
import { mockProjectData } from '@/lib/mock-data';
import { getTodaysUpdates } from '@/lib/api';

const filterOptions = [
  { value: 'all', label: 'All Projects' },
  { value: 'active', label: 'Active' },
  { value: 'high-priority', label: 'High Priority' },
];

export default function DashboardProjectsPage() {
  const [projects, setProjects] = useState<ProjectSheetItem[]>([]);
  const [todaysUpdates, setTodaysUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // In a real app, projects would be fetched based on the logged-in user
      const userProjects = mockProjectData;
      const updates = await getTodaysUpdates();
      setProjects(userProjects);
      setTodaysUpdates(updates);
      setLoading(false);
    }
    fetchData();
  }, []);

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
          status: project.status.toLowerCase().replace(' ', '-') as any,
          todaysUpdate: update,
        };
        return cardProject;
      });
  }, [projects, todaysUpdates, activeFilter]);
  

  if (loading) {
    return <div className="p-6">Loading projects...</div>;
  }

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
      {filteredProjects.length > 0 ? (
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

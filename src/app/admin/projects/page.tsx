
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FolderKanban,
  PlusCircle,
  Search,
  MoreVertical,
} from 'lucide-react';
import type { ProjectSheetItem } from '@/lib/definitions';
import { useState, useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CreateProjectSheet } from '@/components/admin/create-project-sheet';
import { ViewProjectDialog } from '@/components/admin/view-project-dialog';

const mockProjectData: ProjectSheetItem[] = [
  {
    id: 'proj-001',
    clientName: 'Stellar Solutions',
    clientType: 'Enterprise',
    projectTitle: 'QuantumLeap CRM',
    projectType: 'Web App',
    tags: ['CRM', 'SaaS'],
    priority: 'High',
    status: 'In Progress',
    estimatedHours: 250,
    startDate: '2024-06-01',
    endDate: '2024-12-31',
    leadAssignee: 'Alex Doe',
  },
  {
    id: 'proj-002',
    clientName: 'Orion Commerce',
    clientType: 'Startup',
    projectTitle: 'Nova E-commerce Platform',
    projectType: 'E-commerce',
    tags: ['React', 'Next.js'],
    priority: 'High',
    status: 'In Progress',
    estimatedHours: 400,
    startDate: '2024-05-15',
    endDate: '2025-01-31',
    leadAssignee: 'Maria Garcia',
  },
  {
    id: 'proj-003',
    clientName: 'Meridian Inc.',
    clientType: 'Corporate',
    projectTitle: 'Project Phoenix',
    projectType: 'Internal Tool',
    tags: ['data-viz', 'reporting'],
    priority: 'Medium',
    status: 'On Hold',
    estimatedHours: 120,
    startDate: '2024-07-01',
    endDate: '2024-10-31',
    leadAssignee: 'Sam Wilson',
  },
];


export default function AdminProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<ProjectSheetItem[]>(mockProjectData);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectSheetItem | null>(null);

  
  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [projects, searchQuery]);

  const handleCreateClick = () => {
    setSelectedProject(null);
    setIsSheetOpen(true);
  }

  const handleEditClick = (project: ProjectSheetItem) => {
    setSelectedProject(project);
    setIsSheetOpen(true);
  };

  const handleViewClick = (project: ProjectSheetItem) => {
    setSelectedProject(project);
    setIsViewDialogOpen(true);
  }

  const handleDeleteClick = (project: ProjectSheetItem) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedProject) {
      setProjects(projects.filter(p => p.id !== selectedProject.id));
      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
    }
  };

  const handleSaveProject = (projectData: Omit<ProjectSheetItem, 'id' | 'tags'> & { tags: string[] }, id?: string) => {
    if (id) {
        // Update existing project
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...projectData, id } : p));
    } else {
        // Add new project
        const projectWithId = { ...projectData, id: `proj-${Date.now()}` };
        setProjects(prev => [projectWithId, ...prev]);
    }
  };


  return (
    <div className="admin-dashboard-gradient min-h-screen p-4 sm:p-8">
       <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderKanban className="h-8 w-8 text-primary"/>
          <div>
            <h1 className="text-2xl font-bold">Project Management</h1>
            <p className="text-muted-foreground">Create and maintain project data.</p>
          </div>
        </div>
        <Button onClick={handleCreateClick}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Project
        </Button>
      </header>

      <main>
        <Card className="rounded-2xl shadow-lg">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>All Projects</CardTitle>
                        <CardDescription>
                            {projects.length} projects found.
                        </CardDescription>
                    </div>
                    <div className="relative w-full max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input 
                        placeholder="Search projects..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Project Title</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Assignee</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProjects.map((project) => (
                                <TableRow key={project.id}>
                                    <TableCell className="font-medium">{project.projectTitle}</TableCell>
                                    <TableCell>{project.clientName}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                project.status === 'In Progress' || project.status === 'Active' ? 'default' :
                                                project.status === 'On Hold' || project.status === 'Stalled' ? 'secondary' :
                                                'outline'
                                            }
                                        >
                                            {project.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{project.priority}</TableCell>
                                    <TableCell>{project.leadAssignee}</TableCell>
                                    <TableCell>{project.startDate}</TableCell>
                                    <TableCell>{project.endDate}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => handleEditClick(project)}>Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleViewClick(project)}>View Details</DropdownMenuItem>
                                                <DropdownMenuItem 
                                                  className="text-destructive"
                                                  onClick={() => handleDeleteClick(project)}
                                                >
                                                  Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      </main>

       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project &quot;{selectedProject?.projectTitle}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CreateProjectSheet 
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSaveProject={handleSaveProject as any}
        project={selectedProject}
      />

      <ViewProjectDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        project={selectedProject}
      />
    </div>
  );
}

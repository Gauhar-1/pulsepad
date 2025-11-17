
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
  Filter,
} from 'lucide-react';
import type { Employee, ProjectSheetItem } from '@/lib/definitions';
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
import { mockProjectData, mockEmployeeData } from '@/lib/mock-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';

const filterOptions = [
    { value: 'all', label: 'All Projects' },
    { value: 'active', label: 'Active' },
    { value: 'high-priority', label: 'High Priority' },
    { value: 'client-meeting-done', label: 'Client Meeting Done' },
    { value: 'req-sent', label: 'Reqs Sent' },
    { value: 'stock', label: 'Stock' },
    { value: 'training', label: 'Training' },
];

export default function AdminProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<ProjectSheetItem[]>(mockProjectData);
  const [employees] = useState<Employee[]>(mockEmployeeData);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectSheetItem | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const router = useRouter();

  
  const filteredProjects = useMemo(() => {
    const searchFiltered = projects.filter(p => 
      p.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (activeTab === 'all') {
      return searchFiltered;
    }
    if (activeTab === 'active') {
      return searchFiltered.filter(p => p.status === 'Active');
    }
    if (activeTab === 'high-priority') {
      return searchFiltered.filter(p => p.priority === 'High');
    }
    if (activeTab === 'client-meeting-done') {
      return searchFiltered.filter(p => p.status === 'Client Meeting Done');
    }
    if (activeTab === 'req-sent') {
      return searchFiltered.filter(p => p.status === 'Requirement Sent');
    }
    if (activeTab === 'stock') {
      return searchFiltered.filter(p => p.tags.map(t => t.toLowerCase()).includes('stock'));
    }
    if (activeTab === 'training') {
        return searchFiltered.filter(p => p.projectType === 'Training');
    }
    return searchFiltered;

  }, [projects, searchQuery, activeTab]);

  const activeLeads = useMemo(() => {
    return employees.filter(e => e.active && e.type === 'Lead');
  }, [employees]);

  const activeVAs = useMemo(() => {
    return employees.filter(e => e.active && e.type === 'VA');
  }, [employees]);

  const activeFreelancers = useMemo(() => {
    return employees.filter(e => e.active && e.type === 'Freelancer');
  }, [employees]);
  
  const activeCoders = useMemo(() => {
    return employees.filter(e => e.active && e.type === 'Coder');
  }, [employees]);

  const activeCoreEmployees = useMemo(() => {
    return employees.filter(e => e.active && e.type === 'Core');
  }, [employees]);

  const handleCreateClick = () => {
    setSelectedProject(null);
    setIsSheetOpen(true);
  }

  const handleEditClick = (project: ProjectSheetItem) => {
    setSelectedProject(project);
    setIsSheetOpen(true);
  };

  const handleViewClick = (project: ProjectSheetItem) => {
    router.push(`/admin/projects/${project.id}`);
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
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle>All Projects</CardTitle>
                        <CardDescription>
                            {filteredProjects.length} of {projects.length} projects shown.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative w-full md:max-w-sm">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input 
                            placeholder="Search projects..." 
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <Select value={activeTab} onValueChange={setActiveTab}>
                            <SelectTrigger className="w-[180px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter projects" />
                            </SelectTrigger>
                            <SelectContent>
                                {filterOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                                <TableHead className="hidden md:table-cell">Priority</TableHead>
                                <TableHead>Assignee</TableHead>
                                <TableHead className="hidden lg:table-cell">Start Date</TableHead>
                                <TableHead className="hidden lg:table-cell">End Date</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProjects.map((project) => (
                                <TableRow key={project.id}>
                                    <TableCell className="font-medium max-w-xs truncate">{project.projectTitle}</TableCell>
                                    <TableCell className="hidden sm:table-cell">{project.clientName}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                project.status === 'Active' ? 'default' :
                                                project.status === 'On Hold' || project.status === 'Stalled' ? 'secondary' :
                                                'outline'
                                            }
                                        >
                                            {project.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{project.priority}</TableCell>
                                    <TableCell className="hidden sm:table-cell">{project.leadAssignee}</TableCell>
                                    <TableCell className="hidden lg:table-cell">{project.startDate}</TableCell>
                                    <TableCell className="hidden lg:table-cell">{project.endDate}</TableCell>
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
        leads={activeLeads}
        virtualAssistants={activeVAs}
        freelancers={activeFreelancers}
        coders={activeCoders}
        coreEmployees={activeCoreEmployees}
      />
    </div>
  );
}

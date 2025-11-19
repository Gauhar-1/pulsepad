
'use client';
import { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { CheckCheck, PlusCircle, MoreVertical, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AssessmentTemplate, Employee } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AssessmentTemplateSheet } from '@/components/admin/assessment-template-sheet';
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
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const fetchAssessmentTemplates = async (): Promise<AssessmentTemplate[]> => {
    const res = await fetch('/api/admin/assessments');
    if (!res.ok) throw new Error('Failed to fetch templates');
    const data = await res.json();
    return data.templates;
}

const fetchEmployees = async (): Promise<Employee[]> => {
    const res = await fetch('/api/admin/employees');
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
}

const TableSkeleton = () => (
     <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Items</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {Array.from({length: 3}).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

export default function AdminAssessmentsPage() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<AssessmentTemplate | null>(null);
    const [selectedAssignmentTemplates, setSelectedAssignmentTemplates] = useState<string[]>([]);
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

    const { data: templates = [], isLoading: isLoadingTemplates } = useQuery<AssessmentTemplate[]>({
        queryKey: ['assessment-templates'],
        queryFn: fetchAssessmentTemplates,
    });
    
    const { data: employees = [], isLoading: isLoadingEmployees } = useQuery<Employee[]>({
        queryKey: ['employees'],
        queryFn: fetchEmployees,
    });
    
    const saveTemplateMutation = useMutation({
        mutationFn: async ({ templateData, id }: { templateData: Omit<AssessmentTemplate, 'id'>, id?: string }) => {
            const currentTemplates = queryClient.getQueryData<AssessmentTemplate[]>(['assessment-templates']) || [];
            if (id) {
                return currentTemplates.map(t => t.id === id ? { ...templateData, id } : t);
            } else {
                const newTemplate = { ...templateData, id: `template-${Date.now()}` };
                return [newTemplate, ...currentTemplates];
            }
        },
        onSuccess: (updatedData) => {
            queryClient.setQueryData(['assessment-templates'], updatedData);
            toast({ title: 'Success', description: `Template saved successfully.` });
            setIsSheetOpen(false);
            setSelectedTemplate(null);
        }
    });

    const deleteTemplateMutation = useMutation({
        mutationFn: async (templateId: string) => {
            const currentTemplates = queryClient.getQueryData<AssessmentTemplate[]>(['assessment-templates']) || [];
            return currentTemplates.filter(t => t.id !== templateId);
        },
        onSuccess: (updatedData) => {
            queryClient.setQueryData(['assessment-templates'], updatedData);
            toast({ title: 'Success', description: 'Template deleted.' });
            setIsDeleteDialogOpen(false);
            setSelectedTemplate(null);
        }
    });

    const handleCreate = () => {
        setSelectedTemplate(null);
        setIsSheetOpen(true);
    };

    const handleEdit = (template: AssessmentTemplate) => {
        setSelectedTemplate(template);
        setIsSheetOpen(true);
    };

    const handleDelete = (template: AssessmentTemplate) => {
        setSelectedTemplate(template);
        setIsDeleteDialogOpen(true);
    }
    
    const handleDeleteConfirm = () => {
        if (selectedTemplate) {
            deleteTemplateMutation.mutate(selectedTemplate.id);
        }
    }

    const handleSave = (data: Omit<AssessmentTemplate, 'id'>, id?: string) => {
        saveTemplateMutation.mutate({ templateData: data, id });
    }

    const handleSendAssignments = () => {
        toast({
            title: "Assignments Sent",
            description: `Sent assessment with ${selectedAssignmentTemplates.length} templates to ${selectedEmployees.length} employees.`
        });
        setSelectedAssignmentTemplates([]);
        setSelectedEmployees([]);
    }

    return (
        <div className="admin-dashboard-gradient min-h-screen p-4 sm:p-8">
            <header className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <CheckCheck className="h-8 w-8 text-primary"/>
                    <div>
                        <h1 className="text-2xl font-bold">Assessments</h1>
                        <p className="text-muted-foreground">Manage templates and assign daily checklists.</p>
                    </div>
                </div>
            </header>

            <main>
                <Tabs defaultValue="templates">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="templates">Templates</TabsTrigger>
                        <TabsTrigger value="assignments">Assignments</TabsTrigger>
                    </TabsList>
                    <TabsContent value="templates" className="mt-6">
                        <Card className="rounded-2xl shadow-lg">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>All Templates</CardTitle>
                                        <CardDescription>A list of all available assessment templates.</CardDescription>
                                    </div>
                                     <Button onClick={handleCreate}>
                                        <PlusCircle className="mr-2 h-4 w-4"/>
                                        Create Template
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                            {isLoadingTemplates ? <TableSkeleton /> : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Template Name</TableHead>
                                                <TableHead>Checklist Items</TableHead>
                                                <TableHead><span className="sr-only">Actions</span></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {templates.map(template => (
                                                <TableRow key={template.id}>
                                                    <TableCell className="font-medium">{template.name}</TableCell>
                                                    <TableCell>{template.checklist.length}</TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                <DropdownMenuItem onClick={() => handleEdit(template)}>Edit</DropdownMenuItem>
                                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(template)}>
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                            )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="assignments" className="mt-6">
                         <Card className="rounded-2xl shadow-lg">
                             <CardHeader>
                                <CardTitle>Assignment Builder</CardTitle>
                                <CardDescription>Create and send a new daily assessment by combining templates.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="font-semibold">1. Select Templates to Include</h3>
                                    <Card className="max-h-80 overflow-y-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-12"><Checkbox 
                                                        checked={selectedAssignmentTemplates.length > 0 && selectedAssignmentTemplates.length === templates.length}
                                                        onCheckedChange={(checked) => setSelectedAssignmentTemplates(checked ? templates.map(t => t.id) : [])}
                                                    /></TableHead>
                                                    <TableHead>Template Name</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                 {templates.map(template => (
                                                    <TableRow key={`assign-${template.id}`}>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={selectedAssignmentTemplates.includes(template.id)}
                                                                onCheckedChange={(checked) => {
                                                                    setSelectedAssignmentTemplates(prev => checked ? [...prev, template.id] : prev.filter(id => id !== template.id));
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>{template.name}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Card>
                                </div>
                                 <div className="space-y-4">
                                    <h3 className="font-semibold">2. Select Employees to Assign</h3>
                                    <Card className="max-h-80 overflow-y-auto">
                                        <Table>
                                             <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-12"><Checkbox
                                                        checked={selectedEmployees.length > 0 && selectedEmployees.length === employees.length}
                                                        onCheckedChange={(checked) => setSelectedEmployees(checked ? employees.map(e => e.id) : [])}
                                                    /></TableHead>
                                                    <TableHead>Employee Name</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {employees.filter(e => e.active).map(employee => (
                                                    <TableRow key={`emp-assign-${employee.id}`}>
                                                         <TableCell>
                                                            <Checkbox
                                                                checked={selectedEmployees.includes(employee.id)}
                                                                onCheckedChange={(checked) => {
                                                                    setSelectedEmployees(prev => checked ? [...prev, employee.id] : prev.filter(id => id !== employee.id));
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>{employee.name}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Card>
                                </div>
                                <div className="md:col-span-2 flex justify-end">
                                     <Button 
                                        size="lg" 
                                        onClick={handleSendAssignments}
                                        disabled={selectedAssignmentTemplates.length === 0 || selectedEmployees.length === 0}
                                     >
                                        <Send className="mr-2 h-4 w-4" /> 
                                        Send Assignment to {selectedEmployees.length} Employee(s)
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            <AssessmentTemplateSheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                template={selectedTemplate}
                onSave={handleSave}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This will permanently delete the &quot;{selectedTemplate?.name}&quot; template. This action cannot be undone.
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
        </div>
    );
}

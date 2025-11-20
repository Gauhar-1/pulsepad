
'use client';
import { useState, useMemo } from 'react';
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
import { Check, CheckCheck, PlusCircle, MoreVertical, Send, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AssessmentTemplate, Employee, DailyAssessment, ChecklistItem } from '@/lib/definitions';
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
import { Badge } from '@/components/ui/badge';
import { GradingSheet } from '@/components/admin/grading-sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiFetch } from '@/lib/api';

const fetchAssessmentTemplates = async (): Promise<AssessmentTemplate[]> => {
    const res = await apiFetch('/admin/assessments/templates');
    if (!res.ok) throw new Error('Failed to fetch templates');
    return res.json();
}

const fetchEmployees = async (): Promise<Employee[]> => {
    const res = await apiFetch('/admin/employees');
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
}

const fetchAssessmentsData = async (): Promise<{assessments: DailyAssessment[], templates: AssessmentTemplate[]}> => {
    const res = await apiFetch('/admin/assessments');
    if (!res.ok) throw new Error('Failed to fetch assessments');
    return res.json();
}

const employeeTypes = ['All Types', 'Lead', 'Core', 'VA', 'Coder', 'Freelancer'];

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

const statusVariant: { [key: string]: 'default' | 'secondary' | 'outline' | 'destructive' } = {
  SUBMITTED: 'secondary',
  VALIDATED: 'default',
  ASSIGNED: 'outline',
};

const statusIcon = {
  SUBMITTED: Circle,
  VALIDATED: Check,
  ASSIGNED: Circle,
};

const statusColor = {
  SUBMITTED: 'text-blue-500',
  VALIDATED: 'text-green-500',
  ASSIGNED: 'text-muted-foreground',
};


export default function AdminAssessmentsPage() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isGradingSheetOpen, setIsGradingSheetOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<AssessmentTemplate | null>(null);
    const [selectedAssignmentTemplates, setSelectedAssignmentTemplates] = useState<string[]>([]);
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [assessmentToGrade, setAssessmentToGrade] = useState<DailyAssessment | null>(null);
    const [employeeTypeFilter, setEmployeeTypeFilter] = useState('All Types');


    const { data: templates = [], isLoading: isLoadingTemplates } = useQuery<AssessmentTemplate[]>({
        queryKey: ['assessment-templates'],
        queryFn: fetchAssessmentTemplates,
    });
    
    const { data: employees = [], isLoading: isLoadingEmployees } = useQuery<Employee[]>({
        queryKey: ['employees'],
        queryFn: fetchEmployees,
    });

    const { data: assessmentsData, isLoading: isLoadingAssessments } = useQuery<{assessments: DailyAssessment[], templates: AssessmentTemplate[]}>({
        queryKey: ['assessmentsData'],
        queryFn: fetchAssessmentsData,
    });
    
    const filteredEmployees = useMemo(() => {
        if (employeeTypeFilter === 'All Types') {
            return employees.filter(e => e.status === 'ACTIVE');
        }
        return employees.filter(e => e.status === 'ACTIVE' && e.type === employeeTypeFilter);
    }, [employees, employeeTypeFilter]);

    const dailyAssessments = assessmentsData?.assessments || [];
    
    const saveTemplateMutation = useMutation({
        mutationFn: async ({ templateData, id }: { templateData: Omit<AssessmentTemplate, '_id'>, id?: string }) => {
            const url = id ? `/api/admin/assessments/templates/${id}` : '/api/admin/assessments/templates';
            const method = id ? 'PUT' : 'POST';
            const res = await apiFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(templateData),
            });
            if (!res.ok) throw new Error(`Failed to save template`);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assessment-templates'] });
            queryClient.invalidateQueries({ queryKey: ['assessmentsData'] });
            toast({ title: 'Success', description: `Template saved successfully.` });
            setIsSheetOpen(false);
            setSelectedTemplate(null);
        },
        onError: (error) => {
             toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    });

    const deleteTemplateMutation = useMutation({
        mutationFn: async (templateId: string) => {
            const res = await apiFetch(`/admin/assessments/templates/${templateId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete template');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assessment-templates'] });
            queryClient.invalidateQueries({ queryKey: ['assessmentsData'] });
            toast({ title: 'Success', description: 'Template deleted.' });
            setIsDeleteDialogOpen(false);
            setSelectedTemplate(null);
        },
        onError: (error) => {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    });
    
    const assignAssessmentsMutation = useMutation({
        mutationFn: async ({ employeeIds, templateIds }: { employeeIds: string[], templateIds: string[] }) => {
            const res = await apiFetch('/admin/assessments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeIds, templateIds }),
            });
            if (!res.ok) throw new Error('Failed to send assignments');
            return res.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['assessmentsData'] });
            toast({
                title: "Assignments Sent",
                description: data.message || `Sent assessment with ${selectedAssignmentTemplates.length} templates to ${selectedEmployees.length} employees.`
            });
            setSelectedAssignmentTemplates([]);
            setSelectedEmployees([]);
        },
        onError: (error) => {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    });
    
    const saveGradeMutation = useMutation({
        mutationFn: async (gradedAssessment: DailyAssessment) => {
            const res = await apiFetch(`/admin/assessments/submissions/${gradedAssessment._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gradedAssessment),
            });
            if (!res.ok) throw new Error('Failed to save grade');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assessmentsData'] });
            toast({ title: "Grade Saved", description: "The assessment has been validated and scored." });
            setIsGradingSheetOpen(false);
        },
        onError: (error) => {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    })


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
            deleteTemplateMutation.mutate(selectedTemplate._id);
        }
    }

    const handleSave = (data: Omit<AssessmentTemplate, '_id' | 'checklist'> & { checklist: Omit<ChecklistItem, '_id'>[] }, id?: string) => {
        saveTemplateMutation.mutate({ templateData: data as Omit<AssessmentTemplate, '_id'>, id });
    }

    const handleSendAssignments = () => {
        if (selectedAssignmentTemplates.length === 0 || selectedEmployees.length === 0) return;
        assignAssessmentsMutation.mutate({ employeeIds: selectedEmployees, templateIds: selectedAssignmentTemplates });
    }
    
    const handleValidateClick = (assessment: DailyAssessment) => {
        setAssessmentToGrade(assessment);
        setIsGradingSheetOpen(true);
    };
    
    const handleSaveGrade = (finalAssessment: DailyAssessment) => {
        saveGradeMutation.mutate(finalAssessment);
    }

    const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || 'Unknown Employee';

    const getTemplateForAssessment = (assessment: DailyAssessment) => {
        if (typeof assessment.templateId === 'object' && assessment.templateId !== null) {
            return assessment.templateId as AssessmentTemplate;
        }
        return templates.find(t => t._id === assessment.templateId);
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
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="templates">Templates</TabsTrigger>
                        <TabsTrigger value="assignments">Assignments</TabsTrigger>
                         <TabsTrigger value="submissions">Submissions</TabsTrigger>
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
                                                <TableRow key={template._id}>
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
                                                        onCheckedChange={(checked) => setSelectedAssignmentTemplates(checked ? templates.map(t => t._id) : [])}
                                                    /></TableHead>
                                                    <TableHead>Template Name</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                 {templates.map(template => (
                                                    <TableRow key={`assign-${template._id}`}>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={selectedAssignmentTemplates.includes(template._id)}
                                                                onCheckedChange={(checked) => {
                                                                    setSelectedAssignmentTemplates(prev => checked ? [...prev, template._id] : prev.filter(id => id !== template._id));
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
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold">2. Select Employees to Assign</h3>
                                        <Select value={employeeTypeFilter} onValueChange={setEmployeeTypeFilter}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Filter by type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {employeeTypes.map(type => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Card className="max-h-80 overflow-y-auto">
                                        <Table>
                                             <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-12"><Checkbox
                                                        checked={filteredEmployees.length > 0 && filteredEmployees.every(e => selectedEmployees.includes(e.id))}
                                                        onCheckedChange={(checked) => {
                                                            const filteredIds = filteredEmployees.map(e => e.id);
                                                            setSelectedEmployees(prev => {
                                                                const otherSelections = prev.filter(id => !filteredIds.includes(id));
                                                                return checked ? [...otherSelections, ...filteredIds] : otherSelections;
                                                            });
                                                        }}
                                                    /></TableHead>
                                                    <TableHead>Employee Name</TableHead>
                                                    <TableHead>Type</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredEmployees.map(employee => (
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
                                                        <TableCell>{employee.type}</TableCell>
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
                                        disabled={assignAssessmentsMutation.isPending || selectedAssignmentTemplates.length === 0 || selectedEmployees.length === 0}
                                     >
                                        <Send className="mr-2 h-4 w-4" /> 
                                        Send Assignment to {selectedEmployees.length} Employee(s)
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="submissions" className="mt-6">
                        <Card className="rounded-2xl shadow-lg">
                            <CardHeader>
                                <CardTitle>Daily Submissions</CardTitle>
                                <CardDescription>Track submission status for today's assessments.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoadingAssessments || isLoadingEmployees ? <TableSkeleton /> : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Employee</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead><span className="sr-only">Actions</span></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {dailyAssessments.map(item => {
                                                const Icon = statusIcon[item.status];
                                                return (
                                                <TableRow key={item._id}>
                                                    <TableCell>{getEmployeeName(item.employeeId)}</TableCell>
                                                    <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={statusVariant[item.status]}>
                                                            <Icon className={`mr-2 h-3 w-3 ${statusColor[item.status]}`} />
                                                            {item.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.status === 'SUBMITTED' && (
                                                            <Button variant="outline" size="sm" onClick={() => handleValidateClick(item)} disabled={saveGradeMutation.isPending}>Validate</Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                )}
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
                isSaving={saveTemplateMutation.isPending}
            />

            {assessmentToGrade && (
                <GradingSheet
                    open={isGradingSheetOpen}
                    onOpenChange={setIsGradingSheetOpen}
                    assessment={assessmentToGrade}
                    template={getTemplateForAssessment(assessmentToGrade)}
                    employeeName={getEmployeeName(assessmentToGrade.employeeId)}
                    onSave={handleSaveGrade}
                    isSaving={saveGradeMutation.isPending}
                />
            )}

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
                    disabled={deleteTemplateMutation.isPending}
                    >
                    Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

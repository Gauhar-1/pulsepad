
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
import { CheckCheck, PlusCircle, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AssessmentTemplate } from '@/lib/definitions';
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

const fetchAssessmentTemplates = async (): Promise<AssessmentTemplate[]> => {
    // In a real app, this would fetch from '/api/admin/assessments'
    // but the mock API returns more than just templates.
    // We'll simulate the fetch and return the templates part.
    const res = await fetch('/api/admin/assessments');
    if (!res.ok) throw new Error('Failed to fetch templates');
    const data = await res.json();
    return data.templates;
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

    const { data: templates = [], isLoading } = useQuery<AssessmentTemplate[]>({
        queryKey: ['assessment-templates'],
        queryFn: fetchAssessmentTemplates,
    });
    
    // In a real app, mutations would call an API endpoint.
    // For now, we optimistically update the query cache.
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

    return (
        <div className="admin-dashboard-gradient min-h-screen p-4 sm:p-8">
            <header className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <CheckCheck className="h-8 w-8 text-primary"/>
                    <div>
                        <h1 className="text-2xl font-bold">Assessment Templates</h1>
                        <p className="text-muted-foreground">Create and manage daily assessment checklists.</p>
                    </div>
                </div>
                <Button onClick={handleCreate}>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Create Template
                </Button>
            </header>

            <main>
                 <Card className="rounded-2xl shadow-lg">
                    <CardHeader>
                        <CardTitle>All Templates</CardTitle>
                        <CardDescription>A list of all available assessment templates.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       {isLoading ? <TableSkeleton /> : (
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

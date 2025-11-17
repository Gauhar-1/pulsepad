
'use client';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectSheetItem } from '@/lib/definitions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useEffect } from 'react';
import { Textarea } from '../ui/textarea';

const statusEnum = [
    'In Progress', 'On Hold', 'Completed', 'Cancelled', 
    'Client Meeting Done', 'Contact Made', 'Active', 'Reconnected', 
    'Stalled', 'Requirement Sent', 'Waiting for Requirement', 
    'Awaiting Testimonial', 'Training'
] as const;

const formSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientType: z.enum(['New', 'Existing']),
  projectTitle: z.string().min(1, 'Project title is required'),
  projectDescription: z.string().optional(),
  projectType: z.string().min(1, 'Project type is required'),
  tags: z.string(),
  priority: z.enum(['High', 'Medium', 'Low']),
  status: z.enum(statusEnum),
  estimatedHours: z.coerce.number().positive('Must be a positive number'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  leadAssignee: z.string().min(1, 'Lead assignee is required'),
  virtualAssistant: z.string().optional(),
  freelancers: z.string().optional(),
  coders: z.string().optional(),
  projectLeader: z.string().optional(),
  githubLink: z.string().url().optional().or(z.literal('')),
  loomLink: z.string().url().optional().or(z.literal('')),
  whatsappLink: z.string().url().optional().or(z.literal('')),
  oneDriveLink: z.string().url().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateProjectSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveProject: (project: Omit<ProjectSheetItem, 'id'>, id?: string) => void;
  project: ProjectSheetItem | null;
}

export function CreateProjectSheet({
  open,
  onOpenChange,
  onSaveProject,
  project,
}: CreateProjectSheetProps) {
  const isEditMode = !!project;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: '',
      clientType: 'New',
      projectTitle: '',
      projectDescription: '',
      projectType: '',
      tags: '',
      priority: 'Medium',
      status: 'In Progress',
      estimatedHours: 0,
      startDate: '',
      endDate: '',
      leadAssignee: '',
      virtualAssistant: '',
      freelancers: '',
      coders: '',
      projectLeader: '',
      githubLink: '',
      loomLink: '',
      whatsappLink: '',
      oneDriveLink: '',
    },
  });

  useEffect(() => {
    if (isEditMode && project) {
      form.reset({
        ...project,
        clientType: project.clientType as 'New' | 'Existing',
        tags: project.tags.join(', '),
        freelancers: project.freelancers?.join(', '),
        coders: project.coders?.join(', '),
      });
    } else {
      form.reset({
        clientName: '',
        clientType: 'New',
        projectTitle: '',
        projectDescription: '',
        projectType: '',
        tags: '',
        priority: 'Medium',
        status: 'In Progress',
        estimatedHours: 0,
        startDate: '',
        endDate: '',
        leadAssignee: '',
        virtualAssistant: '',
        freelancers: '',
        coders: '',
        projectLeader: '',
        githubLink: '',
        loomLink: '',
        whatsappLink: '',
        oneDriveLink: '',
      });
    }
  }, [project, isEditMode, form]);

  const onSubmit = (values: FormValues) => {
    const projectData = {
        ...values,
        tags: values.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        freelancers: values.freelancers?.split(',').map(f => f.trim()).filter(f => f) || [],
        coders: values.coders?.split(',').map(c => c.trim()).filter(c => c) || [],
    } as Omit<ProjectSheetItem, 'id'>;
    onSaveProject(projectData, project?.id);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{isEditMode ? 'Edit Project' : 'Create New Project'}</SheetTitle>
          <SheetDescription>
            {isEditMode ? 'Update the details of the existing project.' : 'Fill out the details below to add a new project.'}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
                <ScrollArea className="flex-1 pr-6 -mr-6">
                    <div className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField name="clientName" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Client Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField name="clientType" control={form.control} render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Client Type</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                      <SelectContent>
                                          <SelectItem value="New">New</SelectItem>
                                          <SelectItem value="Existing">Existing</SelectItem>
                                      </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                        <FormField name="projectTitle" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Project Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField name="projectDescription" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Project Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField name="projectType" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Project Type</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField name="tags" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Tags (comma-separated)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField name="priority" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Priority</FormLabel><Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent><SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem></SelectContent>
                                </Select><FormMessage /></FormItem>
                            )}/>
                            <FormField name="status" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {statusEnum.map(status => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                             <FormField name="estimatedHours" control={form.control} render={({ field }) => (
                                <FormItem className="col-span-1"><FormLabel>Est. Hours</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField name="startDate" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField name="endDate" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>End Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <div className="space-y-2">
                             <h3 className="text-sm font-medium">Assignments</h3>
                             <FormField name="leadAssignee" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Lead Assignee</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField name="virtualAssistant" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Virtual Assistant</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField name="freelancers" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Freelancers (comma-separated)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField name="coders" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Coders (comma-separated)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField name="projectLeader" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Project Leader / Update In-charge</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">Project Links</h3>
                             <FormField name="githubLink" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>GitHub</FormLabel><FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField name="loomLink" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Loom</FormLabel><FormControl><Input placeholder="https://loom.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField name="whatsappLink" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>WhatsApp</FormLabel><FormControl><Input placeholder="https://wa.me/..." {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField name="oneDriveLink" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>OneDrive</FormLabel><FormControl><Input placeholder="https://onedrive.live.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                    </div>
                </ScrollArea>
                <SheetFooter className="mt-auto pt-4">
                    <SheetClose asChild>
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                    </SheetClose>
                    <Button type="submit">{isEditMode ? 'Save Changes' : 'Create Project'}</Button>
                </SheetFooter>
            </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

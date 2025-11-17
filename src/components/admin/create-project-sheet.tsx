
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectSheetItem } from '@/lib/definitions';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

const formSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientType: z.string().min(1, 'Client type is required'),
  projectTitle: z.string().min(1, 'Project title is required'),
  projectType: z.string().min(1, 'Project type is required'),
  tags: z.string(),
  priority: z.enum(['High', 'Medium', 'Low']),
  status: z.enum(['In Progress', 'On Hold', 'Completed', 'Cancelled']),
  estimatedHours: z.coerce.number().positive('Must be a positive number'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  leadAssignee: z.string().min(1, 'Lead assignee is required'),
  githubLink: z.string().url().optional().or(z.literal('')),
  loomLink: z.string().url().optional().or(z.literal('')),
  whatsappLink: z.string().url().optional().or(z.literal('')),
  oneDriveLink: z.string().url().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateProjectSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProject: (project: Omit<ProjectSheetItem, 'id'>) => void;
}

export function CreateProjectSheet({
  open,
  onOpenChange,
  onAddProject,
}: CreateProjectSheetProps) {
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: '',
      clientType: '',
      projectTitle: '',
      projectType: '',
      tags: '',
      priority: 'Medium',
      status: 'In Progress',
      estimatedHours: 0,
      startDate: '',
      endDate: '',
      leadAssignee: '',
      githubLink: '',
      loomLink: '',
      whatsappLink: '',
      oneDriveLink: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    const newProject: Omit<ProjectSheetItem, 'id'> = {
        ...values,
        tags: values.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    onAddProject(newProject);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Create New Project</SheetTitle>
          <SheetDescription>
            Fill out the details below to add a new project.
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
                                <FormItem><FormLabel>Client Type</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <FormField name="projectTitle" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Project Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField name="projectType" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Project Type</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField name="tags" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Tags (comma-separated)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField name="priority" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Priority</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent><SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem></SelectContent>
                                </Select><FormMessage /></FormItem>
                            )}/>
                            <FormField name="status" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent><SelectItem value="In Progress">In Progress</SelectItem><SelectItem value="On Hold">On Hold</SelectItem><SelectItem value="Completed">Completed</SelectItem><SelectItem value="Cancelled">Cancelled</SelectItem></SelectContent>
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
                         <FormField name="leadAssignee" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Lead Assignee</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        
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
                    <Button type="submit">Create Project</Button>
                </SheetFooter>
            </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

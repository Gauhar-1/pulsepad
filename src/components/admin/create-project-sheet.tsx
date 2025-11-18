
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
import { Employee, ProjectSheetItem } from '@/lib/definitions';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useEffect } from 'react';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const statusEnum = [
    'On Hold', 'Completed', 'Cancelled', 
    'Client Meeting Done', 'Contact Made', 'Active', 'Reconnected', 
    'Stalled', 'Requirement Sent', 'Waiting for Requirement', 
    'Awaiting Testimonial', 'Training'
] as const;

const projectTypeEnum = ['Client', 'Research', 'Management', 'Training'] as const;

const milestoneStatusEnum = ['upcoming', 'completed', 'missed'] as const;

const formSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientType: z.enum(['New', 'Existing']),
  projectTitle: z.string().min(1, 'Project title is required'),
  projectDescription: z.string().optional(),
  projectType: z.enum(projectTypeEnum),
  tags: z.string(),
  priority: z.enum(['High', 'Medium', 'Low']),
  status: z.enum(statusEnum),
  estimatedHours: z.coerce.number().positive('Must be a positive number'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  leadAssignee: z.string().min(1, 'Lead assignee is required'),
  virtualAssistant: z.string().optional(),
  freelancers: z.array(z.string()).optional(),
  coders: z.array(z.string()).optional(),
  projectLeader: z.string().optional(),
  githubLink: z.string().url().optional().or(z.literal('')),
  loomLink: z.string().url().optional().or(z.literal('')),
  whatsappLink: z.string().url().optional().or(z.literal('')),
  oneDriveLink: z.string().url().optional().or(z.literal('')),
  milestones: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Milestone name is required'),
    date: z.date({ required_error: 'Date is required' }),
    status: z.enum(milestoneStatusEnum),
  })).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateProjectSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveProject: (project: Omit<ProjectSheetItem, 'id'>, id?: string) => void;
  project: ProjectSheetItem | null;
  leads: Employee[];
  virtualAssistants: Employee[];
  freelancers: Employee[];
  coders: Employee[];
  coreEmployees: Employee[];
}

export function CreateProjectSheet({
  open,
  onOpenChange,
  onSaveProject,
  project,
  leads,
  virtualAssistants,
  freelancers: allFreelancers,
  coders: allCoders,
  coreEmployees,
}: CreateProjectSheetProps) {
  const isEditMode = !!project;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: '',
      clientType: 'New',
      projectTitle: '',
      projectDescription: '',
      projectType: 'Client',
      tags: '',
      priority: 'Medium',
      status: 'Active',
      estimatedHours: 0,
      startDate: '',
      endDate: '',
      leadAssignee: '',
      virtualAssistant: '',
      freelancers: [],
      coders: [],
      projectLeader: '',
      githubLink: '',
      loomLink: '',
      whatsappLink: '',
      oneDriveLink: '',
      milestones: [],
    },
  });

   const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "milestones",
  });

  useEffect(() => {
    if (isEditMode && project) {
      form.reset({
        ...project,
        clientType: project.clientType as 'New' | 'Existing',
        projectType: project.projectType as 'Client' | 'Research' | 'Management' | 'Training',
        tags: project.tags.join(', '),
        freelancers: project.freelancers || [],
        coders: project.coders || [],
        milestones: project.milestones?.map(m => ({ ...m, date: new Date(m.date) })) || [],
      });
    } else {
      form.reset({
        clientName: '',
        clientType: 'New',
        projectTitle: '',
        projectDescription: '',
        projectType: 'Client',
        tags: '',
        priority: 'Medium',
        status: 'Active',
        estimatedHours: 0,
        startDate: '',
        endDate: '',
        leadAssignee: '',
        virtualAssistant: '',
        freelancers: [],
        coders: [],
        projectLeader: '',
        githubLink: '',
        loomLink: '',
        whatsappLink: '',
        oneDriveLink: '',
        milestones: [],
      });
    }
  }, [project, isEditMode, form]);

  const onSubmit = (values: FormValues) => {
    const projectData = {
        ...values,
        tags: values.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        freelancers: values.freelancers || [],
        coders: values.coders || [],
        milestones: values.milestones?.map(m => ({...m, id: m.id || `m-${Date.now()}`, date: format(m.date, 'yyyy-MM-dd')}))
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
                            <FormItem>
                                <FormLabel>Project Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {projectTypeEnum.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
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
                                <FormItem>
                                    <FormLabel>Lead Assignee</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a lead" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {leads.map(lead => (
                                                <SelectItem key={lead.id} value={lead.name}>{lead.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                              <FormField name="virtualAssistant" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Virtual Assistant</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a VA" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {virtualAssistants.map(va => (
                                                <SelectItem key={va.id} value={va.name}>{va.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                             <FormField
                                name="freelancers"
                                control={form.control}
                                render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                    <FormLabel>Freelancers</FormLabel>
                                    </div>
                                    {allFreelancers.map((item) => (
                                    <FormField
                                        key={item.id}
                                        control={form.control}
                                        name="freelancers"
                                        render={({ field }) => {
                                        return (
                                            <FormItem
                                            key={item.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                            <FormControl>
                                                <Checkbox
                                                checked={field.value?.includes(item.name)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                    ? field.onChange([...(field.value || []), item.name])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                            (value) => value !== item.name
                                                        )
                                                        )
                                                }}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {item.name}
                                            </FormLabel>
                                            </FormItem>
                                        )
                                        }}
                                    />
                                    ))}
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                name="coders"
                                control={form.control}
                                render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                    <FormLabel>Coders</FormLabel>
                                    </div>
                                    {allCoders.map((item) => (
                                    <FormField
                                        key={item.id}
                                        control={form.control}
                                        name="coders"
                                        render={({ field }) => {
                                        return (
                                            <FormItem
                                            key={item.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                            <FormControl>
                                                <Checkbox
                                                checked={field.value?.includes(item.name)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                    ? field.onChange([...(field.value || []), item.name])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                            (value) => value !== item.name
                                                        )
                                                        )
                                                }}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {item.name}
                                            </FormLabel>
                                            </FormItem>
                                        )
                                        }}
                                    />
                                    ))}
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField name="projectLeader" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Leader / Update In-charge</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a project leader" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {coreEmployees.map(emp => (
                                                <SelectItem key={emp.id} value={emp.name}>{emp.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>

                         <div className="space-y-4">
                            <h3 className="text-sm font-medium">Milestones</h3>
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end p-3 border rounded-lg">
                                    <FormField
                                        control={form.control}
                                        name={`milestones.${index}.name`}
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Milestone Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Design Complete" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`milestones.${index}.date`}
                                        render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Due Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name={`milestones.${index}.status`}
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                   {milestoneStatusEnum.map(status => (
                                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                ))}
                            </div>
                            <Button type="button" variant="outline" onClick={() => append({ name: '', date: new Date(), status: 'upcoming' })}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Milestone
                            </Button>
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


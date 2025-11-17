
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
import { Employee } from '@/lib/definitions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useEffect } from 'react';
import { Switch } from '../ui/switch';

const employeeTypeEnum = ['Lead', 'Core', 'VA', 'Coder', 'Freelancer'] as const;

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  skills: z.string().min(1, 'At least one skill is required'),
  type: z.enum(employeeTypeEnum),
  active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateEmployeeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveEmployee: (employee: Omit<Employee, 'id' | 'projects' | 'sheetId'>, id?: string) => void;
  employee: Employee | null;
}

export function CreateEmployeeSheet({
  open,
  onOpenChange,
  onSaveEmployee,
  employee,
}: CreateEmployeeSheetProps) {
  const isEditMode = !!employee;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      skills: '',
      type: 'Core',
      active: true,
    },
  });

  useEffect(() => {
    if (isEditMode && employee) {
      form.reset({
        ...employee,
        skills: employee.skills.join(', '),
      });
    } else {
      form.reset({
        name: '',
        email: '',
        skills: '',
        type: 'Core',
        active: true,
      });
    }
  }, [employee, isEditMode, form]);

  const onSubmit = (values: FormValues) => {
    const employeeData = {
        ...values,
        skills: values.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
    } as Omit<Employee, 'id' | 'projects' | 'sheetId'>;

    onSaveEmployee(employeeData, employee?.id);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEditMode ? 'Edit Employee' : 'Create New Employee'}</SheetTitle>
          <SheetDescription>
            {isEditMode ? 'Update the details of the existing employee.' : 'Fill out the details below to add a new employee.'}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
                <ScrollArea className="flex-1 pr-6 -mr-6">
                    <div className="space-y-6 py-4">
                        <FormField name="name" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField name="email" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField name="skills" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Skills (comma-separated)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField name="type" control={form.control} render={({ field }) => (
                            <FormItem>
                              <FormLabel>Employment Type</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                  <SelectContent>
                                      {employeeTypeEnum.map(type => (
                                          <SelectItem key={type} value={type}>{type}</SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                        )}/>
                         <FormField name="active" control={form.control} render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Active Status</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )}/>
                    </div>
                </ScrollArea>
                <SheetFooter className="mt-auto pt-4">
                    <SheetClose asChild>
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                    </SheetClose>
                    <Button type="submit">{isEditMode ? 'Save Changes' : 'Create Employee'}</Button>
                </SheetFooter>
            </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

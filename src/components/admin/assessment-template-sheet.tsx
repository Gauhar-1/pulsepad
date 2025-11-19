
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
import { ScrollArea } from '@/components/ui/scroll-area';
import type { AssessmentTemplate } from '@/lib/definitions';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useEffect } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  checklist: z.array(z.object({
    id: z.string().optional(),
    text: z.string().min(1, 'Checklist item text is required'),
    weight: z.coerce.number().min(1, 'Weight must be at least 1'),
  })).min(1, 'At least one checklist item is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface AssessmentTemplateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Omit<AssessmentTemplate, 'id'>, id?: string) => void;
  template: AssessmentTemplate | null;
}

export function AssessmentTemplateSheet({
  open,
  onOpenChange,
  onSave,
  template,
}: AssessmentTemplateSheetProps) {
  const isEditMode = !!template;
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      checklist: [{ text: '', weight: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "checklist",
  });

  useEffect(() => {
    if (isEditMode && template) {
      form.reset({
        name: template.name,
        checklist: template.checklist.map(item => ({ ...item, id: item.id || `item-${Date.now()}` })),
      });
    } else {
      form.reset({
        name: '',
        checklist: [{ text: '', weight: 1 }],
      });
    }
  }, [template, isEditMode, form, open]); // re-run on open change

  const onSubmit = (values: FormValues) => {
    const templateData = {
        ...values,
        checklist: values.checklist.map(item => ({
            ...item,
            id: item.id || `item-${Date.now()}-${Math.random()}`
        }))
    };
    onSave(templateData, template?.id);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{isEditMode ? 'Edit Template' : 'Create New Template'}</SheetTitle>
          <SheetDescription>
            {isEditMode ? 'Update the details of this assessment template.' : 'Design a new assessment template by adding checklist items.'}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
                <ScrollArea className="flex-1 pr-6 -mr-6">
                    <div className="space-y-6 py-4">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Template Name</FormLabel>
                                    <FormControl><Input placeholder="e.g., Daily Punctuality Check" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <div className="space-y-4">
                            <FormLabel>Checklist Items</FormLabel>
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex items-start gap-3 p-3 border rounded-lg bg-muted/50">
                                        <span className="text-sm font-medium pt-2">{index + 1}.</span>
                                        <div className="flex-grow grid gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`checklist.${index}.text`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input placeholder="Enter checklist text..." {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`checklist.${index}.weight`}
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center gap-2 space-y-0">
                                                        <FormLabel className="text-sm">Weight</FormLabel>
                                                        <FormControl>
                                                             <Input type="number" className="w-20" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => remove(index)}
                                            disabled={fields.length <= 1}
                                            className="mt-1"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            {form.formState.errors.checklist?.root && <p className="text-sm font-medium text-destructive">{form.formState.errors.checklist.root.message}</p>}
                            <Button type="button" variant="outline" onClick={() => append({ text: '', weight: 1 })}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Checklist Item
                            </Button>
                        </div>
                    </div>
                </ScrollArea>
                <SheetFooter className="mt-auto pt-4">
                    <SheetClose asChild>
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                    </SheetClose>
                    <Button type="submit">{isEditMode ? 'Save Changes' : 'Create Template'}</Button>
                </SheetFooter>
            </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}


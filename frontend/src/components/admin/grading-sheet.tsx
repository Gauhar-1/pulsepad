
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { AssessmentTemplate, DailyAssessment } from '@/lib/definitions';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '../ui/form';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { useEffect, useMemo } from 'react';

interface GradingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessment: DailyAssessment | null;
  template: AssessmentTemplate | undefined;
  employeeName: string;
  onSave: (gradedAssessment: DailyAssessment) => void;
  isSaving: boolean;
}

export function GradingSheet({
  open,
  onOpenChange,
  assessment,
  template,
  employeeName,
  onSave,
  isSaving,
}: GradingSheetProps) {
  const formSchema = useMemo(() => {
    if (!template) return z.object({});

    const schemaObject: Record<string, z.ZodBoolean> = {};
    template.checklist.forEach((item) => {
      schemaObject[item._id] = z.boolean();
    });

    return z.object(schemaObject);
  }, [template]);

  type FormValues = Record<string, boolean>;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (assessment && template) {
      const defaultValues = template.checklist.reduce((acc, item) => {
        const response = assessment.responses.find(r => r.checklistItemId === item._id);
        const correction = assessment.adminCorrections?.find(c => c.checklistItemId === item._id);
        if (correction) {
          acc[item._id] = correction.correctedAnswer;
        } else if (response) {
          acc[item._id] = response.answer;
        }
        return acc;
      }, {} as Record<string, boolean>);
      form.reset(defaultValues);
    }
  }, [assessment, template, form, open]);

  const onSubmit = (values: FormValues) => {
    if (!assessment || !template) return;

    const totalPossibleWeight = template.checklist.reduce((sum, item) => sum + item.weight, 0);
    const earnedWeight = template.checklist.reduce((sum, item) => {
      if (values[item._id]) {
        return sum + item.weight;
      }
      return sum;
    }, 0);
    
    const finalScore = totalPossibleWeight > 0 ? earnedWeight / totalPossibleWeight : 0;

    const adminCorrections = Object.keys(values).map((itemId) => ({
      checklistItemId: itemId,
      correctedAnswer: values[itemId],
    }));

    const gradedAssessment: DailyAssessment = {
      ...assessment,
      status: 'VALIDATED',
      adminCorrections,
      finalScore,
    };
    onSave(gradedAssessment);
  };
  
  if (!assessment || !template) return null;

  const handleMarkAllCorrect = () => {
    if (!template) return;
    template.checklist.forEach((item) => {
      form.setValue(item._id, true);
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col sm:max-w-xl">
        <SheetHeader>
          <div className="flex justify-between items-center">
            <div>
              <SheetTitle>Validate Submission</SheetTitle>
              <SheetDescription>
                Reviewing for <span className="font-semibold">{employeeName}</span> on {new Date(assessment.date).toLocaleDateString()}.
              </SheetDescription>
            </div>
            <Button variant="secondary" size="sm" onClick={handleMarkAllCorrect}>Mark All Correct</Button>
          </div>
        </SheetHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
                <ScrollArea className="flex-1 pr-6 -mr-6">
                    <div className="space-y-6 py-4">
                      {template.checklist.map((item) => {
                          const employeeResponse = assessment.responses.find(r => r.checklistItemId === item._id)?.answer;
                          return (
                            <div key={item._id} className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-1.5">
                                    <p className="font-medium">{item.text}</p>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-muted-foreground">Employee says:</span>
                                        <Badge variant={employeeResponse ? 'default' : 'destructive'}>
                                            {employeeResponse ? 'Yes' : 'No'}
                                        </Badge>
                                    </div>
                                </div>
                                <Controller
                                    name={item._id}
                                    control={form.control}
                                    render={({ field }) => (
                                        <div className="flex flex-col items-center gap-2">
                                            <Label htmlFor={`switch-${item._id}`} className="text-xs">Correct?</Label>
                                            <Switch
                                                id={`switch-${item._id}`}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                          )
                      })}
                    </div>
                </ScrollArea>
                <SheetFooter className="mt-auto pt-4">
                    <SheetClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </SheetClose>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save & Score'}
                    </Button>
                </SheetFooter>
            </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

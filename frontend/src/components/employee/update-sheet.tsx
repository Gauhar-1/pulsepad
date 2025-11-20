'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import type { Project, Update } from '@/lib/definitions';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Paperclip } from 'lucide-react';
import { Input } from '../ui/input';
import { apiFetch } from '@/lib/api';

export function UpdateSheet({
  project,
  update,
  open,
  onOpenChange,
}: {
  project: Project;
  update?: Update;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [content, setContent] = useState(update?.content ?? '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setContent(update?.content ?? '');
      setErrorMessage(null);
    }
  }, [update, open]);

  const mutation = useMutation({
    mutationFn: async ({ projectId, bodyContent, updateId }: { projectId: string; bodyContent: string; updateId?: string }) => {
      const payload = {
        update: {
          id: updateId || `update-${Date.now()}`,
          projectId,
          userId: 'user-employee-1',
          content: bodyContent,
          createdAt: new Date().toISOString(),
        },
        isEdit: !!updateId,
      };

      const res = await apiFetch('/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to submit update');
      }

      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: update ? 'Update saved successfully.' : 'Daily update submitted!',
      });
      setContent('');
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['todaysUpdates'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong while saving the update.',
        variant: 'destructive',
      });
    },
  });

  const isEdit = useMemo(() => !!update, [update]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = content.trim();
    if (trimmed.length < 10) {
      setErrorMessage('Update must be at least 10 characters long.');
      return;
    }
    setErrorMessage(null);
    mutation.mutate({ projectId: project.id, bodyContent: trimmed, updateId: update?.id });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {update ? 'Edit' : 'Add'} Update for: {project.name}
          </SheetTitle>
          <SheetDescription>
            {update ? 'Modify your existing update.' : 'Log your progress for today.'}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
          <div className="flex-1 py-4 space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="content">
                Daily Update
                </Label>
                <Textarea
                id="content"
                placeholder="What did you work on today?"
                className="h-full min-h-[200px] text-base"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                />
                {errorMessage && (
                <p className="mt-2 text-sm text-destructive">{errorMessage}</p>
                )}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="attachment">Attachment (optional)</Label>
                <div className="relative">
                    <Paperclip className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="attachment" name="attachment" type="file" className="pl-10"/>
                </div>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Submit Update'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

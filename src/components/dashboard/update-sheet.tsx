'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { submitUpdate } from '@/lib/actions';
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
import { useFormStatus } from 'react-dom';
import { Input } from '../ui/input';

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isEdit ? 'Save Changes' : 'Submit Update'}
    </Button>
  );
}

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
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(submitUpdate, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.message.includes('success')) {
      toast({
        title: 'Success!',
        description: state.message,
      });
      onOpenChange(false);
      formRef.current?.reset();
    } else if (state.message) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast, onOpenChange]);

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
        <form action={dispatch} ref={formRef} className="flex-1 flex flex-col gap-4">
          <input type="hidden" name="projectId" value={project.id} />
          {update && <input type="hidden" name="updateId" value={update.id} />}
          <div className="flex-1 py-4 space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="content">
                Daily Update
                </Label>
                <Textarea
                id="content"
                name="content"
                placeholder="What did you work on today?"
                className="h-full min-h-[200px] text-base"
                defaultValue={update?.content || ''}
                required
                />
                {state.errors?.content && (
                <p className="mt-2 text-sm text-destructive">{state.errors.content}</p>
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
            <SubmitButton isEdit={!!update} />
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

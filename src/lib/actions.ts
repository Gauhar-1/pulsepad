'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { saveUpdate as apiSaveUpdate } from '@/lib/api';

const UpdateSchema = z.object({
  projectId: z.string(),
  updateId: z.string().optional(),
  content: z.string().min(10, { message: 'Update must be at least 10 characters long.' }),
});

export type State = {
  errors?: {
    content?: string[];
  };
  message?: string | null;
};

export async function submitUpdate(prevState: State, formData: FormData) {
  const validatedFields = UpdateSchema.safeParse({
    projectId: formData.get('projectId'),
    updateId: formData.get('updateId'),
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields. Failed to submit update.',
    };
  }
  
  const { projectId, content, updateId } = validatedFields.data;
  
  try {
    await apiSaveUpdate(projectId, content, updateId);
  } catch (error) {
    console.error(error);
    return {
      message: 'API Error: Failed to save update.',
    };
  }

  revalidatePath('/dashboard');
  return { message: 'Update submitted successfully.' };
}

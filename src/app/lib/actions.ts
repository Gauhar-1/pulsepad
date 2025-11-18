
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

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
    // In a real app, you would get the user from the session
    const userId = 'user-employee-1'; 
    const updateData = {
        id: updateId || `update-${Date.now()}`,
        projectId,
        userId,
        content,
        createdAt: new Date().toISOString(),
    };

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/updates`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ update: updateData, isEdit: !!updateId }),
    });

  } catch (error) {
    console.error(error);
    return {
      message: 'API Error: Failed to save update.',
    };
  }

  revalidatePath('/dashboard');
  return { message: 'Update submitted successfully.' };
}

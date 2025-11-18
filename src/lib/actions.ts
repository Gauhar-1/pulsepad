
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

    // The base URL should be configured properly in a real app,
    // but for this context, we assume it's running on the same host.
    // The environment variable is used in client components but might not be available here in the same way
    // without proper setup, so we use a relative path.
    await fetch(new URL('/api/updates', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'), {
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
  revalidatePath('/dashboard/projects');
  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath('/admin/projects');
  revalidatePath(`/admin/projects/${projectId}`);
  return { message: 'Update submitted successfully.' };
}

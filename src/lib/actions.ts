'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getFirebaseAdmin } from '@/firebase/admin'; // Assuming admin initialization for server actions
import { getAuth } from 'firebase-admin/auth';

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
  const { firestore } = getFirebaseAdmin();
  
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
  
  // This is a placeholder for getting the current user's ID.
  // In a real app, you'd get this from the session.
  const userId = 'user-1'; 

  try {
    if (updateId) {
      const updateRef = doc(firestore, 'updates', updateId);
      await setDoc(updateRef, { 
        content,
        updatedAt: serverTimestamp(),
       }, { merge: true });
    } else {
      const updatesCollection = collection(firestore, 'updates');
      await addDoc(updatesCollection, {
        projectId,
        content,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error(error);
    return {
      message: 'Database Error: Failed to save update.',
    };
  }

  revalidatePath('/dashboard');
  return { message: 'Update submitted successfully.' };
}

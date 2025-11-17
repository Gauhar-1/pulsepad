// This file is now deprecated as we are fetching data directly from Firebase in our components.
// You can remove this file if you wish.

import type { Project, Update, User } from '@/lib/definitions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { isToday } from 'date-fns';

const user: User = {
  id: 'user-1',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatarUrl: PlaceHolderImages.find((p) => p.id === 'user-avatar-1')?.imageUrl || '',
  role: 'employee',
};

const projects: Project[] = [
  { id: 'proj-1', name: 'QuantumLeap CRM', client: 'Stellar Solutions', status: 'active' },
  { id: 'proj-2', name: 'Nova E-commerce Platform', client: 'Orion Commerce', status: 'active' },
  { id: 'proj-3', name: 'Project Phoenix', client: 'Meridian Inc.', status: 'on-hold' },
  { id: 'proj-4', name: 'Odyssey Mobile App', client: 'Horizon Digital', status: 'active' },
  { id: 'proj-5', name: 'Titan Analytics Dashboard', client: 'Apex Data', status: 'completed' },
];

let updates: Update[] = [
  {
    id: 'update-1',
    projectId: 'proj-1',
    userId: 'user-1',
    content: 'Finished the main dashboard component and integrated the new charting library.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'update-2',
    projectId: 'proj-3',
    userId: 'user-1',
    content: 'Project is on hold pending client feedback on the new designs.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Simulate API latency
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function getUser(): Promise<User> {
  await delay(50);
  return user;
}

export async function getActiveProjects(): Promise<Project[]> {
  await delay(100);
  return projects.filter((p) => p.status === 'active');
}

export async function getTodaysUpdates(): Promise<Update[]> {
  await delay(100);
  return updates.filter((u) => isToday(new Date(u.createdAt)));
}

export async function saveUpdate(projectId: string, content: string, updateId?: string): Promise<Update> {
  await delay(500);
  if (updateId) {
    // Edit existing update
    const index = updates.findIndex((u) => u.id === updateId);
    if (index !== -1) {
      updates[index].content = content;
      updates[index].createdAt = new Date().toISOString();
      return updates[index];
    }
  }

  // Create new update
  const newUpdate: Update = {
    id: `update-${Date.now()}`,
    projectId,
    userId: user.id,
    content,
    createdAt: new Date().toISOString(),
  };
  updates.push(newUpdate);
  return newUpdate;
}

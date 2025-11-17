import type { Project, Update, User } from '@/lib/definitions';
import { isToday } from 'date-fns';

const users: User[] = [
  { id: 'user-employee', name: 'Alex Doe', email: 'alex.doe@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=employee', role: 'employee' },
  { id: 'user-admin', name: 'Sam Admin', email: 'sam.admin@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=admin', role: 'admin' },
];

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
    userId: 'user-employee',
    content: 'Finished the main dashboard component and integrated the new charting library.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'update-2',
    projectId: 'proj-3',
    userId: 'user-employee',
    content: 'Project is on hold pending client feedback on the new designs.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Simulate API latency
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function getUser(userId: string): Promise<User | undefined> {
  await delay(50);
  return users.find(u => u.id === userId);
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
  
  // In a real app, you'd get the user from the session
  const userId = 'user-employee'; 

  if (updateId) {
    // Edit existing update
    const index = updates.findIndex((u) => u.id === updateId);
    if (index !== -1) {
      updates[index].content = content;
      updates[index].createdAt = new Date().toISOString(); // Simulate update timestamp
      return updates[index];
    }
  }

  // Create new update
  const newUpdate: Update = {
    id: `update-${Date.now()}`,
    projectId,
    userId: userId,
    content,
    createdAt: new Date().toISOString(),
  };
  updates.push(newUpdate);
  return newUpdate;
}

import type { Project, Update, User } from '@/lib/definitions';
import { isToday, subDays } from 'date-fns';

const users: User[] = [
  { id: 'user-employee-1', name: 'Alex Doe', email: 'alex.doe@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=employee1', role: 'employee' },
  { id: 'user-employee-2', name: 'Maria Garcia', email: 'maria.garcia@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=employee2', role: 'employee' },
  { id: 'user-employee-3', name: 'Sam Wilson', email: 'sam.wilson@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=employee3', role: 'employee' },
  { id: 'user-admin', name: 'Jane Smith', email: 'jane.smith@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=admin', role: 'admin' },
  { id: 'user-client', name: 'Peter Jones', email: 'peter.jones@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=client', role: 'client' },
  { id: 'user-applicant', name: 'Mary Brown', email: 'mary.brown@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=applicant', role: 'applicant' },
];

const projects: Project[] = [
  { id: 'proj-1', name: 'QuantumLeap CRM', client: 'Stellar Solutions', status: 'active' },
  { id: 'proj-2', name: 'Nova E-commerce Platform', client: 'Orion Commerce', status: 'active' },
  { id: 'proj-3', name: 'Project Phoenix', client: 'Meridian Inc.', status: 'on-hold' },
  { id: 'proj-4', name: 'Odyssey Mobile App', client: 'Horizon Digital', status: 'active' },
  { id: 'proj-5', name: 'Titan Analytics Dashboard', client: 'Apex Data', status: 'completed' },
];

let updates: Update[] = [
  // Proj-001 (Active)
  { id: 'update-1', projectId: 'proj-001', userId: 'user-employee-1', content: 'Finished the main dashboard component and integrated the new charting library.', createdAt: new Date().toISOString() },
  { id: 'update-4', projectId: 'proj-001', userId: 'user-employee-3', content: 'Initial setup for the new database schema.', createdAt: subDays(new Date(), 1).toISOString() },
  { id: 'update-8', projectId: 'proj-001', userId: 'user-employee-1', content: 'Deployed v1 to staging.', createdAt: subDays(new Date(), 5).toISOString() },

  // Proj-002 (Active)
  { id: 'update-2', projectId: 'proj-002', userId: 'user-employee-2', content: 'Fixed the bug in the payment gateway integration.', createdAt: new Date().toISOString() },
  { id: 'update-5', projectId: 'proj-002', userId: 'user-employee-2', content: 'Updated the UI components based on feedback.', createdAt: subDays(new Date(), 1).toISOString() },
  { id: 'update-7', projectId: 'proj-002', userId: 'user-employee-2', content: 'Met with the client to discuss the project timeline.', createdAt: subDays(new Date(), 3).toISOString() },

  // Proj-003 (Client Meeting Done -> On Hold)
  { id: 'update-9', projectId: 'proj-003', userId: 'user-employee-3', content: 'Client meeting held, requirements gathered. Project currently on hold pending client feedback.', createdAt: subDays(new Date(), 7).toISOString() },
  
  // Proj-004 (Requirement Sent -> now Active)
  { id: 'update-3', projectId: 'proj-004', userId: 'user-employee-1', content: 'Requirements sent to client for approval.', createdAt: subDays(new Date(), 10).toISOString() },
  { id: 'update-10', projectId: 'proj-004', userId: 'user-employee-1', content: 'Client approved requirements. Started initial project setup.', createdAt: subDays(new Date(), 2).toISOString() },
  { id: 'update-11', projectId: 'proj-004', userId: 'user-employee-1', content: 'Completed the basic layout for the training portal.', createdAt: new Date().toISOString() },

  // Proj-005 (Active)
  { id: 'update-6', projectId: 'proj-005', userId: 'user-employee-1', content: 'User authentication flow is now complete.', createdAt: subDays(new Date(), 2).toISOString() },
  { id: 'update-12', projectId: 'proj-005', userId: 'user-employee-3', content: 'Began work on the data visualization components.', createdAt: new Date().toISOString() },

];


// Simulate API latency
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function getUser(userId: string): Promise<User | undefined> {
  await delay(50);
  return users.find(u => u.id === userId);
}

export async function getUsers(role?: User['role']): Promise<User[]> {
  await delay(50);
  if (role) {
    return users.filter(u => u.role === role);
  }
  return users;
}

export async function getAllProjects(): Promise<Project[]> {
  await delay(100);
  return projects;
}

export async function getActiveProjects(): Promise<Project[]> {
  await delay(100);
  // In a real app, this would be `p.assignedTo.includes(userId)`
  return projects.filter((p) => p.status === 'active');
}

export async function getAllUpdates(): Promise<Update[]> {
  await delay(100);
  return updates;
}


export async function getTodaysUpdates(): Promise<Update[]> {
  await delay(100);
  // In a real app, this would be filtered by userId
  return updates.filter((u) => isToday(new Date(u.createdAt)));
}

export async function saveUpdate(projectId: string, content: string, updateId?: string): Promise<Update> {
  await delay(500);
  
  // In a real app, you'd get the user from the session
  const userId = 'user-employee-1'; 

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
  updates.unshift(newUpdate);
  return newUpdate;
}

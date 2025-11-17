export type User = {
  id: string; // This will be the Firebase UID
  name: string;
  email: string;
  avatarUrl: string;
  role: 'admin' | 'employee' | 'client' | 'applicant';
};

export type Project = {
  id: string; // Firestore document ID
  title: string;
  description: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  estimatedHours: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: 'active' | 'on-hold' | 'completed' | 'archived';
  leadAssignee: string; // User ID
  virtualAssistants: string[]; // Array of User IDs
  freelancers: string[]; // Array of User IDs
  client: string; // Client ID
  name: string; // for compatibility with existing components
};

export type Update = {
  id: string; // Firestore document ID
  projectId: string;
  userId: string;
  content: string; // Summary
  checklist: { item: string; completed: boolean }[];
  nextPlan: string;
  attachments: { name: string; url: string }[];
  createdAt: string; // ISO date string
};

export type Client = {
  id: string; // Firestore document ID
  name: string;
  contactPerson: string;
  email: string;
};

export type AuditLog = {
  id: string;
  userId: string;
  action: string; // e.g., 'create-project', 'edit-update'
  entity: 'project' | 'update' | 'client';
  entityId: string;
  timestamp: string; // ISO date string
  changes: Record<string, any>; // For tracking what was changed
};

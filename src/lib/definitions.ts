export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'admin' | 'employee' | 'client' | 'applicant';
};

export type Project = {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'on-hold' | 'completed';
};

export type Update = {
  id: string;
  projectId: string;
  userId: string;
  content: string;
  createdAt: string; // ISO date string
};

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
  status: 'active' | 'on-hold' | 'completed' | 'archived';
};

export type Update = {
  id: string;
  projectId: string;
  userId: string;
  content: string;
  createdAt: string; // ISO date string
};

export type Client = {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
};

export type ProjectSheetItem = {
    id: string;
    clientName: string;
    clientType: string;
    projectTitle: string;
    projectType: string;
    tags: string[];
    priority: 'High' | 'Medium' | 'Low';
    status: 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
    estimatedHours: number;
    startDate: string; // ISO date string
    endDate: string; // ISO date string
    leadAssignee: string;
    virtualAssistant?: string;
    freelancers?: string[];
    coders?: string[];
    projectLeader?: string;
    githubLink?: string;
    loomLink?: string;
    whatsappLink?: string;
    oneDriveLink?: string;
};

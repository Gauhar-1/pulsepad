

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

export type Milestone = {
  id: string;
  name:string;
  date: string; // ISO date string
  status: 'upcoming' | 'completed' | 'missed';
}

export type ProjectSheetItem = {
    id: string;
    clientName: string;
    clientType: 'New' | 'Existing';
    projectTitle: string;
    projectDescription?: string;
    projectType: 'Client' | 'Research' | 'Management' | 'Training';
    tags: string[];
    priority: 'High' | 'Medium' | 'Low';
    status: 'On Hold' | 'Completed' | 'Cancelled' | 'Client Meeting Done' | 'Contact Made' | 'Active' | 'Reconnected' | 'Stalled' | 'Requirement Sent' | 'Waiting for Requirement' | 'Awaiting Testimonial' | 'Training';
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
    milestones?: Milestone[];
};


export type Employee = {
    id: string;
    name: string;
    skills: string[];
    projects: string[];
    email: string;
    sheetId: string;
    active: boolean;
    type: 'Lead' | 'Core' | 'VA' | 'Coder' | 'Freelancer';
};

export type TrainingProgressLog = {
    id: string;
    notes: string;
    date: string; // ISO date string
}

export type TrainingTask = {
    id: number;
    title: string;
    description: string;
    status: 'completed' | 'in-progress' | 'not-started';
    category: string;
    progress: number;
    progressLogs?: TrainingProgressLog[];
    assignedTo: string[]; // employee ids
    trainerId: string; // employee id
}

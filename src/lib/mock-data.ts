
import type { Employee, ProjectSheetItem, TrainingTask, Update, AssessmentTemplate, DailyAssessment } from '@/lib/definitions';
import { addDays, addMonths, formatISO, subDays } from 'date-fns';

const now = new Date();

export const mockEmployeeData: Employee[] = [
    { id: 'emp-001', name: 'Alex Doe', skills: ['React', 'Node.js', 'TypeScript'], projects: ['QuantumLeap CRM', 'Odyssey Mobile App'], email: 'alex.doe@example.com', sheetId: 'sheet-001', active: true, type: 'Lead' },
    { id: 'emp-002', name: 'Maria Garcia', skills: ['Next.js', 'GraphQL', 'Prisma'], projects: ['Nova E-commerce Platform'], email: 'maria.garcia@example.com', sheetId: 'sheet-002', active: true, type: 'Core' },
    { id: 'emp-003', name: 'Sam Wilson', skills: ['Data Viz', 'D3.js', 'Python'], projects: ['Project Phoenix'], email: 'sam.wilson@example.com', sheetId: 'sheet-003', active: false, type: 'Core' },
    { id: 'emp-004', name: 'Li Wei', skills: ['Angular', 'Java', 'Spring Boot'], projects: [], email: 'li.wei@example.com', sheetId: 'sheet-004', active: true, type: 'VA' },
    { id: 'emp-005', name: 'Fatima Ahmed', skills: ['Vue.js', 'Firebase', 'UX/UI'], projects: ['Titan Analytics Dashboard'], email: 'fatima.ahmed@example.com', sheetId: 'sheet-005', active: true, type: 'Core' },
    { id: 'emp-006', name: 'Kenji Tanaka', skills: ['React Native', 'Swift', 'Kotlin'], projects: ['Odyssey Mobile App'], email: 'kenji.tanaka@example.com', sheetId: 'sheet-006', active: true, type: 'Coder' },
    { id: 'emp-007', name: 'Isabella Rossi', skills: ['PHP', 'Laravel', 'MySQL'], projects: [], email: 'isabella.rossi@example.com', sheetId: 'sheet-007', active: false, type: 'Core' },
    { id: 'emp-008', name: 'David Chen', skills: ['Go', 'Docker', 'Kubernetes'], projects: ['QuantumLeap CRM'], email: 'david.chen@example.com', sheetId: 'sheet-008', active: true, type: 'Lead' },
    { id: 'emp-009', name: 'Aisha Khan', skills: ['Flutter', 'Dart', 'Firebase'], projects: [], email: 'aisha.khan@example.com', sheetId: 'sheet-009', active: true, type: 'VA' },
    { id: 'emp-010', name: 'Carlos Gomez', skills: ['C#', '.NET', 'Azure'], projects: ['Titan Analytics Dashboard'], email: 'carlos.gomez@example.com', sheetId: 'sheet-010', active: true, type: 'Coder' },
    { id: 'emp-011', name: 'Olivia Martinez', skills: ['Svelte', 'Sapper', 'PostgreSQL'], projects: [], email: 'olivia.martinez@example.com', sheetId: 'sheet-011', active: false, type: 'Core' },
    { id: 'emp-012', name: 'Ben Carter', skills: ['React', 'Redux', 'Jest'], projects: ['Nova E-commerce Platform'], email: 'ben.carter@example.com', sheetId: 'sheet-012', active: true, type: 'Freelancer' },
    { id: 'emp-013', name: 'Chloe Dubois', skills: ['Ruby on Rails', 'Heroku'], projects: [], email: 'chloe.dubois@example.com', sheetId: 'sheet-013', active: true, 'type': 'Core' },
    { id: 'emp-014', name: 'Arjun Reddy', skills: ['Python', 'Django', 'AWS'], projects: ['Project Phoenix'], email: 'arjun.reddy@example.com', sheetId: 'sheet-014', active: true, type: 'Lead' },
    { id: 'emp-015', name: 'Sofia Petrov', skills: ['JavaScript', 'HTML', 'CSS'], projects: [], email: 'sofia.petrov@example.com', sheetId: 'sheet-015', active: false, type: 'Freelancer' },
];


export const mockProjectData: ProjectSheetItem[] = [
  {
    id: 'proj-001',
    clientName: 'Stellar Solutions',
    clientType: 'Existing',
    projectTitle: 'QuantumLeap CRM',
    projectDescription: 'A next-generation CRM platform for enterprise clients, focusing on AI-driven insights and automation. The goal is to enhance sales productivity and streamline customer relationship management.',
    projectType: 'Client',
    tags: ['CRM', 'SaaS', 'AI', 'Stock'],
    priority: 'High',
    status: 'Active',
    estimatedHours: 250,
    startDate: '2024-06-01',
    endDate: '2024-12-31',
    leadAssignee: 'Alex Doe',
    virtualAssistant: 'Li Wei',
    coders: ['Kenji Tanaka'],
    freelancers: [],
    projectLeader: 'Maria Garcia',
    githubLink: 'https://github.com/example/quantumleap',
    loomLink: 'https://loom.com/share/12345',
    whatsappLink: 'https://wa.me/1234567890',
    oneDriveLink: 'https://onedrive.live.com/redir?resid=12345',
    milestones: [
        { id: 'm1-1', name: 'Kick-off Meeting', date: formatISO(addMonths(now, -1), { representation: 'date' }), status: 'completed' },
        { id: 'm1-2', name: 'Design Mockups Approved', date: formatISO(addDays(now, -15), { representation: 'date' }), status: 'completed' },
        { id: 'm1-3', name: 'Alpha Release', date: formatISO(addMonths(now, 2), { representation: 'date' }), status: 'upcoming' },
        { id: 'm1-4', name: 'Beta Testing', date: formatISO(addMonths(now, 4), { representation: 'date' }), status: 'upcoming' },
        { id: 'm1-5', name: 'Final Launch', date: formatISO(addMonths(now, 5), { representation: 'date' }), status: 'upcoming' },
    ]
  },
  {
    id: 'proj-002',
    clientName: 'Orion Commerce',
    clientType: 'New',
    projectTitle: 'Nova E-commerce Platform',
    projectDescription: 'Building a headless e-commerce platform with a focus on performance and scalability. This project involves creating a custom storefront and a robust backend to handle high traffic.',
    projectType: 'Client',
    tags: ['React', 'Next.js', 'E-commerce'],
    priority: 'High',
    status: 'Active',
    estimatedHours: 400,
    startDate: '2024-05-15',
    endDate: '2025-01-31',
    leadAssignee: 'David Chen',
    virtualAssistant: 'Aisha Khan',
    coders: ['Carlos Gomez'],
    freelancers: ['Ben Carter'],
    projectLeader: 'Fatima Ahmed',
    githubLink: 'https://github.com/example/nova-commerce',
    loomLink: 'https://loom.com/share/67890',
    whatsappLink: 'https://wa.me/0987654321',
    oneDriveLink: 'https://onedrive.live.com/redir?resid=67890',
    milestones: [
      { id: 'm2-1', name: 'Initial Scoping', date: formatISO(addMonths(now, -2), { representation: 'date' }), status: 'completed' },
      { id: 'm2-2', name: 'Backend API Deployed', date: formatISO(addDays(now, 20), { representation: 'date' }), status: 'upcoming' },
      { id: 'm2-3', name: 'Storefront V1', date: formatISO(addMonths(now, 2), { representation: 'date' }), status: 'upcoming' },
    ]
  },
  {
    id: 'proj-003',
    clientName: 'Meridian Inc.',
    clientType: 'Existing',
    projectTitle: 'Project Phoenix',
    projectDescription: 'An internal R&D project to explore the viability of using machine learning for predictive analytics in the logistics sector. This is a research-heavy project with a focus on creating a proof-of-concept.',
    projectType: 'Research',
    tags: ['data-viz', 'reporting', 'ML'],
    priority: 'Medium',
    status: 'Client Meeting Done',
    estimatedHours: 120,
    startDate: '2024-07-01',
    endDate: '2024-10-31',
    leadAssignee: 'Arjun Reddy',
    virtualAssistant: 'Li Wei',
    coders: [],
    freelancers: [],
    projectLeader: 'Maria Garcia',
    githubLink: 'https://github.com/example/project-phoenix',
    loomLink: '',
    whatsappLink: '',
    oneDriveLink: '',
    milestones: [
        { id: 'm3-1', name: 'Data Source Integration', date: formatISO(addDays(now, 10), { representation: 'date' }), status: 'upcoming' },
        { id: 'm3-2', name: 'Model Training Complete', date: formatISO(addMonths(now, 1), { representation: 'date' }), status: 'upcoming' },
    ]
  },
  {
    id: 'proj-004',
    clientName: 'Internal',
    clientType: 'New',
    projectTitle: 'Employee Training Portal',
    projectDescription: 'A new portal for onboarding and continuous training of employees. Will include video modules, quizzes, and progress tracking.',
    projectType: 'Training',
    tags: ['HR', 'Training', 'Internal'],
    priority: 'Low',
    status: 'Requirement Sent',
    estimatedHours: 80,
    startDate: '2024-09-01',
    endDate: '2024-12-15',
    leadAssignee: 'Alex Doe',
    projectLeader: 'Fatima Ahmed',
    coders: ['Kenji Tanaka'],
    milestones: [
        { id: 'm4-1', name: 'Finalize Curriculum', date: formatISO(addMonths(now, 1), { representation: 'date' }), status: 'upcoming' },
    ]
  },
   {
    id: 'proj-005',
    clientName: 'Internal',
    clientType: 'New',
    projectTitle: 'Project Management Dashboard',
    projectDescription: 'A comprehensive dashboard for the management team to oversee all ongoing projects, employee assignments, and resource allocation.',
    projectType: 'Management',
    tags: ['Dashboard', 'Internal', 'Admin', 'Stock'],
    priority: 'High',
    status: 'Active',
    estimatedHours: 150,
    startDate: '2024-08-01',
    endDate: '2024-11-30',
    leadAssignee: 'David Chen',
    virtualAssistant: 'Aisha Khan',
    coders: ['Carlos Gomez'],
    projectLeader: 'Maria Garcia',
    milestones: [
        { id: 'm5-1', name: 'Data Model Definition', date: formatISO(addDays(now, -5), { representation: 'date' }), status: 'completed' },
        { id: 'm5-2', name: 'UI/UX Wireframes', date: formatISO(addDays(now, 7), { representation: 'date' }), status: 'upcoming' },
        { id: 'm5-3', name: 'Dashboard V1', date: formatISO(addMonths(now, 1), { representation: 'date' }), status: 'upcoming' },
    ]
  },
];

export let mockUpdates: Update[] = [
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


export const mockTrainingTasks: TrainingTask[] = [
  { 
    id: 1, 
    title: 'Advanced React Hooks', 
    description: 'A deep dive into advanced React hooks like useReducer, useCallback, and custom hooks to optimize performance and state management.', 
    status: 'completed', 
    category: 'Frontend', 
    progress: 100,
    progressLogs: [
        { id: 'log-1-1', notes: 'Finished the module on custom hooks. Built a useLocalStorage hook.', date: formatISO(subDays(now, 7), { representation: 'date' }) },
        { id: 'log-1-2', notes: 'Completed the final assessment with a 95% score.', date: formatISO(subDays(now, 2), { representation: 'date' }) }
    ],
    assignedTo: ['emp-002'],
    trainerId: 'emp-001'
  },
  { 
    id: 2, 
    title: 'Next.js 14 Deep Dive', 
    description: 'Explore the latest features in Next.js 14, including Server Actions, partial pre-rendering, and advanced routing techniques.', 
    status: 'in-progress', 
    category: 'Framework', 
    progress: 45,
    progressLogs: [
        { id: 'log-2-1', notes: 'Completed the section on Server Actions. It\'s a powerful feature for forms.', date: formatISO(subDays(now, 1), { representation: 'date' }) },
    ],
    assignedTo: ['emp-001', 'emp-006'],
    trainerId: 'emp-008'
  },
  { 
    id: 3, 
    title: 'Introduction to Tailwind CSS', 
    description: 'Learn the fundamentals of utility-first CSS with Tailwind, covering setup, configuration, and responsive design.', 
    status: 'not-started', 
    category: 'Styling', 
    progress: 0,
    progressLogs: [],
    assignedTo: ['emp-005'],
    trainerId: 'emp-001'
  },
  { 
    id: 4, 
    title: 'Mastering TypeScript', 
    description: 'From basic types to advanced concepts like generics, decorators, and mapped types, this course covers everything you need to be proficient in TypeScript.', 
    status: 'not-started', 
    category: 'Language', 
    progress: 0,
    progressLogs: [],
    assignedTo: ['emp-010', 'emp-012'],
    trainerId: 'emp-002'
  },
  { 
    id: 5, 
    title: 'Server Actions in Next.js', 
    description: 'Understand how to use Server Actions for data mutations and form submissions without creating separate API endpoints.', 
    status: 'completed', 
    category: 'Framework', 
    progress: 100,
    progressLogs: [
      { id: 'log-5-1', notes: 'This was a great refresher. Solidified my understanding of the topic.', date: formatISO(subDays(now, 10), { representation: 'date' }) }
    ],
    assignedTo: ['emp-014'],
    trainerId: 'emp-008'
  },
];

export const mockAuditLogs = [
    {
        id: 'log-001',
        user: { name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=admin' },
        action: 'updated the status',
        project: 'QuantumLeap CRM',
        details: { from: 'Active', to: 'On Hold' },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        icon: 'Edit3',
    },
    {
        id: 'log-002',
        user: { name: 'David Chen', avatar: 'https://i.pravatar.cc/150?u=emp-008' },
        action: 'assigned a new coder',
        project: 'Nova E-commerce Platform',
        details: { coder: 'Kenji Tanaka' },
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        icon: 'User',
    },
    {
        id: 'log-003',
        user: { name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=admin' },
        action: 'created a new project',
        project: 'Internal Onboarding Portal',
        details: null,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        icon: 'PlusCircle',
    },
    {
        id: 'log-004',
        user: { name: 'Alex Doe', avatar: 'https://i.pravatar.cc/150?u=emp-001' },
        action: 'changed the end date',
        project: 'Project Phoenix',
        details: { from: '2024-10-31', to: '2024-11-15' },
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        icon: 'Edit3',
    },
    {
        id: 'log-005',
        user: { name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=admin' },
        action: 'deleted a project',
        project: 'Legacy System Support',
        details: null,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        icon: 'Trash2',
    }
];

export const mockNotifications = [
    {
        id: 'notif-001',
        subject: 'Project Assignment: QuantumLeap CRM',
        message: "You have been assigned as the Project Leader for QuantumLeap CRM. Please review the project details and connect with the team.",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        read: false,
    },
    {
        id: 'notif-002',
        subject: 'Daily Update Reminder',
        message: "This is a friendly reminder to submit your daily updates for all active projects before the end of the day.",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        read: false,
    },
    {
        id: 'notif-003',
        subject: 'Deadline Approaching: Nova E-commerce',
        message: "The deadline for the 'Development Sprint 1' milestone for the Nova E-commerce Platform is in 3 days. Please ensure all tasks are on track.",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
    },
     {
        id: 'notif-004',
        subject: 'New Company-wide Training Module',
        message: "A new training module, 'Advanced TypeScript Techniques', has been assigned to you. Please complete it by the end of next week.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
    },
];

export const mockAssessmentTemplates: AssessmentTemplate[] = [
    {
        id: 'template-001',
        name: 'Daily Punctuality & Availability',
        checklist: [
            { id: 'chk-1', text: 'Was available on WhatsApp at 9 AM?', weight: 1 },
            { id: 'chk-2', text: 'Was available on WhatsApp at 11 AM?', weight: 1 },
            { id: 'chk-3', text: 'Was available on WhatsApp at 2 PM?', weight: 1 },
            { id: 'chk-4', text: 'Was available on WhatsApp at 4 PM?', weight: 1 },
        ]
    },
    {
        id: 'template-002',
        name: 'End of Day Report',
        checklist: [
            { id: 'chk-5', text: 'Submitted EOD report before 6 PM?', weight: 2 },
            { id: 'chk-6', text: 'Report was detailed and clear?', weight: 1 },
        ]
    }
];

export const mockDailyAssessments: DailyAssessment[] = [
    {
        id: 'assess-001',
        employeeId: 'emp-001',
        templateId: 'template-001',
        date: formatISO(now, { representation: 'date' }),
        status: 'SUBMITTED',
        responses: [
            { checklistItemId: 'chk-1', answer: true },
            { checklistItemId: 'chk-2', answer: true },
            { checklistItemId: 'chk-3', answer: false },
            { checklistItemId: 'chk-4', answer: true },
        ],
    },
    {
        id: 'assess-002',
        employeeId: 'emp-002',
        templateId: 'template-001',
        date: formatISO(now, { representation: 'date' }),
        status: 'SUBMITTED',
        responses: [
            { checklistItemId: 'chk-1', answer: true },
            { checklistItemId: 'chk-2', answer: true },
            { checklistItemId: 'chk-3', answer: true },
            { checklistItemId: 'chk-4', answer: true },
        ],
    },
    {
        id: 'assess-003',
        employeeId: 'emp-006',
        templateId: 'template-002',
        date: formatISO(subDays(now, 1), { representation: 'date' }),
        status: 'VALIDATED',
        responses: [
            { checklistItemId: 'chk-5', answer: true },
            { checklistItemId: 'chk-6', answer: false },
        ],
        adminCorrections: [
            { checklistItemId: 'chk-6', correctedAnswer: true }
        ],
        finalScore: 0.5
    },
    {
        id: 'assess-005',
        employeeId: 'emp-002',
        templateId: 'template-002',
        date: formatISO(subDays(now, 2), { representation: 'date' }),
        status: 'VALIDATED',
        responses: [
            { checklistItemId: 'chk-5', answer: true },
            { checklistItemId: 'chk-6', answer: true },
        ],
        finalScore: 1
    },
    {
        id: 'assess-006',
        employeeId: 'emp-005',
        templateId: 'template-001',
        date: formatISO(subDays(now, 2), { representation: 'date' }),
        status: 'VALIDATED',
        responses: [
            { checklistItemId: 'chk-1', answer: true },
            { checklistItemId: 'chk-2', answer: true },
            { checklistItemId: 'chk-3', answer: true },
            { checklistItemId: 'chk-4', answer: true },
        ],
        finalScore: 1
    },
    {
        id: 'assess-007',
        employeeId: 'emp-008',
        templateId: 'template-001',
        date: formatISO(subDays(now, 3), { representation: 'date' }),
        status: 'VALIDATED',
        responses: [
            { checklistItemId: 'chk-1', answer: false },
            { checklistItemId: 'chk-2', answer: true },
            { checklistItemId: 'chk-3', answer: true },
            { checklistItemId: 'chk-4', answer: false },
        ],
        finalScore: 0.5
    },
    {
        id: 'assess-008',
        employeeId: 'emp-009',
        templateId: 'template-002',
        date: formatISO(subDays(now, 3), { representation: 'date' }),
        status: 'VALIDATED',
        responses: [
            { checklistItemId: 'chk-5', answer: true },
            { checklistItemId: 'chk-6', answer: true },
        ],
        finalScore: 1
    },
    // Add more validated data for other employees
    {
        id: 'assess-009',
        employeeId: 'emp-001',
        templateId: 'template-002',
        date: formatISO(subDays(now, 4), { representation: 'date' }),
        status: 'VALIDATED',
        responses: [
            { checklistItemId: 'chk-5', answer: true },
            { checklistItemId: 'chk-6', answer: true },
        ],
        finalScore: 1
    },
    {
        id: 'assess-010',
        employeeId: 'emp-003',
        templateId: 'template-001',
        date: formatISO(subDays(now, 2), { representation: 'date' }),
        status: 'VALIDATED',
        responses: [
            { checklistItemId: 'chk-1', answer: true },
            { checklistItemId: 'chk-2', answer: false },
            { checklistItemId: 'chk-3', answer: true },
            { checklistItemId: 'chk-4', answer: true },
        ],
        finalScore: 0.75
    },
    {
        id: 'assess-011',
        employeeId: 'emp-004',
        templateId: 'template-001',
        date: formatISO(subDays(now, 3), { representation: 'date' }),
        status: 'VALIDATED',
        responses: [
            { checklistItemId: 'chk-1', answer: true },
            { checklistItemId: 'chk-2', answer: true },
            { checklistItemId: 'chk-3', answer: true },
            { checklistItemId: 'chk-4', answer: true },
        ],
        finalScore: 1
    },
    {
        id: 'assess-012',
        employeeId: 'emp-007',
        templateId: 'template-002',
        date: formatISO(subDays(now, 1), { representation: 'date' }),
        status: 'VALIDATED',
        responses: [
            { checklistItemId: 'chk-5', answer: false },
            { checklistItemId: 'chk-6', answer: false },
        ],
        finalScore: 0
    },
    {
        id: 'assess-013',
        employeeId: 'emp-010',
        templateId: 'template-001',
        date: formatISO(subDays(now, 4), { representation: 'date' }),
        status: 'VALIDATED',
        responses: [
            { checklistItemId: 'chk-1', answer: true },
            { checklistItemId: 'chk-2', answer: true },
            { checklistItemId: 'chk-3', answer: true },
            { checklistItemId: 'chk-4', answer: false },
        ],
        finalScore: 0.75
    },
    {
        id: 'assess-014',
        employeeId: 'emp-011',
        templateId: 'template-001',
        date: formatISO(subDays(now, 2), { representation: 'date' }),
        status: 'VALIDATED',
        responses: [
            { checklistItemId: 'chk-1', answer: true },
            { checklistItemId: 'chk-2', answer: true },
            { checklistItemId: 'chk-3', answer: true },
            { checklistItemId: 'chk-4', answer: true },
        ],
        finalScore: 1
    },
    {
        id: 'assess-015',
        employeeId: 'emp-012',
        templateId: 'template-002',
        date: formatISO(subDays(now, 1), { representation: 'date' }),
        status: 'VALIDATED',
        responses: [
            { checklistItemId: 'chk-5', answer: true },
            { checklistItemId: 'chk-6', answer: true },
        ],
        finalScore: 1
    },
    {
        id: 'assess-016',
        employeeId: 'emp-013',
        templateId: 'template-001',
        date: formatISO(subDays(now, 5), { representation: 'date' }),
        status: 'VALIDATED',
        responses: [
            { checklistItemId: 'chk-1', answer: true },
            { checklistItemId: 'chk-2', answer: false },
            { checklistItemId: 'chk-3', answer: false },
            { checklistItemId: 'chk-4', answer: true },
        ],
        finalScore: 0.5
    },
    {
        id: 'assess-017',
        employeeId: 'emp-014',
        templateId: 'template-001',
        date: formatISO(subDays(now, 3), { representation: 'date' }),
        status: 'VALIDATED',
        responses: [
            { checklistItemId: 'chk-1', answer: true },
            { checklistItemId: 'chk-2', answer: true },
            { checklistItemId: 'chk-3', answer: true },
            { checklistItemId: 'chk-4', answer: true },
        ],
        finalScore: 1
    },
    {
        id: 'assess-018',
        employeeId: 'emp-015',
        templateId: 'template-002',
        date: formatISO(subDays(now, 2), { representation: 'date' }),
        status: 'VALIDATED',
        responses: [
            { checklistItemId: 'chk-5', answer: true },
            { checklistItemId: 'chk-6', answer: false },
        ],
        finalScore: 0.66
    },
];


    
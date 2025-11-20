import mongoose, { Schema, models } from 'mongoose';
import { withVirtualId } from './utils/withVirtualId';

export interface IProject {
  _id: string;
  clientId?: string;
  clientName: string;
  clientType: 'New' | 'Existing';
  projectTitle: string;
  projectDescription?: string;
  projectType: 'Client' | 'Research' | 'Management' | 'Training';
  tags: string[];
  priority: 'High' | 'Medium' | 'Low';
  status: string;
  estimatedHours: number;
  startDate: string;
  endDate: string;
  leadAssignee: string;
  virtualAssistant?: string;
  freelancers?: string[];
  coders?: string[];
  projectLeader?: string;
  assignedEmployees: string[];
  projectRequestId?: string;
  githubLink?: string;
  loomLink?: string;
  whatsappLink?: string;
  oneDriveLink?: string;
  milestones?: {
    id: string;
    name: string;
    date: string;
    status: 'upcoming' | 'completed' | 'missed';
  }[];
}

const MilestoneSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['upcoming', 'completed', 'missed'], required: true },
  },
  { _id: false },
);

const ProjectSchema = new Schema<IProject>(
  {
    _id: { type: String, required: true },
    clientId: { type: String },
    clientName: { type: String, required: true },
    clientType: { type: String, enum: ['New', 'Existing'], required: true },
    projectTitle: { type: String, required: true },
    projectDescription: { type: String },
    projectType: { type: String, enum: ['Client', 'Research', 'Management', 'Training'], required: true },
    tags: [{ type: String, required: true }],
    priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
    status: { type: String, required: true },
    estimatedHours: { type: Number, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    leadAssignee: { type: String, required: true },
    virtualAssistant: { type: String },
    freelancers: [{ type: String }],
    coders: [{ type: String }],
    projectLeader: { type: String },
    assignedEmployees: [{ type: String }],
    projectRequestId: { type: String },
    githubLink: { type: String },
    loomLink: { type: String },
    whatsappLink: { type: String },
    oneDriveLink: { type: String },
    milestones: [MilestoneSchema],
  },
  { timestamps: true },
);

withVirtualId(ProjectSchema);

export default models.Project || mongoose.model<IProject>('Project', ProjectSchema);


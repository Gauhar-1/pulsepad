import mongoose, { Schema, models } from 'mongoose';
import { withVirtualId } from './utils/withVirtualId';

export interface IProjectRequest {
  _id: string;
  clientId: string;
  projectTitle: string;
  projectDescription?: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes?: string;
  adminReviewerId?: string;
  projectId?: string;
}

const ProjectRequestSchema = new Schema<IProjectRequest>(
  {
    _id: { type: String, required: true },
    clientId: { type: String, required: true, index: true },
    projectTitle: { type: String, required: true },
    projectDescription: { type: String },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    adminNotes: { type: String },
    adminReviewerId: { type: String },
    projectId: { type: String },
  },
  { timestamps: true },
);

withVirtualId(ProjectRequestSchema);

export default models.ProjectRequest || mongoose.model<IProjectRequest>('ProjectRequest', ProjectRequestSchema);


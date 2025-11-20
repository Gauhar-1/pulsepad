import mongoose, { Schema, models } from 'mongoose';
import { withVirtualId } from './utils/withVirtualId';

export interface ICandidate {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: 'Interviewing' | 'New' | 'Hired' | 'Rejected';
  avatarUrl: string;
}

const CandidateSchema = new Schema<ICandidate>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, enum: ['Interviewing', 'New', 'Hired', 'Rejected'], required: true },
    avatarUrl: { type: String, required: true },
  },
  { timestamps: true },
);

withVirtualId(CandidateSchema);

export default models.Candidate || mongoose.model<ICandidate>('Candidate', CandidateSchema);


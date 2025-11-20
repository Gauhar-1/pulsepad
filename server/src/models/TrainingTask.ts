import mongoose, { Schema, models } from 'mongoose';
import { withVirtualId } from './utils/withVirtualId';

export interface ITrainingTask {
  _id: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'not-started';
  category: string;
  progress: number;
  progressLogs: {
    id: string;
    notes: string;
    date: string;
  }[];
  assignedTo: string[];
  trainerId: string;
}

const ProgressLogSchema = new Schema(
  {
    id: { type: String, required: true },
    notes: { type: String, required: true },
    date: { type: String, required: true },
  },
  { _id: false },
);

const TrainingTaskSchema = new Schema<ITrainingTask>(
  {
    _id: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['completed', 'in-progress', 'not-started'], required: true },
    category: { type: String, required: true },
    progress: { type: Number, required: true },
    progressLogs: [ProgressLogSchema],
    assignedTo: [{ type: String, required: true }],
    trainerId: { type: String, required: true },
  },
  { timestamps: true },
);

withVirtualId(TrainingTaskSchema);

export default models.TrainingTask || mongoose.model<ITrainingTask>('TrainingTask', TrainingTaskSchema);


import mongoose, { Schema, models } from 'mongoose';
import { withVirtualId } from './utils/withVirtualId';

export interface IUpdateLog {
  _id: string;
  projectId: string;
  userId: string;
  content: string;
  createdAt: string;
}

const UpdateLogSchema = new Schema<IUpdateLog>(
  {
    _id: { type: String, required: true },
    projectId: { type: String, required: true },
    userId: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { timestamps: true },
);

withVirtualId(UpdateLogSchema);

export default models.UpdateLog || mongoose.model<IUpdateLog>('UpdateLog', UpdateLogSchema);


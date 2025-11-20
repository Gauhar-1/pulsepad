import mongoose, { Schema, models } from 'mongoose';
import { withVirtualId } from './utils/withVirtualId';

export interface IAuditLog {
  _id: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  project: string;
  details?: Record<string, unknown> | null;
  timestamp: string;
  icon: string;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    _id: { type: String, required: true },
    user: {
      name: { type: String, required: true },
      avatar: { type: String, required: true },
    },
    action: { type: String, required: true },
    project: { type: String, required: true },
    details: { type: Schema.Types.Mixed, default: null },
    timestamp: { type: String, required: true },
    icon: { type: String, required: true },
  },
  { timestamps: true },
);

withVirtualId(AuditLogSchema);

export default models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);


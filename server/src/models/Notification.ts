import mongoose, { Schema, models } from 'mongoose';
import { withVirtualId } from './utils/withVirtualId';

export interface INotification {
  _id: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const NotificationSchema = new Schema<INotification>(
  {
    _id: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

withVirtualId(NotificationSchema);

export default models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);


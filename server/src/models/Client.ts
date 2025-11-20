import mongoose, { Schema, models } from 'mongoose';
import { withVirtualId } from './utils/withVirtualId';

export interface IClient {
  _id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

const ClientSchema = new Schema<IClient>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    company: { type: String },
    phone: { type: String },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true },
);

withVirtualId(ClientSchema);

export default models.Client || mongoose.model<IClient>('Client', ClientSchema);


import mongoose, { Schema, models } from 'mongoose';
import { withVirtualId } from './utils/withVirtualId';

export interface IEmployee {
  _id: string;
  name: string;
  skills: string[];
  projects: string[];
  email: string;
  googleId?: string;
  sheetId: string;
  status: 'ACTIVE' | 'INACTIVE';
  role: 'admin' | 'employee';
  type: 'Lead' | 'Core' | 'VA' | 'Coder' | 'Freelancer';
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    skills: [{ type: String, required: true }],
    projects: [{ type: String, required: true }],
    email: { type: String, required: true, lowercase: true, unique: true },
    googleId: { type: String },
    sheetId: { type: String, required: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
    role: {
      type: String,
      enum: ['admin', 'employee'],
      default: 'employee',
    },
    type: {
      type: String,
      enum: ['Lead', 'Core', 'VA', 'Coder', 'Freelancer'],
      required: true,
    },
  },
  { timestamps: true },
);

withVirtualId(EmployeeSchema);

export default models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);


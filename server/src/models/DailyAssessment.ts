import mongoose, { Schema, models } from 'mongoose';

export interface IDailyAssessment {
  employeeId: string;
  templateId: string;
  date: string;
  status: 'ASSIGNED' | 'SUBMITTED' | 'VALIDATED';
  responses: {
    checklistItemId: string;
    answer: boolean;
  }[];
  adminCorrections?: {
    checklistItemId: string;
    correctedAnswer: boolean;
  }[];
  finalScore?: number;
}

const DailyAssessmentSchema = new Schema<IDailyAssessment>(
  {
    employeeId: { type: String, required: true, index: true },
    templateId: { type: String, ref: 'AssessmentTemplate', required: true },
    date: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ['ASSIGNED', 'SUBMITTED', 'VALIDATED'],
      default: 'ASSIGNED',
    },
    responses: [
      {
        checklistItemId: { type: String, required: true },
        answer: { type: Boolean, required: true },
        _id: false,
      },
    ],
    adminCorrections: [
      {
        checklistItemId: { type: String, required: true },
        correctedAnswer: { type: Boolean, required: true },
        _id: false,
      },
    ],
    finalScore: { type: Number },
  },
  {
    timestamps: true,
  },
);

export default models.DailyAssessment || mongoose.model<IDailyAssessment>('DailyAssessment', DailyAssessmentSchema);


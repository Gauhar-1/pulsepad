import mongoose, { Document, Schema, models } from 'mongoose';

export interface IDailyAssessment extends Document {
  employeeId: string;
  templateId: mongoose.Schema.Types.ObjectId;
  date: string;
  status: 'ASSIGNED' | 'SUBMITTED' | 'VALIDATED';
  responses: {
    checklistItemId: mongoose.Schema.Types.ObjectId;
    answer: boolean;
  }[];
  adminCorrections?: {
    checklistItemId: mongoose.Schema.Types.ObjectId;
    correctedAnswer: boolean;
  }[];
  finalScore?: number;
}

const DailyAssessmentSchema = new Schema<IDailyAssessment>({
  employeeId: { type: String, required: true, index: true },
  templateId: { type: Schema.Types.ObjectId, ref: 'AssessmentTemplate', required: true },
  date: { type: String, required: true, index: true },
  status: {
    type: String,
    enum: ['ASSIGNED', 'SUBMITTED', 'VALIDATED'],
    default: 'ASSIGNED',
  },
  responses: [{
    checklistItemId: { type: Schema.Types.ObjectId, required: true },
    answer: { type: Boolean, required: true },
    _id: false
  }],
  adminCorrections: [{
    checklistItemId: { type: Schema.Types.ObjectId, required: true },
    correctedAnswer: { type: Boolean, required: true },
    _id: false
  }],
  finalScore: { type: Number },
}, {
  timestamps: true,
});

export default models.DailyAssessment || mongoose.model<IDailyAssessment>('DailyAssessment', DailyAssessmentSchema);

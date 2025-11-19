import mongoose, { Document, Schema, models } from 'mongoose';

export interface IChecklistItem extends Document {
  text: string;
  weight: number;
}

export interface IAssessmentTemplate extends Document {
  name: string;
  checklist: IChecklistItem[];
}

const ChecklistItemSchema = new Schema({
  text: { type: String, required: true },
  weight: { type: Number, required: true, default: 1 },
});

const AssessmentTemplateSchema = new Schema<IAssessmentTemplate>({
  name: {
    type: String,
    required: [true, 'Template name is required.'],
    trim: true,
  },
  checklist: [ChecklistItemSchema],
}, {
  timestamps: true,
});

export default models.AssessmentTemplate || mongoose.model<IAssessmentTemplate>('AssessmentTemplate', AssessmentTemplateSchema);

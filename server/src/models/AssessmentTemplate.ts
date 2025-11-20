import mongoose, { Schema, models } from 'mongoose';

export interface IChecklistItem {
  _id: string;
  text: string;
  weight: number;
}

export interface IAssessmentTemplate {
  _id: string;
  name: string;
  checklist: IChecklistItem[];
}

const ChecklistItemSchema = new Schema<IChecklistItem>({
  _id: { type: String, required: true },
  text: { type: String, required: true },
  weight: { type: Number, required: true, default: 1 },
});

const AssessmentTemplateSchema = new Schema<IAssessmentTemplate>(
  {
    _id: { type: String, required: true },
    name: {
      type: String,
      required: [true, 'Template name is required.'],
      trim: true,
    },
    checklist: [ChecklistItemSchema],
  },
  {
    timestamps: true,
  },
);

export default models.AssessmentTemplate || mongoose.model<IAssessmentTemplate>('AssessmentTemplate', AssessmentTemplateSchema);


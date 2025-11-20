import { randomUUID } from 'crypto';
import { Router } from 'express';
import { formatISO } from 'date-fns';
import AssessmentTemplate from '../../models/AssessmentTemplate';
import DailyAssessment from '../../models/DailyAssessment';
import { connectToDatabase } from '../../lib/mongodb';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

const normalizeChecklist = (items: Array<{ _id?: string; id?: string; text: string; weight: number }>) =>
  items.map((item) => ({
    _id: item._id || item.id || `cli-${randomUUID()}`,
    text: item.text,
    weight: item.weight,
  }));

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    await connectToDatabase();
    const today = formatISO(new Date(), { representation: 'date' });
    const [assessments, templates] = await Promise.all([
      DailyAssessment.find({ date: today }).populate('templateId').lean(),
      AssessmentTemplate.find({}).sort({ createdAt: -1 }).lean(),
    ]);

    res.json({
      assessments: JSON.parse(JSON.stringify(assessments)),
      templates: JSON.parse(JSON.stringify(templates)),
    });
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    const { employeeIds, templateIds } = req.body as { employeeIds?: string[]; templateIds?: string[] };

    if (!employeeIds?.length || !templateIds?.length) {
      return res.status(400).json({ message: 'Missing employeeIds or templateIds' });
    }

    const today = formatISO(new Date(), { representation: 'date' });
    const assignments: Array<Record<string, unknown>> = [];

    for (const employeeId of employeeIds) {
      for (const templateId of templateIds) {
        const exists = await DailyAssessment.findOne({ employeeId, templateId, date: today });
        if (!exists) {
          assignments.push({
            employeeId,
            templateId,
            date: today,
            status: 'ASSIGNED',
            responses: [],
          });
        }
      }
    }

    if (assignments.length) {
      await DailyAssessment.insertMany(assignments);
    }

    res.status(201).json({ message: `${assignments.length} assignments created successfully.` });
  }),
);

router.put(
  '/submissions/:id',
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    const { status, adminCorrections, finalScore } = req.body;
    const assessment = await DailyAssessment.findByIdAndUpdate(
      req.params.id,
      { status, adminCorrections, finalScore },
      { new: true, runValidators: true },
    )
      .populate('templateId')
      .lean();

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    res.json(JSON.parse(JSON.stringify(assessment)));
  }),
);

router.get(
  '/templates',
  asyncHandler(async (_req, res) => {
    await connectToDatabase();
    const templates = await AssessmentTemplate.find({}).sort({ createdAt: -1 }).lean();
    res.json(JSON.parse(JSON.stringify(templates)));
  }),
);

router.post(
  '/templates',
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    const { checklist = [], name } = req.body;
    const templatePayload = {
      _id: req.body._id || `template-${randomUUID()}`,
      name,
      checklist: normalizeChecklist(checklist),
    };
    const newTemplate = await AssessmentTemplate.create(templatePayload);
    res.status(201).json(JSON.parse(JSON.stringify(newTemplate)));
  }),
);

router.put(
  '/templates/:id',
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    const { checklist = [], name } = req.body;
    const payload = {
      name,
      checklist: normalizeChecklist(checklist),
    };
    const updated = await AssessmentTemplate.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json(JSON.parse(JSON.stringify(updated)));
  }),
);

router.delete(
  '/templates/:id',
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    const deleted = await AssessmentTemplate.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.status(204).send();
  }),
);

export default router;


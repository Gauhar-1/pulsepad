import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { connectToDatabase } from '../../lib/mongodb';
import DailyAssessment from '../../models/DailyAssessment';
import AssessmentTemplate from '../../models/AssessmentTemplate';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    await new Promise((resolve) => setTimeout(resolve, 800));
    const filter: Record<string, unknown> = {};
    if (req.user?.role === 'employee') {
      filter.employeeId = req.user.sub;
    }
    const [assessments, templates] = await Promise.all([
      DailyAssessment.find(filter).populate('templateId').exec(),
      AssessmentTemplate.find().sort({ createdAt: -1 }).exec(),
    ]);

    res.json({
      assessments,
      templates,
    });
  }),
);

export default router;


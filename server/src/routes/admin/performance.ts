import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { connectToDatabase } from '../../lib/mongodb';
import DailyAssessment from '../../models/DailyAssessment';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    await connectToDatabase();
    const pipeline = [
      { $match: { status: 'VALIDATED', finalScore: { $ne: null } } },
      {
        $addFields: {
          month: { $dateToString: { format: '%Y-%m', date: { $toDate: '$date' } } },
        },
      },
      {
        $group: {
          _id: { employeeId: '$employeeId', month: '$month' },
          averageScore: { $avg: '$finalScore' },
          submissions: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.month': -1 as 1 | -1 },
      },
    ];

    const results = await DailyAssessment.aggregate(pipeline);
    res.json(results);
  }),
);

export default router;


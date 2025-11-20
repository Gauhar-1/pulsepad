import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { connectToDatabase } from '../../lib/mongodb';
import TrainingTask from '../../models/TrainingTask';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    await connectToDatabase();
    const tasks = await TrainingTask.find().sort({ _id: 1 }).exec();
    res.json(tasks);
  }),
);

export default router;


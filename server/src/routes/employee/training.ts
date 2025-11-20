import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { connectToDatabase } from '../../lib/mongodb';
import TrainingTask from '../../models/TrainingTask';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const id = req.query.id ? Number(req.query.id) : undefined;

    if (id) {
      const task = await TrainingTask.findById(id).exec();
      if (!task) {
        return res.status(404).json({ message: 'Training task not found' });
      }
      return res.json(task);
    }

    const tasks = await TrainingTask.find().sort({ _id: 1 }).exec();
    res.json(tasks);
  }),
);

export default router;


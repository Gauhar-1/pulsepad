import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { connectToDatabase } from '../../lib/mongodb';
import Notification from '../../models/Notification';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    await connectToDatabase();
    await new Promise((resolve) => setTimeout(resolve, 800));
    const notifications = await Notification.find().sort({ timestamp: -1 }).exec();
    res.json(notifications);
  }),
);

export default router;


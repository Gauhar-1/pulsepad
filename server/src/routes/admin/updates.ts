import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { connectToDatabase } from '../../lib/mongodb';
import UpdateLog from '../../models/UpdateLog';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    await connectToDatabase();
    const updates = await UpdateLog.find().sort({ createdAt: -1 }).exec();
    res.json(updates);
  }),
);

export default router;


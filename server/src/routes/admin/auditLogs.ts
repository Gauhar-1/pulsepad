import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { connectToDatabase } from '../../lib/mongodb';
import AuditLog from '../../models/AuditLog';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    await connectToDatabase();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const logs = await AuditLog.find().sort({ timestamp: -1 }).exec();
    res.json(logs);
  }),
);

export default router;


import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { connectToDatabase } from '../../lib/mongodb';
import Candidate from '../../models/Candidate';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    await connectToDatabase();
    await new Promise((resolve) => setTimeout(resolve, 500));
    const candidates = await Candidate.find().sort({ name: 1 }).exec();
    res.json(candidates);
  }),
);

export default router;


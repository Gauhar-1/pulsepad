import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { connectToDatabase } from '../lib/mongodb';
import Project from '../models/Project';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    const user = req.user;
    const filter: Record<string, unknown> = {};

    if (user?.role === 'employee') {
      filter.assignedEmployees = user.sub;
    } else if (user?.role === 'client') {
      filter.clientId = user.sub;
    } else if (user?.role === 'admin') {
      // admins can optionally filter by status
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 }).exec();
    res.json(projects);
  }),
);

export default router;


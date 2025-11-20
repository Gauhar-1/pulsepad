import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { connectToDatabase } from '../../lib/mongodb';
import Project from '../../models/Project';
import ProjectRequest from '../../models/ProjectRequest';

const router = Router();

router.get(
  '/projects',
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    if (req.user?.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can access their projects.' });
    }
    const projects = await Project.find({ clientId: req.user.sub }).sort({ createdAt: -1 }).exec();
    res.json(projects);
  }),
);

router.get(
  '/project-requests',
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    if (req.user?.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can view project requests.' });
    }
    const requests = await ProjectRequest.find({ clientId: req.user.sub }).sort({ createdAt: -1 }).exec();
    res.json(requests);
  }),
);

router.post(
  '/project-requests',
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    if (req.user?.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can create project requests.' });
    }
    const { projectTitle, projectDescription, startDate, endDate } = req.body;

    if (!projectTitle || !startDate || !endDate) {
      return res.status(400).json({ message: 'Project title, start date, and end date are required.' });
    }

    const request = await ProjectRequest.create({
      _id: `req-${Date.now()}`,
      clientId: req.user.sub,
      projectTitle,
      projectDescription,
      startDate,
      endDate,
      status: 'PENDING',
    });

    res.status(201).json(request);
  }),
);

export default router;


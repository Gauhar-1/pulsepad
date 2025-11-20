import { Router } from 'express';
import { isToday } from 'date-fns';
import { asyncHandler } from '../utils/asyncHandler';
import { connectToDatabase } from '../lib/mongodb';
import UpdateLog from '../models/UpdateLog';
import Project from '../models/Project';
import AuditLog from '../models/AuditLog';

const router = Router();

router.post(
  '/',
  asyncHandler(async (req, res) => {
    if (req.user?.role !== 'employee') {
      return res.status(403).json({ message: 'Only employees can submit updates.' });
    }

    await connectToDatabase();
    const body = (req.body.update as Record<string, any>) ?? req.body;
    const projectId = body.projectId;
    const content = body.content;
    const updateId = body.id || body.updateId || `update-${Date.now()}`;

    if (!projectId || !content) {
      return res.status(400).json({ message: 'Project ID and content are required.' });
    }

    const project = await Project.findById(projectId).exec();
    if (!project || !project.assignedEmployees?.includes(req.user.sub)) {
      return res.status(403).json({ message: 'You are not assigned to this project.' });
    }

    const payload = {
      _id: updateId,
      projectId,
      userId: req.user.sub,
      content,
      createdAt: new Date().toISOString(),
    };

    const saved = await UpdateLog.findByIdAndUpdate(payload._id, payload, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }).exec();

    await AuditLog.create({
      _id: `audit-${Date.now()}`,
      user: { name: req.user.name || 'Employee', avatar: req.user.avatarUrl || req.user.picture || '' },
      action: 'submitted an update',
      project: project.projectTitle,
      details: { content },
      timestamp: payload.createdAt,
      icon: 'FileText',
    });

    res.status(body.isEdit ? 200 : 201).json(saved);
  }),
);

router.get(
  '/today',
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    const updates = await UpdateLog.find().exec();
    const todaysUpdates = updates.filter((entry) => isToday(new Date(entry.createdAt)));

    if (req.user?.role === 'employee') {
      return res.json(todaysUpdates.filter((entry) => entry.userId === req.user?.sub));
    }

    if (req.user?.role === 'client') {
      const clientProjects = await Project.find({ clientId: req.user.sub }).select('_id').exec();
      const projectIds = new Set(clientProjects.map((p) => p._id));
      return res.json(todaysUpdates.filter((entry) => projectIds.has(entry.projectId)));
    }

    res.json(todaysUpdates);
  }),
);

export default router;


import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { connectToDatabase } from '../../lib/mongodb';
import ProjectRequest from '../../models/ProjectRequest';
import Project, { IProject } from '../../models/Project';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    const status = req.query.status as string | undefined;
    const filter: Record<string, unknown> = {};
    if (status) {
      filter.status = status.toUpperCase();
    }
    const requests = await ProjectRequest.find(filter).sort({ createdAt: -1 }).exec();
    res.json(requests);
  }),
);

router.patch(
  '/:id/reject',
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    const { adminNotes } = req.body as { adminNotes?: string };

    const request = await ProjectRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: 'REJECTED',
        adminNotes,
        adminReviewerId: req.user?.sub,
      },
      { new: true },
    ).exec();

    if (!request) {
      return res.status(404).json({ message: 'Project request not found' });
    }

    res.json(request);
  }),
);

router.patch(
  '/:id/approve',
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    const { projectData } = req.body as { projectData: Partial<IProject> };

    const request = await ProjectRequest.findById(req.params.id).exec();
    if (!request) {
      return res.status(404).json({ message: 'Project request not found' });
    }
    if (request.status !== 'PENDING') {
      return res.status(400).json({ message: 'Request already processed.' });
    }

    const projectId = projectData?._id || `proj-${Date.now()}`;
    const newProject = await Project.create({
      _id: projectId,
      clientId: request.clientId,
      clientName: projectData?.clientName || 'Client',
      clientType: projectData?.clientType || 'New',
      projectTitle: request.projectTitle,
      projectDescription: request.projectDescription,
      startDate: projectData?.startDate || request.startDate,
      endDate: projectData?.endDate || request.endDate,
      projectType: projectData?.projectType || 'Client',
      tags: projectData?.tags || [],
      priority: projectData?.priority || 'Medium',
      status: projectData?.status || 'Active',
      estimatedHours: projectData?.estimatedHours || 100,
      leadAssignee: projectData?.leadAssignee || '',
      virtualAssistant: projectData?.virtualAssistant,
      freelancers: projectData?.freelancers || [],
      coders: projectData?.coders || [],
      projectLeader: projectData?.projectLeader,
      assignedEmployees: projectData?.assignedEmployees || [],
      githubLink: projectData?.githubLink,
      loomLink: projectData?.loomLink,
      whatsappLink: projectData?.whatsappLink,
      oneDriveLink: projectData?.oneDriveLink,
      milestones: projectData?.milestones || [],
      projectRequestId: request._id,
    });

    request.status = 'APPROVED';
    request.adminReviewerId = req.user?.sub;
    request.projectId = newProject._id;
    await request.save();

    res.json({ request, project: newProject });
  }),
);

export default router;


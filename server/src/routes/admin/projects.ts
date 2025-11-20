import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { connectToDatabase } from "../../lib/mongodb";
import Project from "../../models/Project";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    const id = req.query.id as string | undefined;

    if (id) {
      const project = await Project.findById(id).exec();
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      return res.json(project);
    }

    const projects = await Project.find().sort({ createdAt: -1 }).exec();
    res.json(projects);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    const data = req.body;
    if (!data._id || !data.projectTitle || !data.clientName || !data.clientType) {
      return res.status(400).json({ message: "Missing required fields for project creation." });
    }
    const project = await Project.create({
      ...data,
      tags: data.tags || [],
      freelancers: data.freelancers || [],
      coders: data.coders || [],
      assignedEmployees: data.assignedEmployees || [],
    });
    res.status(201).json(project);
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    const updates = req.body;
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      {
        ...updates,
        tags: updates.tags || [],
        freelancers: updates.freelancers || [],
        coders: updates.coders || [],
        assignedEmployees: updates.assignedEmployees || [],
      },
      { new: true, runValidators: true }
    ).exec();

    if (!updated) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(updated);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    const deleted = await Project.findByIdAndDelete(req.params.id).exec();
    if (!deleted) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(204).send();
  })
);

export default router;

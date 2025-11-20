import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { connectToDatabase } from '../../lib/mongodb';
import Employee from '../../models/Employee';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    const id = req.query.id as string | undefined;

    if (id) {
      const employee = await Employee.findById(id).exec();
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      return res.json(employee);
    }

    const status = req.query.status as string | undefined;
    const role = req.query.role as string | undefined;
    const filter: Record<string, unknown> = {};

    if (status) {
      filter.status = status.toUpperCase();
    }
    if (role) {
      filter.role = role;
    }

    const employees = await Employee.find(filter).sort({ name: 1 }).exec();
    res.json(employees);
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    const { id, name, email, skills = [], type, role = 'employee', status = 'ACTIVE' } = req.body;

    if (!name || !email || !type) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const existingEmail = await Employee.findOne({ email: email.toLowerCase() }).exec();
    if (existingEmail) {
      return res.status(409).json({ message: 'An employee with this email already exists.' });
    }

    const employee = await Employee.create({
      _id: id || `emp-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      skills,
      projects: [],
      sheetId: `sheet-${Date.now()}`,
      type,
      role,
      status,
    });

    res.status(201).json(employee);
  }),
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    const updates = req.body;

    if (updates.email) {
      updates.email = updates.email.toLowerCase();
      const duplicate = await Employee.findOne({
        email: updates.email,
        _id: { $ne: req.params.id },
      }).exec();
      if (duplicate) {
        return res.status(409).json({ message: 'Another employee already uses this email.' });
      }
    }

    const updated = await Employee.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).exec();

    if (!updated) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(updated);
  }),
);

router.patch(
  '/:id/status',
  asyncHandler(async (req, res) => {
    await connectToDatabase();
    const { status } = req.body as { status?: 'ACTIVE' | 'INACTIVE' };

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    ).exec();

    if (!updated) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(updated);
  }),
);

export default router;


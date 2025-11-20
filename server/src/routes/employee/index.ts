import { Router } from 'express';
import assessmentsRouter from './assessments';
import notificationsRouter from './notifications';
import trainingRouter from './training';

const router = Router();

router.use('/assessments', assessmentsRouter);
router.use('/notifications', notificationsRouter);
router.use('/training', trainingRouter);

export default router;


import { Router } from 'express';
import assessmentsRouter from './assessments';
import employeesRouter from './employees';
import projectsRouter from './projects';
import updatesRouter from './updates';
import trainingRouter from './training';
import auditLogsRouter from './auditLogs';
import candidatesRouter from './candidates';
import requestsRouter from './requests';
import performanceRouter from './performance';

const router = Router();

router.use('/assessments', assessmentsRouter);
router.use('/employees', employeesRouter);
router.use('/projects', projectsRouter);
router.use('/updates', updatesRouter);
router.use('/training', trainingRouter);
router.use('/audit-logs', auditLogsRouter);
router.use('/candidates', candidatesRouter);
router.use('/requests', requestsRouter);
router.use('/performance', performanceRouter);

export default router;


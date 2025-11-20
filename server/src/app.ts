import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import adminRouter from './routes/admin';
import employeeRouter from './routes/employee';
import projectsRouter from './routes/projects';
import updatesRouter from './routes/updates';
import authRouter from './routes/auth';
import clientRouter from './routes/client';
import { env } from './config/env';
import { errorHandler, notFound } from './middleware/error-handler';
import { authenticate, authorizeRoles } from './middleware/auth';

const app = express();

app.use(
  cors({
    origin: env.corsOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.use(`${env.apiPrefix}/auth`, authRouter);
app.use(`${env.apiPrefix}/admin`, authenticate, authorizeRoles('admin'), adminRouter);
app.use(`${env.apiPrefix}/employee`, authenticate, authorizeRoles('employee', 'admin'), employeeRouter);
app.use(`${env.apiPrefix}/client`, authenticate, authorizeRoles('client'), clientRouter);
app.use(`${env.apiPrefix}/projects`, authenticate, authorizeRoles('admin', 'employee', 'client'), projectsRouter);
app.use(`${env.apiPrefix}/updates`, authenticate, authorizeRoles('admin', 'employee'), updatesRouter);

app.use(notFound);
app.use(errorHandler);

export default app;

